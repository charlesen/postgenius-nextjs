'use client';

import { useState, useEffect } from 'react';
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

interface LinkedInPostProps {
    initialContent?: string;
}

export default function LinkedInPost({ initialContent = '' }: LinkedInPostProps) {
    const [post, setPost] = useState(initialContent);
    const [topic, setTopic] = useState('');
    const [tone, setTone] = useState('Professional');
    const [customTone, setCustomTone] = useState('');
    const [audience, setAudience] = useState('General');
    const [customAudience, setCustomAudience] = useState('');
    const [keywords, setKeywords] = useState('');
    const [promptStyle, setPromptStyle] = useState('inspiration');
    const [language, setLanguage] = useState('French');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setPost(initialContent);
    }, [initialContent]);

    const handleGenerate = async () => {
        setLoading(true);
        setError('');
        try {
            const generatedPost = await generateLinkedInPost({
                topic,
                tone: customTone || tone,
                audience: customAudience || audience,
                keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
                prompt_style: promptStyle,
                language,
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

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Prompt Style</label>
                        <Select value={promptStyle} onValueChange={setPromptStyle}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a style" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="inspiration">Inspiration</SelectItem>
                                <SelectItem value="storytelling">Storytelling</SelectItem>
                                <SelectItem value="cta">Appel à l’action</SelectItem>
                                <SelectItem value="thread">Mini-thread</SelectItem>
                                <SelectItem value="stat_opinion">Statistique + opinion</SelectItem>
                                <SelectItem value="service_announcement">Annonce de service</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Language</label>
                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="French">French</SelectItem>
                                <SelectItem value="English">English</SelectItem>
                                <SelectItem value="Spanish">Spanish</SelectItem>
                                <SelectItem value="German">German</SelectItem>
                            </SelectContent>
                        </Select>
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
