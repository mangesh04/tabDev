import React, { useState, useEffect } from 'react'
import { BackBtn } from './backBtn'
import Button from './button';

const Host = ({ changePopup }) => {
    const [currentUrl, setCurrentUrl] = useState('')
    const [baseUrl, setBaseUrl] = useState('')

    useEffect(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const url = tabs[0].url
            const { protocol, hostname } = new URL(url)
            setCurrentUrl(url)
            setBaseUrl(`${protocol}//${hostname}`)
        })
    }, [])

    return (
        <>
            <BackBtn popup="LandingPopup" changePopup={() => changePopup("LandingPopup")} />

            <h2>Host</h2>

            <input
                type="text"
                list="hosts"
                name="host"
                placeholder="example.com"
                id="host_inp"
                className='border-2 rounded-md px-2 py-1'
            />

            <datalist id="hosts">
                <option value={currentUrl} />
                <option value={baseUrl} />
                <option value="localhost" />
                <option value="127.0.0.1" />
            </datalist>

            <Button buttonText="save" onClick={() => changePopup("HostPopup")} padding={'px-2 py-1'} />
        </>
    )
}

export default Host