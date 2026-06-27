import React, { useState, useEffect } from 'react';
import { useRef } from "react";
import './App.css';
import LandingPopup from './components/landing';
import WidgetManager from './components/widget_manager';
import BuildWidget from './components/build_widget';
import MainContainer from './components/mainContainer';
import Host from './components/host';

function App() {

  const [popup, changePopup] = useState("WidgetManager");

  const isGuest = useRef(true)
  const apiConfig = useRef({})
  const apiKey = useRef("");

  const [appHost, setAppHost] = useState('')
  const [isEdit, setIsEdit] = useState(false)

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

  //  needs to change edit logic apply on edit should work differently
  //comming back from

  return (

    <>

      <MainContainer>

        {/* {popup === "LandingPopup" && <LandingPopup changePopup={changePopup} apiKey={apiKey} />} */}

        {/* {popup === "HostPopup" && <Host changePopup={changePopup} apiKey={apiKey} appHost={appHost} setAppHost={setAppHost} />} */}


        {/* we need currentUrl aswell as base inrrepective what it's set too  */}
        {popup === "WidgetManager" && <WidgetManager changePopup={changePopup} appHost={currentUrl} setIsEdit={setIsEdit} />}

        {popup === "BuildWidget" && <BuildWidget changePopup={changePopup} apiKey={apiKey} appHost={appHost} isEdit={isEdit} setIsEdit={setIsEdit} />}


      </MainContainer>
    </>
  )
}

export default App