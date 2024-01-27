const {WindowBar, ModPackItem, AddModPackButton, MainContent, PlayModPackButton, TextInput, ColorPicker, NewModPackButton, FileList, MarkDownViewer, Prompt} = require('./Components.js')
const fs = require('fs')
const spawn = require('child_process').spawn

class ViewManager{
    constructor(){
        window.MainContent = new MainContent();
        window.WindowBar = new WindowBar()
        window.Prompt = new Prompt();
        document.body.append(window.WindowBar, window.MainContent);
        window.WindowBar.setTitle('LCML')
    }

    main_view(){
        window.MainContent.innerHTML = ''
        window.ModManager.getModpacks().forEach((modpack) => {
            window.MainContent.append(new ModPackItem(modpack))
        })
        window.MainContent.append(new AddModPackButton())
    }

    new_modpack_view(){
        window.MainContent.innerHTML = ''
        var title = document.createElement('p')
        title.Style({
            float:'left',
            margin:'20px',
            fontSize:'20px',
            color:'white'
        })

        var text_style = {
            float:'left',
            width:'calc(100% - 40px)',
            margin:'20px',
            marginTop:'10px',
            marginBottom:'10px',
            fontSize:'18px',
            fontWeight:'lighter',
            color:'white'
        }

        var name_input_text = document.createElement('p')
        var color_input_text = document.createElement('p')
        var new_modpack_button = new NewModPackButton();
        var name_input = new TextInput()

        color_input_text.Style(text_style)
        name_input_text.Style(text_style)

        title.innerHTML = 'New Mod Pack'
        name_input_text.innerHTML = 'Name: '
        color_input_text.innerHTML = 'Color: '

        new_modpack_button.onclick = () => {
            window.ModManager.createModPackFolder(name_input.value)
            window.ModManager.ensureBepinExInstalled(name_input.value)
            window.ViewManager.main_view()
        }

        window.MainContent.append(title, name_input_text, name_input, color_input_text, new ColorPicker())
        window.WindowBar.addBackButton()
        window.MainContent.append(new_modpack_button)
    }

    view_modpack_view(modpack){
        window.MainContent.innerHTML = ''
        var title = document.createElement('p')
        var file_list = new FileList(modpack)
        var play_modpack_button = new PlayModPackButton()

        title.Style({
            float:'left',
            margin:'20px',
            fontSize:'20px',
            color:'white'
        })

        play_modpack_button.onclick = () => {
            window.ModManager.setCurrentDoorstopConfig(window.ModManager.buildDoorstopConfig(modpack))
            var lc_process = spawn(window.lethal_company_dir + '/Lethal Company.exe', [], {cwd: window.lethal_company_dir})
        }

        title.innerHTML = modpack
        window.MainContent.append(title, file_list)
        window.WindowBar.addBackButton().onclick = () => {
            window.ViewManager.main_view()
        }
        window.MainContent.append(play_modpack_button)
    }

    view_modpack_info_view(modpack, mod){
        window.ModManager.getModInfo(modpack, mod).then((mod_info) => {
            window.ModManager.getModPackReadme(modpack, mod).then((readme) => {
                window.MainContent.innerHTML = ''
                var title = document.createElement('p')
                var markdown_viewer = new MarkDownViewer(readme)
        
                title.Style({
                    float:'left',
                    margin:'20px',
                    fontSize:'20px',
                    color:'white'
                })
    
                title.innerHTML = mod_info.name
                window.MainContent.append(title, markdown_viewer)
                window.WindowBar.addBackButton().onclick = () => {
                    window.ViewManager.view_modpack_view(modpack)
                }
            })
        })
    }

}

module.exports = ViewManager