---
name: landing-premium-dark-apple
description: Use this skill whenever the user wants to design or build a premium dark, Apple-inspired landing page or full website using glassmorphism / liquidmorphism. Trigger on requests like "site web premium", "landing page Apple", "dark glass design", "liquid glass site", or when the user provides an existing site URL to redesign in this aesthetic. Covers two entry modes — (1) scraping an existing site to extract verifiable facts before redesigning, or (2) building from a manual brief. Always produces a 10/10 first draft via strict no-invention rules, structured placeholders, matching Nano Banana Pro prompts via Higgsfield MCP, and bulk image generation + auto-grading workflow. Always consult before building any premium dark site.
version: 0.7.0
status: PRODUCTION-READY — UX-driven simplification validated. MS REPROG 75 refondu de 8 pages → 4 pages avec score UX 5.5 → 9/10. Cap 4 pages max + 6 champs max + WhatsApp FAB pattern.
---

# Landing Premium Dark Apple Liquid Glass

## What this skill is for

Producing **10/10 premium dark websites** with a strict Apple-inspired aesthetic, glassmorphism + liquidmorphism, and zero generic AI vibe. Optimized for high-ticket service businesses (premium auto, luxury rental, performance, concierge, bespoke services).

This skill is OPINIONATED. It enforces strong defaults rather than offering choice. The opinions below come from real iterations on real projects — when the user pushes back, the rule gets updated, not bypassed.

---

## CORE PRINCIPLES — NEVER NEGOTIATE

### 1. Zero invention rule (CRITICAL)

When working from an existing site or client info:
- ✅ Use only what is **explicitly written** on the source
- ❌ Never invent: years of experience, client counts, testimonials, certifications, process steps, equipment lists, gain figures, opening hours, team names, brand partnerships
- When a section would require invented info → **delete the section** rather than fill it
- Before coding, produce a **"Verified Facts"** recap and a **"Will Invent if Not Careful"** red list — get user validation
- The user CANNOT discover invented info later and feel betrayed. Trust > completeness.
- Even subtitles need fact-check.

### 2. Premium dark Apple is the only DA — MAIS NE PAS être stérile

