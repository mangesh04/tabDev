import React, { useState, useEffect } from 'react'
import { useRef } from "react";
import './App.css';
import LandingPopup from './components/landing';
import WidgetManager from './components/widget_manager';
import BuildWidget from './components/build_widget';
import UseApi from './components/use_api';
import MainContainer from './components/mainContainer';
import Host from './components/host';
import Settings from './components/settings';

function App() {

  const [popup, changePopup] = useState("WidgetManager");

  const isGuest = useRef(true)
  const apiConfig = useRef({})
  const apiKey = useRef("");

  const [appHost, setAppHost] = useState('')


  const [currentUrl, setCurrentUrl] = useState('')
  const [baseUrl, setBaseUrl] = useState('')

  // todo
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url
      const { protocol, hostname } = new URL(url)

      setCurrentUrl(url)
      setBaseUrl(`${protocol}//${hostname}/*`)

      setAppHost(url)
    })
  }, [])

  console.log(appHost)

  return (

    <>

      <MainContainer>

        {/* {popup === "LandingPopup" && <LandingPopup changePopup={changePopup} apiKey={apiKey} />} */}

        {/* {popup === "HostPopup" && <Host changePopup={changePopup} apiKey={apiKey} appHost={appHost} setAppHost={setAppHost} />} */}

        {popup === "WidgetManager"  && <WidgetManager changePopup={changePopup} appHost={appHost} />}

        {popup === "BuildWidget" && <BuildWidget changePopup={changePopup} apiKey={apiKey} appHost={appHost} setAppHost={setAppHost} />}

        {popup === "UseApi" && <UseApi changePopup={changePopup} apiKey={apiKey} />}

        {popup === "Settings"  && <Settings changePopup={changePopup} appHost={appHost} setAppHost={setAppHost} isGuest={isGuest}  />}

      </MainContainer>
    </>
  )
}

export default App