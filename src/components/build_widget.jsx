import { useRef, useState, useEffect } from "react";
import { BackBtn } from "./backBtn";
import Button from "./button";
import { generateExtension } from "./apiAdapter";

const SYSTEM_INSTRUCTIONS = `Instructions to create it:
Output js only.
Create it using js only with DOM, no HTML.
DO NOT include comments or explanations.
Just two comments //start and //end wrapping the code.
Follow these extra rules if it's a widget:
1. Create it in a single draggable block.
2. Set margin = 0.
3. Set user-selection = none.`;

export default function BuildWidget({ changePopup, apiKey, apiConfig, host, isGuest }) {
  const promptRef = useRef();
  const [widgetName, setWidgetName] = useState("");
  const [script, setScript] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill if editing an existing widget
  useEffect(() => {
    const raw = sessionStorage.getItem("edit_widget");
    if (raw) {
      const widget = JSON.parse(raw);
      setWidgetName(widget.name);
      setScript(widget.script);
      sessionStorage.removeItem("edit_widget");
    }
  }, []);

  async function handleGenerate() {
    const prompt = promptRef.current?.value?.trim();
    if (!prompt) { setError("enter a prompt first"); return; }
    setError("");
    setGenerating(true);
    setScript("generating...");

    try {
      let raw;

      if (isGuest.current) {
        // Guest mode: hit local server
        const res = await fetch("http://localhost:3000/generate_script", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });
        if (!res.ok) throw new Error("Server error");
        const data = await res.json();
        raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      } else {
        // Own API key via apiAdapter
        raw = await generateExtension({
          provider: apiConfig.current.provider,
          model: apiConfig.current.model,
          key: apiKey.current,
          prompt: prompt + "\n" + SYSTEM_INSTRUCTIONS,
        });
      }

      const match = raw.match(/\/\/start([\s\S]*?)\/\/end/);
      setScript(match ? match[1].trim() : raw.trim());
    } catch (err) {
      setError(err.message || "something went wrong");
      setScript("");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSaveApply() {
    if (!widgetName.trim()) { setError("name your widget first"); return; }
    if (!script.trim()) { setError("no script to save"); return; }
    setError("");

    const h = host.current;

    // Register / update userScript
    const existing = await chrome.userScripts.getScripts({ ids: [widgetName] });
    if (existing.length > 0) {
      await chrome.userScripts.update([{ id: widgetName, matches: [h], js: [{ code: script }] }]);
    } else {
      await chrome.userScripts.register([{ id: widgetName, matches: [h], js: [{ code: script }] }]);
    }

    // Persist to storage
    const result = await chrome.storage.local.get({ [h]: {} });
    result[h][widgetName] = script;
    await chrome.storage.local.set({ [h]: result[h] });

    changePopup("WidgetManager");
  }

  return (
    <>
      <BackBtn popup="WidgetManager" changePopup={changePopup} />

      <div className="text-2xl font-medium text-zinc-800 dark:text-zinc-300">Build Widget</div>

      <textarea
        ref={promptRef}
        className="border-2 border-zinc-800 dark:border-zinc-300 bg-transparent text-zinc-800 dark:text-zinc-300 rounded-sm p-2 w-full resize-y text-sm"
        placeholder="explain what to build..."
        rows={3}
      />

      <Button buttonText={generating ? "generating..." : "generate"} onClick={handleGenerate} />

      <textarea
        value={script}
        onChange={(e) => setScript(e.target.value)}
        className="border-2 border-zinc-800 dark:border-zinc-300 bg-zinc-900 text-green-400 rounded-sm p-2 w-full resize-y font-mono text-xs"
        placeholder="generated code appears here — you can edit it"
        rows={8}
      />

      <input
        type="text"
        value={widgetName}
        onChange={(e) => setWidgetName(e.target.value)}
        placeholder="name this widget"
        className="border-2 border-zinc-800 dark:border-zinc-300 bg-transparent text-zinc-800 dark:text-zinc-300 rounded-md px-2 py-1 w-full text-sm"
      />

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <Button buttonText="save & apply" onClick={handleSaveApply} variant="primary" />
    </>
  );
}
