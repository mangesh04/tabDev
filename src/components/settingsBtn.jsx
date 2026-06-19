import React from 'react'
import { SettingsIcon } from "./icons";

export default function SettingsBtn({ changePopup }) {
    return (
        <div>
            <button className='cursor-pointer text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center' onClick={() => {
                changePopup("Settings")
            }}>
                <SettingsIcon />
            </button>
        </div>
    )
}
