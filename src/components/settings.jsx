import { useState } from "react";
import { BackBtn } from "./backBtn";
import { providers } from "./providerConfig";
import Button from './button';

export default function Settings(props) {
    return (
        <>

      <div className="flex w-full items-center">

            <BackBtn popup="BuildWidget" changePopup={props.changePopup} />

      </div>


            <div className="text-xl font-medium text-zinc-800 dark:text-zinc-300">Settings</div>

            <span> set url to use this widgit </span>
            <select
                value={props.appHost}
                onChange={(e) => setAppHost(e.target.value)}
                className='border-2 rounded-md px-2 py-1 bg-gray-700 text-white '
            >
                <option value={props.currentUrl}>current tab url</option>
                <option value={props.baseUrl}>base url</option>

            </select>


            <div>set api key</div>

            <Button buttonText="use own api key" onClick={() => { props.isGuest.current = false; props.changePopup("UseApi") }} />

        </>
    )
}