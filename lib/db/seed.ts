import { stripe } from '../payments/stripe';
import { db } from './drizzle';
import { users } from './schema';
import { hashPassword } from '@/lib/auth/session';

async function createStripeProducts() {
  console.log('\n🛒 Création des produits Stripe...');

  // Mensuel – 9 €/mois
  const monthlyProduct = await stripe.products.create({
    name: 'PostGenius Mensuel',
    description: 'Abonnement mensuel à PostGenius',
  });

  await stripe.prices.create({
    product: monthlyProduct.id,
    unit_amount: 900,
    currency: 'eur',
    recurring: {
      interval: 'month',
      trial_period_days: 0,
    },
  });

  // Annuel – 97 €/an
  const yearlyProduct = await stripe.products.create({
    name: 'PostGenius Annuel',
    description: 'Abonnement annuel à PostGenius',
  });

  await stripe.prices.create({
    product: yearlyProduct.id,
    unit_amount: 9700,
    currency: 'eur',
    recurring: {
      interval: 'year',
      trial_period_days: 0,
    },
  });

  // Lifetime – 297 € (paiement unique)
  const lifetimeProduct = await stripe.products.create({
    name: 'PostGenius Lifetime',
    description: 'Accès à vie à PostGenius',
  });

  await stripe.prices.create({
    product: lifetimeProduct.id,
    unit_amount: 29700,
    currency: 'eur',
    // Pas de champ "recurring" pour lifetime
  });

  console.log('✅ Produits Stripe créés avec succès.');
}

async function seed() {
  console.log('🌱 Lancement du seed...');

  const email = 'test@test.com';
  const password = 'admin123';

  let user;

  const existingUser = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, email),
  });

  if (!existingUser) {
    const passwordHash = await hashPassword(password);
    [user] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        role: 'owner',
      })
      .returning();
    console.log('✅ Utilisateur créé.');
  } else {
    user = existingUser;
    console.log('ℹ️ Utilisateur déjà existant, réutilisé.');
  }

  await createStripeProducts();
}

seed()
  .catch((error) => {
    console.error('❌ Erreur dans le seed :', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('\n🌱 Seed terminé. ✅');
    process.exit(0);
  });
