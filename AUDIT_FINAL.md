# Audit final ms-reprog-75 — Rapport de livraison

**Date :** 2026-05-05
**Scope :** 4 pages (index, boutique, rendez-vous, merci) — desktop 1440×900 + mobile 390×844
**Méthode :** lecture HTML/CSS exhaustive + screenshots Playwright avec déclenchement complet des reveals.

---

## Décisions

Sur 12 findings identifiés dans `PROPOSITIONS.md`, le client a validé **5 fixes** :
- 3 CRITICAL : C1, C2, C3
- 2 RECOMMENDED : R1, R3

Findings non validés (skip volontaire) : R2, R4, R5, O1, O2, O3, O4. Voir `PROPOSITIONS.md` pour le détail — ces points peuvent être traités lors d'une itération ultérieure.

---

## Fixes appliqués

### ✅ C1 — Grille prestations équilibrée

**Avant :** desktop 3 colonnes avec Stage 1 en `featured` (span 2) → carte E85 orpheline sur ligne 2.
**Après :** 3 cartes égales sur 3 colonnes desktop, layout symétrique.

**Surface :**
- `index.html:111` — retrait de la classe `featured` sur Stage 1
- `styles.css` — suppression de `.prestation-card.featured` (4 lignes desktop + 2 lignes 980px + 2 lignes 640px)

**Régression :** vérifié desktop + mobile. Aucune.

---

### ✅ C2 — Form RDV centré

**Avant :** `<form style="max-width: 720px;">` ancré à gauche → ~50 % de viewport vide à droite sur 1440px.
**Après :** form centré (`margin: 56px auto 0; max-width: 640px;`), équilibre visuel restauré.

**Surface :**
- `rendez-vous.html:49` — retrait de `style="max-width: 720px;"`
- `styles.css:1810-1815` — ajout `margin: 56px auto 0; max-width: 640px;` à `.form-grid`

**Régression :** mobile inchangé (passage 1 col déjà géré). Aucune.

---

### ✅ C3 — Inline styles → classes utilitaires

**Avant :** 13+ inline styles dispersés sur 4 fichiers HTML — fragilité du design system.
**Après :** 5 classes utilitaires créées, inline styles ciblés remplacés.

**Classes créées dans `styles.css` :**
```css
.link-accent { color: var(--accent); }
.link-accent-underline {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.nav-link[aria-current="page"] { color: var(--accent); }
.footer-meta { color: var(--text-tertiary); font-size: 13px; }
.footer-urgence { color: var(--accent); font-size: 13px; }
```

**Remplacements :**
- `boutique.html:23` — nav active : `style="color:var(--accent);"` retiré (couvert par `[aria-current]`)
- `index.html:98` — lien "boutique" → `class="link-accent-underline"`
- `rendez-vous.html:44` — liens "06 01 94 61 97" + "WhatsApp" → `class="link-accent-underline"`
- `rendez-vous.html:111` — lien tel inline → `class="link-accent"`
- 4 fichiers (`index`, `boutique`, `rendez-vous`, `merci`) — footer "Lun – Sam · 9h – 19h" / "Urgence 24/7" → `class="footer-meta"` / `class="footer-urgence"`

**Régression :** 0 changement visuel attendu. Vérifié screenshots — identique.

---

### ✅ R1 — Suppression CSS mort `.hero-badge*`

**Avant :** ~39 lignes de CSS pour `.hero-badge`, `.hero-badge-tag`, `.hero-badge-text` jamais référencées (résidu d'une ancienne itération remplacée par `.hero-eyebrow`).
**Après :** code mort supprimé.

**Surface :**
- `styles.css:284-310` — bloc desktop supprimé (27 lignes)
- `styles.css:1207-1218` — bloc mobile supprimé (12 lignes)
- Total : 39 lignes en moins, 0 référence restante (vérifié par `grep`)

**Régression :** aucune (code mort).

---

### ✅ R3 — Soulignement liens WhatsApp/tel sur RDV

**Avant :** liens "06 01 94 61 97" et "WhatsApp" en accent gold sans soulignement → cliquabilité ambiguë sur fond noir.
**Après :** liens en `class="link-accent-underline"` (couvert par C3), soulignement visible.

**Régression :** aucune.

---

## Métriques

- **Lignes CSS supprimées :** ~46 (R1 + cleanup featured)
- **Lignes CSS ajoutées :** ~13 (utilitaires C3)
- **Inline styles HTML retirés :** 13 occurrences
- **Fichiers modifiés :** 5 (`index.html`, `boutique.html`, `rendez-vous.html`, `merci.html`, `styles.css`)
- **Régressions détectées :** 0

---

## Validation visuelle

Screenshots avant/après dans `/screenshots/audit/` :
- `idx-prestations-desktop.png` — grille équilibrée 3×1
- `rdv-form-desktop.png` — form centré
- `rendezvous-desktop-fold.png` — liens soulignés
- `index-desktop-full.png` / `index-mobile-full.png` — pleines pages sans régression
- `boutique-desktop-full.png` / `boutique-mobile-full.png` — pleines pages sans régression
- `rendezvous-desktop-full.png` / `rendezvous-mobile-full.png` — form centré, mobile intact
- `merci-desktop-full.png` / `merci-mobile-full.png` — sans régression

---

## État de livraison

✅ Le site est prêt pour livraison client.
✅ Design system cohérent, plus d'inline styles parasites sur les zones audit.
✅ Aucune dépendance externe ajoutée.
✅ Architecture 4 pages préservée.
✅ Caps UX respectés (5 sections accueil, 6 fields RDV, 3 nav + 1 CTA).
✅ Tokens couleur conservés (#E8C875, #F2D88A, #B89548).
✅ WhatsApp FAB intact sur les 4 pages.
✅ Custom select préservé (RDV).

---

## À considérer pour itération future

Voir `PROPOSITIONS.md` pour le détail de :
- R2 — `.field-select` mort (~12 lignes à supprimer)
- R4 — CTA "Prendre RDV" auto-référencé sur la page RDV
- R5 — Callout "service réservé aux pros" (boutique) à inline-styles lourds
- O1-O4 — micro-finitions

Ces points sont triviaux et peuvent être adressés sans risque dans un patch ultérieur si besoin.
