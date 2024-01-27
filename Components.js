
const remote = require('@electron/remote');
const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');
const BrowserWindow = remote.BrowserWindow
const path = require('node:path')

HTMLElement.prototype.Style = function(styles){
    for(var key in styles){
        this.style[key] = styles[key]
    }
    return this
}

HTMLElement.prototype.Append = function(els){
    for(var el in els){
        this.append(els[el])
    }

    return this
}

HTMLElement.prototype.AddClass = function(className){
    this.classList.add(className)
    return this
}

HTMLElement.prototype.RemoveClass = function(className){
    this.classList.remove(className)
    return this
}

//modify constructor
HTMLElement.prototype.constructor = function(){
    //do all default behavior but return itself when done
    return this
}

class WindowBar extends HTMLElement{
    constructor(){
        super()
        this.Style({
            width:'100%',
            height:'30px',
            background:'#2f3640',
            display:'block',
            "-webkit-app-region":"drag",
            cursor:'pointer',
        })

        this.exit = document.createElement('p')
        this.back_button = document.createElement('p')
        this.title_el = document.createElement('p')

        this.title_el.Style({
            float:'left',
            fontSize:'17px',
            color:'white',
            textAlign:'center',
            width:'100%',
            position:'absolute',
            margin:'0px',
            lineHeight:'30px',
            zIndex:'1',
        })

        this.exit.Style({
            display:'block',
            width:'20px',
            height:'20px',
            float:'right',
            padding:'0px',
            lineHeight:'20px',
            right:'5px',
            margin:'5px',
            textAlign:'center',
            fontSize:'20px',
            color:'#eb2f06',
            '-webkit-app-region': 'no-drag',
            zIndex:'2',
            position:'absolute',
        })

        this.exit.classList.add('material-symbols-outlined')
        this.exit.innerHTML = 'close'

        this.back_button.Style({
            display:'block',
            width:'20px',
            height:'20px',
            float:'left',
            padding:'0px',
            lineHeight:'20px',
            margin:'5px',
            textAlign:'center',
            fontSize:'20px',
            color:'#2ecc71',
            cursor:'pointer',
            '-webkit-app-region': 'no-drag',
            zIndex:'2',
            position:'absolute',
        })
        
        this.back_button.classList.add('material-symbols-outlined')
        this.back_button.innerHTML = 'arrow_back'

        this.exit.onclick = () => {
            BrowserWindow.getFocusedWindow().close();

        }

        this.append(this.exit, this.title_el)
    }

    setTitle(title){
        this.title_el.innerHTML = title;
    }

    addBackButton(){
        this.append(this.back_button)
        return this.back_button
    }
}

class ModPackItem extends HTMLElement{
    constructor(name){
        super();
        this.Style({
            float:'left',
            display:'block',
            width:'50px',
            height: '50px',
            marginTop:'20px',
            marginLeft:'20px',
            background:'#292f37',
            borderRadius:'10px',
            cursor:'pointer',
        })

        var title_el = document.createElement('p');
        title_el.Style({
            color:'white',
            fontSize:'18px',
            textAlign:'center'
        })
        title_el.innerHTML = name.charAt(0)

        this.append(title_el)

        this.onclick = () => {
            window.ViewManager.view_modpack_view(name)
        }
    }
}

class AddModPackButton extends HTMLElement{
    constructor(){
        super();
        this.Style({
            display:'block',
            float:'right',
            height:'40px',
            width:'40px',
            borderRadius:'20px',
            background:'#3498db',
            bottom:'20px',
            right:'20px',
            position:'absolute',
            fontSize:'40px',
            color:'#353b48',
            cursor:'pointer'
        })

        this.classList.add('material-symbols-outlined')
        this.innerHTML = 'add'
        this.onclick = () => {
            window.ViewManager.new_modpack_view()
        }
    }
}

class PlayModPackButton extends HTMLElement{
    constructor(){
        super();
        this.Style({
            height:'40px',
            width:'40px',
            borderRadius:'20px',
            background:'#2ecc71',
            bottom:'20px',
            right:'20px',
            position:'absolute',
            fontSize:'40px',
            color:'#353b48',
            cursor:'pointer'
        })

        this.classList.add('material-symbols-outlined')
        this.innerHTML = 'play_arrow'
    }
}

class NewModPackButton extends HTMLElement{
    constructor(){
        super();
        this.Style({
            display:'block',
            float:'right',
            height:'40px',
            width:'40px',
            borderRadius:'20px',
            background:'#2ecc71',
            bottom:'20px',
            right:'20px',
            position:'absolute',
            fontSize:'30px',
            color:'#353b48',
            cursor:'pointer',
            textAlign:'center',
            lineHeight:'40px',
        })

        this.classList.add('material-symbols-outlined')
        this.innerHTML = 'save'
    }
}

