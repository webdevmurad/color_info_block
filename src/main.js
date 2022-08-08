import EditorJS from '@editorjs/editorjs';
const ColoredInfoBlock = require('./index.js');
const Header = require('./header/header.js')
const Marker = require('./marker/index.js');


const editor = new EditorJS({
    /**
     * Id of Element that should contain Editor instance
     */
    holder: 'editorjs',
    tools: {
        header: {
            class: Header,
            inlineToolbar: ['marker']
        },
        coloredInfoBlock: {
            class: ColoredInfoBlock,
            inlineToolbar: ['link', 'bold', 'marker']
        },
        marker: {
            class: Marker
        }
    },
    data: {
        blocks: [
            {
                "id" : "znhCJKL7VQ",
                "type" : "header",
                "data" : {
                    "text" : "Editor.js",
                    "level" : 2
                }
            },
            {
                "id" : "znhCJKL8VQ",
                "type" : "header",
                "data" : {
                    "text" : "Editor.js",
                    "level" : 2
                }
            },
            {
                "id" : "znhCJKL8VQ",
                "type" : "coloredInfoBlock",
                "data" : {
                    "id": "25599ebf-e28f-c93b-f4ed-44322e9967d2",
                    "code" : "green",
                    "text" : "Текст текст <b>текст</b>"
                }
            },
            {
                "id" : "znhCJVQ",
                "type" : "coloredInfoBlock",
                "data" : {
                    "id": "25599ebf-e28f-c93b-f4ed-24421e9967d2",
                    "code" : "red",
                    "text" : "Текст красный <b>текст</b>"
                }
            },
            {
                "id" : "znh232323",
                "type" : "coloredInfoBlock",
                "data" : {
                    "id": "845489ebf-e28f-c93b-f4ed-24421e9967d2",
                    "code" : "blue",
                    "text" : "В коротких ответах используется только конструкция all + of + <b>местоимение.</b><br><br>— How many of these old books are you going to give away to the library?<br><br>— All of them.<br><br>— Сколько из этих старых книг вы собираетесь отдать в библиотеку?<br><br>— Все.<br>"
                }
            },
            {
                "id" : "dfgdfg235236",
                "type" : "coloredInfoBlock",
                "data" : {
                    "id": "25756ebf-e28f-c93b-f4ed-24421e9967d2",
                    "code" : "gray",
                    "text" : "Текст красный <b>текст</b> hfghfghfgh hfghfgh"
                }
            },
            {
                "id" : "fghfghfghfgh43634634",
                "type" : "coloredInfoBlock",
                "data" : {
                    "id": "4249ebf-e28f-c93b-f4ed-24421e9967d2",
                    "code" : "orange",
                    "text" : "Текст красный <b>текст</b>"
                }
            },
        ]
    }
});


let saveBtn = document.querySelector('button')

console.log(editor)

saveBtn.addEventListener('click', function() {
    editor.save().then((data) => {
        console.log(data)
    })
})