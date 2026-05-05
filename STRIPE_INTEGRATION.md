# 🔑 Intégration Stripe — Guide de mise en route

Le site est **prêt à fonctionner** avec Stripe. Il ne te reste que **3 étapes** pour activer les paiements.

---

## Étape 1 — Créer un compte Stripe (5 min)

1. Va sur **[stripe.com](https://stripe.com)** et clique sur **"Démarrer"**
2. Crée un compte avec ton email pro `msreprog75@gmail.com`
3. Renseigne les informations de l'entreprise :
   - SIRET / numéro d'entreprise
   - Adresse : 18 Avenue de Juvisy, 91420 Morangis
   - IBAN du compte bancaire pro pour recevoir les paiements
4. Une fois le compte créé, tu accèdes au **Dashboard Stripe**

---

## Étape 2 — Récupérer ta clé secrète Stripe

### Mode TEST (pour valider que tout fonctionne avant de mettre en prod)

1. Dans le Dashboard Stripe, en haut à droite, **active le mode "Test"** (toggle)
2. Va dans **Développeurs → Clés API**
3. Copie la **"Clé secrète"** qui commence par `sk_test_...`

### Mode PRODUCTION (quand tu es prêt à recevoir de vrais paiements)

1. Désactive le mode Test
2. Va dans **Développeurs → Clés API**
3. Copie la **"Clé secrète"** qui commence par `sk_live_...`

⚠️ **NE JAMAIS partager cette clé**. Elle ne doit JAMAIS apparaître dans le code source ni sur GitHub.

---

## Étape 3 — Déployer sur Vercel et ajouter la clé

### Option A : Déploiement Vercel (recommandé — gratuit)

1. Crée un compte sur **[vercel.com](https://vercel.com)** avec GitHub
2. Pousse tous les fichiers du site sur un repository GitHub
3. Sur Vercel : **"New Project"** → sélectionne ton repo → **"Deploy"**
4. Une fois déployé, va dans **Settings → Environment Variables**
5. Ajoute une nouvelle variable :
   - **Name** : `STRIPE_SECRET_KEY`
   - **Value** : ta clé `sk_test_...` (mode test) ou `sk_live_...` (mode prod)
   - **Environments** : coche **Production**, **Preview**, **Development**
6. Redéploie le site (**Deployments** → dernier déploiement → **... → Redeploy**)

✅ **C'est tout.** Le site est prêt à recevoir des paiements.

### Option B : Ton propre serveur (Hostinger VPS, etc.)

Si tu veux héberger sur ton VPS Hostinger (`187.77.171.106`), tu dois :
1. Installer Node.js 18+ et `pm2` ou similaire
2. Installer les dépendances : `npm install`
3. Convertir la fonction Vercel en serveur Express (je peux t'aider si besoin)
4. Configurer la variable d'environnement `STRIPE_SECRET_KEY`
5. Reverse-proxy avec Nginx pour `/api/*` → Node.js, et le reste → fichiers statiques

> **Recommandation** : utilise Vercel. C'est gratuit, ultra rapide à déployer, et conçu exactement pour ce cas d'usage.

---

## 🧪 Tester le paiement avant la mise en production

Une fois la clé `sk_test_...` configurée, ouvre le site et fais un test :

1. Va sur **/boutique.html** ou **/fichiers.html**
2. Ajoute un produit au panier
3. Clique sur le panier → **"Voir le panier"** → **"Procéder au paiement"**
4. Tu es redirigé vers la page Stripe Checkout
5. **Cartes de test Stripe** :

| Numéro de carte | Résultat |
|---|---|
| `4242 4242 4242 4242` | ✅ Paiement accepté |
| `4000 0000 0000 9995` | ❌ Solde insuffisant |
| `4000 0027 6000 3184` | 🔐 Demande 3D Secure (autorisation requise) |

- **Date d'expiration** : n'importe quelle date future (ex: `12/34`)
- **CVC** : 3 chiffres au hasard (ex: `123`)
- **Code postal** : `12345`

6. Après paiement validé, tu es redirigé sur **/merci.html**
7. Va dans le **Dashboard Stripe → Paiements** : tu verras le paiement de test

---

## 🚀 Passer en production

Une fois que tu as testé et que tout fonctionne :

1. **Active le mode Live** dans le Dashboard Stripe (en haut à droite)
2. Récupère ta nouvelle clé `sk_live_...`
3. Sur Vercel : **Settings → Environment Variables** → édite `STRIPE_SECRET_KEY` avec la nouvelle valeur
4. **Redéploie** le projet
5. Les paiements sont désormais réels — l'argent arrive sur ton compte bancaire (versement automatique sous 7 jours par défaut)

---

## 💳 Configuration Stripe recommandée

### Activer Apple Pay / Google Pay
Dans le Dashboard Stripe → **Réglages → Paiements** → active :
- ✅ Apple Pay (gratuit, augmente le taux de conversion mobile de ~30%)
- ✅ Google Pay (gratuit, idem)
- ✅ Cartes bancaires (par défaut)

### Notifications email automatiques
Dans le Dashboard Stripe → **Réglages → Emails** :
- Active les **reçus automatiques** envoyés au client après paiement
- Active les **alertes admin** (tu reçois un email à chaque vente)

### Frais Stripe
- **1,5% + 0,25 €** par transaction (cartes européennes)
- **2,9% + 0,25 €** pour cartes hors Europe

Sur une vente de 300€, tu reçois ~295€ après frais. Pas de frais d'abonnement.

---

## 📁 Structure des fichiers du site

```
ms-reprog-75/
├── index.html               # Accueil
├── boutique.html            # Catalogue 9 prestations atelier
├── fichiers.html            # Catalogue 5 fichiers à distance
├── rendez-vous.html         # Formulaire RDV (mailto)
├── a-propos.html            # Page À propos
├── contact.html             # Formulaire contact (mailto)
├── cart.html                # Page panier
├── merci.html               # Page confirmation post-paiement
├── styles.css               # CSS partagé
├── cart.js                  # Logique panier (sessionStorage)
├── package.json             # Dépendances Node.js (stripe)
├── api/
│   └── create-checkout-session.js   # Vercel Serverless → Stripe
└── img-*.png                # 3 images générées (atelier, cartographie, moteur)
```

---

## 🛠️ Modifier les prix

Les prix sont définis à **2 endroits** (sécurité) :

1. **`cart.js`** (côté client — pour l'affichage)
   - Constante `CART_PRODUCTS` en haut du fichier
2. **`api/create-checkout-session.js`** (côté serveur — pour la facturation réelle)
   - Constante `CATALOG` en haut du fichier

⚠️ **Toujours modifier les deux** ensemble. C'est la valeur côté serveur qui fait foi (un client malveillant ne peut pas modifier le prix).

Pour modifier un prix d'une prestation, change la valeur `price` dans **les deux fichiers** ET le prix affiché dans la card HTML correspondante (`boutique.html` ou `fichiers.html`).

---

## 📨 Formulaires (RDV + Contact)

Actuellement, les formulaires ouvrent le client mail du visiteur (`mailto:`). Pour un envoi automatique sans ouvrir le mail, je recommande **Formspree** (gratuit jusqu'à 50 envois/mois) ou **Resend** (3000 envois/mois gratuits).

Si tu veux qu'on connecte ça aussi, dis-le moi.

---

## 🆘 Si ça ne marche pas

| Problème | Solution |
|---|---|
| "Erreur — réessayez" au paiement | Vérifie que `STRIPE_SECRET_KEY` est bien dans Vercel et que tu as redéployé |
| Page 404 sur `/api/create-checkout-session` | Vérifie que le dossier `api/` est bien à la racine du repo |
| Le panier se vide à chaque page | Normal — `sessionStorage` se vide à la fermeture du navigateur. Si tu veux qu'il persiste plusieurs jours, change `sessionStorage` en `localStorage` dans `cart.js` |
| Le prix affiché ne correspond pas au prix payé | Vérifie que tu as modifié les prix dans `cart.js` ET `api/create-checkout-session.js` |

Pour tout problème : ouvre la **console développeur (F12)** sur ton navigateur et regarde l'onglet **"Console"**. Stripe affiche toujours un message clair en cas d'erreur.

---

**Tout est prêt.** Tu n'as plus qu'à créer ton compte Stripe, déployer sur Vercel et ajouter ta clé. Le reste fonctionne tout seul.
