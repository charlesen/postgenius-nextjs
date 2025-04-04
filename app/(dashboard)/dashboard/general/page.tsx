import { redirect } from 'next/navigation';
import { Settings } from '@/app/(dashboard)/dashboard/settings';
import { getUser } from '@/lib/auth/session-server';


export default async function GeneralPage() {
  const user = await getUser();

  if (!user) {
    redirect('/sign-in');
  }

  return <Settings user={user} />;
}