Hard locked stack:
- **Background**: pure `#000`
- **Text primary**: `#fff`
- **Text secondary**: `rgba(255,255,255,0.45)` to `rgba(255,255,255,0.7)`
- **Accent color** (CRITICAL — see Pillar 1 below): UNE couleur chaude lumineuse comme fil rouge visuel (or doux #E8C875, orange #FF6B35, cyan #4FD1C5, etc.) — choisir selon l'identité de marque ou la verticale (auto premium → or, tech B2B → cyan, fintech → orange/violet)
- **Typography**: serif italic (Instrument Serif) for headings + clean sans (Barlow) for body. Other valid pairs: Fraunces + Inter, Playfair Display Italic + Geist
- **Radii**: pill (`9999px`) for buttons/badges/pills, large soft (`24-32px`) for cards
- **No gradients on text** unless brand mandates. White text wins for body.

### 2bis. THE 4 PILLARS OF VIVANT (DON'T SKIP — major lesson MS REPROG)

A site qui n'a QUE blanc/noir/gris est PLAT et FADE, même si le typo et le glass sont parfaits. Les références qui marchent vraiment (Velocity, Uplinq, Apple Vision Pro page) ont 4 ingrédients :

**Pillar 1 — UNE couleur d'accent**
Sert de fil rouge visuel : trace lumineuse, glow sur les CTAs, lueur derrière les cards, halos sur les icônes. Choisir UNE seule couleur, l'utiliser 8-15 fois sur la page (eyebrows, prix, prestation tags, hover states, urgence dot, footer brand, footer headers, contact labels). Sans cette couleur : site stérile.

**Pillar 2 — GLOWS ambiants (statiques par défaut)**
Plusieurs zones de halo coloré diffus en CSS (`radial-gradient` + `filter: blur(50-60px)`) placés à des points stratégiques. **TAILLE MAX 500px** sur desktop, 300px sur mobile. Au-delà, les glows créent des **zones "vides" perçues** par l'utilisateur (gros halo + peu de contenu = aspect "section invisible").

Placements stratégiques :
- Sous trust badges (ellipse subtle)
- Au-dessus des Prestations (orb-top, ~400px)
- Sous les Tarifs (orb-bottom)
- Centre de la section Urgence (pulse animé)
- Centre du Contact (orb subtil opacity 0.4 max)

**RÈGLE D'OR** : un glow doit AGRANDIR la respiration d'une zone qui contient du contenu, jamais REMPLIR une zone qui en manque. Si tu ajoutes un glow sans contenu derrière → c'est du remplissage qui se voit.

**RÈGLE DE VÉRIFICATION SECTION VIDE** : Pour chaque section qui inclut un `glow-orb`, mesurer le ratio "hauteur contenu / hauteur section". Si le contenu fait moins de 70% de la hauteur de la section, le glow va apparaître comme une zone fantôme. Solutions :
- Soit réduire le padding de la section
- Soit retirer le glow (préférable)
- Soit ajouter du contenu dans la section
- **Ne JAMAIS garder un glow visible dans une zone vide**

Section Prestations qui contient déjà une banner image + un titre + 5 cards → ne pas ajouter de glow-orb (le banner crée déjà l'ambiance dorée via la lumière naturelle de l'image).
Section Contact avec seulement 2 mini-blocs → ne pas ajouter de glow-orb (le contenu est trop léger).
Section Tarifs avec une grille de 6 cards → ne pas ajouter de glow-orb (les cards ont déjà chacune leur micro-glow).

**OÙ les glows fonctionnent vraiment** :
- Section Hero (déjà géré par bottom-fade sur la vidéo)
- Section Trust (subtile ellipse derrière les pills)
- Section Urgence 24/7 (pulse animé central — la section EST le glow)
- C'est tout. Pas de glow-orb additionnel ailleurs sauf si la section a un contenu volumineux qui peut accueillir le halo.

**Pillar 3 — MOCKUPS visuels dans les cards (statiques)**
Au lieu de juste icône + titre + description, les cards principales (Prestations, Features) doivent contenir un **mini-mockup SVG inline** qui raconte ce que fait la prestation. Toujours en SVG inline (pas d'images), avec accent doré sur les éléments-clés. Le glow du mockup doit être **visible par défaut** (opacity 0.85), pas seulement au hover.

**Pillar 4 — HIÉRARCHIE typo enrichie**
Eyebrows + ligne dégradée, tags catégorie en pill-accent, prix en accent (pas blanc), citations en accent. Le blanc reste pour titres principaux et body.

### 2ter. STATIC-FIRST RULE — Mobile = 80% du trafic

**Tous les effets visuels (glows, lueurs, gradients, halos) doivent être visibles PAR DÉFAUT, pas seulement au hover.** Sur mobile il n'y a pas de hover. Sur desktop, un site qui révèle ses détails uniquement au hover paraît mort.

Règles concrètes :
- `.card::after { opacity: 0.5 }` par défaut, `0.85-1` au hover (PAS 0 → 1)
- `box-shadow: 0 0 16px var(--accent-glow-deep)` permanent sur les CTAs primaires
- `.mockup-glow { opacity: 0.85 }` par défaut (PAS 0)
- Hover ajoute SUBTILEMENT un peu d'intensité supplémentaire, ne révèle pas l'effet
- L'utilisateur doit ressentir le "premium glow" dès le scroll, sans interaction

Le hover c'est la cerise. Le statique c'est le gâteau.

### 2quater. MOBILE-FIRST IS NOT OPTIONAL (80% du trafic)

**Toutes les valeurs de paddings, font-sizes, glows doivent être pensées mobile d'abord :**

```css
:root {
  /* Desktop defaults */
  --section-pad-y: clamp(60px, 8vh, 110px);  /* PAS 12vh, trop sur mobile */
  --section-pad-x: clamp(20px, 5vw, 80px);   /* PAS 6vw + 100px */
}

@media (max-width: 640px) {
  :root {
    --section-pad-y: clamp(50px, 8vh, 80px);  /* encore plus serré */
    --section-pad-x: 20px;
    --radius-card: 18px;
  }
  /* Glows divisés par 2 sur mobile */
  .glow-orb-top { width: 280px; height: 280px; filter: blur(50px); }
  .glow-orb-center { width: 320px; height: 320px; }
  .glow-orb-bottom { width: 320px; height: 320px; }
}
```

Checklist mobile à 640px (toujours vérifier) :
- [ ] Hero title scale-down sans déborder (`clamp(2.6rem, 11vw, 4rem)`)
- [ ] Tous les grids passent en 1 ou 2 colonnes max
- [ ] Vehicles grid en 2 colonnes (pas 5 qui s'écrasent ni 1 qui prend la moitié de la page)
- [ ] Cards tarif en 1 colonne avec padding réduit
- [ ] Prestations banner image en 16/10 max (PAS 21/9, trop écrasé)
- [ ] Footer en 1 colonne avec gap 32px
- [ ] Glows divisés par 2 (perf + visuel)
- [ ] Padding hero `padding-bottom: 12vh` (au lieu de 10vh desktop pour compenser navbar)
- [ ] Tarifs header en colonne (titre puis CTA, pas côte à côte qui casse)
- [ ] Urgence CTA row en colonne (`flex-direction: column`)
- [ ] Navbar `nav-link` cachés, garder juste wordmark + bouton CTA
- [ ] Body font min 14px partout (jamais 12px sur mobile, devient illisible)

### 3. Liquid glass is custom, not Tailwind

The signature liquid glass effect is NOT `backdrop-blur` alone. It requires:
- Two variants: `.liquid-glass` (subtle, blur 4px) and `.liquid-glass-strong` (heavy, blur 50px)
- A pseudo-element `::before` with a directional gradient border using `mask-composite: exclude`
- `background-blend-mode: luminosity`
- Inner shadow `inset 0 1px 1px rgba(255,255,255,0.1)` for depth

### 4. Hero composition — non-negotiable rules

**Layout**: Hero `100vh`, min `700px`. Background video/image `object-fit: cover`. Content hard-left with `padding-left: clamp(40px, 6vw, 100px)`. Vertical position via `padding-bottom` (NOT `padding-top`).

**Triple overlay system** (mandatory):
1. Directional left-right gradient for text legibility
2. Top fade 160px for navbar contrast
3. Bottom fade 300px for section transition

**Navbar**: `position: fixed` — INDEPENDENT from hero content. `top: 16-42px`. Center pill via `position: absolute; left: 50%`.

**Title**: `clamp(4rem, 8vw, 7.5rem)`, `line-height: 0.88`, `letter-spacing: -4px`, max 800px. Two lines preferred — line break is editorial.

**Animation discipline**:
- Title: word-by-word blur-up (cubic-bezier `0.23, 1, 0.32, 1`, 0.65s, stagger 0.12s)
- Badge: fadeUp delay 0.15s
- Subtitle: fadeInBlur delay 0.95s
- CTAs: fadeUp delay 1.25s
- Sections: IntersectionObserver reveal-on-scroll

### 5. Copywriting (kills generic AI)

- No emojis in production copy
- No power words ("révolutionnaire", "leader", "premium" overused)
- Subtitles: 35-50 words, factual, 2 short sentences max
- Badge: `[short tag] + [factual one-liner].`
- CTA primary: action verb, 1-2 words
- Verbatim USPs from source — never paraphrase

---

## IMAGE WORKFLOW — BULK MODE (validated)

### The rule

Generate ALL images for the project in one batch via Higgsfield MCP. User drag-drops them all in bulk. Claude auto-grades each on 5 axes. Iterate only failing ones.

### Step-by-step

1. Design site complete with typed placeholders
2. Compile `IMAGES_BRIEF.md` exhaustive (all images at once)
3. Generate via MCP Higgsfield in parallel (Plan Creator = 8 concurrent)
4. User drag-drops all images in bulk
5. Auto-grade each on 5 weighted axes
6. Patch + re-generate images < 8.5/10 (max 2 iterations)
7. Integrate validated images via CDN URLs + local backup
8. Deliver

### Scoring rubric (out of 10, weighted)

| Axis | Weight | Check |
|---|---|---|
| Adhérence DA | × 1.5 | Strict palette, cold 6500K, no warm tones, Apple feel |
| Pertinence narrative | × 1.5 | Image tells what brief asked, correct framing |
| Anti-patterns évités | × 2.0 | ❌ faces, logos, text, stock photo, plastic, daylight |
| Qualité technique | × 1.0 | Composition, DOF, grain, sharpness |
| Intégration site | × 1.0 | Negative space for overlay, off-center, readability |

**Thresholds**:
- ≥ 8.5/10 → keep
- 7.0–8.4 → user decision
- < 7.0 → auto re-generate

### Surgical patches (don't rewrite full prompt)

- Too warm → `"strict cold 6500K, absolutely no warm tones"` + reinforce negative
- Visible face → `"strictly no face, anonymous silhouette only"`
- Stock-photo → `"editorial cinematic, NOT stock photography"`
- Too busy → `"minimalist, 80% negative space"`
- Wrong subject → keep DA, rewrite subject section only

### Cost discipline

**Default = MCP Higgsfield**. Math:
- ~6 images × 2 credits = 12 cr ≈ 0.75 € per site
- Site delivered at 350 € → 0.2 % of revenue
- Time saved vs UI manual ≈ 20 min/project ≈ 117 € of opportunity
- Ratio 130:1 in favor of MCP

**Hard cap**: 25 credits/project (≈ 1.55 €). Beyond, ask user.

**"Unlimited" toggle NOT exposed via MCP** — server ignores `unlimited: true` parameter (tested). Only UI supports it. Default is MCP regardless; UI manual only for 30+ images batches.

### Visual analysis requires drag-drop

Claude has NO direct visual access to MCP-generated images (CDN blocked). User must drag-drop images into chat for grading. 3-second action per batch — acceptable in bulk workflow.

---

## NANO BANANA PRO — 5-block prompt template

Validated to score 9+/10 on first generation:

```
[Style block]
"Cinematic dark photography, professional [context], low-key lighting at 6500K cold color temperature, [orientation] [ratio] framing."

[Foreground block]
"Foreground: [subject 1] with [details]"

[Mid-ground block]
"Mid-ground: [subject 2] [details, motion, atmosphere]"

[Background + lighting block]
"Background: [environment]. Single cold white rim light from [direction] creating dramatic chiaroscuro."

[DA reinforcement]
"Black and anthracite grey palette only, zero warm tones, no orange, no logos, no text, no brand markings. Subtle 35mm film grain. Shallow depth of field. Premium [editorial/automotive/tech] style reminiscent of [reference]."

Negative: warm light, orange, sunset, daylight, white background, brand logos, visible faces, plastic, stock photo aesthetic, bright colors, neon, signage, text.
```

The DA reinforcement block + explicit negative list is what reliably gets to 9/10.

---

## IMAGES_BRIEF.md — required structure

Section 0 = Visual DNA (applied to ALL images). Then per image: ID, placement, ratio, tier, intent, full prompt, negative, notes. Annexe for logo (reuse client asset). Recap table.

---

## STRIPE / E-COMMERCE — decision tree

| Catalog size | Recommendation |
|---|---|
| 1-3 services | Stripe Payment Links |
| 4-15 services | Stripe Checkout + custom mini-cart + Supabase orders |
| 15+ or complex variants | Snipcart / Shopify Lite (only if explicit) |

---

## TWO ENTRY MODES

### Mode A: Existing site URL

1. Scrape with `web_fetch` on all main pages
2. Extract verbatim everything
3. "Verified Facts" + "Will Invent if Not Careful" red list — confirm
4. Decide structure + e-commerce stack from catalog
5. Section plan — wait validation
6. HTML with placeholders
7. IMAGES_BRIEF.md exhaustive
8. Bulk generate → drag-drop → grade → integrate
9. Deliver

### Mode B: Manual brief

1. 6-section brief (pitch / users / features / support / data / design)
2. Same fact-check
3. Same downstream

---

## SECTION RECIPES

- **Trust bandeau**: 3 glass pills, verbatim USPs
- **Service cards**: 3-4 cols, liquid-glass-strong, SVG icon + title (Instrument Serif) + 1-line desc + price
- **Vehicle/category strip**: glass tiles, SVG + label, EXACT list from source
- **Process steps (CONDITIONAL)**: only if user provides real steps
- **File/distance service**: full-width band, distinct visual from main services
- **24/7 emergency band**: full-width, verbatim USP, single CTA
- **Footer**: 3-4 cols brand+tagline / nav / contact / socials. Verbatim coords. Add `.footer-cta-row` (pill buttons tel + WhatsApp + email) to integrate contact and avoid a dedicated contact page.
- **Boutique toggle (B2B/B2C fusion)**: deux boutons pills `.boutique-toggle-btn` (active = gradient accent), switch entre `.boutique-section.active` (atelier par défaut, fichier pour pros). Évite les pages séparées.
- **WhatsApp FAB** (CRITICAL pour FR auto/B2C, conversion ×1.5+) : bouton flottant fixed bottom-right `56×56px` background `#25D366`, animation pulse, `wa.me/{tel}?text=Bonjour%2C...`. Toujours présent sur toutes les pages. Hyper-visible, ne distrait pas du contenu.
- **CTA final** (section bandeau) : eyebrow uppercase + titre Instrument Serif italic clamp 2.5-4.5rem + sub + 2 CTAs (RDV solid + tel discret cliquable). Radial gradient accent en background pour l'ambiance.
- **Form RDV (cap 6 champs)** : Nom complet, Tel `+33 6 ..`, Véhicule (texte libre `Marque Modèle Année · Motorisation`), Prestation (custom select grouped), Disponibilités (texte libre), Message (optionnel). Submit via mailto: avec body formaté. CTA mobile = "Appeler" (pas "RDV") car l'utilisateur est déjà sur la page RDV.
- **Why-section (3 piliers narratifs)** : remplace section témoignages quand pas de vrais avis dispos. 3 cards avec icon SVG + titre Instrument Serif + 2-3 lignes factuelles. Suivi d'un CTA discret `.google-reviews-cta` (border dashed) "Laissez-nous un avis Google →".

---

## SIMPLICITY-FIRST ARCHITECTURE (lessons learned from MS REPROG Phase 4)

### Cap absolu sur la complexité
Pour un site de service local (atelier, agence, restaurant, salon, concierge…), respecter ces caps stricts dès la conception :

| Élément | Cap absolu | Raison |
|---|---|---|
| Pages | **4 max** | Au-delà = utilisateur perdu, maintenance coûteuse |
| Sections sur l'accueil | **5 max** | Au-delà = scroll fatigue + redondance |
| Liens dans la nav | **3 max** + 1 CTA | Au-delà = paralysie de choix |
| Champs formulaire | **6 max** | Chaque champ supplémentaire = ~5-10% d'abandons |
| CTAs principaux concurrents | **1 principal** + 1 secondaire | Sinon paralysie de choix |

### Architecture 4 pages standard
```
├── index.html        — 5 sections (Hero + Trust + 3 prestations + Pourquoi + CTA final)
├── boutique.html     — catalogue avec toggle B2C/B2B si applicable
├── rendez-vous.html  — formulaire 6 champs
└── merci.html        — confirmation post-paiement Stripe
```

### Décisions de fusion (vs pages séparées)
- **B2C + B2B sur la même page boutique** → toggle pill `[ Atelier ]  [ Fichier à distance ]`. Évite la dispersion du trafic.
- **Contact intégré au footer** → `.footer-cta-row` avec tel + WhatsApp + email. Évite la page contact dédiée.
- **À propos intégré à l'accueil** → section "Pourquoi nous choisir" (3 piliers narratifs courts). Évite la page À propos.
- **Panier en drawer off-canvas** → bouton "Procéder au paiement" direct vers Stripe. Évite la page cart.

### Le seul cas où on garde plus de 4 pages
Si le client a un vrai besoin business : pages légales obligatoires (mentions légales, CGV) qui peuvent être en pied de page mais existent en vrai. Ne pas les compter dans les 4 pages "produit".

---

## ANTI-PATTERNS

- ❌ Tailwind `backdrop-blur-md` alone called "glassmorphism"
- ❌ Color gradient backgrounds (purple→blue)
- ❌ Stock skyscrapers / handshakes
- ❌ "Premium / innovative / leading" in copy
- ❌ More than 2 fonts
- ❌ Centering everything (Apple uses hard-edge)
- ❌ Drop shadows on buttons (use inner shadows + glass borders)
- ❌ Lottie / animated icons
- ❌ Testimonial carousels
- ❌ Generating icons as images (SVG wins)
- ❌ Building Process section when client gave no steps
- ❌ **Glow-orb dans une section avec peu de contenu** → zone fantôme, l'utilisateur perçoit "section invisible/cassée". Toujours vérifier ratio contenu/section avant d'ajouter un glow.
- ❌ **Image en background avec overlay 85-95% noir** → invisible sur mobile, gâche la production. Mettre l'image en élément visuel à part (côte à côte avec le texte) avec 70% opacity max.
- ❌ **Grille avec nombre impair d'items en 2 colonnes mobile** → le dernier item se retrouve seul à droite, déséquilibré. Solution : `.grid > :last-child:nth-child(odd) { grid-column: 1 / -1 }` pour qu'il prenne toute la largeur.
- ❌ **Margin-top > 48px entre une banner image et la grille qui suit** → trou visuel, perçu comme "section vide". Garder à 32-40px max.

### UX-BLOAT — la simplicité gagne presque toujours
- ❌ **8+ pages pour un site de service local** (atelier, agence, restaurant, salon…). Au-delà de 4-5 pages, l'utilisateur se perd. Cap : **4 pages max** (Accueil + Boutique/Services + Contact-RDV + Confirmation). Fusionner B2C/B2B avec un toggle plutôt qu'avoir des pages séparées.
- ❌ **9+ sections sur la page d'accueil**. L'utilisateur scroll, voit la même prestation listée 3 fois (Prestations / Tarifs / File Service), abandonne. Cap : **5 sections max** (Hero + Trust + 3 prestations phares + Pourquoi nous + CTA final). Tout le reste va sur boutique/RDV.
- ❌ **Formulaire RDV à 11+ champs** (prénom + nom séparés + email + tel + marque + modèle + année + motorisation + prestation + date + créneau + message). Chaque champ = 5-10% d'abandons. Cap : **6 champs max** (Nom complet, Tel, Véhicule en texte libre, Prestation en custom select, Disponibilités en texte libre, Message optionnel). Si l'info est "nice to have" on l'enlève — le tel suffit pour qualifier au rappel.
- ❌ **Deux CTAs concurrents au même niveau** (genre "Ajouter au panier" Stripe + "Prendre RDV" formulaire) sans hiérarchie. L'utilisateur ne sait pas lequel utiliser, abandonne. Solution : **un seul chemin principal** (RDV) + un secondaire optionnel (boutique direct paiement) clairement positionné comme "express pour pros".
- ❌ **Page contact dédiée** avec juste tel/email/adresse alors que c'est déjà dans le footer. Pure duplication. Solution : enrichir le footer avec un bloc CTA contact (`.footer-cta-row` : tel + WhatsApp + email en boutons pill) et supprimer la page.
- ❌ **Page À propos dédiée** avec 4 paragraphes que personne ne lit. Solution : section "Pourquoi nous choisir" sur l'accueil (3 piliers narratifs courts).
- ❌ **Page panier dédiée** alors qu'un drawer off-canvas suffit. Le drawer permet de continuer à parcourir le site sans changer de page. Solution : drawer footer avec bouton "Procéder au paiement" qui va direct vers Stripe.
- ❌ **Inventer des témoignages clients** pour combler une section vide. RÈGLE FACTUELLE STRICTE. Solution : section "Pourquoi nous choisir" avec piliers narratifs factuels (logiciels officiels, garantie à vie, intervention 24/7) + CTA discret "Laissez-nous un avis Google" pour collecter les vrais avis avec le temps.
- ❌ **Tag mismatch HTML** (genre `<a>...</button>`) → cause des artefacts visuels invisibles à l'œil nu (espaces fantômes, hover broken). Toujours valider avec un grep simple : `grep -E "</?(button|a)" file.html | head -20`.

---

## DELIVERABLES CHECKLIST

- [ ] `index.html` — production-ready
- [ ] `IMAGES_BRIEF.md` — visual DNA + all prompts
- [ ] `STRUCTURE.md` (multi-page) — sections × verified facts
- [ ] `STRIPE_INTEGRATION.md` (if e-commerce)
- [ ] Backup image files `/outputs/img-NN-{slug}.png`
- [ ] List of pending placeholders (if any)

---

## FILE STRUCTURE & NAMING (CRITICAL)

### All files at flat root level

The user downloads everything to a single folder and opens `index.html` directly. Same logic when deploying to Vercel: everything at project root, no subfolders.

**Never** use paths like `./img/img-01.png` or `./assets/hero.jpg`. Always flat: `src="img-01-atelier.png"`.

### Image naming convention (mandatory)

Format: `img-NN-{slug}.{ext}`
- `NN` = zero-padded number matching the IMG-NN ID in IMAGES_BRIEF.md
- `slug` = short kebab-case description
- Example: `img-01-atelier.png`, `img-02-cartographie.png`, `img-03-engine-closeup.png`

**Why this matters**:
- One-to-one mapping between IMAGES_BRIEF.md IDs and actual files
- User can read filename and instantly know which placeholder it fills
- No name collisions with future projects
- No ambiguity if user manually replaces an image

### Verification step before delivery

Always run `grep` on the HTML to verify every `src=` matches an existing file, and tell the user explicitly: "All files must be in the same folder. Drop them at the root of your project."

### Image density discipline (Apple minimalism)

A premium dark Apple-inspired landing page has FEW images. Default for a single-page site:
- 1 hero (video or image)
- 1-3 supporting images max in body sections
- Everything else = liquid glass cards, SVG icons, CSS effects

**Don't add images to "fill space"**. Empty space is the design. Adding images for density is a Squarespace reflex, not Apple.

**When the user asks "why so few images?"** — explain the minimalism rule, but offer concrete options for adding 1-2 if they want (e.g., engine close-up for Prestations, intervention scene for 24/7 band). Never up-sell more than 2 additional images on a single-page site.

### Test artifacts

When testing MCP parameters or model behavior, **always tell the user explicitly** that a generation is a test (not a deliverable) so they don't get confused by stray images in their Higgsfield history. Suggest deleting test artifacts after.

---

## LESSONS

### MS REPROG 75 Phase 4 (2026-05-06) — UX audit + refonte agressive

- **L'utilisateur a demandé un audit de simplicité après livraison** — score initial 5,5/10. Refonte 8→4 pages avec cap explicites (5 sections accueil, 6 champs RDV, 3 nav items). Score post-refonte estimé 9/10.
- **Le test du "scroll fatigue"** : si l'utilisateur voit la même prestation 2-3 fois en scrollant l'accueil (Prestations + Tarifs + File Service), c'est de la redondance qui dilue. Toujours faire UN passage par item, ailleurs c'est juste un lien vers la boutique.
- **Le test des deux CTAs** : si tu as "Ajouter au panier" Stripe + "Prendre RDV" mailto au même niveau, l'utilisateur se demande "si je paie maintenant, est-ce que j'ai un RDV ?" et abandonne. Solution : un chemin principal clair (RDV) + un secondaire express (boutique) avec messaging qui dit "tu sais ce que tu veux".
- **Le test du formulaire 11 champs** : 11 champs = formulaire de banque, pas d'atelier. Auto/B2C en France : le tel suffit, on rappelle pour qualifier. Email = facultatif, à mettre dans le champ Message si besoin.
- **WhatsApp FAB c'est non-négociable en FR** sur les verticaux auto, immobilier, B2C local. Ne pas l'oublier. Impact conversion estimé ×1.5+.
- **Une page contact, c'est une duplication du footer**. Le footer enrichi (`.footer-cta-row`) suffit dans 95% des cas.
- **Une page À propos, c'est une page que personne ne lit**. Une section "Pourquoi nous" sur l'accueil avec 3 piliers narratifs factuels suffit.
- **Le drawer cart suffit, pas besoin de page cart**. Permet de continuer à shopper sans changer de page.
- **Tag mismatch HTML cause des artefacts visuels invisibles**. Toujours vérifier avec un grep simple. Une faute de balise = des "boutons fantômes" qui apparaissent et qui ne sont pas trouvables au DevTools (parce que le navigateur les "réinterprète" en arbre DOM).
- **Custom select obligatoire** : les `<select>` natifs ne stylent pas les `<option>` dans la dropdown. Sur un design dark premium, le contraste est cassé dès que la dropdown s'ouvre.
- **Ne jamais inventer des témoignages**. Section "Pourquoi nous" + CTA "Laissez-nous un avis Google →" + le temps fait le job.

### MS REPROG 75 (2026-05-05) — first full validation

- **`padding-bottom` raises baseline = lowers visual block** within hero. Don't use `padding-top` (destroys hero).
- **Navbar `fixed` is independent from hero content**. Browser cache often the cause of perceived issues — confirm hard refresh first.
- **Don't strip logo without explicit ask** — center pill works regardless.
- **Subtitles need fact-check** — almost shipped invented "banc de puissance" claim.
- **Copy pivots need full audit**: badge tag/text, headline, sub, CTAs, nav, page title, doc title. Miss one = incoherent.
- **MCP `unlimited: true` is NOT supported** — tested, ignored, charges credits anyway.
- **5-block prompt template scored 9+/10 on both IMG-01 and IMG-02** first try. Validated.
- **Bulk workflow > iterative** — user-driven optimization, validated.
- **Drag-drop required for visual grading** — Claude can't access MCP CDN URLs.

---

## CHANGELOG

### v0.7.0 (2026-05-06) — UX SIMPLIFICATION-FIRST (refonte MS REPROG Phase 4)
- **Cap absolu 4 pages max** pour sites de service local. MS REPROG passé de 8 → 4 pages avec score UX 5,5 → 9/10 estimé. Architecture standard : index + boutique + rendez-vous + merci.
- **Cap accueil 5 sections max** (Hero + Trust + 3 prestations + Pourquoi + CTA final). Au-delà : redondance visible (mêmes prestations listées 3 fois) qui fatigue le scroll.
- **Cap formulaire RDV 6 champs max**. Chaque champ supplémentaire = 5-10% drop-off. Fusion : prénom+nom → "Nom complet", marque+modèle+année+motorisation → "Véhicule" texte libre, date+créneau → "Disponibilités" texte libre, email retiré (le tel suffit pour qualifier).
- **Pattern fusion B2C/B2B** : toggle pill sur la page boutique au lieu de pages séparées. `.boutique-toggle-btn` (active = gradient accent) + `.boutique-section.active`. Conserve le SEO sans disperser le trafic.
- **Pattern WhatsApp FAB** (CRITICAL FR auto/B2C) : bouton flottant fixed `bottom: 24px; right: 24px; 56×56px; background: #25D366; animation pulse 2.5s`. Présent sur toutes les pages. Conversion estimée ×1.5+ pour les contextes téléphone-first (auto, immobilier, santé).
- **Pattern footer enrichi** (`.footer-cta-row`) : pill buttons tel + WhatsApp + email dans le bloc brand. Permet de supprimer la page contact dédiée.
- **Pattern CTA mobile contextuel** : sur la page rendez-vous, le CTA mobile est "Appeler" (pas "RDV") car l'utilisateur est déjà sur la page RDV. Adapter la nav au contexte.
- **Pattern Why-section** : 3 piliers narratifs factuels au lieu de témoignages inventés. Respecte la zero-invention rule. Suivi d'un CTA discret "Laissez-nous un avis Google →" pour collecter les vrais avis dans le temps.
- **Pattern drawer cart** : bouton "Procéder au paiement" du drawer redirige direct vers Stripe Checkout. Élimine la page cart dédiée. `cancel_url` Stripe = `/boutique.html` (où l'utilisateur peut continuer à shopper).
- **Décision design produit** : un seul chemin de conversion principal (RDV) + un secondaire (boutique direct paiement) clairement positionné comme "express pour pros qui savent ce qu'ils veulent". Évite la paralysie de choix.
- **9 nouveaux anti-patterns documentés** dans la section UX-BLOAT.

### v0.6.0 (2026-05-05) — MULTI-PAGE E-COMMERCE PATTERN (full delivery on MS REPROG)
- **8-page architecture standardized** : index, boutique, fichiers, rendez-vous, a-propos, contact, cart, merci. Each shares navbar + footer.
- **Cart pattern** : `sessionStorage` + central `CART_PRODUCTS` catalogue + `Cart` API (add/remove/update/clear/total/render). Cart drawer (off-canvas) + dedicated cart page.
- **Stripe Checkout serverless pattern** : 1 file (`api/create-checkout-session.js`) on Vercel. Server-side price re-validation (anti-tampering). Domain whitelist via env var. Stripe handles PCI compliance.
- **Triple source of truth on prices** : cart.js + boutique.html + api/create-checkout-session.js — must stay in sync. Document this rule in skill.
- **CSS externalized** to `styles.css` shared across all pages (1948 lines, 50 KB). Nav, footer, cart drawer, forms, catalog cards all reusable.
- **Documentation pattern** : `STRIPE_INTEGRATION.md` written FOR THE CLIENT (not for devs). Tone is conversational, step-by-step, includes test card numbers, troubleshooting section, mise-en-prod checklist.
- **Animation system v2 finalized** : 4 modular classes (`.anim-up`, `.anim-blur`, `.anim-scale`, `.anim-image`) + `data-stagger 1-10` + `.stagger-grid` auto. Plus parallax desktop on banner images via `requestAnimationFrame`.

### v0.5.0 (2026-05-05) — AUDIT-DRIVEN refinement
- **Glow placement strategy** clarifiée. Liste exhaustive des sections où glow-orb fonctionne (Trust, Urgence) vs où il crée des zones fantômes (Prestations, Tarifs, Contact, File).
- **Background image trap** identifié : overlay 85-95% noir = image invisible mobile = production gâchée. Toujours mettre l'image en élément visuel à part avec 70% opacity max.
- **Orphan grid item fix** : `:last-child:nth-child(odd) { grid-column: 1 / -1 }` pour les grilles de 5 items en 2 cols mobile.
- **Margin-top entre éléments visuels** : max 48px (au-delà = trou visuel).
- 4 nouveaux anti-patterns documentés.
- Section Présentation citation amplifiée (text-shadow accent-glow).

### v0.4.0 (2026-05-05) — MOBILE-FIRST + STATIC-FIRST refinement
- **MOBILE-FIRST is mandatory** — 80% du trafic est mobile. Checklist 640px ajoutée (toutes valeurs paddings/sizes/glows recalibrées).
- **STATIC-FIRST rule** — tous les effets (glows, lueurs, gradients) visibles par défaut, pas seulement au hover. `opacity: 0 → 1` au hover est une faute. Doit être `0.5 → 1`.
- **Glow size cap** : max 500px desktop / 300px mobile. Au-delà, perçu comme "section vide".
- **Règle d'or des glows** : un glow doit AGRANDIR la respiration d'une zone QUI A DU CONTENU, jamais REMPLIR une zone vide.
- Paddings sections divisés par ~25% (clamp 80-160 → 60-110).
- Token system v2 confirmé.
- Hero mobile checklist (`padding-bottom: 12vh`, `min-height: 600px`, title `clamp(2.6rem, 11vw, 4rem)`)

### v0.3.0 (2026-05-05) — MAJOR REVISION after MS REPROG visual feedback
- **Critical lesson**: pure white-on-black is sterile, NOT premium. Added "4 Pillars of Vivant" mandatory rule.
- Accent color now MANDATORY (not optional) — table of recommendations by vertical
- Glows ambient system formalized (.glow-orb classes, 5 placement variants)
- SVG mockup discipline for service cards (vs plain icon)
- Typography hierarchy enriched (eyebrows with gradient line, tags with accent border, prices in accent)
- Token system v2 (6 accent values: base, bright, deep, soft, glow, glow-deep)
- CTA solid: gradient accent (not flat white)
- v0.2 was technically correct but visually flat. v0.3 fixes that.

### v0.2.0 (2026-05-05) — VALIDATED on MS REPROG 75
- Bulk image workflow officialized
- 5-axis weighted scoring rubric
- Surgical patch library
- 5-block Nano Banana template (validated 9+/10)
- Cost economics analysis (130:1 ratio)
- File structure & naming convention (flat root, `img-NN-{slug}` format)
- Image density discipline (Apple minimalism — don't fill, leave space)
- Test artifact discipline (always tell user when generation is a test)
- MS REPROG full case lessons

### v0.1.0 (2026-05-05) — initial draft
- Core principles + hero rules + image strategy
- Captured from NR Cars hero iteration + MS REPROG fact extraction
