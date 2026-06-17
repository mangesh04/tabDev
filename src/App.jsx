import { useState } from 'react';
import { useRef } from "react";
import './App.css';
import LandingPopup from './components/landing';
import WidgetManager from './components/widget_manager';
import BuildWidget from './components/build_widget';
import UseApi from './components/use_api';
import MainContainer from './components/mainContainer';
import Host from './components/host';

function App() {

  const [popup, changePopup] = useState("LandingPopup");

  const isGuest = useRef(false)
  const apiConfig = useRef({})
  const apiKey = useRef("");

  const [appHost, setAppHost] = useState('')

  return (

    <>

      <MainContainer>

        {popup === "LandingPopup" && <LandingPopup changePopup={changePopup} apiKey={apiKey} />}

        {popup === "HostPopup" && <Host changePopup={changePopup} apiKey={apiKey} appHost={appHost} setAppHost={setAppHost} />}

        {popup === "WidgetManager" && appHost && <WidgetManager changePopup={changePopup} apiKey={apiKey} appHost={appHost} />}

        {popup === "BuildWidget" && <BuildWidget changePopup={changePopup} apiKey={apiKey} />}

        {popup === "UseApi" && <UseApi changePopup={changePopup} apiKey={apiKey} />}

      </MainContainer>
    </>
  )
}

export default App