function select(selector, parent = undefined) { //, classes, parent, id, name

    function frame(elem) { //stop: frame function

        if (elem.backup && elem.events && elem.config && elem.insert && elem.push && elem.class) return;

        elem._creoned = true;

        Object.assign(elem, { ...creon.frame });
        elem.insert = Object.assign({}, creon.frame.insert);
        elem.events = Object.assign({}, creon.frame.events);
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

        elem.style.few = function (fewStylesObject) {
            for (let prop in fewStylesObject) {
                elem.style[prop] = fewStylesObject[prop];
            }
            return elem;
        };

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

    elems.each = function (eachProccesingFunction) {
        for (let i = 0; i < elems.length; i++) {
            const el = elems[i];
            eachProccesingFunction.bind(el)(el, i, elems);
        }
    };
    return elems;
}


function create(tag, numberOfElements) {
    if (numberOfElements) {
        let elems = [];
        for (let i = 0; i < numberOfElements; i++) {
            let elem = document.createElement(tag);
            elems.push(select(elem));
        }
        return elems;
    }
    else {
        let elem = document.createElement(tag);
        select(elem);
        return elem;
    }
}
(function () {
    let allTags = [
        "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "menuitem", "meta", "param", "source", "track", "wbr", "script", "style", "textarea", "title", "a", "abbr", "address", "area", "map", "article", "aside", "audio", "b", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "table", "cite", "code", "col", "colgroup", "data", "datalist", "input", "option", "dd", "dt", "del", "details", "summary", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "figure", "footer", "form", "h1-h6", "head", "title", "meta", "script", "link", "style", "header", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "input", "legend", "fieldset", "li", "link", "main", "main", "map", "area", "mark", "meta", "head", "meta", "meter", "nav", "noscript", "object", "param", "ol", "optgroup", "option", "option", "select", "optgroup", "datalist", "output", "p", "param", "object", "picture", "img", "source", "pre", "progress", "q", "ruby", "rb", "rt", "ruby", "rtc", "rp", "s", "samp", "script", "section", "select", "option", "small", "source", "picture", "video", "audio", "span", "strong", "style", "sub", "summary", "details", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "audio", "video", "u", "ul", "var", "video", "wbr"
    ];
    for (let i = 0, tagName; tagName = allTags[i]; i++) {
        create[tagName] = className => className ? create(tagName).class(className) : create(tagName);
    }
}());



function jeson(data, separator = "<::>") {
    let jesoner = {};

    jesoner.get = get;
    jesoner.remove = remove;

    function remove(targetString) {
        let way = targetString.split(separator);
        let now = data;
        for (let i = 0; i < way.length - 1; i++) {
            if (now[way[i]])
                now = now[way[i]];
            else return null;
        }
        delete now[way[way.length - 1]];
    }
    function get(targetString) {
        let way = targetString.split(separator);
        let now = data;
        for (let i = 0; i < way.length; i++) {
            if (now[way[i]])
                now = now[way[i]];
            else return null;
        }
        now.get = get;
        return now;
    }

    return jesoner;
}

let sel = select;
let sela = selectAll;
let cre = create;

const creon = { //stop: creon start
    run(...args) {
        return {
            _isCreonRunner: true,
            args: args,
        };
    },
    sacred(data) {
        return {
            _isCreonDontTouch: true,
            data: data,
        };
    },
    allTags: [
        "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "menuitem", "meta", "param", "source", "track", "wbr", "script", "style", "textarea", "title", "a", "abbr", "address", "area", "map", "article", "aside", "audio", "b", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "table", "cite", "code", "col", "colgroup", "data", "datalist", "input", "option", "dd", "dt", "del", "details", "summary", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "figure", "footer", "form", "h1-h6", "head", "title", "meta", "script", "link", "style", "header", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "input", "legend", "fieldset", "li", "link", "main", "main", "map", "area", "mark", "meta", "head", "meta", "meter", "nav", "noscript", "object", "param", "ol", "optgroup", "option", "option", "select", "optgroup", "datalist", "output", "p", "param", "object", "picture", "img", "source", "pre", "progress", "q", "ruby", "rb", "rt", "ruby", "rtc", "rp", "s", "samp", "script", "section", "select", "option", "small", "source", "picture", "video", "audio", "span", "strong", "style", "sub", "summary", "details", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "audio", "video", "u", "ul", "var", "video", "wbr"
    ],
    onspecial: { //stop: onspecial
        hover(hoverin, hoverout = 'tag', name = "") {
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

        clickToggle(clickin, clickout) {
            let isClickedIn = false;
            this.on('click', e => {
                e.isClickedIn = isClickedIn;
                if (!isClickedIn) {
                    if (!clickout) {
                        //make backup of element
                    }
                    clickin(e);
                } else {
                    if (!clickout) {
                        //restore element from backup
                    } else {
                        clickout(e);
                    }
                }
            });
            return elem;
        },

        focus(focusin, focusout, name = '') {
            this.on('focusin', e => {
                if (!focusout) {
                    //make backup
                }
                focusin(e);
            });
            this.on('focusout', e => {
                if (!focusout) {
                    //restore from backup
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
            for (let i = 0; i < classes.length; i++) {
                this.classList.add(classes[i]);
            }
            return this;
        },

        unclass(...classes) {
            for (let i = 0; i < classes.length; i++) {
                this.classList.remove(classes[i]);
            }
            return this;
        },

        hasclass(...classes) {
            for (let i = 0; i < classes.length; i++) {
                if (!this.classList.contains(classes[i])) return false;
            }
            return true;
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
            } else if (typeof attributes == "object") {
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
            if (level === 0 || level < 0) return this;

            let currentNextElement = this;
            for (let i = 0; i < level; i++) {
                currentNextElement = currentNextElement.nextElementSibling;
            }
            if (currentNextElement)
                sel(currentNextElement);
            return currentNextElement;
        },

        prev(level = 1) {
            if (level === 0 || level < 0) return this;

            let currentPrevElement = this;
            for (let i = 0; i < level; i++) {
                currentPrevElement = currentPrevElement.previousElementSibling;
            }
            if (currentPrevElement)
                sel(currentPrevElement);
            return currentPrevElement;
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

        push(child, numberOfChilds) {
            const elem = this;
            if (numberOfChilds) {
                let newchildren = create(child, numberOfChilds);
                newchildren.forEach(childelem => childelem.to(elem));
                return newchildren;
            }
            else {
                return create(child).to(elem);
            }
        },

        insert: {
            after(child) {
                let elem = sel(this);
                return elem.parentElement.insertBefore(
                    typeof child == "string" ? create(child) : sel(child),
                    elem.next()
                );
            },
            before(child) {
                let elem = sel(this);
                return elem.parentElement.insertBefore(
                    typeof child == "string" ? create(child) : sel(child),
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

        lettering() {
            let text = this.textContent.trim().split("");
            let newHTML = text.map(letter => '<span>' + letter + '</span>');
            this.htmlto(newHTML.join('\n'));
            return this.children;
        },

        select(selector) { return select(selector, this); },
        selectAll(selector) { return selectAll(selector, this); },

        sel: this.select,
        sela: this.selectAll,


        events: {
        },

        on(eventTypes, handler, name = "") { //stop: .on
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

                //if no name defined for event
                if (name == "") {
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

                } else { //if name for event is defined

                    //get link to event place
                    let currEvent = this.events[eName][name];

                    //put handler to this place
                    currEvent = handler;

                    //make back link to event type
                    currEvent.eventtype = {};
                    currEvent.eventtype.link = this.events[eName];
                    currEvent.eventtype.name = eName;

                    //removeEventListener shortcut
                    currEvent.remove = () => {
                        this.events[eName].splice(index, 1);
                        elem.removeEventListener(currEvent.eventtype.name, currEvent);
                    };
                }
            }

            //on end
            return this;
        },

        config(configObject) { //stop: config
            function configSingle(elem, prop, value) {
                if (value._isCreonRunner) {
                    elem[prop](...value.args);
                } else if (value._isCreonDontTouch) {
                    elem[prop] = value.data;
                } else if (typeof value == "object" && Object.getPrototypeOf(value).constructor.name == "Object") {
                    //is object need to be proccessed
                    //e.g. dataset: { attr1: val1, attr2: val2 }
                    const point = elem[prop];
                    Object.assign(point, value);
                } else if (Array.isArray(value) && Object.keys(creon.frame).find(val => val == prop)) {
                    elem[prop](...value);
                } else
                    elem[prop] = value;
            }

            for (const prop in configObject) {
                if (configObject.hasOwnProperty(prop)) {
                    const value = configObject[prop];

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
                    } else if (prop == "on") { //TEST!
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

                        if (Array.isArray(value) && value.length > 0) { //TEST!
                            proccessArray(this, value);
                        } else if (typeof value == "object") { //is usual object test!
                            if (value._isCreonDontTouch) continue;
                            if (value._isCreonRunner) {
                                //1.
                                // on: [
                                //     ['hover', e => ..., e => ...],
                                //     ['click', e => ...]
                                // ]
                                //2.
                                // on: ['hover', e => ..., e => ...],
                                this.on(...value.args);
                            } else {
                                //else if usual object
                                for (const eventType in value) {
                                    const eventHandler = value[eventType];
                                    if (Array.isArray(eventHandler) && eventHandler.length > 0) {
                                        const eventHandlersArray = eventHandler;
                                        proccessArray(this, eventHandlersArray, eventType);
                                    }
                                }
                            }
                        } else throw new Error('Extpected: Element.config({ ..., on: (Array | Object), ...}). But recieved ' + typeof value + '. Use Array or Object instead.');
                    } else {
                        //if (!style && !on)
                        configSingle(this, prop, value);
                    }
                }
            }
            return this;
        },

        //todo: make mode:array recieve
        backup(mode = 'tag') { //stop: backup
            let backup = {};
            let propsToBackup;

            if (mode == 'all') {
                propsToBackup = Object.keys(this);
            } else {
                propsToBackup = creon.backup[mode];
            }

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

                                //TODO: add copy methods for another classes
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


function range(start, stop, step) {
    if (!stop) {
        return {
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
        return {
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
        return {
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
};

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