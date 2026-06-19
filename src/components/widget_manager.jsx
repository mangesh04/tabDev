import WidgetList from "./widget_list";
import Button from "./button";
import { BackBtn } from "./backBtn";

function WidgetManager({ changePopup, appHost }) {
    return (
        <>

            <div className="text-2xl font-medium text-zinc-800 dark:text-zinc-300">Widgets</div>

            <Button buttonText="build widget" onClick={() => changePopup("BuildWidget")} />
            <WidgetList />

            <WidgetList appHost={appHost} changePopup={changePopup} />

        </>
    );
}

export default WidgetManager;