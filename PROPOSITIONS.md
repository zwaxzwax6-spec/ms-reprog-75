# Audit final ms-reprog-75

Audit livraison client — 4 pages (index, boutique, rendez-vous, merci) sur desktop 1440×900 + mobile 390×844.
Analyse selon 4 axes : cohérence design system, hiérarchie visuelle, parcours UX, polish & détails.

**Méthode :** lecture HTML/CSS + screenshots Playwright avec déclenchement complet des reveals.
**Résultat :** 12 findings, classés CRITICAL (3) / RECOMMENDED (5) / OPTIONAL (4).

> **NE RIEN PATCHER avant validation explicite, point par point.**

---

## CRITICAL

### C1 — Grille prestations asymétrique sur desktop (orphelin visuel)
- **Fichier :** `styles.css:611-617` + `styles.css:636-639`
- **Problème observé :** la grille `.prestations-grid` est en `repeat(3, 1fr)` et la carte `Stage 1` porte `featured` avec `grid-column: span 2`. Avec **3 cartes** dans `index.html:111/134/159`, on obtient ligne 1 = Stage 1 (span 2) + Pack dépollution, ligne 2 = E85 seul avec **2 colonnes vides** à droite. Effet visuel : carte E85 orpheline, équilibre cassé, perception "section inachevée".
- **Fix proposé :** option A — passer la grille en `repeat(2, 1fr)` sur desktop (Stage 1 span 2 reste cohérent, ou retirer le span). Option B (recommandée) — retirer la classe `featured` de Stage 1 (`index.html:111`) → 3 cartes égales sur 3 colonnes, plus lisible et plus rapide à scanner. La hiérarchie peut être maintenue via le badge "À partir de" déjà présent.
- **Surface du patch :** option B = 1 ligne HTML + suppression de `.prestation-card.featured` (lignes 636-639, 651, et règles mobiles 1169, 1297, 1302) = ~7 lignes nettes.
- **Risque de régression :** faible. Le span featured n'est utilisé que sur cette page. Vérifier mobile : déjà géré (`grid-column: span 1` à 640px).

### C2 — Formulaire RDV décalé à gauche, vide énorme à droite (desktop)
- **Fichier :** `rendez-vous.html:49`
- **Problème observé :** `<form class="form-grid" style="max-width: 720px;">` — le form est ancré à gauche dans la `.section` (qui est aussi left-aligned via `.page-header`). Sur 1440×900, le form occupe ~50 % de la largeur et **~50 % du viewport est vide à droite**. Page perçue comme "déséquilibrée", le regard cherche un contenu qui n'existe pas. La `.page-header-lead` (max-width 56ch) crée déjà cet effet plus haut, mais sur le form c'est plus brutal.
- **Fix proposé :** centrer le form via `margin: 56px auto 0; max-width: 640px;` dans `.form-grid` (styles.css:1810) **et** retirer le inline `style="max-width: 720px;"` de `rendez-vous.html:49`. Alternative plus ambitieuse (hors scope si peu de temps) : layout 2 colonnes form + colonne aside (atelier/contact) — mais ajoute du contenu. Solution simple : centrage.
- **Surface du patch :** 2 lignes (1 CSS + 1 HTML).
- **Risque de régression :** nul sur mobile (passage 1 col déjà géré). Vérifier que `.page-header` left-aligned ne paraît pas dissonante avec un form centré — acceptable car header narratif vs form action distincts.

### C3 — Inline styles dispersés (3 pages, 13+ occurrences) — fragilise le design system
- **Fichiers :**
  - `index.html:55, 58, 67, 98, 224, 265, 266`
  - `rendez-vous.html:30, 35, 44, 49, 106, 107, 110, 111, 129`
  - `boutique.html:23, 245, 246`
- **Problème observé :** styles inline pour color, max-width, padding, font-size, display, gap. Cela contourne les tokens CSS, rend les évolutions plus risquées (un changement de var(--accent) ne suit pas), et certains liens utilisent `style="color:var(--accent);"` au lieu d'une classe générique réutilisable. Ex : `boutique.html:23` répète `style="color:var(--accent);"` alors que le sélecteur `.nav-link[aria-current="page"]` pourrait suffire (à créer).
- **Fix proposé :**
  1. Créer 2 classes utilitaires dans styles.css : `.link-accent { color: var(--accent); }` et `.link-accent-underline { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }`.
  2. Créer la règle `.nav-link[aria-current="page"] { color: var(--accent); }` (1 ligne).
  3. Remplacer chaque `style="color:var(--accent);..."` par la classe correspondante.
  4. Pour les `style="display:flex;flex-direction:column;gap:16px"` (rendez-vous.html:106) → soit garder (1 occurrence, OK), soit créer `.stack-16`.
