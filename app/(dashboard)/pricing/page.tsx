import { checkoutAction } from '@/lib/payments/actions';
import { Check } from 'lucide-react';
import { getStripePrices, getStripeProducts } from '@/lib/payments/stripe';
import { SubmitButton } from './submit-button';

export const revalidate = 3600;

export default async function PricingPage() {
  const [prices, products] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
  ]);

  const getProductWithPrice = (productName: string) => {
    const product = products.find((p) => p.name === productName);
    const price = prices.find((p) => p.productId === product?.id);
    return { product, price };
  };

  const monthly = getProductWithPrice('PostGenius Mensuel');
  const yearly = getProductWithPrice('PostGenius Annuel');
  const lifetime = getProductWithPrice('PostGenius Lifetime');

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <PricingCard
          name="Mensuel"
          price={monthly.price?.unitAmount || 900}
          interval={monthly.price?.interval || 'mois'}
          trialDays={monthly.price?.trialPeriodDays || 0}
          features={[
            '20 générations IA / jour',
            'Support par email',
            'Annulable à tout moment',
          ]}
          priceId={monthly.price?.id}
        />

        <PricingCard
          name="Annuel"
          price={yearly.price?.unitAmount || 9700}
          interval="an"
          trialDays={yearly.price?.trialPeriodDays || 0}
          features={[
            'Accès illimité à PostGenius',
            '2 mois offerts',
            'Support prioritaire',
          ]}
          priceId={yearly.price?.id}
        />

        <PricingCard
          name="Lifetime"
          price={lifetime.price?.unitAmount || 29700}
          interval=""
          trialDays={0}
          features={[
            'Paiement unique',
            'Accès à vie à toutes les fonctionnalités',
            'Mises à jour incluses',
          ]}
          priceId={lifetime.price?.id}
        />
      </div>
    </main>
  );
}

function PricingCard({
  name,
  price,
  interval,
  trialDays,
  features,
  priceId,
}: {
  name: string;
  price: number;
  interval: string;
  trialDays: number;
  features: string[];
  priceId?: string;
}) {
  return (
    <div className="pt-6 border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">{name}</h2>
      {trialDays > 0 && (
        <p className="text-sm text-gray-600 mb-4">
          {trialDays} jours d’essai gratuit
        </p>
      )}
      <p className="text-4xl font-medium text-gray-900 mb-6">
        {(price / 100).toLocaleString('fr-FR', {
          style: 'currency',
          currency: 'EUR',
        })}{' '}
        {interval && (
          <span className="text-xl font-normal text-gray-600">/ {interval}</span>
        )}
      </p>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <form action={checkoutAction}>
        <input type="hidden" name="priceId" value={priceId} />
        <SubmitButton />
      </form>
    </div>
  );
}
