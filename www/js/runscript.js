const { fstat } = require('fs')


function inject() {
    injectBtn.disabled = true
    injectBtn.innerText = "Loading"
    ipcRenderer.send("inject-button-click",localStorage.getItem("usesAlternativeElevation") == "true")
}
ipcRenderer.on('set-inject-btn-text', (event, arg) => {
    injectBtn.innerText = arg
    injectBtn.disabled = true
})

ipcRenderer.on('enable-inject-btn', (event, arg) => {
    injectBtn.innerText = "Inject"
    injectBtn.disabled = undefined
})
ipcRenderer.on("script-ran",() => {
    console.log("hahaha icon goes spinspinspin")
    runFab.classList.remove("spin")
    void runFab.offsetWidth; // forces it to be re-rendered? idk js is weird sometimes
    runFab.classList.add("spin")
})
runFab.onclick = function() {
    ipcRenderer.send("run-script",mainEditor.getValue())
}

saveFab.onclick = function() {
    var win = require('electron').remote.getCurrentWindow()
    var script = mainEditor.getValue()
    
    var loc = dialog.showSaveDialogSync(win, {
        title: "Save Current Script",
        defaultPath: path.join(homedir,"Documents","Jellyfish","Scripts"),
        buttonLabel: "Save",
        message:"Choose where you want to save the current script in the editor.",
        filters: [{extensions: ["lua","txt"]}]
    })
    if (!loc.endsWith(".lua") && !loc.endsWith(".txt")) {
        loc += ".lua"
    }
    fs.writeFileSync(loc,script)
}

function editScript(script) {
    mainEditor.setValue(script)
    location.hash = "#editor"
}

function runScript(a) {
    console.log(a)
    ipcRenderer.send("run-script",a)
}