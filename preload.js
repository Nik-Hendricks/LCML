const fs = require('fs')
const remote = require('@electron/remote');
const { dialog } = remote;
const ViewManager = require('./ViewManager.js')
const ModManager = require('./ModManager.js')

window.lethal_company_dir = 'C:/Program Files (x86)/Steam/steamapps/common/Lethal Company'

function init(){
    if (!fs.existsSync(window.lethal_company_dir)) {
        var dir = dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']});
        console.log(dir)
    }else{
        ensure_instalation()
    }
}

function ensure_instalation(){
    if(!fs.existsSync(window.lethal_company_dir + '/LCML')){
        //create new directory
        console.log('creating new directory')
        fs.mkdirSync(window.lethal_company_dir + '/LCML')
    }
    if(!fs.existsSync(window.lethal_company_dir + '/LCML/modpacks.json')){
        //create new modpacks.json
        console.log('creating new modpacks.json')
        fs.writeFileSync(window.lethal_company_dir + '/LCML/modpacks.json', '{}')
    }

    if(!fs.existsSync(window.lethal_company_dir + '/LCMLVIRGINBepInEx')){
        //create new modpacks.json
        console.log('creating new modpacks.json')
        //copy bepinex folder from root dir of application to modpack folder
        fs.mkdirSync(window.lethal_company_dir + '/LCMLVIRGINBepInEx')
        //fs.copyFileSync('./BepInEx', window.lethal_company_dir + '/LCMLVIRGINBepInEx')
        fs.cp('./BepInEx', window.lethal_company_dir + '/LCMLVIRGINBepInEx', {recursive: true}, (err) => {
            console.log('asdf')
        })
    }
}

window.addEventListener('DOMContentLoaded', () => {
    init()
    window.ViewManager = new ViewManager()
    window.ModManager = new ModManager()
    window.ViewManager.main_view()
})