Object.isEquivalent = function (a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
};

Array.isEquivalent = function (a, b) {
    if (a.length != b.length)
        return false;
    for (var i = 0; i < a.length; i++)
        if (a[i] != b[i]) return false;
    return true;
};

describe('Creon Tests', () => {
    let block = sel('#block');
    let blockParent = sel('#blockParent');
    blockParent.push('div', 10);

    function refresh() {
        block = sel('#block');
        blockParent = sel('#blockParent');
    }

    const tests = {
        '.style.few': {
            mode: 'equal',
            'border, width, height': [
                sel('#block').style.few({
                    border: '1px solid black',
                    width: '5em',
                    height: '5em'
                }).style.cssText,
                'border: 1px solid black; width: 5em; height: 5em;',
                'equal'
            ],
        },
        '.to': {
            '#block.to(#blockParent)': [
                function () {
                    refresh();

                    block.to(blockParent);

                    block = block.clone();
                    let blockParentLoc = document.createElement('div');
                    sel(blockParentLoc).push('div', 10);
                    blockParentLoc.append(block);

                    return blockParent.children.length ==
                        blockParentLoc.children.length &&

                        blockParent.firstElementChild.tagName ==
                        blockParentLoc.firstElementChild.tagName &&

                        blockParent.firstElementChild.id ==
                        blockParentLoc.firstElementChild.id;
                }(), true
            ]
        },
        '.class': {
            'signle': [
                function () {
                    refresh();
                    block.class('class1');
                    return block.className;
                }(), 'class1'
            ],
            'multiple': [
                function () {
                    block.class('class2', 'class3');
                    return block.className;
                }(), 'class1 class2 class3'
            ]
        },
        '.unclass': {
            'signle': [
                function () {
                    refresh();
                    block.unclass('class1');
                    return block.className;
                }(), 'class2 class3'
            ],
            'multiple': [
                function () {
                    block.unclass('class2', 'class3');
                    return block.className;
                }(), ''
            ]
        },
        '.hasclass': {
            'single': {
                'yes': [
                    function () {
                        refresh();
                        block.class('hello');
                        return true;
                    }(), block.hasclass('hello')
                ],
                'no': [
                    function () {
                        refresh();
                        return false;
                    }(), block.hasclass('donthavethis')
                ],
            },
            'few': {
                'yes': [
                    function () {
                        refresh();
                        block.class('few-hello1', 'few-hello2', 'few-hello3');
                        return true;
                    }(), block.hasclass('few-hello1', 'few-hello2', 'few-hello3')
                ],
                'haven\'t one from list': [
                    function () {
                        refresh();
                        return false;
                    }(), block.hasclass('hello', 'donthavethis', 'few-hello1')
                ],
            }
        },
        '.attr': {
            'get': [
                function () {
                    refresh();
                    block.setAttribute('attr0', 'val0');
                    return block.attr('attr0');
                }(), 'val0'
            ],
            'set': [
                function () {
                    refresh();
                    block.attr('attr1', 'val1');
                    return block.getAttribute('attr1');
                }(), 'val1'
            ],
            'autocomplete': {
                'get': [
                    function () {
                        refresh();
                        block.setAttribute('attr2', 'val2');
                        return 'val2';
                    }(), block.attr.attr2()
                ],
                'set': [
                    function () {
                        refresh();
                        block.attr.attr3('val3');
                        return 'val3';
                    }(), block.getAttribute('attr3')
                ],
            },
        },
        '.textto': {
            'Hello, World!': [
                function () {
                    refresh();
                    block.textto('Hello, World!');
                    return block.textContent;
                }(), 'Hello, World!'
            ]
        },
        '.htmlto': {
            'fedoritiy corp.': [
                function () {
                    refresh();
                    block.htmlto('<strong>feodoritiy</strong> corp.');
                    return block.innerHTML;
                }(), '<strong>feodoritiy</strong> corp.'
            ]
        },
        '.parent': {
            'single': [
                function () {
                    refresh();
                    return block.parent();
                }(), block.parentElement
            ],
            'few': [
                function () {
                    refresh();
                    return block.parent(3);
                }(), block.parentElement.parentElement.parentElement
            ],
        },
        '.next': {
            'single': [
                function () {
                    refresh();
                    return block.next();
                }(), block.nextElementSibling
            ],
            'few': [
                function () {
                    refresh();
                    blockParent.push('div', 10);
                    return block.next(3);
                }(), block.nextElementSibling.nextElementSibling.nextElementSibling
            ],
        },
        '.prev': {
            'single': [
                function () {
                    refresh();
                    return block.prev();
                }(), block.previousElementSibling
            ],
            'few': [
                function () {
                    refresh();
                    return block.prev(3);
                }(), block.previousElementSibling.previousElementSibling.previousElementSibling
            ],
        },
        '.firstchild': {
            'function get': [
                function () {
                    refresh();
                    return block.firstchild();
                }(), block.firstElementChild
            ],
            'function set': [
                function () {
                    refresh();
                    let newBlock = cre.div();
                    block.firstchild(newBlock);
                    return newBlock;
                }(), block.firstElementChild
            ],
        },
        '.lastchild': {
            'function get': [
                function () {
                    refresh();
                    return block.lastchild();
                }(), block.lastElementChild
            ],
            'function set': [
                function () {
                    refresh();
                    let newBlock = cre.div();
                    block.lastchild(newBlock);
                    return newBlock;
                }(), block.lastElementChild
            ],
        },
        '.push': {
            'single': [
                function () {
                    refresh();
                    block.push('p');
                    return block.lastchild().tagName == 'P';
                }(), true
            ],
            'few': [
                function () {
                    refresh();
                    block.push('u', 3);
                    return block.lastchild().tagName == 'U' &&
                        block.lastchild().prev().tagName == 'U' &&
                        block.lastchild().prev(2).tagName == 'U';
                }(), true
            ],
            'autocomplete': [
                function () {
                    block.push.input();
                    return block.lastchild().tagName;
                }(), 'INPUT'
            ]
        },
        '.insert': {
            '.before': {
                'tagName': [
                    function () {
                        refresh();
                        block.insert.before('input').class('tagName');
                        return block.prev().tagName == 'INPUT' && block.prev().hasclass('tagName');
                    }(), true
                ],
                'HTMLElement': [
                    function () {
                        refresh();
                        block.insert.before(cre('input').class('HTMLElement'));
                        return block.prev().tagName == 'INPUT' && block.prev().hasclass('HTMLElement');
                    }(), true
                ],
                'autocomplete': [
                    function () {
                        refresh();
                        block.insert.before.input().class('autocomplete');
                        return block.prev().tagName == 'INPUT' && block.prev().hasclass('autocomplete');
                    }(), true
                ]
            },
            '.after': {
                'tagName': [
                    function () {
                        refresh();
                        block.insert.after('input').class('tagName');
                        return block.next().tagName == 'INPUT' && block.next().hasclass('tagName');
                    }(), true
                ],
                'HTMLElement': [
                    function () {
                        refresh();
                        block.insert.after(cre('input').class('HTMLElement'));
                        return block.next().tagName == 'INPUT' && block.next().hasclass('HTMLElement');
                    }(), true
                ],
                'autocomplete': [
                    function () {
                        refresh();
                        block.insert.after.input().class('autocomplete');
                        return block.next().tagName == 'INPUT' && block.next().hasclass('autocomplete');
                    }(), true
                ]
            },
        },
        '.clone': {
            'deep == true': {
                'no args': [
                    function () {
                        refresh();
                        block.myProp = 'myProp';
                        block.myMethod = () => 'myMethod';
                        let clone = block.clone();
                        return clone.myProp == 'myProp' && clone.myMethod() == 'myMethod';
                    }(), true
                ],
                '(true)': [
                    function () {
                        refresh();
                        block.myProp = 'myProp';
                        block.myMethod = () => 'myMethod';
                        let clone = block.clone(true);
                        return clone.myProp == 'myProp' && clone.myMethod() == 'myMethod';
                    }(), true
                ]
            },
            'deep == false': {
                '(false)': [
                    function () {
                        refresh();
                        block.myProp = 'myProp';
                        block.myMethod = () => 'myMethod';
                        let clone = block.clone(false);
                        return !clone.myProp && !clone.myMethod &&
                            Object.isEquivalent(clone, block.cloneNode(true));
                    }(), true
                ]
            },
        },
        '.lettering': {
            'isOK': [
                function () {
                    refresh();
                    let text = block.push.span().textto('feo');
                    text.lettering();
                    return text.children[0].textContent == 'f' &&
                        text.children[1].textContent == 'e' &&
                        text.children[2].textContent == 'o';
                }(), true
            ]
        },
        '.select': {
            'sel': [
                function () {
                    return sel('#block');
                }(), block
            ],
            'select': [
                function () {
                    return select('#block');
                }(), block
            ],
        },
        '.selectAll': {
            'sela': [
                function () {
                    refresh();
                    let lettering = block.lastchild().sela('span > span');
                    let qsa = block.lastchild().querySelectorAll('span > span');
                    return Array.isEquivalent(lettering, qsa);
                }(), true
            ],
            'selectAll': [
                function () {
                    refresh();
                    let lettering = block.lastchild().selectAll('span > span');
                    let qsa = block.lastchild().querySelectorAll('span > span');
                    return Array.isEquivalent(lettering, qsa);
                }(), true
            ],
        },
        '.on': {
            'isOK': [
                function () {
                    refresh();
                    block.on('click', e => block.clicked = 'isOK');
                    block.dispatchEvent(new Event('click'));
                    return 'isOK';
                }(), block.clicked
            ],
            'autocomplete': [
                function () {
                    refresh();
                    block.on.click(e => e.target.isOnAutocomplete = 'OK');
                    block.dispatchEvent(new Event('click'));
                    return 'OK';
                }(), block.isOnAutocomplete
            ],
            'eventsStore': [
                function () {
                    refresh();
                    block.on('click', e => block.isEventStore = 'eventstore');
                    return block.events.click[2].toString();
                }(), "e => block.isEventStore = 'eventstore'"
            ],
        },
        '.config': {
            'js props': [
                function () {
                    refresh();
                    block.config({
                        style: 'border: 1px solid red',
                        dataset: {
                            attrFromConfig: 'config is cool',
                        },
                        myObject: creon.sacred({
                            myProp1: 'myVal1',
                        }),
                    });

                    let expected = [
                        'border: 1px solid red;',
                        'config is cool',
                        'myVal1'
                    ], result = [
                        block.style.cssText,
                        block.attr('data-attr-from-config'),
                        block.myObject.myProp1
                    ];

                    console.log();

                    return Array.isEquivalent(expected, result);
                }(), true
            ],
            'creon.run with creon methods (class: creon.run(class1, class2))': [
                function () {
                    refresh();
                    block.config({
                        htmlto: creon.run('<em>new inner html</em>'),
                        on: creon.run('click', () => 'on from config >> creon methods'),
                        attr: creon.run('attr-from-config-creon-methods', 'hohoho'),
                        class: creon.run('conf-class1', 'conf-class2', 'conf-class3'),
                        myObject: creon.sacred({
                            myProp1: 'myVal1',
                        }),
                    });

                    let expected = [
                        '<em>new inner html</em>',
                        "() => 'on from config >> creon methods'",
                        'hohoho',
                        true,
                        'myVal1'
                    ], result = [
                        block.innerHTML,
                        Array.from(block.events.click).pop(),
                        block.attr('attr-from-config-creon-methods'),
                        block.hasclass('conf-class1', 'conf-class2', 'conf-class3'),
                        block.myObject.myProp1
                    ];

                    console.log();

                    return Array.isEquivalent(expected, result);
                }(), true
            ],
            'is creon method and value is arguments array (class: [class1, class2])': [
                function () {
                    refresh();
                    block.config({
                        htmlto: ['<em>new inner html</em>'],
                        on: ['click', () => 'on from config >> creon methods'],
                        attr: ['attr-from-config-creon-methods', 'hohoho'],
                        class: ['conf-class1', 'conf-class2', 'conf-class3'],
                    });

                    let expected = [
                        '<em>new inner html</em>',
                        "() => 'on from config >> creon methods'",
                        'hohoho',
                        true,
                    ], result = [
                        block.innerHTML,
                        Array.from(block.events.click).pop(),
                        block.attr('attr-from-config-creon-methods'),
                        block.hasclass('conf-class1', 'conf-class2', 'conf-class3'),
                    ];

                    console.log();

                    return Array.isEquivalent(expected, result);
                }(), true
            ]
        },
        'range(...)': {
            'range(stop)': [
                function () {
                    let arr = [];
                    for (let i of range(3)) arr.push(i);
                    return arr[0] == 0 && arr[1] == 1 && arr[2] == 2 && arr[3] == undefined;
                }(), true
            ],
            'range(start, stop)': [
                function () {
                    let arr = [];
                    for (let i of range(1, 4)) arr.push(i);
                    return arr[0] == 1 && arr[1] == 2 && arr[2] == 3 && arr[3] == undefined;
                }(), true
            ],
            'range(start, stop, step)': {
                'correct step': [
                    function () {
                        let arr = [];
                        for (let i of range(1, 6, 2)) arr.push(i);
                        return arr[0] == 1 && arr[1] == 3 && arr[2] == 5 && arr[3] == undefined;
                    }(), true
                ],
                'uncorrect step': [
                    function () {
                        let arr = [];
                        for (let i of range(1, 6, 2)) arr.push(i);
                        console.log(arr);
                        return arr[0] == 1 && arr[1] == 3 && arr[2] == 5 && arr[3] == undefined;
                    }(), true
                ]
            },
        },
        'keycode': {
            'isOK': [!!keycode, true],
        },

        all() {
            function allRecursive(target, mode) {
                for (const prop in target) {
                    if (target.hasOwnProperty(prop) && prop != 'mode') {
                        const value = target[prop];
                        if (Array.isArray(value)) {
                            it(prop, function () {
                                console.log(value);
                                assert[value[2] || mode || 'equal'](value[0], value[1]);
                            });
                        } else {
                            //send mode if exist
                            describe(prop, () => { allRecursive(value, value.mode); });
                        }
                    }
                }
            }

            allRecursive(this);
        },
    };

    tests.all();
});