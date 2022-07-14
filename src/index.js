const { colors: COLOR_PALETTE } = require('./colors.js');
const { icons: ICONS } = require('./icons.js');
require('./index.css').toString();

const SECTION_COLOR = 'color'
const SECTION_ICON = 'icon'

const sections = [
    {
        code: SECTION_COLOR,
        icon: '<svg width="18px" height="18px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.4 2.096a10.08 10.08 0 0 0-8.937 3.331A10.054 10.054 0 0 0 2.096 13.4c.53 3.894 3.458 7.207 7.285 8.246a9.982 9.982 0 0 0 2.618.354l.142-.001a3.001 3.001 0 0 0 2.516-1.426 2.989 2.989 0 0 0 .153-2.879l-.199-.416a1.919 1.919 0 0 1 .094-1.912 2.004 2.004 0 0 1 2.576-.755l.412.197c.412.198.85.299 1.301.299A3.022 3.022 0 0 0 22 12.14a9.935 9.935 0 0 0-.353-2.76c-1.04-3.826-4.353-6.754-8.247-7.284zm5.158 10.909-.412-.197c-1.828-.878-4.07-.198-5.135 1.494-.738 1.176-.813 2.576-.204 3.842l.199.416a.983.983 0 0 1-.051.961.992.992 0 0 1-.844.479h-.112a8.061 8.061 0 0 1-2.095-.283c-3.063-.831-5.403-3.479-5.826-6.586-.321-2.355.352-4.623 1.893-6.389a8.002 8.002 0 0 1 7.16-2.664c3.107.423 5.755 2.764 6.586 5.826.198.73.293 1.474.282 2.207-.012.807-.845 1.183-1.441.894z"/><circle cx="7.5" cy="14.5" r="1.5"/><circle cx="7.5" cy="10.5" r="1.5"/><circle cx="10.5" cy="7.5" r="1.5"/><circle cx="14.5" cy="7.5" r="1.5"/></svg>',
    },
    {
        code: SECTION_ICON,
        icon: '<svg width="22px" height="22px"viewBox="0 0 32 32" enable-background="new 0 0 32 32" version="1.1" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Favorite"><path id="3" d="M30.9,10.6C30.8,10.2,30.4,10,30,10h0h-9l-4.1-8.4C16.7,1.2,16.4,1,16,1v0c0,0,0,0,0,0   c-0.4,0-0.7,0.2-0.9,0.6L11,10H2c-0.4,0-0.8,0.2-0.9,0.6c-0.2,0.4-0.1,0.8,0.2,1.1l6.6,7.6L5,29.7c-0.1,0.4,0,0.8,0.3,1   s0.7,0.3,1.1,0.1l9.6-4.6l9.6,4.6C25.7,31,25.8,31,26,31h0h0h0c0.5,0,1-0.4,1-1c0-0.2,0-0.3-0.1-0.5l-2.8-10.3l6.6-7.6   C31,11.4,31.1,10.9,30.9,10.6z"/></g></svg>',
    },
]

let activeId = ''

