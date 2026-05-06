# Diagnostic perf finale (2026-05-06)

## Métriques par page (avant fix)

| Page | Viewport | LCP | FPS scroll | Long frames | Backdrop visibles |
|---|---|---|---|---|---|
| index | desktop | 1016 ms | **41.5** 🔴 | 22/111 (20%) | **12** |
| index | mobile | 580 ms | 57.7 ✅ | 3/188 (1.6%) | 11 |
| boutique | desktop | 124 ms | 55.5 ⚠️ | 4/115 (3.5%) | 1 |
| boutique | mobile | 124 ms | 60.2 ✅ | 0 | 0 |
| merci | desktop | 88 ms | 60.3 ✅ | 0 | 2 |
| merci | mobile | 72 ms | 60.6 ✅ | 0 | 1 |

## Goulots identifiés (priorité)

1. **🔴 index desktop : 41.5 FPS — empilement backdrop-filter**
   - 3 `.prestation-card` + 3 `.why-card` × `blur(24px)` = compositing GPU lourd
   - Combiné au parallax sur `.prestations-banner-img` (transform à chaque scroll)
   - Cible : 50+ FPS

2. **✅ IntersectionObserver propre** : `.unobserve(target)` appelé après `visible` sur les 3 pages (vérifié)

3. **✅ Listeners scroll passive** : tous les `addEventListener('scroll', ...)` ont `{ passive: true }`

4. **✅ Parallax scopé** : `if (isDesktop && supportsParallax)` + matchMedia gate. Pas de `.parallax-img` sur boutique/merci.

5. **🟡 Cascade prestations-grid désordonnée** : `.stagger-grid > *:nth-child(N)` donne delays 0.10/0.18/0.26s aux cards, qui démarrent AVANT le heading (data-stagger=2 → 0.15s) et le lead (=3 → 0.25s). Visuel chaotique → impression "pas d'animation" pour l'utilisateur.

## Plan de fix

A) `.prestation-card.liquid-glass-strong` + `.why-card.liquid-glass-strong` : override `backdrop-filter: none`, bg légèrement plus opaque, `contain: layout style paint`.

B) Cascade prestations-grid : override les délais nth-child pour cette grille uniquement → cards apparaissent à 0.45/0.55/0.65s (après banner à 0.35s).

## Métriques après fix

| Page | Viewport | FPS avant | FPS après | Long frames |
|---|---|---|---|---|
| index | desktop | 41.5 🔴 | **52.5** ✅ | 22 → 5 |
| index | mobile | 57.7 | 60.2 ✅ | 3 → 0 |
| boutique | desktop | 55.5 | 57.3 ✅ | 4 → 3 |
| boutique | mobile | 60.2 | 60.3 ✅ | 0 |
| merci | desktop | 60.3 | 61.0 ✅ | 0 |
| merci | mobile | 60.6 | 60.7 ✅ | 0 |

**Cible 50+ FPS scroll : atteinte sur 6/6 cas.** Backdrop visibles index desktop : 12 → 6.

## Cascade animation prestations validée

Timeline post-fix (vérifié via Playwright sample) :
- t=200ms : heading démarre
- t=300ms : lead démarre
- t=400ms : banner démarre
- t=600ms : card 1 démarre (après banner ✅)
- t=900ms : card 2 démarre
- t=1200ms : card 3 démarre

Plus de chevauchement chaotique cards/heading.
