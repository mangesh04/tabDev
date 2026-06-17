function isUserScriptsAvailable() {
    if (!chrome.userScripts) {
        document.getElementById('warning').style.display = 'flex';
        return false;
    }
    return true;
}



async function showApi() {
    hideAllPages();
    popups["start"].style.display = 'flex';
    const response = await chrome.storage.local.get({ "api_key": false });
    if (response.api_key)
        api_key_inp_ele.value = response.api_key;
}

function get_current_url() {

    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            resolve(tabs[0].url);
        });
    })
}

async function showHost() {
    hideAllPages();
    popups["host"].style.display = 'flex';
    let host = await get_current_url();

    baseHost = getUrlBase(host) + "/*";

    const optionHostEle = document.createElement('option');

    const optionBaseEle = document.createElement('option');

    optionHostEle.setAttribute('value', host);

    optionHostEle.innerText = "current tab url";

    document.getElementById('hosts').appendChild(optionHostEle);

    optionBaseEle.setAttribute('value', baseHost);

    optionBaseEle.innerText = "base url";

    document.getElementById('hosts').appendChild(optionBaseEle);

}

function getUrlBase(host) {
    const { protocol, hostname } = new URL(host);
    return `${protocol}//${hostname}`;
}
async function showWidgets() {

    const base = getUrlBase(host) + '/*';

    const result2 = await chrome.storage.local.get({ [base]: {} });
    const result = await chrome.storage.local.get({ [host]: {} });

    let stored_scripts = []

    result[host] = { ...result[base], ...result[host] };

    for (let key in result[host]) {
        stored_scripts.push(key);
    }

    const running_scripts_array = await chrome.userScripts.getScripts({
        ids: stored_scripts
    });

    let registered_scripts = []

    for (let ele of running_scripts_array) {
        registered_scripts.push(ele.id);
    }

    widget_list_ele.innerHTML = "";

    for (let val of stored_scripts) {

        const li = document.createElement("li");

        const label = document.createElement("label");
        label.textContent = val;
        label.setAttribute("for", val);
        label.className = "widget_name";

        const span = document.createElement("span");
        span.className = "widget_ops";

        const switchLabel = document.createElement("label");
        switchLabel.className = "switch round";
        switchLabel.setAttribute("for", val);

        const input = document.createElement("input");
        input.type = "checkbox";
        input.className = "round";
        input.id = val;
        if (registered_scripts.includes(val)) input.checked = true;

        const slider = document.createElement("span");
        slider.className = "slider round";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "delete";
        deleteBtn.className = "delete_widget round";

        const editBtn = document.createElement("button");
        editBtn.textContent = "edit";
        editBtn.className = "edit_widget round";

        switchLabel.appendChild(input);
        switchLabel.appendChild(slider);
        span.appendChild(switchLabel);
        span.appendChild(deleteBtn);
        span.appendChild(editBtn);

        li.appendChild(label);
        li.appendChild(span);

        widget_list_ele.appendChild(li);

        const all_widgets = document.getElementsByClassName("delete_widget");
        for (let ele of all_widgets) {
            ele.addEventListener("click", async () => {
                ele.parentNode.parentNode.remove();
                const result = await chrome.storage.local.get({ [host]: {} });
                delete result[host][ele.parentNode.parentNode.firstElementChild.innerText];
                await chrome.storage.local.set({ [host]: result[host] });
            })
        }

        const all_edit_els = document.getElementsByClassName("edit_widget");

        for (let ele of all_edit_els) {

            ele.addEventListener("click", async () => {

                const widget_name_inp_ele = document.getElementById('widget_name_inp')

                const result = await chrome.storage.local.get({ [host]: {} });

                widget_name_inp_ele.value = ele.parentNode.parentNode.firstElementChild.innerText;
                custom_script_inp_ele.value = result[host][ele.parentNode.parentNode.firstElementChild.innerText];

                onCreate();

            });
        }
    }

    hideAllPages();
    popups["widgets"].style.display = 'flex';
}

function showCustomeScript() {
    hideAllPages();
    popups["build"].style.display = 'flex';
}

const gemini_api_endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

async function fetch_data(apiKey, prompt) {

    const apiUrl = `${gemini_api_endpoint}${apiKey}`;

    return await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                        + "Instructiong to create it:" +
                        "Output js only" +
                        "create it using js only with dom no html" +
                        "DO NOT include comments or explanations. " +
                        "just two comments //start and //end " +
                        "Follow these extra rules if its widget: " +
                        "1. create it in single draggable block" +
                        "2. Set margin = 0. " +
                        "3. Set user-selection = none."
                }]
            }]
        })
    })
}

