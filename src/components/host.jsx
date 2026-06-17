import React, { useState, useEffect } from 'react'
import { BackBtn } from './backBtn'
import Button from './button';

const Host = ({ changePopup, setSelectedHost, appHost, setAppHost }) => {
    const [currentUrl, setCurrentUrl] = useState('')
    const [baseUrl, setBaseUrl] = useState('')

    useEffect(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const url = tabs[0].url
            const { protocol, hostname } = new URL(url)
            setCurrentUrl(url)
            setBaseUrl(`${protocol}//${hostname}/*`)
        })
    }, [])

    return (
        <>
            <BackBtn popup="LandingPopup" changePopup={() => changePopup("LandingPopup")} />

            <div className="text-2xl font-medium text-zinc-800 dark:text-zinc-300">Host</div>

            <select
                value={appHost}
                onChange={(e) => setAppHost(e.target.value)}
                className='border-2 rounded-md px-2 py-1 bg-gray-700 text-white '
            >
                <option value={currentUrl}>current tab url</option>
                <option value={baseUrl}>base url</option>
            </select>

            <Button buttonText="save" onClick={() => {
                if (!appHost) setAppHost(currentUrl) // if user never changed select
                changePopup("WidgetManager")
            }} />

        </>
    )
}

export default Host