class MainContent extends HTMLElement{
    constructor(){
        super()
        this.Style({
            display:'block',
            width:'100%',
            height:'calc(100% - 30px)',
            overflowY:'scroll',
        })
    }
}

class TextInput extends HTMLInputElement{
    constructor(){
        super()
        this.type = 'text'
        this.Style({
            display:'block',
            width:'calc(100% - 40px)',
            height:'25px',
            background:'#2f3640',
            color:'white',
            border:'none',
            outline:'none',
            borderRadius:'5px',
            padding:'5px',
            marginLeft:'20px',
            float:'left',
            borderBottom: '2px solid transparent',
        })

        this.addEventListener('focus', () => {
            this.Style({
                borderBottom: '2px solid #2ecc71',
            })
        })

        this.addEventListener('blur', () => {
            this.Style({
                borderBottom: '2px solid transparent',
            })
        })
    }
}

class ColorPicker extends HTMLElement{
    constructor(){
        super()
        
        this.Style({
            display:'block',
            height:'25px',
            width:'80px',
            color:'white',
            border:'none',
            outline:'none',
            padding:'0px',
            marginLeft:'20px',
            float:'left',
            borderRadius:'5px',
            background:'#2f3640',
            textAlign:'center',
            fontSize:'20px',
            lineHeight:'25px',
            cursor:'pointer',
        })

        this.color_picker = document.createElement('input')
        this.color_picker.type = 'color'
        this.color_picker.Style({
            position:'absolute',
            display:'block',
            marginTop:'-3px',
            zIndex:'-1',
            width: '0px',
            height: '0px',
            background: 'transparent',
            border: 'none',
            color: 'transparent',
        })
        this.innerHTML = 'color_lens'
        this.classList.add('material-symbols-outlined')
        this.append(this.color_picker)

        this.onclick = (ev) => {
            this.color_picker.click(ev)
        }

        this.color_picker.onchange = (ev) => {
            this.Style({
                color:this.color_picker.value,
            })
        }
        
    }
}

class FileList extends HTMLElement{
    constructor(modpack){
        super();
        this.modpack = modpack
        this.Style({
            display:'block',
            width:'calc(100% - 40px)',
            height:'auto',
            background:'#2f3640',
            color:'white',
            overflowY:'scroll',
            margin:'20px',
            borderRadius:'5px',
        }) 

        this.list_title = document.createElement('p')
        this.open_folder_button = document.createElement('p')
        this.download_mod_button = document.createElement('p')

        this.open_folder_button.classList.add('material-symbols-outlined')
        this.download_mod_button.classList.add('material-symbols-outlined')

        this.open_folder_button.innerHTML = 'folder_open'
        this.download_mod_button.innerHTML = 'download'

        this.open_folder_button.Style({
            float:'right',
            margin:'20px',
            fontSize:'20px',
            color:'#1abc9c',
            margin:'5px',
            padding:'0px',
            cursor:'pointer',
        })

        this.download_mod_button.Style({
            float:'right',
            margin:'20px',
            fontSize:'20px',
            color:'#3498db',
            margin:'5px',
            padding:'0px',
            cursor:'pointer',
        })

        this.list_title.Style({
            float:'left',
            margin:'20px',
            fontSize:'20px',
            color:'white',
            margin:'5px',
            padding:'0px',
        })

        this.open_folder_button.onclick = () => {
            window.ModManager.openModPackFolder(this.modpack)
        }

        this.download_mod_button.onclick = () => {
            var p = window.Prompt.open();
            p.main_content.innerHTML = ''
            var input = new TextInput()
            input.placeholder = 'URL'
            input.Style({
                margin:'20px',
                marginTop:'10px',
                marginBottom:'0px',
            })
            p.main_content.append(input)
            p.window_bar.setTitle('Download Mod')

            input.onkeydown = (ev) => {
                if(ev.key == 'Enter'){
                    window.ModManager.downloadMod(input.value, this.modpack)
                    p.window.close()
                }
            }

        }

    }

    connectedCallback(){  
        this.modsView()
    }

