# Forensic — bug freeze 1-2s mobile (2026-05-06)

## Méthode

- Playwright Chromium headless
- Mobile 390×844, CPU throttle **4×**, route delay 200 ms par requête CDN
- Scénario exact : load → wait 1500 ms → burst scroll 0→1500 px en ~200 ms → wait 800 ms
- Capture : `PerformanceObserver({ type: 'longtask' })` IN-PAGE + DevTools Tracing trace complet
- Frame tracker via `requestAnimationFrame` Δt > 50 ms

## Résultats (avant patch)

```
=== index ===
Long tasks TOTAL : 5
Long tasks pendant burst : 0
Long frames (rAF Δt>50 ms) : 1 (67 ms isolé hors burst)

=== boutique ===
Long tasks TOTAL : 1
Long tasks pendant burst : 0
Long frames : 0

=== merci ===
Long tasks TOTAL : 1
Long tasks pendant burst : 0
Long frames : 0
```

DevTools trace (12 662 events) : **0 event > 50 ms** sur les catégories `devtools.timeline`, `cc,benchmark,frame`, `v8.execute`.

## Verdict objectif

**Le bug n'est pas reproductible dans l'environnement Playwright Chromium headless.** Aucune long task main thread ne se produit pendant le burst scroll, ni au load, sur les 3 pages × 6 itérations.

## Pourquoi le user le voit quand même

Trois hypothèses, par ordre de probabilité :

### 🔴 Hypothèse #1 (LA PLUS PROBABLE) — Stall compositor iOS Safari sur `filter: blur()`
- Long Task API ne capture **que** le main thread. Les stalls compositor (GPU thread séparé) sont invisibles dans cette API.
- iOS Safari maintient un **layer compositor par élément avec `filter: blur()`**, et le shader blur tourne à chaque frame de scroll sur chacun.
- Dans l'état actuel : `.stagger-grid > *` (commit `ba9bf73` qui a unifié les cards) applique `filter: blur(6px)` sur :
  - **18 catalog-card** sur boutique (9 atelier + 5 fichier dans .stagger-grid + 4 hidden via display:none mais layer compositor possiblement créé)
  - **3 prestation-card** sur index
  - **3 why-card** sur index
  - **+ tous les `.anim-blur`** (titres) et **`.anim-image`** (banner)
- En burst scroll, plusieurs IO entries fire en même temps → multiples transitions `filter: blur(6px → 0)` démarrent simultanément sur ~10-15 éléments → iOS GPU stall **1-2 s**.

### 🟠 Hypothèse #2 — `<video autoplay>` + scroll concurrent sur iOS Safari
- iOS Safari donne priorité au décodeur vidéo. Pendant qu'il décode, le scroll est parfois mis en pause sur un seul thread.
- Mitigation déjà en place : `videoObserver.pause()` quand le hero sort du viewport. Mais le décodeur peut être actif jusqu'à ce que l'observer fire.

### 🟡 Hypothèse #3 — `backdrop-filter: blur(4px)` sur navbar (`.liquid-glass`)
- Présent en permanent, fixed, toujours visible. iOS Safari paye le shader chaque frame.
- 4 px reste léger mais s'ajoute aux autres pressions GPU.

## Patch chirurgical appliqué (NON committé, en attente de validation user)

`styles.css` — ajout d'un media query `(max-width: 767px)` qui désactive `filter: blur` sur :

```css
@media (max-width: 767px) {
  .anim-blur,
  .anim-image,
  .stagger-grid > * {
    filter: none !important;
    transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }
  .reveal.visible .anim-blur,
  .reveal.visible .anim-image,
  .reveal.visible .stagger-grid > * {
    filter: none !important;
  }
}
```

**Effet :**
- Mobile : cards/titres/banner s'animent en `opacity + translateY` seulement (premium feeling conservé via la courbe out-expo). Plus de blur transition.
- Desktop : **animations blur préservées intégralement** (≥ 768 px).

**Risques :**
- Si la cause root est autre (vidéo ou backdrop-filter), le patch ne résoudra pas le bug. Test sur device réel iOS nécessaire pour confirmer.
- Régression visuelle mobile : perte d'effet blur transitoire. Acceptable car la transition est rapide (0.6 s) et peu perceptible sur petit écran.

## Validation après patch (test env)

```
=== index ===   Long tasks pendant burst : 0   |   Long frames : 0
=== boutique === Long tasks pendant burst : 0   |   Long frames : 0
=== merci ===   Long tasks pendant burst : 0   |   Long frames : 0
```

Test environment **inchangé** (déjà à 0 avant patch). **Le test ne peut pas valider le fix** — il faut tester sur device réel iOS.

## Recommandation

1. **Push le patch** et tester sur iPhone réel.
2. Si le freeze persiste, désactiver progressivement (par ordre) :
   - `backdrop-filter` sur `.liquid-glass` mobile
   - Vidéo autoplay sur mobile (poster seulement)
3. Si ça persiste encore : profiler avec Safari Web Inspector connecté à l'iPhone pour avoir la vraie trace compositor.

## Limite technique honnête

Sans device iOS réel ou Safari Inspector, je ne peux pas **prouver** que le patch résout le bug. Je peux seulement appliquer la mitigation la plus probable basée sur la connaissance des comportements iOS Safari.
