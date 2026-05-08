import { useState } from "react";
import { BackBtn } from "./backBtn";
import { providers } from "./providerConfig";

export default function UseApi({ changePopup, apiKey, apiConfig }) {
  const [selectedProvider, setSelectedProvider] = useState("gemini");
  const [selectedModel, setSelectedModel] = useState(providers["gemini"].models[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);

  function handleProviderChange(e) {
    const provider = e.target.value;
    setSelectedProvider(provider);
    setSelectedModel(providers[provider].models[0]);
    setError("");
  }

  function handleKeyInput(e) {
    apiKey.current = e.target.value;
    setError("");
  }

  async function checkAndChange() {
    if (!apiKey.current?.trim()) {
      setError("please enter an api key");
      return;
    }

    apiConfig.current = { provider: selectedProvider, model: selectedModel };

    setLoading(true);
    setError("");

    try {
      // Persist api_key for future sessions
      await chrome.storage.local.set({ api_key: apiKey.current });
      changePopup("HostPopup");
    } catch (err) {
      setError(err.message || "something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const currentModels = providers[selectedProvider].models;

  const selectClass =
    "border-2 border-zinc-800 dark:border-zinc-300 bg-transparent text-zinc-800 dark:text-zinc-300 rounded-md p-1 cursor-pointer w-full";

  return (
    <>
      <BackBtn popup="LandingPopup" changePopup={changePopup} />

      <p className="text-2xl font-medium text-zinc-800 dark:text-zinc-300">configure api</p>

      <select className={selectClass} value={selectedProvider} onChange={handleProviderChange}>
        {Object.entries(providers).map(([key, val]) => (
          <option key={key} value={key}>{val.name}</option>
        ))}
      </select>

      <select className={selectClass} value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
        {currentModels.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <div className="relative w-full">
        <input
          type={showKey ? "text" : "password"}
          placeholder="enter api key"
          className="border-2 border-zinc-800 dark:border-zinc-300 bg-transparent text-zinc-800 dark:text-zinc-300 rounded-md p-1 w-full pr-16"
          onChange={handleKeyInput}
        />
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs cursor-pointer opacity-60 text-zinc-800 dark:text-zinc-300"
          onClick={() => setShowKey(!showKey)}
        >
          {showKey ? "hide" : "show"}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        className="border-2 border-zinc-800 dark:border-zinc-300 text-zinc-800 dark:text-zinc-300 rounded-md px-4 py-2 cursor-pointer disabled:opacity-50 font-black transition-shadow duration-200 hover:shadow-[2px_2px_0px_rgba(39,39,42,1)] dark:hover:shadow-[2px_2px_0px_rgba(212,212,216,1)]"
        onClick={checkAndChange}
        disabled={loading}
      >
        {loading ? "saving..." : "submit"}
      </button>
    </>
  );
}
