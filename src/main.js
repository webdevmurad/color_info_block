import EditorJS from '@editorjs/editorjs';
const ColoredInfoBlock = require('./index.js');
const Header = require('./header/header.js')

const editor = new EditorJS({
    /**
     * Id of Element that should contain Editor instance
     */
    holder: 'editorjs',
    tools: {
        header: {
            class: Header,
            inlineToolbar: true
        },
        coloredInfoBlock: {
            class: ColoredInfoBlock,
            inlineToolbar: true
        }
    },
});


let saveBtn = document.querySelector('button')

console.log(editor)

saveBtn.addEventListener('click', function() {
    editor.save().then((data) => {
        console.log(data)
    })
})