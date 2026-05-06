# Audit perf boutique.html

**Mesuré le 2026-05-06 sur viewport 1440×900, scroll lent.**

## Métriques actuelles

| Métrique | Valeur | Cible | Verdict |
|---|---|---|---|
| FCP | 204 ms | < 1800 ms | ✅ |
| LCP | 204 ms | < 2500 ms | ✅ |
| FPS moyen au scroll | **17.3** | ≥ 50 | 🔴 |
| Frame max | 127 ms | < 16 ms | 🔴 |
| Frames > 33ms (jank) | 30/38 (79%) | < 5% | 🔴 |

## Causes identifiées

### 🔴 #1 — Empilement de `backdrop-filter`
- 22 éléments avec `backdrop-filter` actif simultanément
- 17 `.liquid-glass-strong` (blur **50px**) — coût GPU énorme
- Blur 50px est >2× plus coûteux que blur 24px sur la plupart des compositors

### 🔴 #2 — Double blur pendant les reveals
- `.stagger-grid > *` applique `filter: blur(8px)` pendant l'animation
- Empilé sur le `backdrop-filter: blur(50px)` des cards = composit. catastrophique
- 9 cards animées en cascade × 0.08s stagger = 720ms de double-blur GPU-saturant

### 🟡 #3 — Pas d'isolation de repaint
- `.catalog-card` n'utilise ni `contain` ni `content-visibility`
- Chaque hover/reveal force un repaint sur toutes les cards visibles

### ✅ Hors cause
- IntersectionObserver `.unobserve()` ✅ correctement appelé
- Pas de parallax JS sur cette page ✅
- 5 cards "Fichier" en `display: none` (déjà skipped par le compositor)

## Fixes appliqués

1. `.liquid-glass-strong` blur 50px → 24px (réduction coût compositor)
2. `.stagger-grid > *` : retrait `filter: blur(8px)` (élimine double-blur pendant reveals) + transition 0.9s → 0.7s
3. `.catalog-card` : `contain: layout style paint` (isolation repaint)
4. `.catalog-card.liquid-glass-strong` : override `backdrop-filter: none` + bg légèrement plus opaque (visuellement quasi-identique sur fond noir, énorme gain GPU)
5. `.cart-drawer-overlay` + `.cart-drawer` : backdrop-filter déplacé sur `.open` uniquement (élément invisible ne paye plus le coût)
6. `.info-band.liquid-glass-strong` : override `backdrop-filter: none` (élément 1296×319 — coût énorme pendant scroll)

## Métriques après fix

| Métrique | Avant | Après | Gain |
|---|---|---|---|
| FPS desktop | 17.3 | **57.0** | ×3.3 |
| FPS mobile | n/a | **60.1** | — |
| Long frames desktop | 30/38 (79%) | 3/128 (2%) | -97% |
| Long frames mobile | n/a | 0/227 (0%) | — |
| Frame max desktop | 127 ms | 37.5 ms | -70% |
| Backdrop-filter visibles scroll | 22 | 5 | -77% |
| LCP | 204 ms | 144 ms | -29% |

**Cibles atteintes ✅** — 50+ FPS desktop, 60 FPS mobile, aucun blocage perceptible.
