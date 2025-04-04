import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/session-server';

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect('/sign-in');
  }

  // Return simple title page
  return (
    <section className="flex-1 p-4 lg:p-8 space-y-8">
      <div>
        <h2 className="text-2xl lg:text-3xl font-semibold mb-2">
          Dashboard
        </h2>
        <p className="text-muted-foreground text-sm">
          Welcome back, {user.name}
        </p>
      </div>
    </section>
  );

}
