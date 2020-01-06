/**
 * select element from page
 * @param {string} selector 
 * @param {HTMLElement} parent 
 * @returns {HTMLElement}
 */
function select(selector, parent = undefined) { //, classes, parent, id, name

    function frame(elem) { //stop: frame function

        if (elem.backup && elem.events && elem.config && elem.insert && elem.push && elem.class) return;

        elem._creoned = true;

        Object.assign(elem, { ...creon.frame });
        for (let prop in creon.frame) {
            const value = creon.frame[prop];
            if (typeof value == "object") { //if prop is ANY object
                if (Array.isArray(value)) { //copy prop if prop is array
                    elem[prop] = Arrat.from(creon.frame[prop]);
                } else { //copy prop if object
                    elem[prop] = Object.assign({}, creon.frame[prop]);
                }
            }
        }

        function autocomplete(context, contextProp) {
            context[contextProp] = new Proxy(context[contextProp], {
                get(target, prop, reciever) {
                    target[prop] = function () { };
                    return new Proxy(target[prop], {
                        apply(autoTarget, autoTargetThisArg, autoTargetArgs) {
                            if (autoTarget.toString() == 'function () { }')
                                return target.call(elem, prop, ...autoTargetArgs);
                            else return autoTarget(autoTargetArgs);
                        },
                    });
                },
                apply(target, thisArg, args) {
                    return target.call(elem, ...args);
                }
            });
        }

        //OKEY: autotargeting only after all methods assigning
        [
            { context: elem, prop: 'push' },
            { context: elem.insert, props: ['before', 'after'] },
            { context: elem, prop: 'on' },
            { context: elem, prop: 'attr' },
        ]
            .forEach(obj => {
                obj.prop
                    ? autocomplete(obj.context, obj.prop)
                    : obj.props.forEach(prop => autocomplete(obj.context, prop));
            });

        creon.methods.forEach(method => {
            if (typeof method == "function") {
                method(elem);
            } else if (typeof method == "object" && Object.getPrototypeOf(method).constructor.name == "Object") {
                Object.assign(elem, method);
            }
        });
    }


    let elem;
    if (typeof selector == "string")
        if (parent) {
            elem = parent.querySelector(selector);
        } else {
            elem = document.querySelector(selector);
        }
    else
        elem = selector;
    if (elem) frame(elem);
    return elem;
}

select.page = function () {
    selectAll("*");
};

/**
 * select all elements by selector
 * @param {string} selector 
 * @param {HTMLElement} parent 
 * @returns {NodeList}
 */
function selectAll(selector, parent) {
    let elems;

    if (typeof selector == "string")
        if (parent) {
            elems = parent.querySelectorAll(selector);
        } else {
            elems = document.querySelectorAll(selector);
        }
    else { //if selector is array of elements
        elems = [];
        for (let i = 0; i < selector.length; i++) {
            elems.push(selector[i]);
        }
    }
    elems.forEach(elem => select(elem));

    return elems;
}


function create(tag, config) {
    let elem = document.createElement(tag);
    select(elem);
    if (config) elem.config(config);
    return elem;
}

create = new Proxy(create, {
    get(target, prop) {
        if (!target[prop]) target[prop] = function () { };
        return new Proxy(target[prop], {
            apply(targetProp, thisArg, argsArray) {
                return target(prop, ...argsArray);
            }
        });
    },
    apply(target, thisArg, argsArray) {
        return target(...argsArray);
    }
});

let sel = select;
let sela = selectAll;
let cre = create;

