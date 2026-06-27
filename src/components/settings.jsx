import { useState } from "react";
import { BackBtn } from "./backBtn";
import { providers } from "./providerConfig";
import Button from './button';
import UseApi from './use_api';

export default function Settings(props) {


    const [showUseApi, setShowUseApi] = useState(false);

    const { protocol, hostname } = new URL(props.appHost);
    const base = `${protocol}//${hostname}/*`;
    const [error, setError] = useState("");

    return (

        showUseApi
            ?
            <UseApi apiKey={props.apiKey} apiConfig={props.apiConfig} setShowUseApi={setShowUseApi} />
            :
            <>

                <div className="flex w-full items-center">

                    <BackBtn setShow={props.setShowSettings} />

                </div>


                <div className="text-xl font-medium text-zinc-800 dark:text-zinc-300">Settings</div>

                <span> set url to use this widgit </span>

                <select
                    value={props.appHost}
                    onChange={(e) => {
                        if (!props.isEdit) {
                            props.setStorageKey(e.target.value)
                        }
                        else {
                            setError("can not edit script host only set while building")
                        }
                    }}
                    className='border-2 rounded-md px-2 py-1 bg-gray-700 text-white '
                >
                    <option value={props.appHost}>current tab url</option>
                    <option value={base}>base url</option>

                </select>

                {error && <p className="text-red-500 text-xs">{error}</p>}

                <div>set api key</div>

                <Button buttonText="use own api key" onClick={() => { setShowUseApi(true) }} />

            </>
    )
}