    newModPackItem(modfolder){
        var mod_item_container = document.createElement('div')
        var mod_item_icon = document.createElement('p')
        var mod_item = document.createElement('p')
        var mod_version = document.createElement('p')

        mod_item_icon.classList.add('material-symbols-outlined')
        mod_item_icon.innerHTML = 'extension'

        mod_item_icon.Style({
            margin:'0px',
            lineHeight:'30px',
            float:'left',
            color:'#2ecc71',
        })

        mod_item_container.Style({
            float:'left',
            width:'100%',
            height:'30px',
            background:'#2f3640',
            borderRadius:'5px',
            cursor:'pointer',
            margin:'0px',
        })
        mod_item.Style({
            float:'left',
            width:'calc(100% - 100px)',
            fontSize:'15px',
            color:'white',
            margin:'0px',
            marginLeft:'5px',
            padding:'0px',
            display:'block',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            padding:'0px',
            lineHeight:'30px',
        })

        mod_version.Style({
            float:'right',
            width:'auto',
            fontSize:'15px',
            color:'white',
            margin:'0px',
            marginRight:'5px',
            padding:'0px',
            display:'block',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            padding:'0px',
            lineHeight:'30px',
        })

        mod_item_container.onclick = () => {
            window.ViewManager.view_modpack_info_view(this.modpack, modfolder)
        }
        

        window.ModManager.getModInfo(this.modpack, modfolder).then((modinfo) => {
            console.log(modinfo)
            mod_item.innerHTML = modinfo.name
            mod_version.innerHTML = (modinfo.version_number == undefined ? '?.?.?' : modinfo.version_number)
            mod_item_container.append(mod_item_icon, mod_item, mod_version)
        })

        return mod_item_container
    }

    modsView(){
        var mods = window.ModManager.getModpackMods(this.modpack)
        this.list_title.innerHTML = 'Mods (' + mods.length + ')'
        this.append(this.list_title, this.open_folder_button, this.download_mod_button)
        mods.forEach((mod) => {
            console.log(mod)
            this.append(this.newModPackItem(mod))
        })
    }
}

class MarkDownViewer extends HTMLElement{
    constructor(text){
        super()
        this.Style({
            display:'block',
            width:'calc(100% - 80px)',
            height:'auto',
            background:'#2f3640',
            color:'white',
            overflowY:'scroll',
            margin:'20px',
            borderRadius:'5px',
            padding:'20px '
        }) 
        this.innerHTML = this.parseMarkdownWithHighlighting(text)
    }   

    parseMarkdownWithHighlighting(markdownText) {
        // Initialize markdown-it
        const md = new MarkdownIt({
            html: true,
            linkify: true,
            typographer: true,
            highlight: function (str, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(str, { language: lang }).value;
                    } catch (__) {}
                }
    
                return ''; // use external default escaping
            }
        });
    
        // Parse the Markdown to HTML
        return md.render(markdownText);
    }
    

}

class Prompt extends HTMLElement{
    constructor(){
        super();
        this.window_bar = null;
        this.main_content = null;
        this.window = null;
    }

    open(url){
        this.window_bar = new WindowBar()
        this.main_content = new MainContent()
        //get main windows current position
        var main_window = BrowserWindow.getFocusedWindow()
        var main_window_position = main_window.getPosition()
        var main_window_size = main_window.getSize()
        var main_window_center = [main_window_position[0] + (main_window_size[0] / 2), main_window_position[1] + (main_window_size[1] / 2)]

        var prompt_width = 200
        var prompt_height = 80

        var prompt_position = [main_window_center[0] - (prompt_width / 2), main_window_center[1] - (prompt_height / 2)]

        var w = window.open('./prompt.html', '_blank', `top=${prompt_position[1]},left=${prompt_position[0]},width=${prompt_width},height=${prompt_height},frame=false,nodeIntegration=true,resizable=false`)
        w.onload = () => {
            w.innerHTML = ''
            w.document.body.append(this.window_bar, this.main_content)
        }
        this.window = w
        return this
    }
}

window.customElements.define('window-bar', WindowBar);
window.customElements.define('mod-pack-item', ModPackItem);
window.customElements.define('add-mod-pack-button',  AddModPackButton)
window.customElements.define('main-content', MainContent)
window.customElements.define('play-mod-pack-button', PlayModPackButton)
window.customElements.define('text-input', TextInput, {extends:'input'})
window.customElements.define('color-picker', ColorPicker)
window.customElements.define('new-mod-pack-button', NewModPackButton)
window.customElements.define('file-list', FileList)
window.customElements.define('markdown-viewer', MarkDownViewer)
window.customElements.define('prompt-element', Prompt)

module.exports = {WindowBar, ModPackItem, AddModPackButton, MainContent, PlayModPackButton, TextInput, ColorPicker, NewModPackButton, FileList, MarkDownViewer, Prompt}

