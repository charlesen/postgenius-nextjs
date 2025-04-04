'use client';

import { useEffect, useState } from 'react';
import { fetchPostHistory } from '@/lib/services/linkedinService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface LinkedInPostHistoryProps {
    onRegenerate?: (content: string) => void;
}

export default function LinkedInPostHistory({ onRegenerate }: LinkedInPostHistoryProps) {
    const [posts, setPosts] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const data = await fetchPostHistory();
                setPosts(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        loadHistory();
    }, []);

    return (
        <section className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Historique des posts générés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {loading ? (
                        <p>Chargement...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : posts.length === 0 ? (
                        <p>Aucun post généré pour le moment.</p>
                    ) : (
                        posts.map((post, idx) => (
                            <div key={idx} className="space-y-2">
                                <Textarea value={post} readOnly rows={6} className="w-full" />
                                {onRegenerate && (
                                    <Button
                                        variant="outline"
                                        onClick={() => onRegenerate(post)}
                                        className="text-sm"
                                    >
                                        Regénérer ce post
                                    </Button>
                                )}
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
