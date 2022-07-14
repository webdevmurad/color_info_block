import EditorJS from '@editorjs/editorjs';

const ColoredInfoBlock = require('./index');
const Header = require('./header/header');

const editor = new EditorJS({
  /**
   * Id of Element that should contain Editor instance
   */
  holder: 'editorjs',
  tools: {
    header: {
      class: Header,
      inlineToolbar: true,
    },
    coloredInfoBlock: {
      class: ColoredInfoBlock,
      inlineToolbar: true,
    },
  },
});

const saveBtn = document.querySelector('button');

console.log(editor);

saveBtn.addEventListener('click', () => {
  editor.save().then((data) => {
    console.log(data);
  });
});
