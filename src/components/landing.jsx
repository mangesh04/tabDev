import { useState } from 'react'
import Button from './button';

function LandingPopup({ changePopup }) {
    return (
        <>
            <Button buttonText="start as guest" onClick={() => changePopup("WidgetManager")} />

            <Button buttonText="use own api key" onClick={() => changePopup("UseApi")} />
        </>
    )
}

export default LandingPopup