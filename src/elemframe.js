const ElementFrame = {

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

    hasclass(className) {
        return this.classList.contains(className);
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
        frame(parent);
        return parent;
    },

    next(level = 1) {
        if (level === 0 || level < 0) return this;

        let currentNextElement = this;
        for (let i = 0; i < level; i++) {
            currentNextElement = currentNextElement.nextElementSibling;
        }
        if (currentNextElement)
            frame(currentNextElement);
        return currentNextElement;
    },

    prev(level = 1) {
        if (level === 0 || level < 0) return this;

        let currentPrevElement = this;
        for (let i = 0; i < level; i++) {
            currentPrevElement = currentPrevElement.previousElementSibling;
        }
        if (currentPrevElement)
            frame(currentPrevElement);
        return currentPrevElement;
    },

    get firstchild() {
        return sel(this.firstElementChild);
    },
    set firstchild(node) {
        return sel(this.prepend(node));
    },

    get lastchild() {
        return sel(this.lastElementChild);
    },
    set lastchild(node) {
        return sel(this.append(node));
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
    //TODO: tagAutocomplete(elem, "push"); make with Proxy

    insert: {
        //TODO: make tagAutocomplete with Proxy
        after(child) {
            let elem = this;
            return this.parentElement.insertBefore(create(child), elem.next());
        },
        before(child) {
            let elem = this;
            return this.parentElement.insertBefore(create(child), elem);
        }
    },


    clone(isDeepCloning = true) {
        return this.cloneNode(isDeepCloning);
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
};

function frame(elem) {
    Object.assign(elem, ElementFrame);
    elem.style.few = function (fewStylesObject) {
        for (let prop in fewStylesObject) {
            this.style[prop] = fewStylesObject[prop];
        }
        return this;
    };
}