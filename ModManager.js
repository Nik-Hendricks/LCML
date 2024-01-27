const fs = require('fs');
https = require('https');
var unzip = require('unzipper')
const { exec } = require('child_process');

class ModManager{
    constructor(){
        
    }

    createModPackFolder(name){
        if(!fs.existsSync(window.lethal_company_dir + '/LCML/' + name)){
            fs.mkdirSync(window.lethal_company_dir + '/LCML/' + name)
        }
    }

    getModpacks(){
        //read directory ecludeing modpacks.json
        var files = fs.readdirSync(window.lethal_company_dir + '/LCML')
        var modpacks = []
        files.forEach((file) => {
            if(file != 'modpacks.json'){
                modpacks.push(file)
            }
        })

        return modpacks
    }

    ensureBepinExInstalled(modpack){
        if(!fs.existsSync(window.lethal_company_dir + '/LCML/' + modpack + '/BepInEx')){
            fs.mkdirSync(window.lethal_company_dir + '/LCML/' + modpack + '/BepInEx')
            fs.cp(window.lethal_company_dir + '/LCMLVIRGINBepInEx', window.lethal_company_dir + '/LCML/' + modpack + '/BepInEx', {recursive: true}, (err) => {
            })
        }
    }

    getModpackMods(modpack){
        var mods = []
        var files = fs.readdirSync(window.lethal_company_dir + '/LCML/' + modpack + '/BepInEx/plugins')
        files.forEach((file) => {
            mods.push(file)
        })
        return mods
    }

    getModInfo(modpack, mod){
        return new Promise((resolve, reject) => {
            if(fs.existsSync(window.lethal_company_dir + '/LCML/' + modpack + '/BepInEx/plugins/' + mod + '/manifest.json')){
                var mod_info = JSON.parse(fs.readFileSync(window.lethal_company_dir + '/LCML/' + modpack + '/BepInEx/plugins/' + mod + '/manifest.json').toString())
                resolve(mod_info)
            }else{
                resolve({
                    name: mod,
                    version: 'unknown',
                    description: 'unknown'
                })
            }
        })
    }

    buildDoorstopConfig(modname){
        return `[UnityDoorstop]
                enabled=true
                targetAssembly=LCML/${modname}/BepInEx/core/BepInEx.Preloader.dll
                redirectOutputLog=false
                ignoreDisableSwitch=false
                dllSearchPathOverride=`
    }

    setCurrentDoorstopConfig(doorstop_config){   
        fs.writeFileSync(window.lethal_company_dir + '/doorstop_config.ini', doorstop_config)
    }

    openModPackFolder(modpack){
        var fullPath = window.lethal_company_dir + '/LCML/' + modpack + '/BepInEx/plugins'

        exec(`start "" "${fullPath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                return;
            }
            console.log(`Stdout: ${stdout}`);
        });
    }

    getModPackReadme(modpack, mod){
        return new Promise((resolve, reject) => {
            if(fs.existsSync(window.lethal_company_dir + '/LCML/' + modpack + '/BepInEx/plugins/' + mod + '/README.md')){
                resolve(fs.readFileSync(window.lethal_company_dir + '/LCML/' + modpack + '/BepInEx/plugins/' + mod + '/README.md').toString())
            }else{
                resolve('No README.md found')
            }
        })
    }

    downloadMod(url, modpack){
        //download zip file from url
        //unzip file to modpack folder
        //delete zip file

        var zip_file_name = url.split('/')
        zip_file_name = zip_file_name[zip_file_name.length - 1]
        var zip_file_path = window.lethal_company_dir + '/LCML/' + modpack + '/' + zip_file_name
        var unzip_path = window.lethal_company_dir + '/LCML/' + modpack + '/BepInEx/plugins/' + zip_file_name.split('.')[0]
    
        return new Promise(resolve => {
            let file = fs.createWriteStream(zip_file_path)
            https.get(url, function(response) {
                var total_size = parseInt(response.headers['content-length'], 10) / 1048576 //1048576 - bytes in  1Megabyte
                console.log(total_size)
                response.pipe(file)
                file.on("finish", () => {
                    file.close()
                    resolve()
                })
            })
        }).then(() => {
            //now we unzip the file
            return new Promise(resolve => {
                fs.createReadStream(zip_file_path).pipe(unzip.Extract({ path: unzip_path})).on('close', () => {
                    resolve()
                })
            }).then(() => {
                //now we delete the zip file
                fs.unlinkSync(zip_file_path)
                window.ViewManager.view_modpack_view(modpack)
            })
        })
    }
}

module.exports = ModManager;