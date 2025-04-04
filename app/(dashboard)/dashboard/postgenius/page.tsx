import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/session-server';
import PostGeniusPageWrapper from './postgenius-wrapper';

export default async function PostGeniusPage() {
    const user = await getUser();
    if (!user) redirect('/sign-in');

    return <PostGeniusPageWrapper />;
}
