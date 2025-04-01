'use client';

import { useState } from 'react';
import { generateLinkedInPost } from '@/lib/services/linkedinService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function LinkedInPost() {
    const [topic, setTopic] = useState('');
    const [tone, setTone] = useState('Professional');
    const [audience, setAudience] = useState('General');
    const [keywords, setKeywords] = useState('');
    const [post, setPost] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        setLoading(true);
        setError('');
        try {
            const generatedPost = await generateLinkedInPost({
                topic,
                tone,
                audience,
                keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
            });
            setPost(generatedPost);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex-1 p-4 lg:p-8 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>LinkedIn Post Generator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Topic (e.g., AI in marketing)"
                    />
                    <Input
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        placeholder="Tone (e.g., Professional, Casual)"
                    />
                    <Input
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                        placeholder="Audience (e.g., General, Developers)"
                    />
                    <Input
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="Keywords (comma-separated)"
                    />
                    <Button onClick={handleGenerate} disabled={loading}>
                        {loading ? 'Generating...' : 'Generate Post'}
                    </Button>
                    {error && <p className="text-red-500">{error}</p>}
                    {post && <Textarea value={post} readOnly rows={10} />}
                </CardContent>
            </Card>
        </section>
    );
}