async function generate_code() {

    try {
        custom_script_inp_ele.value = "generating script .....";
        const prompt = prompt_inp_ele.value;
        let response = "";

        if (isOwnApi)
            response = await fetch_data(api_key, prompt);

        if (isGuest) {
            response = await generate_script_server(prompt);
        }


        const data = await response.json();

        if (!response.ok) {
            custom_script_inp_ele.value = `Error ${response.status}: ${data.error?.message || 'Unknown error'}`;
        } else {
            let output = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received.';
            const match = output.match(/\/\/start([\s\S]*?)\/\/end/);
            custom_script_inp_ele.value = match[1].trim();
        }

    } catch (error) {
        custom_script_inp_ele.value = 'Error: ' + error.message;
    }
}



function onApi() {
    api_key = api_key_inp_ele.value;
    chrome.storage.local.set({
        "api_key": api_key
    });
    showHost();
}

function onOwnApi() {
    isOwnApi = true;

    popups["start"].style.display = 'none';
    popups["own_api"].style.display = 'flex';
}

function onGuest() {
    isGuest = true;

    popups["start"].style.display = 'none';
    showHost();
}

function onHost() {
    host = host_inp_ele.value;
    showWidgets();
}

function onCreate() {
    popups["widgets"].style.display = 'none';
    popups["build"].style.display = 'flex';
}

async function onGenerate() {
    await generate_code();
}


async function onApply() {

    script = custom_script_inp_ele.value;
    widget_name = document.getElementById('widget_name_inp').value;

    popups["build"].style.display = 'none';
    popups["widgets"].style.display = 'flex';


    const existingScripts = await chrome.userScripts.getScripts({
        ids: [widget_name]
    });

    if (existingScripts.length > 0) {
        await chrome.userScripts.update([
            {
                id: widget_name,
                matches: [host],
                js: [{ code: script }]
            }
        ]);
    } else {
        await chrome.userScripts.register([
            {
                id: widget_name,
                matches: [host],
                js: [{ code: script }]
            }
        ]);
    }

    const result = await chrome.storage.local.get({ [host]: {} });
    result[host][widget_name] = script;

    chrome.storage.local.set({
        [host]: result[host]
    });

    showWidgets();
}

async function onStart() {

    const result = await chrome.storage.local.get({ [host]: {} });
    let stored_scripts = []

    for (let key in result[host]) {
        stored_scripts.push(key);
    }

    const running_scripts_array = await chrome.userScripts.getScripts({
        ids: stored_scripts
    });

    let registered_scripts = []
    for (let ele of running_scripts_array) {
        registered_scripts.push(ele.id);
    }

    for (let ele of widget_list_ele.children) {

        const script_name = ele.children[0].innerText;
        const isChecked = document.getElementById(script_name).checked;

        //tepo code
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });


        if (isChecked) {
            if (!(registered_scripts.includes(script_name))) {

                await chrome.userScripts.execute({
                    target: { tabId: tab.id },
                    js: [{ code: result[host][script_name] }]
                })

                await chrome.userScripts.register([{
                    id: script_name,
                    matches: [host],
                    js: [{ code: result[host][script_name] }]
                }]);
            }
        }
        else {
            if (registered_scripts.includes(script_name)) {
                await chrome.userScripts.unregister({ ids: [script_name] });
            }
        }
    }

    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //     chrome.tabs.reload(tabs[0].id);
    // });
}

async function prepare_ui() {
    popups["start"].style.display = 'flex';

    const currentUrl = await get_current_url();
    const result1 = await chrome.storage.local.get({ "api_key": false });
    const result2 = await chrome.storage.local.get({ [currentUrl]: false });

    if (result1.api_key && result2[currentUrl]) {
        api_key = result1.api_key;
        host = currentUrl;
        showWidgets();
    }
    else {
        showApi();
    }
}

prepare_ui();

const back_btn_eles = document.getElementsByClassName('back_btn');

for (let i = 0; i < 3; i++) {
    back_btn_eles[i].addEventListener('click', () => {
        if (i == 0)
            showApi();
        if (i == 1)
            showHost();
        if (i == 2)
            showWidgets();
    })
}



const generate_script_server = async (prompt) => {

    let response = await fetch('http://localhost:3000/generate_script',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'  // <--- this line
            },
            body: JSON.stringify({ prompt })
        }
    );

    if (!response.ok) throw new Error('Server error');

    return response;
}



// const get_count = (prompt) => {

//     fetch('http://localhost:3000/get-token-count',
//         {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'  // <--- this line
//             },
//             body: JSON.stringify({ prompt })
//         }
//     ).then((res) => {
//         if (!res.ok) throw new Error('Server error');
//         return res.json()
//     })
//         .then((data) => {
//             console.log(data)
//         })
// }


// const page_context_btn = document.getElementById('page_context_btn');


// page_context_btn.addEventListener('click', () => {

//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, { type: "get-html" }, function (response) {
//             if (chrome.runtime.lastError) {
//                 document.getElementById('output').textContent = "Error: " + chrome.runtime.lastError.message;
//             } else {
//                 pageCode = response.html;
//             }
//         });
//     });
//     get_count(pageCode);
// });
