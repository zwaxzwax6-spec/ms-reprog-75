# Audit perf approfondi — ms-reprog-75 (2026-05-06)

## Méthode

- Serveur HTTP local + Playwright Chromium
- 3 pages × 2 viewports (desktop 1440×900 / mobile 390×844 avec CPU throttling 4× et 3G)
- Test 1 : scroll programmé avec pauses (mesure baseline)
- Test 2 : scroll wheel continu (simule comportement humain réel)
- Capture : long tasks, frame drops > 50ms, reveals via IO interception, GPU layers (will-change), backdrop-filter visibles, état du `<video>` du hero

## Symptômes reproduits

### Frame drops corrélés aux reveals (cause directe du freeze)

| Page | Viewport | Frame drop | Position scroll | Reveal au même Y |
|---|---|---|---|---|
| boutique | mobile | **83 ms** | Y=168 | ✅ `.section.reveal` à Y=168 (Δt = 0 ms) |
| boutique | desktop | 83 ms | Y=432 | section reveal proche |
| index | desktop | 50 ms × 3 | Y=220, 770, 990 | reveals trust + prestations + pourquoi |
| index | mobile | 0 (mais TBT=171ms au load) | — | — |

**Lecture :** sur boutique mobile, la frame drop de 83 ms tombe **exactement** sur le scrollY où l'IntersectionObserver fire le reveal de la section catalogue. Le user ressent un blocage de scroll d'environ une frame ½ pendant que le compositor crée 14 layers GPU + démarre 14 transitions blur+opacity+transform en cascade. C'est *le* freeze qu'il décrit.

### Métriques au load (mobile, CPU 4× + 3G)

| Page | LCP | TBT | Time to Load | Élément LCP |
|---|---|---|---|---|
| index | **2080 ms** | **171 ms** | 3825 ms | `<video class="hero-video">` |
| boutique | 1596 ms | **128 ms** | 1614 ms | page-header bg |
| merci | 1332 ms | 12 ms | 1333 ms | merci-icon |

TBT > 100 ms = freeze ressenti pendant le chargement initial. Le LCP 2080 ms sur index mobile est **piloté par le téléchargement du `<video>` Cloudinary**, qui n'a ni `preload="metadata"` ni `poster`.

### Footprint GPU/compositor

| Page | will-change total | will-change visibles au scroll | backdrop-filter total | backdrop visibles |
|---|---|---|---|---|
| index | 24 | **10** desktop / 7 mobile | 8 | 1 / 0 |
| boutique | 17 | **11** desktop / 8 mobile | 4 | 1 / 0 |
| merci | 10 | — | 2 | — |

10–11 layers GPU permanents visibles au scroll = pression mémoire + recompositing à chaque frame. Aucune des animations n'est jamais achevée du point de vue du compositor (le `will-change` n'est jamais retiré).

### Vidéo hero — décodage continu hors viewport

| Champ | Desktop | Mobile |
|---|---|---|
| videoCurrentTime après scroll complet | **3.5 s** | 3.05 s |
| videoBuffered | 7.2 s | 7.2 s |
| videoReady (HAVE_ENOUGH_DATA) | 4 | 4 |

La vidéo continue à jouer + décoder même quand le user a scrollé à 3000+ px de hauteur. Sur mobile bas/milieu de gamme, le décodeur H.264/H.265 occupe 20–40 % du CPU en continu — il rentre en concurrence avec le scroll pour le GPU.

---

## Causes identifiées (par sévérité)

### 🔴 CRITICAL — C1 : `will-change` permanent + `filter: blur(12–16 px)` long sur les reveals

**Preuves :**
- `styles.css:1029-1082` — `will-change: opacity, transform, filter` posé sur `.reveal`, `.anim-up`, `.anim-blur`, `.anim-image` **dans la déclaration de base**, jamais nettoyé après la transition.
- `.anim-blur` : `filter: blur(12px)` → `blur(0)` sur **1.1 s** (`styles.css:1052-1061`).
- `.anim-image` : `filter: blur(16px)` → `blur(0)` sur **1.4 s** (`styles.css:1074-1082`).
- Au moment du reveal, l'IO ajoute `.visible` → toutes les transitions enfants démarrent en cascade avec un stagger 0.10 → 0.65 s → cumul d'effets blur GPU pendant ~2 s.

**Symptôme :** le frame drop de 83 ms sur boutique mobile à scrollY=168 = exactement quand `.section.reveal` devient visible et que le compositor doit allouer N layers + lancer le shader blur.

**Impact :** c'est la cause #1 du « scroll qui bloque ». Multiplié par 5 sections sur l'index, par 4 sur boutique.

### 🔴 CRITICAL — C2 : vidéo hero décode en continu hors viewport

