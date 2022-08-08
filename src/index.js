const { blocks: BLOCKS_SECTION } = require('./sections.js');
require('./index.css').toString();

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

        this.defaultBlock = BLOCKS_SECTION[0]

        // Сократить до ID
        // selectedColorId
        this.activeBlock = {
            id: 1,
        }

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

        newData.id = data.id || null;
        newData.text = data.text || '';
        newData.code = data.code || this.defaultInfoBlock.number;

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
        const HEADER_TITLE = document.createElement('H3')
        const BLOCK_BODY = document.createElement('DIV');
        
        const selectBlock = this.getSelectedData(this._data.code)
        /**
         * Add text to block
         */
        TAG.innerHTML = this._data.text || '';

        if(this._data.code) {
            WRAP.classList.add(selectBlock.class)
            WRAP.setAttribute('id-code', selectBlock.code)
            WRAP.setAttribute('id', this._data.id)
            HEADER_TITLE.innerHTML = selectBlock.headerText
            BLOCK_HEADER.insertAdjacentHTML('afterbegin', selectBlock.icon)
        } else {
            WRAP.classList.add(this.defaultBlock.class)
            WRAP.setAttribute('id-code', this.defaultBlock.code)
            WRAP.setAttribute('id', generateId())
            HEADER_TITLE.innerHTML = this.defaultBlock.headerText
            BLOCK_HEADER.insertAdjacentHTML('afterbegin', this.defaultBlock.icon)
        }

        TAG.classList.add('ce-colored-block-text')
        BLOCK_HEADER.appendChild(HEADER_TITLE)
        BLOCK_HEADER.classList.add('ce-colored-block-header')

        BLOCK_BODY.classList.add('ce-colored-block-body')
        BLOCK_BODY.appendChild(TAG)
        
        WRAP.appendChild(BLOCK_HEADER)
        WRAP.appendChild(BLOCK_BODY)

        /**
         * Add styles class
         */
        WRAP.classList.add(this._CSS.wrapper);

        /**
         * Make tag editable
         */
        TAG.contentEditable = this.readOnly ? 'false' : 'true';

        /**
         * Add Placeholder
         */
        TAG.dataset.placeholder = this.api.i18n.t(this._settings.placeholder || '');

        return WRAP;
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
    * Sanitizer Rules
    */
    static get sanitize() {
        return {
            br: true,
            b: true,
            a: true,
            span: true,
            i: true,
        };
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

        /** Add type selectors */
        BLOCKS_SECTION.forEach(section => {
            const selectTypeButton = document.createElement('SPAN');

            
            selectTypeButton.classList.add('span-block');
            selectTypeButton.style.backgroundColor = section.color
            selectTypeButton.setAttribute('id-code', section.code)

            
            selectTypeButton.addEventListener('click', () => {
                this.selectedBlock()
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

    selectedBlock() {
        const HEADER_TITLE = document.createElement('H3')
        const selectBlock = this.getSelectedData(event.target.getAttribute('id-code'))
        const headerSection = this._element.querySelector('.ce-colored-block-header')

        this.removeClasses()
        
        headerSection.innerHTML = ''
        HEADER_TITLE.innerHTML = selectBlock.headerText

        this._element.setAttribute('id-code', selectBlock.code)
        this._element.classList.add(selectBlock.class)
        
        headerSection.insertAdjacentHTML('afterbegin', selectBlock.icon)
        headerSection.appendChild(HEADER_TITLE)
    }

    getSelectedData(code) {
        return BLOCKS_SECTION.find(section => section.code === code)
    }

    removeClasses() {
        BLOCKS_SECTION.forEach(section => {
            this._element.classList.remove(section.class)
        })
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

        return BLOCKS_SECTION[0];
    }

    /**
        * Extract Tool's data from the view
        *
        * @param {HTMLHeadingElement} toolsContent - Text tools rendered view
        * @returns {HeaderData} - saved data
        * @public
        */
    save(toolsContent) {
        return {
            id: toolsContent.getAttribute('id'),
            code: toolsContent.getAttribute('id-code'),
            text: toolsContent.querySelector('.ce-colored-block-body').innerHTML,
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
