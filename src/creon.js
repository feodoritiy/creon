function select(selector, parent = undefined) { //, classes, parent, id, name

    function frame(elem) {
        Object.assign(elem, { ...creon.frame });
        elem.insert = Object.assign({}, creon.frame.insert);
        function autocomplete(context, contextProp) {
            context[contextProp] = new Proxy(context[contextProp], {
                get(target, prop, reciever) {
                    if (prop) {
                        target[prop] = function () { };
                        return new Proxy(target[prop], {
                            apply(autoTarget, autoTargetThisArg, autoTargetArgs) {
                                return target.call(elem, prop, ...autoTargetArgs);
                            }
                        });
                    }
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

        [
            { context: elem, prop: 'push' },
            { context: elem.insert, props: ['before', 'after'] },
            { context: elem, prop: 'on' },
            { context: elem, prop: 'attr' },
        ]
            .forEach(obj => {
                if (obj.prop)
                    autocomplete(obj.context, obj.prop);
                else
                    obj.props.forEach(prop => autocomplete(obj.context, prop));
            });

        elem.lastchild = new Proxy(elem.lastchild, {
            get(target) {
                return target();
            },
            set(target, prop, value) {
                target(value);
                return value;
            },
            apply(target, thisArg, args) {
                return target.call(elem, ...args);
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

const creon = {
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
    frame: {
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


        events: {},

        on(eventTypes, handler, name = "") {
            let elem = this;
            let eventTypesArray = eventTypes.split(" ");

            for (let i = 0; i < eventTypesArray.length; i++) {
                let eName = eventTypesArray[i].trim(); //eventName
                this.addEventListener(eName, handler);
                if (!this.events[eName]) {
                    //add this type of event to events array
                    this.events[eName] = [];

                    //add removeEventListener of type shortcut
                    this.events[eName].remove = function () {
                        for (let child in this.events[eName]) {
                            this.events[eName][child].remove();
                        }
                        delete this.events[eName];
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
                        elem.removeEventListener(currEvent.eventtype.name, currEvent);
                    };
                }
            }

            //on end
            return this;
        },

        //TODO: make on.hover, ...,  as new Proxy(target, handler) for any prop
        // this.on.hover = function (hoverin, hoverout, name = "") {
        //     if (hoverout) {
        //         this.on("mouseenter", hoverin, name).on("mouseleave", hoverout, name);
        //     }
        //     else {
        //         this.on("mouseenter", e => {
        //             if (!this.on.hover.stylesBefore)
        //                 this.on.hover.stylesBefore = this.style.cssText;
        //             hoverin(e);
        //         }, name);
        //         this.on("mouseleave", e => {
        //             if (this.on.hover.stylesBefore) {
        //                 this.style.cssText = this.on.hover.stylesBefore;
        //                 delete this.on.hover.stylesBefore;
        //             }
        //         }, name);
        //     }
        //     return this;
        // };
        // this.on.click = function (handler) {
        //     this.on("click", handler);
        //     return this;
        // };
        // this.on.focus = function (focusin, focusout) {
        //     this.on("focusin", focusin).on("focusout", focusout);
        //     return this;
        // };
        // this.on.change = function (handler) {
        //     this.on("change", handler);
        //     return this;
        // };

        config(configObject) {
            for (const prop in configObject) {
                if (configObject.hasOwnProperty(prop)) {
                    const value = configObject[prop];
                    if (value._isCreonRunner) {
                        this[prop](...value.args);
                    } else if (value._isCreonDontTouch) {
                        this[prop] = value.data;
                    } else if (typeof value == "object" && Object.getPrototypeOf(value).constructor.name == "Object") {
                        //is object need to be proccessed
                        //e.g. dataset: { attr1: val1, attr2: val2 }
                        const point = this[prop];
                        Object.assign(point, value);
                    } else if (typeof value == "object" && Object.getPrototypeOf(value).constructor.name == "Array" && Object.keys(creon.frame).find(val => val == prop)) {
                        this[prop](...value);
                    } else
                        this[prop] = value;
                }
            }
            return this;
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