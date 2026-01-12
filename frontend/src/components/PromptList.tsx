import React, { useEffect, useState } from 'react';
import type { Prompt } from '../types';
import { getPrompts, deletePrompt } from '../services/api';

interface PromptListProps {
    refreshTrigger: number;
    onLoadPrompt: (prompt: Prompt) => void;
}

const PromptList: React.FC<PromptListProps> = ({ refreshTrigger, onLoadPrompt }) => {
    const [prompts, setPrompts] = useState<Prompt[]>([]);

    const fetchPrompts = async () => {
        try {
            const data = await getPrompts();
            setPrompts(data);
        } catch (error) {
            console.error("Error fetching prompts:", error);
        }
    };

    useEffect(() => {
        fetchPrompts();
    }, [refreshTrigger]);

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this prompt?")) {
            try {
                await deletePrompt(id);
                fetchPrompts();
            } catch (error) {
                console.error("Error deleting prompt:", error);
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Saved Prompts</h2>
            {prompts.length === 0 ? (
                <p className="text-gray-500">No prompts saved yet.</p>
            ) : (
                <ul>
                    {prompts.map((prompt) => (
                        <li key={prompt.id} className="border-b border-gray-200 py-3 last:border-0 flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-lg">{prompt.title}</h3>
                                <p className="text-sm text-gray-500 truncate w-64">{prompt.content}</p>
                                <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">{prompt.model}</span>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    className="text-blue-500 hover:text-blue-700 text-sm font-semibold"
                                    onClick={() => onLoadPrompt(prompt)}
                                >
                                    Load
                                </button>
                                <button
                                    className="text-red-500 hover:text-red-700 text-sm font-semibold"
                                    onClick={() => handleDelete(prompt.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PromptList;
