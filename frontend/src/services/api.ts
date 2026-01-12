import axios from 'axios';
import type { Prompt, PromptCreate, GenerateRequest, GenerateResponse } from '../types';

// In a real app, this should be in an env variable
const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
});

export const getPrompts = async (): Promise<Prompt[]> => {
    const response = await api.get('/prompts');
    return response.data;
};

export const createPrompt = async (prompt: PromptCreate): Promise<Prompt> => {
    const response = await api.post('/prompts', prompt);
    return response.data;
};

export const deletePrompt = async (id: number): Promise<void> => {
    await api.delete(`/prompts/${id}`);
};

export const generateText = async (data: GenerateRequest): Promise<GenerateResponse> => {
    const response = await api.post('/generate', data);
    return response.data;
};

export default api;