const generateId = () => {
    let s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

class ColoredInfoBlock {
    /**
     * Render plugin`s main Element and fill it with saved data
     *
     * @param {{data: ColoredInfoBlockData, config: ColoredInfoBlockConfig, api: object}}
     *   data — previously saved data
     *   config - user config for Tool
     *   api - Editor.js API
     *   readOnly - read only mode flag
     */
    constructor({ data, config, api, readOnly }) {
        this.api = api;
        this.readOnly = readOnly;

        /**
         * Styles
         *
         * @type {object}
         */
        this._CSS = {
            block: this.api.styles.block,
            settingsButton: this.api.styles.settingsButton,
            settingsButtonActive: this.api.styles.settingsButtonActive,
            wrapper: 'ce-colored-block',
        };

        /**
         * Tool's settings passed from Editor
         *
         * @type {ColoredInfoBlockConfig}
         * @private
         */
        this._settings = config;

        /**
         * Block's data
         *
         * @type {ColoredInfoBlockData}
         * @private
         */
        this._data = this.normalizeData(data);

        /**
         * List of settings buttons
         *
         * @type {HTMLElement[]}
         */
        this.settingsButtons = [];

        this.selectedSection = SECTION_COLOR

        this.removeListenerCallback = null

        // Сократить до ID
        // selectedColorId
        this.colorActive = {
            id: 1,
        }

        // selectedIconId
        this.iconActive = {
            id: null,
        },

        /**
         * Main Block wrapper
         *
         * @type {HTMLElement}
         * @private
         */
        this._element = this.getTag();
    }

    /**
     * Normalize input data
     *
     * @param {HeaderData} data - saved data to process
     *
     * @returns {HeaderData}
     * @private
     */
    normalizeData(data) {
        const newData = {};

        if (typeof data !== 'object') {
            data = {};
        }

        newData.text = data.text || '';
        newData.level = parseInt(data.level) || this.defaultInfoBlock.number;

        return newData;
    }

  /**
   * Get tag for target level
   * By default returns second-leveled header
   *
   * @returns {HTMLElement}
   */
    getTag() {
        /**
         * Create element for current Block's level
         */
        const WRAP = document.createElement('DIV')
        const TAG = document.createElement('DIV');
        const BLOCK_HEADER = document.createElement('DIV');
        const BLOCK_BODY = document.createElement('DIV');
        const INPUT_HEADER = document.createElement('INPUT')
        /**
         * Add text to block
         */
        TAG.innerHTML = this._data.text || '';

        WRAP.setAttribute('id', generateId())

        TAG.classList.add('ce-colored-block-text')
        INPUT_HEADER.setAttribute('placeholder', 'Заголовок')
        INPUT_HEADER.addEventListener('input', this.workWithHeader.bind(this))
        BLOCK_HEADER.classList.add('ce-colored-block-header')
        BLOCK_BODY.classList.add('ce-colored-block-body')
        BLOCK_HEADER.appendChild(INPUT_HEADER)
        BLOCK_BODY.appendChild(TAG)
        WRAP.appendChild(BLOCK_HEADER)
        WRAP.appendChild(BLOCK_BODY)

        /**
         * Add styles class
         */
        WRAP.classList.add(this._CSS.wrapper);

        const defaultColorObject = this.getSelectedColorData(this.colorActive.id)

        WRAP.style.backgroundColor = defaultColorObject.backgroundColor
        WRAP.style.borderLeft = `5px solid ${defaultColorObject.color}`
        WRAP.setAttribute('id-color', defaultColorObject.id)

        /**
         * Make tag editable
         */
        TAG.contentEditable = this.readOnly ? 'false' : 'true';

        TAG.addEventListener('change', this.checkField)

        /**
         * Add Placeholder
         */
        TAG.dataset.placeholder = this.api.i18n.t(this._settings.placeholder || '');

        return WRAP;
    }

    workWithHeader(event) {
        const HEADER_SVG = document.querySelector('.ce-colored-block-header svg')
        const BODY_SVG = document.querySelector('.ce-colored-block-body svg')

        if (event.target.value.length === 0 && HEADER_SVG) {
            HEADER_SVG.remove()
            this.iconActive.id = null
        }

        if (event.target.value.length > 0 && BODY_SVG) {
            BODY_SVG.remove()
            this.iconActive.id = null
        }
    }

    /**
     * Get current level
     *
     * @returns {level}
     */
    get currentLevel() {
        let level = sections.find(levelItem => levelItem.number === this._data.level);

        if (!level) {
            level = this.defaultInfoBlock;
        }

        return level;
    }

    /**
     * Return Tool's view
     *
     * @returns {HTMLHeadingElement}
     * @public
     */
    render() {
        return this._element;
    }

    /**
     * Create Block's settings block
     *
     * @returns {HTMLElement}
     */
    // TODO: Вынести название классов в константы
    renderSettings() {
        const holder = document.createElement('DIV');
        const settings = document.querySelector('.ce-settings')
        const createdSubTag = document.querySelector('.tooltip-block')

        if (createdSubTag === null) {
            const subTag = document.createElement('DIV')
            subTag.classList.toggle('tooltip-block')
            settings.appendChild(subTag)
        }

        activeId = this._element.id

        this.removeChildElements()

        /** Add type selectors */
        sections.forEach(section => {
            const selectTypeButton = document.createElement('SPAN');
            
            selectTypeButton.classList.add(this._CSS.settingsButton);
            selectTypeButton.setAttribute('id', section.code)

            /**
             * Add SVG icon
             */
            selectTypeButton.innerHTML = section.icon;

            
            selectTypeButton.addEventListener('click', () => {
                this.selectedSection = section.code;
                this.renderSectionContent()
            });

            /**
             * Append settings button to holder
             */
            holder.appendChild(selectTypeButton);

            /**
             * Save settings buttons
             */
            this.settingsButtons.push(selectTypeButton);
        });

        return holder;
    }

    renderSectionContent() {
        const sectionContent = document.querySelector('.tooltip-block')

        sectionContent.innerHTML = ''
        sectionContent.setAttribute('class', 'tooltip-block')

        if (this.removeListenerCallback !== null) {
            this.removeListenerCallback()
        }

        if (this.selectedSection === SECTION_COLOR) {
            sectionContent.classList.add('color-block')

            this.renderColors()
        }

        if (this.selectedSection === SECTION_ICON) {
            sectionContent.classList.add('icon-block')

            this.renderIcons()
        }
    }

    renderIcons() {
        const ICON_BLOCK = document.querySelector('.icon-block')
        const clickHandler = this.selectIcon.bind(this)

        ICONS.forEach((iconVariant) => {
            ICON_BLOCK.insertAdjacentHTML('beforeend', iconVariant.icon)
        })

        this.removeListenerCallback = () => {
            ICON_BLOCK.removeEventListener('click', clickHandler)
        }

        ICON_BLOCK.addEventListener('click', clickHandler)
    }

    renderColors() {
        const COLOR_BLOCK = document.querySelector('.color-block')
        const clickHandler = this.selectColor.bind(this)

        COLOR_PALETTE.forEach((colorGamma) => {
            const SPAN_BLOCK = document.createElement('SPAN')
            SPAN_BLOCK.classList.add('span-block')
            SPAN_BLOCK.style.backgroundColor = colorGamma.color
            SPAN_BLOCK.id = colorGamma.id
            COLOR_BLOCK.appendChild(SPAN_BLOCK)
        })
        
        this.colorActiveAdded()

        this.removeListenerCallback = () => {
            COLOR_BLOCK.removeEventListener('click', clickHandler)
        }

        COLOR_BLOCK.addEventListener("click", clickHandler)
    }

    removeChildElements() {
        const TOOLTIP_BLOCK = document.querySelector('.tooltip-block')

        while (TOOLTIP_BLOCK.firstChild) {
            TOOLTIP_BLOCK.removeChild(TOOLTIP_BLOCK.firstChild);
        }
    }

    colorActiveAdded() {
        const COLORS_SPAN = document.querySelectorAll('.color-block .span-block')
        const idActiveColor = document.getElementById(activeId).getAttribute('id-color')

        COLORS_SPAN.forEach((colorSpan) => {
            colorSpan.classList.remove('color-selected')

            if (Number(colorSpan.id) === Number(idActiveColor)) {
                colorSpan.classList.add('color-selected')
            }
        })
    }

    selectColor(event) {
        let color = COLOR_PALETTE.find(color => color.id === Number(event.target.id))
        this.selectedActiveColor(color)
    }

    selectIcon(event) {
        this.selectedActiveIcon(this.getSelectedIconData(event.target.id))
    }

    selectedActiveColor(object) {
        if (typeof object === 'object') {
            this.colorActive = object.id
        }

        document.getElementById(activeId).style.backgroundColor = object.backgroundColor
        document.getElementById(activeId).style.borderLeft = `5px solid ${object.color}`
        document.getElementById(activeId).setAttribute('id-color', object.id)
        this.activeColorIcon()
        this.colorActiveAdded()
    }

    selectedActiveIcon(selectedIcon) {

        if (typeof selectedIcon === 'undefined') {
            return
        }

        if (typeof selectedIcon === 'object') {
            this.iconActive.id = selectedIcon.id
        }

        if (selectedIcon.id === 'delete') {
            const HEADER_SVG = this._element.querySelector('.ce-colored-block-header svg')
            const BODY_SVG = this._element.querySelector('.ce-colored-block-body svg')

            if (HEADER_SVG) {
                HEADER_SVG.remove()
            }

            if (BODY_SVG) {
                BODY_SVG.remove()
            }

            return
        }

        const INPUT_HEADER = this._element.querySelector('.ce-colored-block input')
        
        if (INPUT_HEADER.value) {
            const HEADER_WRAP = this._element.querySelector('.ce-colored-block-header')
            const HEADER_SVG = this._element.querySelector('.ce-colored-block-header svg')
            const BODY_SVG = this._element.querySelector('.ce-colored-block-body svg')


            if (HEADER_SVG) {
                HEADER_SVG.remove()
                this.iconActive.id = null
            }

            if (BODY_SVG) {
                BODY_SVG.remove()
                this.iconActive.id = null
            }

            HEADER_WRAP.insertAdjacentHTML('afterbegin', selectedIcon.icon)
            this.activeColorIcon()
        } else {
            const BODY_WRAP = this._element.querySelector('.ce-colored-block-body')
            const HEADER_SVG = this._element.querySelector('.ce-colored-block-header svg')
            const BODY_SVG = this._element.querySelector('.ce-colored-block-body svg')

            if (HEADER_SVG) {
                HEADER_SVG.remove()
                this.iconActive.id = null
            }

            if (BODY_SVG) {
                BODY_SVG.remove()
                this.iconActive.id = null
            }

            BODY_WRAP.insertAdjacentHTML('afterbegin', selectedIcon.icon)
            this.activeColorIcon()
        }
    }

    activeColorIcon() {
        const HEADER_SVG = this._element.querySelector('.ce-colored-block-header svg path')
        const BODY_SVG = this._element.querySelector('.ce-colored-block-body svg path')
        
        if (HEADER_SVG) {
            HEADER_SVG.style.fill = this.getSelectedColorData(this.colorActive).color
        }

        if (BODY_SVG) {
            BODY_SVG.style.fill = this.getSelectedColorData(this.colorActive).color
        }
    }

    getSelectedIconData(idIcon) {
        if (idIcon === 'delete') {
            return ICONS.find(icon => icon.id === idIcon)
        }

        return ICONS.find(icon => icon.id === Number(idIcon))
    }

    getSelectedColorData(idColor) {
        return COLOR_PALETTE.find(color => color.id === Number(idColor))
    }

    

    /**
     * Return default level
     *
     * @returns {level}
     */
    get defaultInfoBlock() {
        /**
         * User can specify own default level value
         */
        if (this._settings.defaultInfoBlock) {
            const userSpecified = sections.find(levelItem => {
                return levelItem.number === this._settings.defaultInfoBlock;
            });

            if (userSpecified) {
                return userSpecified;
            } else {
                console.warn('(ง\'̀-\'́)ง Heading Tool: the default level specified was not found in available levels');
            }
        }

        return sections[0];
    }

    /**
        * Extract Tool's data from the view
        *
        * @param {HTMLHeadingElement} toolsContent - Text tools rendered view
        * @returns {HeaderData} - saved data
        * @public
        */
    save(toolsContent) {
        const headerContent = toolsContent.querySelector('input')

        return {
            header: headerContent.value ?? null,
            icon: this.iconActive.id,
            text: toolsContent.innerHTML,
            colorCode: this.colorActive.id,
        };
    }

    static get toolbox() {
        return {
            icon: require('./../assets/icon.svg').default,
            title: 'Colored Info Block',
        };
    }
}

module.exports = ColoredInfoBlock;
