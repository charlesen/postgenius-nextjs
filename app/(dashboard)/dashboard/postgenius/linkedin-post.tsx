'use client';

import { useState } from 'react';
import { generateLinkedInPost } from '@/lib/services/linkedinService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function LinkedInPost() {
    const [topic, setTopic] = useState('');

    const [tone, setTone] = useState('Professional');
    const [customTone, setCustomTone] = useState('');


    const [audience, setAudience] = useState('General');
    const [customAudience, setCustomAudience] = useState('');

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
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tone</label>
                        <Select
                            value={tone}
                            onValueChange={(value) => {
                                setTone(value);
                                if (value !== 'other') setCustomTone('');
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a tone" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Professional">Professional</SelectItem>
                                <SelectItem value="Casual">Casual</SelectItem>
                                <SelectItem value="Inspirational">Inspirational</SelectItem>
                                <SelectItem value="Humorous">Humorous</SelectItem>
                                <SelectItem value="Educational">Educational</SelectItem>
                                <SelectItem value="other">Other...</SelectItem>
                            </SelectContent>
                        </Select>

                        {tone === 'other' && (
                            <Input
                                placeholder="Enter a custom tone"
                                value={customTone}
                                onChange={(e) => setCustomTone(e.target.value)}
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Audience</label>
                        <Select
                            value={audience}
                            onValueChange={(value) => {
                                setAudience(value);
                                if (value !== 'other') setCustomAudience('');
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select an audience" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="General">General</SelectItem>
                                <SelectItem value="Developers">Developers</SelectItem>
                                <SelectItem value="Entrepreneurs">Entrepreneurs</SelectItem>
                                <SelectItem value="Marketers">Marketers</SelectItem>
                                <SelectItem value="Job Seekers">Job Seekers</SelectItem>
                                <SelectItem value="other">Other...</SelectItem>
                            </SelectContent>
                        </Select>

                        {audience === 'other' && (
                            <Input
                                placeholder="Enter a custom audience"
                                value={customAudience}
                                onChange={(e) => setCustomAudience(e.target.value)}
                            />
                        )}
                    </div>

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