const creon = { //stop: creon start
    sacred(data) {
        return {
            _isCreonDontTouch: true,
            data: data,
        };
    },
    onspecial: { //stop: onspecial
        hover(hoverin, hoverout = 'tag') {
            if (typeof hoverout == "function") { //is function
                this.on("mouseenter", hoverin, name).on("mouseleave", hoverout, name);
            }
            else {
                let backup = null;
                const mode = hoverout;
                this.on("mouseenter", e => {
                    backup = this.backup(mode);
                    hoverin(e);
                }, name);
                this.on("mouseleave", e => {
                    this.config(backup);
                }, name);
            }
            return this;
        },

        clickToggle(clickin, clickout = 'tag') {
            let isClickedIn = false;
            const elem = this;
            let backup;
            elem.on('click', e => {
                isClickedIn = !isClickedIn;
                if (!isClickedIn) {
                    if (!clickout || typeof clickout == "string") {
                        backup = elem.backup(clickout);
                    }
                    clickin(e);
                } else {
                    if (!clickout || typeof clickout == "string") {
                        elem.config(backup);
                    } else {
                        clickout(e);
                    }
                }
            });
            return this;
        },

        focus(focusin, focusout = 'tag') {
            const elem = this;
            let backup;
            this.on('focusin', e => {
                if (!focusout || typeof focusout == "string") {
                    //make backup
                    backup = elem.backup(focusout);
                }
                focusin(e);
            });
            this.on('focusout', e => {
                if (!focusout || typeof focusout == "string") {
                    //restore from backup
                    elem.config(backup);
                } else {
                    focusout(e);
                }
            });
        },
    },
    backup: { //stop: backup modes
        tag: ['tagName', 'className', 'style.cssText'],
        tagFull: ['tagName', 'attributes'],
    },
    methods: [
        elem => {
            elem.style.few = function (fewStylesObject) {
                for (let prop in fewStylesObject) {
                    elem.style[prop] = fewStylesObject[prop];
                }
                return elem;
            };
        },
    ],
    frame: { //stop: frame start
        destruct(to) {
            let toCopy = JSON.parse(JSON.stringify(to));
            to = this;
            let i = 0;
            for (let prop in toCopy) {
                let name = prop;
                if (name.endsWith("$$")) {
                    let j = 0;
                    let nowChild = to.firstchild;
                    let prevChild;
                    while (nowChild) {
                        name = prop.slice(0, -2) + j;
                        to[name] = nowChild.destruct(toCopy[prop]);
                        j++;
                        nowChild = nowChild.next();
                    }
                } else {
                    to[prop] = to.firstchild.next(i).destruct(toCopy[prop]);
                }
                i++;
            }
            return to;
        },

        to(parent) {
            parent.appendChild(this);
            return this;
        },

        class(...classes) {
            this.classList.add(...classes);
            return this;
        },

        unclass(...classes) {
            this.classList.remove(...classes);
            return this;
        },

        hasclass(...classes) {
            for (let i = 0; i < classes.length; i++) {
                if (!this.classList.contains(classes[i])) return false;
            }
            return true;
        },

        hasanyclass(...classes) { //test!
            for (let i = 0; i < classes.length; i++) {
                if (this.classList.contains(classes[i])) return true;
            }
            return false;
        },

        attr(attribute, value) {
            let attributes = attribute;
            if (typeof attribute == "string") {
                if (value !== undefined) {
                    this.setAttribute(attribute, value);
                    return this;
                } else {
                    return this.getAttribute(attribute);
                }
            } else if (typeof attributes == "object" &&
                Object.getPrototypeOf(attributes).constructor.name == "Object") {
                for (let attr in attributes) {
                    this.setAttribute(attr, attributes[attr]);
                }
                return this;
            }
        },

        textto(text) {
            this.textContent = text;
            return this;
        },

        htmlto(html) {
            this.innerHTML = html;
            return this;
        },

        parent(level = 1) {
            let currentParent = this;
            for (let i = 0; i < level; i++) {
                currentParent = currentParent.parentElement;
            }
            let parent = currentParent;
            sel(parent);
            return parent;
        },

        next(level = 1) {
            if (typeof level == "number") {
                if (level === 0 || level < 0) return this;

                let currentNextElement = this;
                for (let i = 0; i < level; i++) {
                    currentNextElement = currentNextElement.nextElementSibling;
                }
                if (currentNextElement)
                    sel(currentNextElement);
                return currentNextElement;
            } else if (typeof level == "string") {
                const selector = level;
                const childrenArray = Array.from(this.parent().children);
                const selfChildIndex = childrenArray.indexOf(this);
                const possibleTargets = this.parent().sela(selector);
                for (let i = 0; i < possibleTargets.length; i++) {
                    const currTarget = possibleTargets[i];
                    if (childrenArray.indexOf(currTarget) > selfChildIndex) return currTarget;
                }
                return null;
            } else throw new Error('Unexpected argument type for .next method. Use number or string as argument.');
        },

        prev(level = 1) {
            if (typeof level == "number") {
                if (level === 0 || level < 0) return this;

                let currentPrevElement = this;
                for (let i = 0; i < level; i++) {
                    currentPrevElement = currentPrevElement.previousElementSibling;
                }
                if (currentPrevElement)
                    sel(currentPrevElement);
                return currentPrevElement;
            } else if (typeof level == "string") {
                const selector = level;
                const childrenArray = Array.from(this.parent().children);
                const selfChildIndex = childrenArray.indexOf(this);
                const possibleTargets = this.parent().sela(selector);
                for (let i = 0; i < possibleTargets.length; i++) {
                    const currTarget = possibleTargets[i];
                    if (childrenArray.indexOf(currTarget) < selfChildIndex) return currTarget;
                }
                return null;
            } else throw new Error('Unexpected argument type for .prev method. Use number or string as argument.');
        },

        firstchild(node) {
            if (node) {
                this.prepend(node);
                return sel(node);
            } else {
                return sel(this.firstElementChild);
            }
        },

        lastchild(node) {
            if (node) {
                this.append(node);
                return sel(node);
            } else {
                return sel(this.lastElementChild);
            };
        },

        push(child, config) {
            const elem = this;
            return create(child, config).to(elem);
        },

        insert: {
            after(child, config) {
                let elem = sel(this);
                return elem.parentElement.insertBefore(
                    typeof child == "string" ? create(child, config) : sel(child).config(config),
                    elem.next()
                );
            },
            before(child, config) {
                let elem = sel(this);
                return elem.parentElement.insertBefore(
                    typeof child == "string" ? create(child, config) : sel(child).config(config),
                    elem
                );
            }
        },


        clone(isDeepCloning = true) {
            if (isDeepCloning) {
                let clone = this.cloneNode(true);
                Object.assign(clone, this);
                for (const prop in this) {
                    if (clone.hasOwnProperty(prop)) {
                        const value = this[prop];
                        if (value instanceof Object && Object.getPrototypeOf(value) == undefined) {
                            Object.assign(clone[prop], this[prop]);
                        }
                    }
                }
                return clone;
            } else {
                let clone = this.cloneNode(true);
                return clone;
            }
        },

        /**
         * selects first element in current by selector
         * @param {string} selector - CSS selector of element
         * @returns {HTMLElement} selected element
         */
        select(selector) { return select(selector, this); },
        /**
         * selects elements in current by selector
         * @param {string} selector - CSS selector of elements
         * @returns {NodeList} selected elements
         */
        selectAll(selector) { return selectAll(selector, this); },

        /**
         * selects first element in current by selector
         * @param {string} selector - CSS selector of element
         * @returns {HTMLElement} selected element
         */
        sel(selector) { return sel(selector, this); },
        /**
         * selects elements in current by selector
         * @param {string} selector - CSS selector of elements
         * @returns {NodeList} selected elements
         */
        sela(selector) { return sela(selector, this); },


        events: {},

        on(eventTypes, handler) { //stop: .on
            let elem = this;
            let eventTypesArray = eventTypes.split(" ");

            if (!elem.events.remove) {
                elem.events.remove = function () {
                    for (let child in this) {
                        this[child].remove();
                    }
                };
                //make enumerable
                Object.defineProperty(elem.events, 'remove', { enumerable: false });
            }

            for (let i = 0; i < eventTypesArray.length; i++) {
                let eName = eventTypesArray[i].trim(); //eventName

                if (creon.onspecial[eName]) {
                    //if is special (e.g. hover) then call this special function
                    //inside some proccesing and call to necessary event types
                    //e.g. hover >> mouseenter, mouseleave
                    let args = Array.from(arguments);
                    args.shift();
                    creon.onspecial[eName].call(this, ...args);
                    return this;
                }

                this.addEventListener(eName, handler);
                if (!this.events[eName]) {
                    //add this type of event to events array
                    this.events[eName] = [];

                    //add removeEventListener of type shortcut
                    this.events[eName].remove = function () {
                        for (let child in elem.events[eName]) {
                            elem.events[eName][child].remove();
                        }
                        delete elem.events[eName];
                    };

                    //make remove method enumerable
                    Object.defineProperty(this.events[eName], "remove", { enumerable: false });
                }

                //push handler and get his index
                let index = this.events[eName].push(handler) - 1;

                //link to pushed handler
                let currEvent = this.events[eName][index];

                //back link to parent object node (event type)
                currEvent.eventtype = {};
                currEvent.eventtype.link = this.events[eName];
                //name of event (e.g. "click")
                currEvent.eventtype.name = eName;

                //removeEventListener shortcut
                currEvent.remove = () => {
                    delete this.events[eName].splice(index, 1);
                    elem.removeEventListener(currEvent.eventtype.name, currEvent);
                };
            }

            //on end
            return this;
        },

        config(configObject, printFullNameOfShortPropName) { //stop: config
            function getFullPropNameByRegex(elem, propName) {
                if (elem[propName]) {
                    printFullNameOfShortPropName ? console.log(propName + ' >> ' + propName) : null;
                    return propName;
                }

                const regexBegin = new RegExp(`^${propName}`);
                const regexHasAnotherParts = new RegExp('^' + propName.split('').join('.*'));

                for (let prop in elem) {
                    if (prop.match(regexBegin)) {
                        printFullNameOfShortPropName ? console.log(propName + ' >> ' + prop) : null;
                        return prop;
                    }
                }

                for (let prop in elem) {
                    if (prop.match(regexHasAnotherParts)) {
                        printFullNameOfShortPropName ? console.log(propName + ' >> ' + prop) : null;
                        return prop;
                    }
                }

                printFullNameOfShortPropName ? console.log(propName + ' >> ' + propName) : null;
                return propName;
            }

            function configSingle(elem, prop, value) {
                if (value._isCreonDontTouch) {
                    elem[prop] = value.data;
                } else if (typeof value == "object" && Object.getPrototypeOf(value).constructor.name == "Object") {
                    //is object need to be proccessed
                    //e.g. dataset: { attr1: val1, attr2: val2 }
                    elem[prop] = {};
                    Object.assign(elem[prop], value);
                } else if (Array.isArray(value) && Object.keys(creon.frame).find(val => val == prop)) {
                    elem[prop](...value);
                } else
                    elem[prop] = value;
            }

            for (let prop in configObject) {
                const value = configObject[prop];
                prop = getFullPropNameByRegex(this, prop);

                //[DATA]
                //this == elem
                //configObject: {
                //    ...
                //    prop: value
                //    ...
                //}

                if (prop == "style") {
                    if (typeof value == "string") {
                        this.style = value;
                    } else {
                        this.style.few(value);
                    }
                }
                else if (prop == "attributes") {
                    for (let attr in value) {
                        this.attr(attr, value[attr]);
                    }
                } else if (prop == "on") {
                    function proccessArray(elem, value, type) {
                        let eachElementIsArray = true;
                        for (let i = 0; i < value.length; i++) {
                            if (!Array.isArray(value[i])) {
                                eachElementIsArray = false;
                                break;
                            }
                        }
                        if (eachElementIsArray) {
                            // args in arr in arr, e.g.
                            // on: [
                            //     ['hover', e => ..., e => ...],
                            //     ['click', e => ...]
                            // ]
                            value.forEach(args => {
                                if (type) args.unshift(type);
                                elem.on(...args);
                            });
                        } else {
                            if (!Array.isArray(value)) value = [value];
                            if (type) value.unshift(type);
                            elem.on(...value); //e.g. on: ['hover', e => ..., e => ...], //args in arr
                        }
                    }

                    if (Array.isArray(value) && value.length > 0) {
                        proccessArray(this, value); //can be method runner or array
                    } else if (typeof value == "object") {
                        if (value._isCreonDontTouch) continue;
                        //else if usual object
                        for (const eventType in value) {
                            const eventHandler = value[eventType];
                            if (Array.isArray(eventHandler) && eventHandler.length > 0) {
                                const eventHandlersArray = eventHandler;
                                proccessArray(this, eventHandlersArray, eventType);
                            }
                        }
                    } else throw new Error('Extpected: Element.config({ ..., on: (Array | Object), ...}). But recieved ' + typeof value + '. Use Array or Object instead.');
                } else {
                    //if (!style && !on)
                    configSingle(this, prop, value);
                }
            }
            return this;
        },

        backup(mode = 'tag') { //stop: backup
            let backup = {};
            let propsToBackup;

            if (typeof mode == "string") {
                if (mode == 'all') {
                    propsToBackup = Object.keys(this);
                } else {
                    if (creon.backup[mode]) propsToBackup = creon.backup[mode];
                    else propsToBackup = [mode];
                }
            } else if (Array.isArray(mode)) {
                propsToBackup = mode;
            } else throw new Error('Invalid arguments for .backup(). Try (Array | string)');

            function copyObjectProp(fromContext, propName, toContext) {

                function getsetMaster(obj, propName) {
                    const propSplit = propName.split('.');
                    propName = propSplit.pop(); //remove last and make get by hands
                    let curr = obj;
                    propSplit.forEach(prop => {
                        if (!curr[prop]) curr[prop] = {}; //because not last
                        curr = curr[prop];
                    });
                    return {
                        get _() {
                            return curr[propName];
                        },
                        set _(value) {
                            return curr[propName] = value;
                        }
                    };
                }

                const from = getsetMaster(fromContext, propName);
                const to = getsetMaster(toContext, propName);

                if (typeof from._ == "object") {

                    if (typeof from._ == "object" && Object.getPrototypeOf(from._).constructor.name == 'Object') {
                        to._ = Object.assign({}, from._);
                    } else { //is class instance
                        to._ = {};
                        for (const attrId in from._) {
                            if (from._.hasOwnProperty(attrId) && typeof from._[attrId] == "object") {
                                const attrFrom = getsetMaster(from._, attrId);

                                //todo: add copy methods for another classes
                                //method for attributes
                                if (attrFrom._.nodeName) {
                                    const attrTo = getsetMaster(to._, attrFrom._.nodeName);
                                    attrTo._ = attrFrom._.nodeValue;
                                }
                            }
                        }
                    }
                } else {
                    to._ = from._;
                }
            }

            propsToBackup.forEach(prop => {
                copyObjectProp(this, prop, backup);
            });
            return backup;
        }
    },
};

