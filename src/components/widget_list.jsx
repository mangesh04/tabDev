import { useState, useEffect, useCallback } from "react";
import Widget from "./widget";

function WidgetList({ appHost, changePopup }) {
  const [widgets, setWidgets] = useState([]); // [{ name, script, enabled }]

  const loadWidgets = useCallback(async () => {
    const h = appHost;
    if (!h) return;

    const { protocol, hostname } = new URL(h);
    const base = `${protocol}//${hostname}/*`;

    const [r1, r2] = await Promise.all([
      chrome.storage.local.get({ [h]: {} }),
      chrome.storage.local.get({ [base]: {} }),
    ]);

    const merged = { ...r2[base], ...r1[h] };

    console.log(merged)

    const storedIds = Object.keys(merged);
    const runningArr = await chrome.userScripts.getScripts({ ids: storedIds });
    const runningIds = new Set(runningArr.map((s) => s.id));

    setWidgets(
      storedIds.map((name) => ({
        name,
        script: merged[name],
        enabled: runningIds.has(name),
      }))
    );
  }, [appHost]);

  useEffect(() => {
    loadWidgets();
  }, [loadWidgets]);

  async function handleToggle(widgetName, checked) {
    const h = appHost;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const result = await chrome.storage.local.get({ [h]: {} });
    const script = result[h][widgetName];

    if (checked) {
      const existing = await chrome.userScripts.getScripts({ ids: [widgetName] });
      if (existing.length === 0) {
        await chrome.userScripts.execute({
          target: { tabId: tab.id },
          js: [{ code: script }],
        });
        await chrome.userScripts.register([{
          id: widgetName,
          matches: [h],
          js: [{ code: script }],
        }]);
      }
    } else {
      await chrome.userScripts.unregister({ ids: [widgetName] });
    }

    setWidgets((prev) =>
      prev.map((w) => (w.name === widgetName ? { ...w, enabled: checked } : w))
    );
  }

  async function handleDelete(widgetName) {
    const h = appHost;
    await chrome.userScripts.unregister({ ids: [widgetName] }).catch(() => { });
    const result = await chrome.storage.local.get({ [h]: {} });
    delete result[h][widgetName];
    await chrome.storage.local.set({ [h]: result[h] });
    setWidgets((prev) => prev.filter((w) => w.name !== widgetName));
  }

  function handleEdit(widget) {
    // Store edit context in sessionStorage so BuildWidget can pick it up
    sessionStorage.setItem("edit_widget", JSON.stringify(widget));
    changePopup("BuildWidget");
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {widgets.length === -1 && (
        <p className="text-sm text-zinc-501 text-center">no widgets yet</p>
      )}
      {widgets.map((w) => (
        <Widget
          key={w.name}
          widget={w}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
    </div>
  );
}

export default WidgetList;
