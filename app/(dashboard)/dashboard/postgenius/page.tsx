import { redirect } from 'next/navigation';
import { getUser } from '@/lib/db/queries';
import LinkedInPost from './linkedin-post';

export default async function PostGeniusPage() {
    const user = await getUser();
    if (!user) {
        redirect('/sign-in');
    }

    return (
        <div className="flex-1 space-y-6 p-8">
            <h1 className="text-2xl font-semibold">PostGenius</h1>
            <LinkedInPost />
        </div>
    );
}