/**
 * @function range
 * @param {number} start 
 * @param {number} stop 
 * @param {number} step 
 * @variation 3
 */
/**
 * @function range
 * @param {number} start
 * @param {number} stop
 * @variation 2
 */
/**
 * @function range
 * @param {number} start
 * @variation 1
 */
function range(start, stop, step) {
    let result;
    if (!stop) {
        result = {
            from: 0, to: start, [Symbol.iterator]() { return this; }, next() {
                if (this.current === undefined) {
                    this.current = this.from;
                }
                if (this.current < this.to) {
                    return {
                        done: false,
                        value: this.current++
                    };
                } else {
                    delete this.current;
                    return {
                        done: true
                    };
                }
            }
        };
    } else if (!step) {
        if (stop < start) {
            let temp = start;
            start = stop;
            stop = temp;
        }
        result = {
            from: start, to: stop, [Symbol.iterator]() { return this; }, next() {
                if (this.current === undefined) {
                    this.current = this.from;
                }
                if (this.current < this.to) {
                    return {
                        done: false,
                        value: this.current++
                    };
                } else {
                    delete this.current;
                    return {
                        done: true
                    };
                }
            }
        };
    } else {
        if (stop < start) {
            let temp = start;
            start = stop;
            stop = temp;
        }
        result = {
            from: start, to: stop, [Symbol.iterator]() { return this; }, next() {
                if (this.current === undefined) {
                    this.current = this.from;
                }
                if (this.current < this.to) {
                    let value = this.current;
                    this.current += step;
                    return {
                        done: false,
                        value: value,
                    };
                } else {
                    delete this.current;
                    return {
                        done: true,
                    };
                }
            }
        };
    }

    return Array.from(result);
};

