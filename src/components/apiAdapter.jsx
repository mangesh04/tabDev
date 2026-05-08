import { providers } from "./providerConfig";

export async function generateExtension({ provider, key, model, prompt }) {
    const config = providers[provider];

    switch (provider) {
        case "gemini":
            return await callGemini(config, key, model, prompt);
        case "openai":
        case "groq":
        case "mistral":
            return await callOpenAIFormat(config, key, model, prompt);
        case "anthropic":
            return await callAnthropic(config, key, model, prompt);
        default:
            throw new Error("Unsupported provider");
    }
}

async function callGemini(config, key, model, prompt) {
    const res = await fetch(
        `${config.baseUrl}/models/${model}:generateContent?key=${key}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Gemini error");
    return data.candidates[0].content.parts[0].text;
}

async function callOpenAIFormat(config, key, model, prompt) {
    const res = await fetch(`${config.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
            model,
            messages: [{ role: "user", content: prompt }],
        }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "API error");
    return data.choices[0].message.content;
}

async function callAnthropic(config, key, model, prompt) {
    const res = await fetch(`${config.baseUrl}/messages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": key,
            "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
            model,
            max_tokens: 4096,
            messages: [{ role: "user", content: prompt }],
        }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Anthropic error");
    return data.content[0].text;
}