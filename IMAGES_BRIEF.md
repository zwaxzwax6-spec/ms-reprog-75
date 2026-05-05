# MS REPROG 75 — Images Brief

Brief de génération pour Nano Banana Pro. Chaque prompt est calibré pour se fondre dans la DA du site (dark Apple liquid glass) sans rupture visuelle.

---

## 0. ADN VISUEL COMMUN — appliqué à TOUTES les images

Cette section définit le langage visuel partagé. Toute image générée doit respecter ces règles, sinon elle ne sera pas en cohérence avec le site.

**Lighting**
- Cinéma sombre, low-key. Sources de lumière directionnelles, dures, avec rim light blanc froid.
- Température de couleur **6500K** (lumière froide, jamais chaude orangée).
- Pas de lumière ambiante généreuse. Les zones d'ombre profonde sont OK et même souhaitées.

**Palette stricte**
- Noirs profonds (`#000`–`#0a0a0a`), gris anthracite (`#1a1a1a`–`#2a2a2a`), blancs cassés.
- **Aucun ton chaud** (orange, jaune, ocre, rouge cuivré). Si une lumière apparaît, elle est blanche froide ou bleutée très subtile.
- **Aucune saturation forte**. Tout est désaturé, sauf un éventuel reflet métallique sur une carrosserie ou un outil.

**Texture & grain**
- Grain photo subtil (style 35mm pousse à 800 ISO), jamais lisse-CGI plastique.
- Surfaces : verre brossé, métal anodisé sombre, carrosserie laquée noire. Jamais de plastique brillant cheap.

**Composition**
- Cadrage cinématographique, large respiration négative noire autour du sujet.
- Profondeur de champ courte (sujet net, arrière-plan flou).
- Angles bas ou serrés type pub auto premium (Audi, Porsche, McLaren).

**À ne JAMAIS faire**
- ❌ Personnages humains au visage visible (anonymat préservé : mains, dos, silhouette uniquement)
- ❌ Marques de voitures identifiables logos visibles (sigles de marques sur calandre, etc.)
- ❌ Couleurs vives, néons saturés (sauf petit accent technique très ponctuel sur un écran)
- ❌ Backgrounds blancs, gris clairs, ciels diurnes
- ❌ Esthétique "stock photo" ou "site corporate" — on cherche un cinéma sombre premium
- ❌ Texte généré dans l'image (pas d'écritures, pas de marquages)

---

## IMG-01 · Photo atelier — Section "Qui sommes-nous"

**Placement** : Section présentation, colonne gauche, en regard du texte « Une équipe de professionnels passionnés. »

**Ratio** : 4:5 portrait (≈ 1080 × 1350 px)

**Tier** : 1 (image clé, génération soignée)

**Intention narrative** : Donner à voir le sérieux du métier. Pas une photo de stock atelier. Une scène cinématographique qui suggère la précision, le travail à la machine, l'environnement haute technologie.

**Prompt Nano Banana Pro** :

```
Cinematic dark photography, professional automotive electronics workshop, low-key
lighting at 6500K color temperature, vertical 4:5 framing. Foreground: a black
diagnostic scan tool laptop with glowing graph display showing engine performance
curves on its screen, sitting on a dark anthracite workbench. Mid-ground: silhouette
of mechanic's hand (no face visible) holding an OBD-II connector cable, motion blur
suggesting careful work. Background: deeply blurred dark workshop with vehicle
silhouette, single cold white rim light from upper right creating dramatic
chiaroscuro. Black and anthracite grey palette only, zero warm tones, no orange,
no logos, no text, no brand markings. Subtle 35mm film grain. Shallow depth of
field. Premium automotive editorial style reminiscent of high-end watch or
luxury car print campaigns.

Negative: warm light, orange, sunset, daylight, white background, brand logos,
visible faces, plastic, stock photo aesthetic, bright colors, neon, signage, text.
```

**Notes pour génération** :
- Si Nano Banana renvoie une scène trop "artisan rustique", relancer en accentuant "high-tech, electronic, cold lighting".
- L'écran du scan tool peut afficher un graphe vert ou bleu très tenu — c'est l'unique tolérance couleur.

---

## IMG-02 · Background section File Service

**Placement** : Background pleine largeur de la section "Fichiers à distance", derrière un overlay très sombre (le contenu est lisible donc l'image est plutôt une texture d'ambiance).

**Ratio** : 16:9 paysage (≈ 1920 × 1080 px)

**Tier** : 1 (image d'ambiance immersive)

**Intention narrative** : Évoquer l'idée d'un fichier numérique, d'une cartographie ECU, d'un flux de données qui voyage. Abstrait, pas littéral.

**Prompt Nano Banana Pro** :

```
Abstract dark cinematic image, cold 6500K lighting, horizontal 16:9 framing.
Subject: a tilted close-up of a computer monitor displaying a 3D engine
cartography mesh — a topographic-like grid surface representing fuel injection
or ignition timing maps, rendered in monochrome white wireframe on pure black
background. The monitor itself is barely visible, slightly out of focus on the
edges, creating a tunnel-vision effect. A single shaft of cold white light grazes
across the screen from the right. Pure black ambient background, deep shadows,
no other objects visible. Subtle film grain. Style of premium tech editorial
photography, reminiscent of Apple keynote slides or sci-fi product reveals.

Negative: warm tones, orange glow, blue cyber neon, code text on screen,
keyboard visible, hands, people, brand logos, daylight, colorful UI elements.
```

**Notes pour génération** :
- L'image sera surcouche d'un overlay noir 85-95 %, donc même un rendu pas parfait fonctionne.
- Si Nano Banana ajoute des chiffres ou du code à l'écran, relancer en insistant "no text, no numbers, only abstract mesh".

---

## ANNEXE — Logo MS REPROG 75

Le logo client existe déjà (logo doré métallique sur fond noir, visible sur le site actuel `https://www.msreprog75.com/`). Il pourra remplacer le wordmark texte actuellement utilisé dans la navbar (`<a class="nav-wordmark">`).

**Spécifications pour intégration** :
- Format : PNG transparent, 88 × 88 px (logo seul) ou 200 × 56 px (logo + wordmark)
- Hauteur dans la navbar : 36–44 px
- Aucune génération nécessaire — utiliser l'asset existant du client.

---

## ICÔNES SVG — déjà inline dans le code

Toutes les icônes (véhicules, trust badges, prestations, contact, réseaux) sont en SVG inline directement dans le HTML. Aucune génération d'image nécessaire pour ces éléments.

Liste des SVG en place :
- 5 icônes véhicules (voiture, poids lourd, moto, tracteur, jet-ski)
- 3 icônes trust (bouclier, horloge, étoile)
- 5 icônes prestations (éclair, courbe, dépollution, boîte, loupe diag)
- Icônes utilitaires (téléphone, email, flèches)

Si une icône te paraît trop générique ou peu lisible à l'usage, signale-la et je la remplace par un SVG plus distinctif — pas de génération.

---

## RÉCAPITULATIF DES IMAGES À GÉNÉRER

| ID | Section | Ratio | Tier | Status |
|---|---|---|---|---|
| IMG-01 | Présentation atelier | 4:5 | 1 | À générer |
| IMG-02 | Background File Service | 16:9 | 1 | À générer |

**Total : 2 images à générer.** Une fois reçues, je les intègre à la place des placeholders typés `data-prompt-id="IMG-01"` et `data-prompt-id="IMG-02"`.