range;

let keycode = {
    a: 65,
    b: 66,
    c: 67,
    d: 68,
    e: 69,
    f: 70,
    g: 71,
    h: 72,
    i: 73,
    j: 74,
    k: 75,
    l: 76,
    m: 77,
    n: 78,
    o: 79,
    p: 80,
    q: 81,
    r: 82,
    s: 83,
    t: 84,
    u: 85,
    v: 86,
    w: 87,
    x: 88,
    y: 89,
    z: 90,

    backspace: 8,
    tab: 9,
    clear: 12,
    enter: 13,
    shift: 16,
    ctrl: 17,
    alt: 18,
    pause: 19,
    capsLock: 20,
    ecsape: 27,
    space: 32,
    end: 35,
    home: 36,
    arrow: {
        left: 37,
        up: 38,
        right: 39,
        down: 40
    },
    select: 41,
    print: 42,
    execute: 43,
    printScreen: 44,
    insert: 45,
    help: 47,
    delete: 46,
    colon: 58,
    semicolon: 59,
    less: 60,
    windows: {
        left: 91,
        right: 92
    },
    command: {
        left: 91,
        right: 92
    },
    sleep: 95,
    numpad0: 96,
    numpad1: 97,
    numpad2: 98,
    numpad3: 99,
    numpad4: 100,
    numpad5: 101,
    numpad6: 102,
    numpad7: 103,
    numpad8: 104,
    numpad9: 105,
    multiply: 106,
    add: 107,
    subtract: 109,
    decimalPoint: 110,
    divide: 111,
    numLock: 144,
    scrollLock: 145,
    caret: 160,
    exclamationMark: 161,
    sharp: 163,
    dollar: 164,
    page: {
        backward: 166,
        forward: 167,
        refresh: 168,
        up: 33,
        down: 34
    },
    email: 180,
    equal: 187,
    comma: 188,
    dash: 189,
    period: 190,
    slash: 191,
    backquote: 192,
    bracketLeft: 219,
    backslash: 220,
    bracketRight: 221,
    singleQuote: 222,

    digit0: 48,
    digit1: 49,
    digit2: 50,
    digit3: 51,
    digit4: 52,
    digit5: 53,
    digit6: 54,
    digit7: 55,
    digit8: 56,
    digit9: 57,

    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    F13: 124,
    F14: 125,
    F15: 126,
    F16: 127,
    F17: 128,
    F18: 129,
    F19: 130,
    F20: 131,
    F21: 132,
    F22: 133,
    F23: 134,
    F24: 135
};