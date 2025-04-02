const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
const MASTER_KEY = process.env.NEXT_PUBLIC_MASTER_KEY || '';

interface GeneratePostParams {
    topic: string;
    tone?: string;
    audience?: string;
    keywords?: string[];
    prompt_style?: string;
    language?: string;
}

interface GeneratePostResponse {
    post: string;
}

export const generateLinkedInPost = async ({
    topic,
    tone = 'Professional',
    audience = 'General',
    keywords = [],
    prompt_style = 'inspiration',
    language = 'English',
}: GeneratePostParams): Promise<string> => {
    const response = await fetch(`${API_URL}/api/linkedin/generate-post`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-master-key': MASTER_KEY,
        },
        body: JSON.stringify({
            topic,
            tone,
            audience,
            keywords,
            prompt_style,
            language,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to generate LinkedIn post');
    }

    const data: GeneratePostResponse = await response.json();
    return data.post;
};