- **Surface du patch :** ~5 lignes CSS + ~10 remplacements inline → ~15 lignes nettes.
- **Risque de régression :** faible. Tester visuellement : nav active boutique, liens dans `page-header-lead`, lien boutique inline du paragraphe prestations, footer "Urgence 24/7".

---

## RECOMMENDED

### R1 — CSS mort : 3 règles `.hero-badge*` non référencées
- **Fichier :** `styles.css:284-310` (desktop) + `styles.css:1230-1241` (mobile override)
- **Problème observé :** `.hero-badge`, `.hero-badge-tag`, `.hero-badge-text` ne sont référencés **nulle part** dans le HTML (vérifié par grep). Vraisemblablement résidu d'une itération antérieure remplacée par `.hero-eyebrow`. ~30 lignes mortes. Coût : poids CSS, risque de confusion future.
- **Fix proposé :** supprimer purement les blocs `styles.css:284-310` et `styles.css:1230-1241`.
- **Surface du patch :** ~38 lignes supprimées.
- **Risque de régression :** nul (grep exhaustif effectué, 0 référence dans HTML/JS).

### R2 — CSS mort : `.field-select` non utilisé (remplacé par `.select-custom`)
- **Fichier :** `styles.css:1831, 1846, 1857-1866`
- **Problème observé :** `.field-select` est défini (background, focus, appearance, dropdown SVG) mais le RDV form utilise `.select-custom` (composant custom). Aucun `<select>` natif dans le projet (vérifié). Code mort.
- **Fix proposé :** retirer `field-select` des sélecteurs combinés (1831, 1846) et supprimer le bloc dédié 1857-1866.
- **Surface du patch :** ~12 lignes nettes.
- **Risque de régression :** nul.

### R3 — Lien "WhatsApp" du `page-header-lead` peu visible (RDV)
- **Fichier :** `rendez-vous.html:44`
- **Problème observé :** dans la phrase "Pour une **urgence** : 06 01 94 61 97 ou WhatsApp", les deux liens sont en `var(--accent)` sans soulignement. Sur fond noir, l'accent (#E8C875) reste lisible mais la nature cliquable est ambiguë. Le téléphone est suffisamment iconique, mais "WhatsApp" en accent + sans souligné = facilement loupé.
- **Fix proposé :** ajouter `text-decoration: underline; text-underline-offset: 3px;` à ces liens (via la classe `.link-accent-underline` créée en C3). Cohérent avec le style du lien "boutique" dans `index.html:98`.
- **Surface du patch :** changement de classe sur 2 `<a>` = 2 lignes HTML.
- **Risque de régression :** nul.

### R4 — Hiérarchie CTA dupliquée dans la nav RDV (auto-référence)
- **Fichier :** `rendez-vous.html:24`
- **Problème observé :** sur la page rendez-vous, le bouton or "Prendre RDV" reste actif dans la nav alors qu'on est déjà sur la page. Cliquer dessus recharge la page. Confusion légère + perte d'opportunité (le slot pourrait pointer vers WhatsApp ou téléphone).
- **Fix proposé :** sur cette page uniquement, transformer le CTA en `<button class="btn-glass" style="opacity:.6;pointer-events:none;">Prendre RDV</button>` ou — mieux — remplacer par un CTA d'urgence : `<a href="tel:..." class="btn-glass">Appeler</a>`. Décision produit : préférer la cohérence (CTA grisé/disabled) ou la conversion (Appeler).
- **Surface du patch :** 1 ligne HTML.
- **Risque de régression :** mineur : tester ARIA / focus order, vérifier sur mobile que le CTA "Appeler" du fold mobile (`rendezvous-mobile-fold.png` montre déjà un "Appeler" en haut à droite) ne crée pas de redondance.

### R5 — Box "service réservé aux pros" à inline-styles lourds (boutique)
- **Fichier :** `boutique.html:245-251`
- **Problème observé :** la callout `<div class="liquid-glass-strong" style="border-radius: var(--radius-card); padding: 24px 28px; margin-bottom: 32px; display: flex; gap: 16px; align-items: flex-start;">` cumule 5 propriétés inline. Difficilement réutilisable, même si en pratique on n'en a qu'une.
- **Fix proposé :** créer une classe `.callout-info` dans styles.css avec ces propriétés. Idem pour le SVG `style="width:24px;height:24px;color:var(--accent);flex-shrink:0;margin-top:2px;"` → classe `.callout-info-icon`.
- **Surface du patch :** ~10 lignes CSS + 2 changements HTML.
- **Risque de régression :** nul.

---

## OPTIONAL

