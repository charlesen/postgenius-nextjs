'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { getUser } from '@/lib/db/queries';

export const checkoutAction = async (formData: FormData) => {
  const priceId = formData.get('priceId') as string;
  const sessionUrl = await createCheckoutSession({ priceId });
  redirect(sessionUrl);
};

export const customerPortalAction = async () => {
  const portalSession = await createCustomerPortalSession();
  redirect(portalSession.url);
};
