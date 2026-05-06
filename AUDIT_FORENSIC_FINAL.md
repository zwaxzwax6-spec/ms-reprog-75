# Audit forensique final — bug freeze scroll burst (2026-05-06)

## Reproduction

Avec **wheel events natifs** (et non `window.scrollTo` qui bypasse les listeners), le bug est mesurable et reproductible dans Playwright Chromium :

- Desktop 1440×900, CPU 1×
- Mobile 390×844, CPU 4×
- Scénario : load → 500 ms → burst 10× wheel(0,200) avec 20 ms entre — pause 800 ms — burst 2

## Cause root identifiée

**`index.html:383-405` — le handler parallax desktop sur `.parallax-img`.**

```js
window.addEventListener('scroll', () => { 
  if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; } 
}, { passive: true });

function updateParallax() {
  parallaxImages.forEach(img => {
    const rect = img.parentElement.getBoundingClientRect();      // READ layout
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      const centerOffset = (rect.top + rect.height / 2) - (window.innerHeight / 2);
      img.style.transform = `translateY(${centerOffset * -0.08}px) scale(1.08)`;  // WRITE compositor
    }
  });
  ticking = false;
}
```

Combiné à `styles.css:1172-1177` :
```css
@media (min-width: 980px) {
  .parallax-img {
    transition: transform 0.1s linear;     /* ← transition stackée avec rAF write */
    will-change: transform;                /* ← layer compositor permanent */
  }
}
```

**Pourquoi c'est pathologique** :
1. `will-change: transform` permanent → layer compositor isolé en permanence
2. `transition: transform 0.1s linear` → chaque write CSS transform crée une mini-transition de 100 ms
3. Le rAF re-écrit le transform à chaque frame de scroll → chaque frame relance une transition → empilement
4. L'image source est un PNG 1920×1080 — la rasterization du layer scale(1.08) translateY(N) à chaque scroll frame consomme 100-200 ms de compositor sur certaines configs
5. En burst scroll, le rAF fire à 60 Hz mais chaque frame nécessite paint+compositor → frames > 50 ms cumulées

## Patch appliqué

### `index.html` — suppression du handler parallax JS
```diff
-window.addEventListener('load', () => {
-  const isDesktop = window.matchMedia('(min-width: 980px)').matches;
-  const supportsParallax = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
-  if (!isDesktop || !supportsParallax) return;
-  const parallaxImages = document.querySelectorAll('.parallax-img');
-  if (!parallaxImages.length) return;
-  let ticking = false;
-  function updateParallax() { ... }
-  window.addEventListener('scroll', () => { ... }, { passive: true });
-  updateParallax();
-});
+// Parallax retiré : remplacé par transform CSS static
```

### `styles.css` — parallax remplacé par échelle statique
```diff
 @media (min-width: 980px) {
   .parallax-img {
-    transition: transform 0.1s linear;
-    will-change: transform;
+    transform: scale(1.05);
   }
 }
```

### `styles.css` — extension de la guard mobile (défensif compositor)
```diff
 @media (max-width: 767px) {
   .anim-blur, .anim-image, .stagger-grid > * {
     filter: none !important;
     transition: opacity 0.6s ..., transform 0.6s ... !important;
   }
+  .liquid-glass,
+  .nav-cart-mobile {
+    backdrop-filter: none !important;
+    -webkit-backdrop-filter: none !important;
+    background: rgba(0, 0, 0, 0.55);
+  }
 }
```

## Métriques

### Long frames (rAF Δt > 50 ms) PENDANT le burst scroll

| Page / Viewport | AVANT fix | APRÈS fix |
|---|---|---|
| index / desktop | 9 frames, max **250 ms** | 3 frames, max **83 ms** (-67 %) ✅ |
| boutique / desktop | 3 frames, max 83 ms | 1 frame, max 67 ms ✅ |
| merci / desktop | 0 | 0 ✅ |
| index / mobile | 16 frames, max **333 ms** | **0 frame pendant burst** ✅ |
| boutique / mobile | 2 frames, max 367 ms | **0 frame pendant burst** ✅ |
| merci / mobile | 2 frames, max 117 ms | **0 frame pendant burst** ✅ |

Long frames mobiles résiduelles (164-461 ms après load) sont des frames de **render initial**, pas du scroll burst — les bursts mobiles sont à 1198+ ms.

### Long tasks (JS main thread > 50 ms) pendant burst

| Page / Viewport | AVANT | APRÈS |
|---|---|---|
| index / desktop | 0 | 0 |
| index / mobile | 3 long tasks (54-79 ms) au burst 1 | **0** ✅ |
| Autres | 0 | 0 |

## Verdict

**Bug résolu sur desktop** (preuve chiffrée : max long frame 250 → 83 ms, -67 %).
**Bug non reproduit pendant burst sur mobile** après fix (0 frame pendant les 2 bursts).

### Limite honnête

Le test Playwright Chromium ne couvre pas iOS Safari spécifiquement. Si le user observe encore un freeze sur iPhone, les causes restantes possibles (par ordre de probabilité) :
1. Vidéo hero `<video autoplay>` qui décode en arrière-plan sur iOS Safari
2. Compositor iOS Safari sur les transitions opacity/transform avec stagger
3. Une cause non instrumentable depuis Playwright

Le patch appliqué élimine la cause **mesurable et reproductible**. Reste à valider sur iPhone réel.

## Effet visuel

- **Desktop** : la prestations-banner sur index n'a plus de parallaxe au scroll, mais conserve un `scale(1.05)` static qui préserve l'effet de zoom/profondeur visuel. Différence quasi imperceptible vs avant.
- **Mobile** : la navbar nav-pill et le bouton cart-mobile perdent leur `backdrop-filter` (effet liquid-glass). Le fond passe à `rgba(0,0,0,0.55)` semi-transparent qui lit toujours bien sur la vidéo hero. Compromis design ↔ perf assumé.
