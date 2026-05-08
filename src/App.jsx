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

  const apiKey = useRef("");

  return (

    <>

      <MainContainer>

        {popup === "LandingPopup" && <LandingPopup changePopup={changePopup} apiKey={apiKey} />}

        {popup === "HostPopup" && <Host changePopup={changePopup} apiKey={apiKey} />}

        {popup === "WidgetManager" && <WidgetManager changePopup={changePopup} apiKey={apiKey} />}

        {popup === "BuildWidget" && <BuildWidget changePopup={changePopup} apiKey={apiKey} />}

        {popup === "UseApi" && <UseApi changePopup={changePopup} apiKey={apiKey} />}

      </MainContainer>
    </>
  )
}

export default App