(function () {
'use strict';

/**
 * Panel which holds controls
 * @class
 * @extends external:H.ui.Control
 */
class Panel extends H.ui.Control {
    /**
     * @param {string} header - panel title
     */
    constructor(header) {
        super();
        this.header_ = header;
        this.setAlignment('top-left');
    }
    renderInternal(el, doc) {
        this.addClass('dl-panel');
        el.innerHTML = `
            <div class="dl-panel__header">${this.header_}</div>
        `;
        super.renderInternal(el, doc);
    }
    addChild(control) {
        //subscribe on events of child controls
        control.setParentEventTarget(this);
        return super.addChild(control);
    }
}

/**
 * Select With one or more possible items selected in same time
 * @class
 * @extends external:H.ui.Control
 */
class Multiselect extends H.ui.Control {
    /**
     * @param {Object} values - object where property name is value and property value is label
     */
    constructor(values) {
        super();
        this.values = values;
    }
    renderInternal(el) {
        this.addClass('dl-multiselect');
        el.innerHTML = Object.keys(this.values).map((value) => {
            const title = this.values[value];
            const id = 'dl-multiselect-' + value;
            return `<div class="dl-multiselect__option">
                <input
                    class="dl-multiselect__input"
                    type="checkbox"
                    name="multiselect"
                    id="${id}"
                    value="${value}"
                    checked
                />
                <label
                    class="dl-multiselect__label"
                    for="${id}"
                >${title}</label>
            </div>`
        }).join('');
        el.addEventListener('change', () => this.dispatchEvent('change'));
    }
    /**
     * @return {string[]} selected values
     */
    getValue() {
        const inputs = this.getElement().querySelectorAll(
            'input[checked]:checked'
        );
        const value = [];
        for (var i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            value.push(input.value);
        }
        return value;
    }
}

/**
 * Label for Control
 * @class
 * @extends external:H.ui.Control
 */
class Label extends H.ui.Control {
    renderInternal() {
        this.addClass('dl-label');
    }
    /**
     * @param {string} html - label html
     */
    setHTML(html) {
        this.getElement().innerHTML = html;
        return this;
    }
}

/**
 * Color Legend Control
 * @class
 * @extends external:H.ui.Control
 */
class ColorLegend extends H.ui.Control {
    /**
     * @param {function} colorScale - scale with domain 0..1
     */
    constructor(colorScale) {
        super();
        this.colorScale = colorScale;
    }
    renderInternal(el) {
        this.addClass('dl-color-legend');
        this.labels = document.createElement('div');
        this.labels.className = 'dl-color-legend__labels';
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 20;
        const ctx = canvas.getContext('2d');
        for (let i = 0; i <= 1; i += 1 / canvas.width) {
            const x = i * canvas.width;
            ctx.fillStyle = this.colorScale(i);
            ctx.fillRect(x, 1, 1, canvas.height);
        }
        el.appendChild(canvas);
        el.appendChild(this.labels);
    }
    /**
     * @param {string[]} labels - label html
     */
    setLabels(labels) {
        this.labels.innerHTML = labels.map(
            label => `<div>${label}</div>`
        ).join('');
    }
}

Object.assign(window, {Panel, Multiselect, Label, ColorLegend});

}());
