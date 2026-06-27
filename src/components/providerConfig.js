export const providers = {
    gemini: {
        name: "Google Gemini",
        models: ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.0-flash", "gemini-3.5-flash"],
        baseUrl: "https://generativelanguage.googleapis.com/v1beta",
        authType: "param", // key goes as ?key=
    },
    openai: {
        name: "OpenAI",
        models: ["gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo"],
        baseUrl: "https://api.openai.com/v1",
        authType: "bearer",
    },
    anthropic: {
        name: "Anthropic Claude",
        models: ["claude-opus-4-6", "claude-sonnet-4-6", "claude-haiku-4-5-20251001"],
        baseUrl: "https://api.anthropic.com/v1",
        authType: "x-api-key",
    },
    groq: {
        name: "Groq",
        models: ["llama-3.3-70b-versatile", "mixtral-8x7b-32768"],
        baseUrl: "https://api.groq.com/openai/v1",
        authType: "bearer",
    },
    mistral: {
        name: "Mistral",
        models: ["mistral-large-latest", "mistral-small-latest"],
        baseUrl: "https://api.mistral.ai/v1",
        authType: "bearer",
    },
};