export default function Button({ buttonText, onClick, variant = "outline" }) {
    const base = "border-2 p-2.5 rounded-md select-none cursor-pointer transition-shadow duration-200"
    const variants = {
        outline: "border-zinc-800 dark:border-zinc-300 text-zinc-800 dark:text-zinc-300 hover:shadow-[2px_2px_0px_rgba(39,39,42,1)] dark:hover:shadow-[2px_2px_0px_rgba(212,212,216,1)]",
        primary: "bg-zinc-800 dark:bg-zinc-300 text-zinc-100 dark:text-zinc-900 border-zinc-800 dark:border-zinc-300 hover:shadow-[2px_2px_0px_rgba(39,39,42,1)] dark:hover:shadow-[2px_2px_0px_rgba(212,212,216,1)]",
    }
    return (
        <button className={`${base} ${variants[variant]} font-black`} onClick={onClick}>
            {buttonText}
        </button>
    )
}