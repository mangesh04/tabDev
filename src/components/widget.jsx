import { EditIcon, DeleteIcon } from "./icons";

export default function Widget({ widget, onToggle, onDelete, onEdit }) {
  const { name, enabled } = widget;

  return (
    <div className="flex justify-between items-center border-2 border-zinc-800 dark:border-zinc-300 rounded-sm min-w-70 px-3 py-2">
      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-300 truncate max-w-32">
        {name}
      </span>

      <div className="flex items-center gap-3">
        {/* Toggle switch */}
        <label className="relative inline-block w-10 h-5 cursor-pointer">

          <input
            type="checkbox"
            className="opacity-0 w-0 h-0"
            checked={enabled}
            onChange={(e) => onToggle(name, e.target.checked)}
          />

          <span
            className={`absolute inset-0 rounded-full transition-colors duration-200 ${
              enabled ? "bg-blue-500" : "bg-zinc-400 dark:bg-zinc-600"
            }`}
          />

          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
              enabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </label>

        <button className="cursor-pointer text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors" onClick={() => onEdit(widget)}>
          <EditIcon />
        </button>

        <button className="cursor-pointer text-zinc-700 dark:text-zinc-300 hover:text-red-500 transition-colors" onClick={() => onDelete(name)}>
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
}
