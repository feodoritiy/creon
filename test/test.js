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

let wrapper;
let block;
let blockParent;
let blockTwo;

refresh();

function refresh() {
    wrapper = cre('div').class('wrapper');
    block = wrapper.push('div', { id: 'blockId' });
    blockParent = wrapper.push('div', { id: 'blockParentId' });
    blockTwo = wrapper.push('div', { id: 'blockTwoId' });
}

describe('Creon Tests', () => {
    for (let i of range(10)) blockParent.push('div');

    const tests = {
        'frame function': {
            'correct copy objects from creon.frame (insert, events)': [
                function () {
                    refresh();
                    sel(block);
                    return !(
                        block.events == creon.frame.events ||
                        block.insert == creon.frame.insert
                    );
                }(), true
            ]
        },
        'create': {
            'simple': [
                function () {
                    return document.createElement('div').toString();
                }(), cre('div').toString()
            ],
            'with config': [
                function () {
                    const elem = create('div', {
                        textContent: 'feodoritiy',
                        style: {
                            border: '1px solid red'
                        },
                        class: ['class1', 'class2']
                    });

                    const expected = [
                        'DIV',
                        'feodoritiy',
                        'border: 1px solid red;',
                        'class1 class2'
                    ], result = [
                        elem.tagName,
                        elem.textContent,
                        elem.style.cssText,
                        elem.className
                    ];
                    return Array.isEquivalent(expected, result);
                }(), true
            ],
            'autocomplete': [
                function () {
                    const block = create.div({
                        tC: 'text content'
                    });
                    return block.textContent;
                }(), 'text content'
            ]
        },
        'plugins': {
            '.style.few': {
                mode: 'equal',
                'border, width, height': [
                    wrapper.sel('#blockId').style.few({
                        border: '1px solid black',
                        width: '5em',
                        height: '5em'
                    }).style.cssText,
                    'border: 1px solid black; width: 5em; height: 5em;',
                    'equal'
                ],
            },
        },
        '.to': {
            '#block.to(#blockParent)': [
                function () {
                    refresh();

                    block.to(blockParent);

                    block = block.clone();
                    let blockParentLoc = document.createElement('div');
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
                    let target = block.push.div().push.div().push.div();
                    return target.parent(3);
                }(), block
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
                    for (let i of range(10)) blockParent.push('div');
                    return block.next(3);
                }(), block.nextElementSibling.nextElementSibling.nextElementSibling
            ],
            'by selector': [
                function () {
                    refresh();
                    blockParent.append(block);
                    for (let i of range(5)) blockParent.push('div');
                    blockParent.append(cre('span', { id: 'target' }));
                    return block.next('span#target');
                }(), block.parentElement.querySelector('span#target')
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
                    range(3).forEach(i => wrapper.push.li());
                    wrapper.append(block);
                    return block.prev(3);
                }(), block.previousElementSibling.previousElementSibling.previousElementSibling
            ],
            'by selector': [
                function () {
                    refresh();
                    blockParent.append(cre('span', { id: 'target' }));
                    for (let i of range(5)) blockParent.push('div');
                    blockParent.append(block);
                    return block.prev('span#target');
                }(), block.parentElement.querySelector('span#target')
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
                    for (let i of range(3)) block.push('u');
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
            ],
            'with config': [
                function () {
                    const elem = create('div').push('span', {
                        textContent: 'feodoritiy',
                        style: {
                            border: '1px solid red'
                        },
                        class: ['class1', 'class2']
                    });

                    const expected = [
                        'SPAN',
                        'feodoritiy',
                        'border: 1px solid red;',
                        'class1 class2'
                    ], result = [
                        elem.tagName,
                        elem.textContent,
                        elem.style.cssText,
                        elem.className
                    ];
                    return Array.isEquivalent(expected, result);
                }(), true
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
                ],
                'with config': [
                    function () {
                        const elem = create('div').push('div').insert.before('span', {
                            textContent: 'feodoritiy',
                            style: {
                                border: '1px solid red'
                            },
                            class: ['class1', 'class2']
                        });

                        const expected = [
                            'SPAN',
                            'feodoritiy',
                            'border: 1px solid red;',
                            'class1 class2',
                            'DIV'
                        ], result = [
                            elem.tagName,
                            elem.textContent,
                            elem.style.cssText,
                            elem.className,
                            elem.next().tagName
                        ];
                        return Array.isEquivalent(expected, result);
                    }(), true
                ],
                'select and config': [
                    function () {
                        const elem = create('div').push('div').insert.before(cre('span'), {
                            textContent: 'feodoritiy',
                            style: {
                                border: '1px solid red'
                            },
                            class: ['class1', 'class2']
                        });

                        const expected = [
                            'SPAN',
                            'feodoritiy',
                            'border: 1px solid red;',
                            'class1 class2',
                            'DIV'
                        ], result = [
                            elem.tagName,
                            elem.textContent,
                            elem.style.cssText,
                            elem.className,
                            elem.next().tagName
                        ];
                        return Array.isEquivalent(expected, result);
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
                ],
                'with config': [
                    function () {
                        const elem = create('div').push('div').insert.after('span', {
                            textContent: 'feodoritiy',
                            style: {
                                border: '1px solid red'
                            },
                            class: ['class1', 'class2']
                        });

                        const expected = [
                            'SPAN',
                            'feodoritiy',
                            'border: 1px solid red;',
                            'class1 class2',
                            'DIV'
                        ], result = [
                            elem.tagName,
                            elem.textContent,
                            elem.style.cssText,
                            elem.className,
                            elem.prev().tagName
                        ];
                        return Array.isEquivalent(expected, result);
                    }(), true
                ],
            },
        },
        '.clone': {
            'deep == true': {
                'no args //custom props and methods': [
                    function () {
                        refresh();
                        block.myProp = 'myProp';
                        block.myMethod = () => 'myMethod';
                        let clone = block.clone();
                        return clone.myProp == 'myProp' && clone.myMethod() == 'myMethod';
                    }(), true
                ],
                '(true) //custom props and methods': [
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
                '(false) //custom props and methods': [
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
                    refresh();
                    return wrapper.sel('#blockId');
                }(), block
            ],
            'select': [
                function () {
                    refresh();
                    return wrapper.select('#blockId');
                }(), block
            ],
        },
        '.selectAll': {
            'sela': [
                function () {
                    refresh();
                    range(3).forEach(i => block.push.span());
                    let lettering = block.sela('span');
                    let qsa = block.querySelectorAll('span');
                    return Array.isEquivalent(lettering, qsa);
                }(), true
            ],
            'selectAll': [
                function () {
                    refresh();
                    range(3).forEach(i => block.push.span());
                    let lettering = block.selectAll('span');
                    let qsa = block.querySelectorAll('span');
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
            '.events': {
                'add': [
                    function () {
                        refresh();
                        block.on('click', e => block.isEventStore = 'eventstore');
                        return block.events.click[0].toString();
                    }(), "e => block.isEventStore = 'eventstore'"
                ],
                'remove signle event': [
                    function () {
                        refresh();
                        block.on('click', e => block.isEventStore = 'eventstore');
                        block.events.click[0].remove();
                        return block.events.click[0];
                    }(), undefined
                ],
                'remove event type': [
                    function () {
                        refresh();
                        block.on('click', e => block.isEventStore = 'eventstore');
                        block.events.click.remove();
                        return block.events.click;
                    }(), undefined
                ],
                'remove all events': [
                    function () {
                        refresh();
                        block.on('click', e => block.isEventStore = 'eventstore');
                        block.events.remove();
                        return 0;
                    }(), Object.keys(block.events)
                ]
            },
            'special events': {
                'hover': {
                    '() //tag': [
                        function () {
                            blockTwo.config({
                                style: {
                                    border: '1px solid skyblue',
                                    width: '10em',
                                    height: '10em'
                                },
                                on: {
                                    hover: [
                                        e => {
                                            console.log('hoverin');
                                            e.target.style.borderColor = 'red';
                                        },
                                    ]
                                }
                            });
                            const expected = [], result = [];

                            blockTwo.dispatchEvent(new Event('mouseenter'));
                            blockTwo.offsetWidth;

                            expected.push('border: 1px solid red; width: 10em; height: 10em;');
                            result.push(blockTwo.style.cssText);

                            blockTwo.offsetWidth;
                            blockTwo.dispatchEvent(new Event('mouseleave'));
                            blockTwo.offsetWidth;

                            expected.push('border: 1px solid skyblue; width: 10em; height: 10em;');
                            result.push(blockTwo.style.cssText);

                            blockTwo.events.remove();

                            return Array.isEquivalent(expected, result);
                        }(), true
                    ],
                    'tagFull': [
                        function () {
                            blockTwo.config({
                                style: {
                                    border: '1px solid skyblue',
                                    width: '10em',
                                    height: '10em'
                                },
                                on: {
                                    hover: [
                                        e => {
                                            console.log('hoverin');
                                            e.target.style.borderColor = 'red';
                                        }, 'tagFull'
                                    ]
                                }
                            });
                            const expected = [], result = [];

                            blockTwo.dispatchEvent(new Event('mouseenter'));
                            blockTwo.offsetWidth;

                            expected.push('border: 1px solid red; width: 10em; height: 10em;');
                            result.push(blockTwo.style.cssText);

                            blockTwo.offsetWidth;
                            blockTwo.dispatchEvent(new Event('mouseleave'));
                            blockTwo.offsetWidth;

                            expected.push('border: 1px solid skyblue; width: 10em; height: 10em;');
                            result.push(blockTwo.style.cssText);

                            return Array.isEquivalent(expected, result);
                        }(), true
                    ],
                }
            }
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
            ],
            'style object': [
                function () {
                    refresh();
                    block.config({
                        style: {
                            color: 'green',
                            border: '1px solid pink',
                            borderRadius: '1em',
                        },
                    });
                    console.log(block.style.cssText);
                    return 'color: green; border: 1px solid pink; border-radius: 1em;';
                }(), block.style.cssText
            ],
            'usual object': [
                function () {
                    refresh();
                    block.config({
                        myObject: {
                            myProp: 'myVal',
                            myMethod: () => 'myValMethod'
                        }
                    });
                    const expected = [
                        'myVal',
                        'myValMethod'
                    ], result = [
                        block.myObject.myProp,
                        block.myObject.myMethod()
                    ];
                    return Array.isEquivalent(expected, result);
                }(), true
            ],
            'js property': [
                function () {
                    refresh();
                    let ihtml = block.innerHTML;
                    block.innerHTML = '';
                    block.config({
                        textContent: 'new text'
                    });
                    const res = block.textContent == 'new text';
                    block.htmlto(ihtml);
                    return res;
                }(), true
            ],
            'propName regex': [
                function () {
                    refresh();
                    block.config({
                        texC: 'text content',
                        cla: ['short-conf-class1', 'short-conf-class2'],
                    });
                    const expected = [
                        'text content',
                        'short-conf-class1 short-conf-class2'
                    ], result = [
                        block.textContent,
                        block.className
                    ];
                    return Array.isEquivalent(expected, result);
                }(), true
            ],
            'on': {
                'single': [
                    function () {
                        refresh();
                        block.config({
                            on: ['mouseenter', e => e.target.textContent = 'mouseenter']
                        });
                        return "e => e.target.textContent = 'mouseenter'";
                    }(), block.events.mouseenter[0].toString()
                ],
                'few': [
                    function () {
                        refresh();
                        block.config({
                            on: [
                                ['mouseenter', e => e.target.textContent = 'mouseenter'],
                                ['click', e => e.target.textContent = 'click'],
                            ]
                        });
                        const expected = [
                            "e => e.target.textContent = 'mouseenter'",
                            "e => e.target.textContent = 'click'"
                        ], result = [
                            block.events.mouseenter[0].toString(),
                            block.events.click[0].toString(),
                        ];
                        return Array.isEquivalent(expected, result);
                    }(), true
                ]
            }
        },
        '.backup': {
            'tag (classes, styles)': [
                function () {
                    refresh();
                    block.config({
                        style: {
                            border: '1px solid red',
                            color: 'gray'
                        },
                        class: ['hello', 'few-hello1', 'few-hello2', 'few-hello3', 'conf-class1', 'conf-class2', 'conf-class3'],
                    });
                    let backup = block.backup('tag');
                    const expected = [
                        'border: 1px solid red; color: gray;',
                        'hello few-hello1 few-hello2 few-hello3 conf-class1 conf-class2 conf-class3'
                    ], result = [
                        backup.style.cssText,
                        backup.className
                    ];
                    console.log(backup);
                    return Array.isEquivalent(expected, result);
                }(), true
            ],
            'tagFull (all attributes)': [
                function () {
                    refresh();
                    block.config({
                        style: 'border: 1px solid red',
                        class: ['hello', 'few-hello1', 'few-hello2', 'few-hello3', 'conf-class1', 'conf-class2', 'conf-class3'],
                        attributes: {
                            attr0: 'val0',
                            attr1: 'val1',
                            attr2: 'val2',
                            attr3: 'val3',
                            'data-attr-from-config': 'config is cool',
                            'attr-from-config-creon-methods': 'hohoho'
                        }
                    });
                    let backup = block.backup('tagFull');
                    const expected = [
                        'blockId',
                        'border: 1px solid red;',
                        'hello few-hello1 few-hello2 few-hello3 conf-class1 conf-class2 conf-class3',
                        'val0',
                        'val1',
                        'val2',
                        'val3',
                        'config is cool',
                        'hohoho'
                    ], result = [
                        backup.attributes.id,
                        backup.attributes.style,
                        backup.attributes.class,
                        backup.attributes.attr0,
                        backup.attributes.attr1,
                        backup.attributes.attr2,
                        backup.attributes.attr3,
                        backup.attributes['data-attr-from-config'],
                        backup.attributes['attr-from-config-creon-methods'],
                    ];
                    return Array.isEquivalent(expected, result);
                }(), true
            ],
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

