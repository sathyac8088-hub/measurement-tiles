export interface Prompt {
    id: number;
    title: string;
    content: string;
    model: string;
}

export interface PromptCreate {
    title: string;
    content: string;
    model: string;
}

export interface GenerateRequest {
    prompt: string;
    model: string;
}

export interface GenerateResponse {
    response: string;
}
