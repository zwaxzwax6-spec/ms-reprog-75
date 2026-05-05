// === MS REPROG 75 — Stripe Checkout Session ===
// Vercel Serverless Function
// Endpoint: POST /api/create-checkout-session

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Catalogue côté serveur (re-validation des prix pour empêcher la manipulation côté client)
const CATALOG = {
  'stage1-atelier':       { name: 'Stage 1',                         description: 'Atelier · Reprogrammation', price: 300 },
  'stage2-atelier':       { name: 'Stage 2',                         description: 'Atelier · Reprogrammation', price: 300 },
  'e85-atelier':          { name: 'Reprogrammation E85',             description: 'Atelier · Flex Fuel',       price: 300 },
  'depollution-atelier':  { name: 'Suppression FAP / EGR / Lambda',  description: 'Atelier · Dépollution',     price: 149 },
  'adblue-nox-atelier':   { name: 'AdBlue + NOX',                    description: 'Atelier · Dépollution',     price: 249 },
  'adblue-fap-atelier':   { name: 'AdBlue + FAP / EGR / Lambda',     description: 'Atelier · Dépollution',     price: 299 },
  'immo-off-atelier':     { name: 'IMMO OFF',                        description: 'Atelier · Électronique',    price: 169 },
  'reparation-frm':       { name: 'Réparation FRM',                  description: 'Atelier · Électronique',    price: 149 },
  'clonage-calculateur':  { name: 'Clonage de calculateur',          description: 'Atelier · Électronique',    price: 199 },
  'egr-off-fichier':      { name: 'EGR OFF',                         description: 'Fichier · Distance',        price: 30  },
  'fap-off-fichier':      { name: 'FAP OFF',                         description: 'Fichier · Distance',        price: 40  },
  'immo-off-fichier':     { name: 'IMMO OFF',                        description: 'Fichier · Distance',        price: 50  },
  'adblue-off-fichier':   { name: 'AdBlue OFF',                      description: 'Fichier · Distance',        price: 50  },
  'stage1-fichier':       { name: 'Stage 1 (fichier)',               description: 'Fichier · Distance',        price: 70  },
};

export default async function handler(req, res) {
  // CORS (sur Vercel, généralement géré automatiquement, mais au cas où)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Aucun article dans le panier' });
    }

    // Re-validation côté serveur (sécurité : on ne fait JAMAIS confiance aux prix envoyés par le client)
    const lineItems = items.map(item => {
      const product = CATALOG[item.id];
      if (!product) throw new Error(`Produit inconnu: ${item.id}`);
      const quantity = parseInt(item.quantity, 10);
      if (isNaN(quantity) || quantity < 1 || quantity > 10) {
        throw new Error(`Quantité invalide pour ${item.id}`);
      }
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.price * 100, // en centimes
        },
        quantity,
      };
    });

    const origin = req.headers.origin || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: `${origin}/merci.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/boutique.html`,
      locale: 'fr',
      // Optionnel: collecter les coordonnées client
      billing_address_collection: 'auto',
      phone_number_collection: { enabled: true },
      // Optionnel: notifications email
      // customer_email: req.body.email, // si tu veux préremplir
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    return res.status(500).json({ error: err.message });
  }
}
