import React, { useState, useEffect } from 'react';
import type { PromptCreate, GenerateRequest, Prompt } from '../types';
import { createPrompt, generateText } from '../services/api';

interface PromptEditorProps {
    onPromptSaved: () => void;
    promptToLoad?: Prompt | null;
}

const PromptEditor: React.FC<PromptEditorProps> = ({ onPromptSaved, promptToLoad }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [model, setModel] = useState('gpt-3.5-turbo');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (promptToLoad) {
            setTitle(promptToLoad.title);
            setContent(promptToLoad.content);
            setModel(promptToLoad.model);
            setResponse(''); // Clear response when loading a new prompt
        }
    }, [promptToLoad]);

    const handleGenerate = async () => {
        setLoading(true);
        setResponse('');
        try {
            const req: GenerateRequest = { prompt: content, model };
            const res = await generateText(req);
            setResponse(res.response);
        } catch (error) {
            console.error("Error generating text:", error);
            setResponse("Error generating response.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!title) {
            alert("Please enter a title.");
            return;
        }
        setSaving(true);
        try {
            const newPrompt: PromptCreate = { title, content, model };
            await createPrompt(newPrompt);
            setTitle('');
            setContent('');
            onPromptSaved(); // Trigger refresh list
        } catch (error) {
            console.error("Error saving prompt:", error);
            alert("Failed to save prompt.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Prompt Editor</h2>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Title (for saving)</label>
                <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="My Awesome Prompt"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Model</label>
                <select
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                >
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="text-davinci-003">Davinci (Legacy)</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Prompt</label>
                <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-40"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter your prompt here..."
                />
            </div>

            <div className="flex items-center justify-between mb-4">
                <button
                    className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleGenerate}
                    disabled={loading}
                >
                    {loading ? 'Generating...' : 'Run Prompt'}
                </button>

                <button
                    className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? 'Saving...' : 'Save Prompt'}
                </button>
            </div>

            {response && (
                <div className="mt-6 p-4 bg-gray-100 rounded border border-gray-300">
                    <h3 className="font-bold mb-2">Response:</h3>
                    <p className="whitespace-pre-wrap text-gray-800">{response}</p>
                </div>
            )}
        </div>
    );
};

export default PromptEditor;
