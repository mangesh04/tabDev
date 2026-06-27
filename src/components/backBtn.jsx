import { BackIcon } from "./icons";
export const BackBtn = ({ popup, changePopup, setShow }) => {
    return (

        <button className="border-2 border-zinc-800 dark:border-zinc-300 text-zinc-800 dark:text-zinc-300 rounded-full p-1 cursor-pointer top-3 left-3 transition-shadow duration-200 hover:shadow-[2px_2px_0px_rgba(39,39,42,1)] dark:hover:shadow-[2px_2px_0px_rgba(212,212,216,1)]"
            onClick={() => {
                if (changePopup) {
                    changePopup(popup)
                }
                if (setShow) {
                    setShow(false)
                }
            }}>
            <BackIcon />
        </button>
    )
}