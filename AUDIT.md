# AUDIT VISUEL — MS REPROG 75

Captures : 4 pages × (desktop 1440×900 + mobile 390×844) + 2 boutique toggles = **10 screenshots**.

Stockés dans `screenshots/before/`. Crops d'inspection dans `/tmp/crops_before/`.

---

## CRITICAL

### C1 — index.html · prestations-grid : 3 colonnes forcées sur mobile
- **Fichier** : `index.html` ligne 109
- **Symptôme** : sur mobile (390px), les 3 cartes sont compressées en 3 colonnes (~120px de large chacune). Titres `Stage 1.`, `Pack dépollution.`, `Reprogrammation E85.` illisibles. Tag `REPROGRAMM…` tronqué.
- **Cause** : inline `style="grid-template-columns: repeat(3, 1fr);"` qui surcharge la media query mobile (`.prestations-grid { grid-template-columns: 1fr }` à 640px).
- **Fix** : retirer l'inline style — la cascade CSS gère 3 → 2 → 1 col aux bons breakpoints.

### C2 — index.html hero : btn-solid plus petit que btn-glass
- **Fichier** : `index.html` ligne 59-65 + `styles.css` ligne 163-181
- **Symptôme** : `Prendre RDV` (primary, gold) clairement plus petit en hauteur et largeur que `Voir les services` (secondary, glass). Hiérarchie visuelle inversée — le primary doit dominer.
- **Cause** : `.btn-solid` est `padding: 8px 18px; font-size: 13px` (taillé pour la nav-pill) alors que `.btn-glass` est `padding: 14px 30px; font-size: 14px`.
- **Contrainte transverse** : `.btn-solid` est aussi utilisé dans `.nav-pill` (où il doit rester compact). Fix scopé : ajouter `.hero-cta-row .btn-solid` qui matche les dimensions de `.btn-glass`.

### C3 — Footer (toutes pages) : colonnes inlinées (links sur une ligne)
- **Fichiers** : `index.html` 256-273, `boutique.html` 381-383, `rendez-vous.html` 128-130, `merci.html` 60-62
- **Symptôme** : « AccueilBoutiquePrendre RDV », « TikTokSnapchatFacebook », « 18 Avenue de Juvisy 91420 Morangis Lun – Sam · 9h – 19h Urgence 24/7 » — tous les liens / spans des `.footer-col` apparaissent sur une seule ligne (desktop ET mobile).
- **Cause** : la règle `.footer-col ul { display: flex; flex-direction: column; gap: 10px }` (styles.css:952) cible un `<ul>` qui n'existe pas dans le markup. Les `<a>` enfants directs n'ont aucune règle d'affichage block.
- **Fix** : ajouter une règle `.footer-col a, .footer-col span { display: block }` (ou `flex` sur `.footer-col` directement).

---

## MAJOR

### M1 — index.html hero : eyebrow tronquée
- **Fichier** : `index.html` ligne 48-53
- **Symptôme** : « Garantie à vie · Logiciels officiels » au lieu de « Garantie à vie · Reprogrammation moteur sur logiciels officiels ».
- **Fix** : remplacer le texte de `.eyebrow-meta`.

### M2 — boutique.html INFO BAND : grid 1fr 1fr forcé sur mobile
- **Fichier** : `boutique.html` ligne 352
- **Symptôme** : la section « Bon à savoir » avec le titre + le bloc CTA reste en 2 colonnes sur mobile (heading très étroit à gauche, boutons étroits à droite).
- **Cause** : inline `style="… grid-template-columns: 1fr 1fr; …"`.
- **Fix** : retirer l'inline grid-template-columns et ajouter une règle CSS responsive (1fr 1fr → 1fr sous 980px).

---

## MINOR

### m1 — footer-cta-row mobile : Email orphelin sur sa ligne
- 06 01 94 61 97 + WhatsApp tiennent en row 1, Email se replie seul sur row 2. flex-wrap gère, mais visuellement déséquilibré. Acceptable.

### m2 — why-grid passage 3→1 col à 980px
- À 980px (tablette), passe directement de 3 col à 1 col, ce qui crée 3 cards très larges en tablette portrait. Pourrait bénéficier d'un palier 2 cols. Subjectif — laissé tel quel sauf si renforcé.

### m3 — `.featured` orphelin desktop
- En desktop, la card featured `Stage 1.` span 2 cols, ce qui pousse la 3ème card seule en row 2 (orphelin). C'est un choix design intentionnel (mise en valeur du Stage 1). Pas un bug.

### m4 — select-custom max-height 320px
- Dropdown avec 13 options à ~36px = 468px de contenu, scrollable dans 320px. OK sur mobile (390×844). Pas de débordement viewport observé (le trigger reste dans la moitié supérieure du viewport).

### m5 — boutique-toggle mobile
- À 390px, les 2 pills tiennent (`flex: 1; padding: 10px 12px; font-size: 12px`). Pas de wrap. OK.

---

## VERDICT

- **3 bugs CRITIQUES** à corriger en priorité (C1, C2, C3).
- **2 bugs MAJEURS** (M1, M2).
- **5 minor / RAS**.

Plan de fix dans la PHASE 2.
