'use client';

import { useState } from 'react';
import LinkedInPost from './linkedin-post';
import LinkedInPostHistory from './linkedin-post-history';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PostGeniusPageWrapper() {
    const [regeneratedPost, setRegeneratedPost] = useState('');

    return (
        <div className="flex-1 space-y-6 p-8">
            <h1 className="text-2xl font-semibold">PostGenius</h1>
            <Tabs defaultValue="generate">
                <TabsList>
                    <TabsTrigger value="generate">Generate Posts</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="generate">
                    <LinkedInPost initialContent={regeneratedPost} />
                </TabsContent>
                <TabsContent value="history">
                    <LinkedInPostHistory onRegenerate={setRegeneratedPost} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