### O1 — Padding inline sur CTA-final (`index.html:224`) : sur-spec
- **Fichier :** `index.html:224`
- **Problème observé :** `<a href="rendez-vous.html" class="btn-solid" style="padding: 14px 26px; font-size: 14px;">` — le `.btn-solid` a déjà ses propres padding/font-size. L'override inline force une taille différente du standard, sans raison apparente vu le screenshot (le bouton paraît dans la norme).
- **Fix proposé :** retirer le inline style. Si visuellement la taille standard est inadaptée, créer `.btn-solid--lg` ou similar. Sinon, simplifier.
- **Surface du patch :** 1 ligne.
- **Risque de régression :** vérifier visuellement la taille du CTA final. Reload + screenshot suffit.

### O2 — `style="animation-delay"` inline sur 3 éléments du hero (`index.html:55, 58, 67`)
- **Fichier :** `index.html:55, 58, 67`
- **Problème observé :** delays inline (`1.2s`, `1.4s`, `1.6s`) pour orchestrer le hero. Fonctionnel mais difficile à maintenir. Pattern `data-stagger` utilisé ailleurs (page-header) serait cohérent.
- **Fix proposé :** migrer vers `data-stagger="3"`, `data-stagger="4"`, `data-stagger="5"` si le système stagger gère les delays automatiques (à vérifier dans le JS). Sinon, garder.
- **Surface du patch :** 3 lignes HTML.
- **Risque de régression :** moyen — il faut vérifier que le système `data-stagger` est compatible avec `anim-fade-up` du hero. Si non, ne pas toucher.

### O3 — Gap de 16px sur footer-cta-row vs cohérence design system
- **Fichier :** non vérifié dans cet audit (footer non lu en détail)
- **Problème observé :** non observable depuis les screenshots, à confirmer.
- **Fix proposé :** —
- **Surface du patch :** —
- **Risque de régression :** —
- **Note :** finding non-validé, à drop si non confirmé visuellement.

### O4 — `.page-header` toujours `text-align: left` — hiérarchie inversée vs accueil
- **Fichier :** `styles.css:1391`
- **Problème observé :** la page d'accueil a un hero centré ; les pages internes (boutique, RDV) sont left-aligned. C'est défendable (style éditorial, narratif) et cohérent entre boutique/RDV. Mais le contraste avec l'accueil + le vide à droite (cf C2 sur RDV) peut donner une impression "page brouillon". À considérer **uniquement si on prend C2** : si on centre le form, on peut soit garder le header left (contraste assumé), soit centrer aussi (uniformité).
- **Fix proposé :** décider après application de C2. Probable maintien de left-aligned pour distinguer narratif vs action.
- **Surface du patch :** 1 ligne (`text-align: center;`) si retenu.
- **Risque de régression :** faible.

---

## Méta — observations positives (à conserver)

- L'eyebrow pill du hero (Task 1) rend correctement desktop + mobile (vérifié sur `index-mobile-fold.png`).
- La grille boutique 3×3 est parfaitement équilibrée — ne pas toucher.
- La page `merci.html` est sobre, claire, fonctionnelle.
- La `info-band` boutique ("Garantie à vie sur l'atelier") est très bien composée — split text/CTAs propre.
- WhatsApp FAB cohérent sur les 4 pages.
- Le custom select fonctionne bien visuellement (`rendezvous-mobile-fold.png`).
- Les tokens accent (#E8C875 / #F2D88A / #B89548) sont utilisés systématiquement, le design system tient debout.

---

## Récap synthétique pour décision rapide

| # | Titre | Sévérité | Effort | Régression |
|---|---|---|---|---|
| C1 | Grille prestations asymétrique | 🔴 | 7 lignes | Faible |
| C2 | Form RDV décalé (vide à droite) | 🔴 | 2 lignes | Nul |
| C3 | Inline styles dispersés | 🔴 | ~15 lignes | Faible |
| R1 | CSS mort `.hero-badge*` | 🟡 | 38 lignes (suppr.) | Nul |
| R2 | CSS mort `.field-select` | 🟡 | 12 lignes (suppr.) | Nul |
| R3 | Lien WhatsApp peu visible | 🟡 | 2 lignes | Nul |
| R4 | CTA RDV auto-référence | 🟡 | 1 ligne | Mineur |
| R5 | Callout "pros" inline-styles | 🟡 | 12 lignes | Nul |
| O1 | Padding inline btn CTA-final | 🟢 | 1 ligne | Faible |
| O2 | `animation-delay` inline hero | 🟢 | 3 lignes | Moyen |
| O3 | Footer gap (non validé) | 🟢 | — | — |
| O4 | `.page-header` text-align | 🟢 | 1 ligne | Faible |

---

**Format de validation attendu :**
- "oui pour C1, C2, R1, R3" → je patche dans cet ordre, screenshot après chaque fix
- "tout en CRITICAL" → C1 + C2 + C3
- "tout sauf O2" → tout sauf O2
- "non" → on s'arrête, livraison en l'état

Je n'apporterai aucune modification de fichier avant ton GO explicite.
