import { useState } from 'react'
import Button from './button';

function LandingPopup({ changePopup,isGuest }) {
    return (
        <>

            <Button buttonText="start as guest" onClick={() => { isGuest.current = true; changePopup("HostPopup") }} />

            <Button  buttonText="use own api key" onClick={() => { isGuest.current = false; changePopup("UseApi") }} />

        </>
    )
}

export default LandingPopup