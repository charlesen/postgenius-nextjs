'use client';

import { useState } from 'react';
import axios from 'axios';

const promptOptions = [
    { label: 'Storytelling', value: 'storytelling' },
    { label: 'Inspiration', value: 'inspiration' },
    { label: 'Thread éducatif', value: 'thread' },
    { label: 'Statistique + Opinion', value: 'stat' },
    { label: 'Annonce de service', value: 'promo' },
];

export default function PostGeniusPage() {
    const [input, setInput] = useState('');
    const [promptType, setPromptType] = useState('storytelling');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    async function generatePost() {
        setLoading(true);
        setResult('');
        try {
            const res = await axios.post('http://localhost:8000/api/openai', {
                prompt_type: promptType,
                input,
            });
            setResult(res.data.generated || JSON.stringify(res.data));
        } catch (err: any) {
            setResult('Erreur : ' + err.message);
        }
        setLoading(false);
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold">🧠 PostGenius</h1>

            <label className="block text-sm font-medium">Quel type de post ?</label>
            <select
                className="w-full border px-3 py-2 rounded"
                value={promptType}
                onChange={(e) => setPromptType(e.target.value)}
            >
                {promptOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            <textarea
                className="w-full border px-3 py-2 rounded"
                rows={4}
                placeholder="Ex. : Je veux parler de ma reconversion pro"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />

            <button
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                onClick={generatePost}
                disabled={loading || !input}
            >
                {loading ? 'Génération...' : 'Générer le post'}
            </button>

            {result && (
                <div className="bg-gray-100 p-4 rounded whitespace-pre-wrap border mt-4">
                    {result}
                </div>
            )}
        </div>
    );
}