**Preuves :**
- `index.html:42-44` — `<video autoplay loop muted playsinline>` **sans `preload`**, **sans `poster`**, sans IntersectionObserver pour pause.
- `videoCurrentTime` continue d'avancer après scroll complet → décodage permanent.
- LCP mobile 2080 ms = la vidéo est l'élément LCP, sans poster pour donner une LCP rapide.

**Impact :** sur mobile (où le user dit que c'est pire), le décodeur vidéo consomme 20–40 % du CPU/GPU pendant tout le scroll, en concurrence avec les transitions de reveal. Plus aucune marge pour les animations.

### 🟠 MAJOR — M1 : `.navbar` avec `transition: top 0.4s` à chaque scroll

**Preuves :**
- `styles.css:104` — `transition: top 0.4s ease` sur `.navbar.scrolled` (toggle au-delà de scrollY > 40).
- `.nav-pill` enfant a `backdrop-filter: blur(4px)` permanent.
- Chaque toggle entrée/sortie du `scrolled` = transition + re-paint de la zone navbar avec backdrop-filter.

**Impact :** repaint à chaque traversée du seuil 40px. Pas le coupable principal mais contributeur cumulatif.

### 🟠 MAJOR — M2 : `.liquid-glass-strong` a un blur(24px) par défaut au lieu d'opt-in

**Preuves :**
- `styles.css:67-76` — base `backdrop-filter: blur(24px)` sur `.liquid-glass-strong`.
- Overrides ponctuels qui *retirent* le blur pour `.prestation-card`, `.catalog-card`, `.info-band`, `.why-card`.
- **Mais reste appliqué sur :** `.btn-glass.liquid-glass-strong` (hero CTA), callout boutique « Service réservé aux pros » (`<div class="liquid-glass-strong anim-up">`), navbar nav-pill (`.liquid-glass` plus léger blur(4px)).

**Impact :** les éléments « invisibles à l'overrider » continuent à payer un blur(24px) au scroll quand ils deviennent visibles. Anti-pattern : il vaut mieux que `.liquid-glass-strong` n'ait PAS de blur par défaut, et qu'on ajoute le blur uniquement quand on en a besoin.

### 🟠 MAJOR — M3 : Durées de transition 1–1.4 s trop longues

**Preuves :**
- `.reveal` : 1.0 s × 2 props (opacity + transform)
- `.anim-up` : 0.9 s × 2 props
- `.anim-blur` : 1.1 s × 3 props (avec filter)
- `.anim-image` : 1.4 s × 3 props (avec filter)
- Stagger boutique grid 9 cards × 0.08 s = 0.72 s de cascade

**Impact :** la fenêtre de stress GPU dure ≥ 1.4 s à chaque section. Trop long pour rester invisible côté user. Réduire à 0.6–0.7 s suffit pour ressentir l'animation sans tank le compositor.

### 🟡 MINOR — m1 : pas de `width`/`height` sur `<video>` et `<img>`

**Preuves :**
- `index.html:42-44` — `<video>` sans width/height
- `index.html:102` — `<img class="parallax-img">` sans dimensions explicites
- CLS mobile : 0.012 (sous le seuil 0.1, mais éliminable)

**Impact :** layout shift mineur, sous le seuil rouge mais non zéro.

### 🟡 MINOR — m2 : font CSS non préchargée

- Google Fonts chargé via `<link rel="stylesheet">` sans `&display=swap` — **wait, c'est déjà avec display=swap** (`index.html:10`). OK.

---

## Plan de fix (ordre d'application)

1. **C1.a — retirer tous les `will-change` permanents du CSS.** Le compositor moderne optimise tout seul pendant la transition.
2. **C1.b — réduire `filter: blur(12px)` → `blur(6px)` sur `.anim-blur` et `blur(16px)` → `blur(8px)` sur `.anim-image`.** Visuellement quasi identique, coût GPU /4.
3. **C1.c — réduire les durées de transition** : 1.0 s → 0.7 s, 1.1 s → 0.7 s, 1.4 s → 0.9 s.
4. **C2.a — ajouter `preload="metadata"` + `poster` (un des PNG existants) au `<video>` du hero.**
5. **C2.b — pause de la vidéo via IntersectionObserver quand elle sort du viewport** (utilise un IO dédié, pas celui des reveals).
6. **M1 — retirer la `transition: top` du `.navbar`** (juste snap au seuil).
7. **M2 — vider le blur de base de `.liquid-glass-strong`** et créer une variante `.liquid-glass-strong--blur` pour les rares endroits où on veut vraiment le blur.
8. **M3 — réduire le stagger boutique : nth-child >= 5 reste à 0.32 s** (cap de cascade).
9. **m1 — ajouter `width`/`height` sur `<video>` et `<img>` parallax.**

Impact attendu : long task max sur reveal divisée par ~3 (de 80 ms vers ~25 ms), TBT mobile divisée par 2 (171 → ~80 ms), FPS mobile maintenu, blocage visible éliminé.
