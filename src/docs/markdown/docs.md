# CREON


## Синтаксис описания функций и аргументов
```js
имяФункции ( аргумент1:тип1, аргумент2:(тип21|ТИП22), (аргумент3:тип3 | АРГУМЕНТ4:тип4) [, аргумент5:тип5 ]=значение ) : тип возвращаемого значения или само значение
```

Тут аргумент2 может принимать один из двух типов данных и является необязательным, принимая значение "значение" по умолчанию. После идут аргументы 3 и 4, из которых надо выбрать один и его тип. Аргумент 5 является необязательным и по умолчанию используется значение "значение".

Варианты синтаксиса такой функции:

```js
имяФункции ( аргумент1:тип1, аргумент2:тип21, аргумент3:тип3 ) : тип возвращаемого значения или само значение

имяФункции ( аргумент1:тип1, аргумент2:ТИП22, аргумент3:тип3 ) : тип возвращаемого значения или само значение

имяФункции ( аргумент1:тип1, аргумент2:тип21, АРГУМЕНТ4:тип4 ) : тип возвращаемого значения или само значение

имяФункции ( аргумент1:тип1, аргумент2:ТИП22, АРГУМЕНТ4:тип4 ) : тип возвращаемого значения или само значение
```

И все варианты выше но с аргументом 5 в конце, например:

```js
имяФункции ( аргумент1:тип1, аргумент2:тип21, аргумент3:тип3, аргумент5:тип5 ) : тип возвращаемого значения или само значение
```


### sel, select, .sel, .select


```js
sel( (selector:string | objectToSelect:HTMLElement), parent:HTMLElement ) : HTMLElement
```


```js
select( (selector:string | objectToSelect:HTMLElement), parent:HTMLElement ) : HTMLElement
```


Функция select является ссылкой на функцию sel и была добавлена с целью дать возможность писать более читаемый код.

Если в функцию первым аргументом передан объект страницы, то ему будет добавлен весь функционал библиотеки.
Если же передана строка, то функция расценивает её как селектор и выполняет поиск элемента по селектору. После того как элемент будет найден ему будут добавлен весь функционал библиотеки.

Если вызывать функции библиотеки на элементах страницы, которые не были выбраны или получены из функций библиотеки, то вы получите ошибку "Функция не определена".

Пример:
```js
let block = sel('div#block');
let block1 = select('div#block1');

block.class('class1');
```

Эквивалент в нативном js:
```js
//После использования такого кода функции библиотеки не будут работать
let block = document.querySelector('div#block');
let block1 = document.querySelector('div#block1');

block.class('class1'); //тут ошибка Uncaught TypeError: block.class is not a function
```

В функцию можно передать родительский элемент, в котором будет произведён поиск по селектору.

Пример:
```js
let block = sel('div#block', document.body);
```

Эквивалент в нативном js:
```js
let block = document.body.querySelector('div#block');
```

Указывать родителя вторым аргументом неудобно, поэтому каждый элемент выбранный элемент имеет методы .sel и .select.
В этих методах вместо родителя подставляется элемент, с которого выполняется вызов метода (this).

Пример:
```js
let parent = sel('#parent');
let innerBlock = parent.sel('.inner-block');
```

Эквивалент в нативном js:
```js
let parent = document.querySelector('#parent');
let innerBlock = parent.querySelector('.inner-block');
```

### sela, selectAll, .sela, .selectAll


```js
sela( (selector:string | objectsToSelect:Array<HTMLElement>), parent:HTMLElement ) : NodeList
```


```js
selectAll( (selector:string | objectToSelect:Array<HTMLElement>), parent:HTMLElement ) : NodeList
```


Функция selectAll является ссылкой на функцию sela и была добавлена с целью дать возможность писать более читаемый код.

Если в функцию первым аргументом переданы объекты страницы, то им будет добавлен весь функционал библиотеки.
Если же передана строка, то функция расценивает её как селектор и выполняет поиск элементов по селектору. После того как элементы будут найдены им будут добавлены все функции библиотеки.

Если вызывать функции библиотеки на элементах страницы, которые не были выбраны или получены из функций библиотеки, то вы получите ошибку "Функция не определена".

Пример:
```js
let blocks = sela('div');
let spans = selectAll('span');

blocks[0].class('class1');
```

Эквивалент в нативном js:
```js
//После использования такого кода функции библиотеки не будут работать
let blocks = document.querySelectorAll('div');
let spans = document.querySelectorAll('span');

blocks[0].class('class1'); //тут ошибка Uncaught TypeError: block.class is not a function
```

В функцию можно передать родительский элемент, в котором будет произведён поиск по селектору.

Пример:
```js
let blocks = sela('div', document.body);
```

Эквивалент в нативном js:
```js
let blocks = document.body.querySelectorAll('div');
```

Указывать родителя вторым аргументом неудобно, поэтому каждый элемент выбранный элемент имеет методы .sela и .selectAll.
В этих методах вместо родителя подставляется элемент, с которого выполняется вызов метода (this).

Пример:
```js
let parentBlocks = sela('div');
let innerBlocks = parentBlocks[0].sela('.inner-block');
innerBlocks.forEach(block => block.textContent = 'новое текстовое содержимое каждого внутреннего блока');
```

Эквивалент в нативном js:
```js
let parentBlocks = document.querySelectorAll('div');
let innerBlocks = parentBlocks[0].querySelectorAll('.inner-block');
innerBlocks.forEach(block => block.textContent = 'новое текстовое содержимое каждого внутреннего блока');
```


### .config


```js
element.config( configObject:object [, printFullNameOfShortPropName:boolean ]=false ) : element
```


Функция выполняет настройку объекта по объекту переданному в качестве аргумента. Функция была создана с целью сократить множественное обращение к одному и тому же элементу при его настройке.

Пример:
```js
let block = sel('div');
block.config({
    textContent: 'новое текстовое содержиомое',
    className: 'class1 class2'
});
```

Эквивалент в нативном js:
```js
let block = document.querySelector('div');
block.textContent = 'новое текстовое содержиомое';
block.className = 'class1 class2';
```

**Стили**

Можно изменять стили используя свойство style как объект:

Пример:
```js
let block = sel('#block');
block.config({
    textContent: 'текст',
    style: {
        color: 'red',
        fontSize: '2em',
        fontFamily: 'monospace'
    }
});
```

Эквивалент на нативном js:
```js
let block = document.querySelector('#block');

block.textContent = 'текст';
block.style.color = 'red';
block.style.fontSize = '2em';
block.style.fontFamily = 'monospace';
```

**Атрибуты**

Можно изменять атрибуты, используя свойство attributes как объект.

Пример:
```js
let block = sel(document.querySelector('#block'));
block.config({
    textContent: 'text',
    attributes: {
        attr1: 'value1',
        'attr2': 'value2',
        'attr-with-dashes': 'dashes value'
    }
});
```

Эквивалент на нативном js:
```js
let block = document.querySelector('#block');

block.textContent = 'text';
block.setAttribute('attr1', 'value1');
block.setAttribute('attr2', 'value3');
block.setAttribute('attr-with-dashes', 'dashes value');
```

**Обработчики событий**

Можно передавать несколько обработчиков сразу. Если значением объекта конфигурации будет массив, то содержимое массива расценивается как аргументы функции и происходит единичный вызов метода .on. Если же был передан массив, у когторого каждый элемент является массивом, то будет выполнен множественный вызов метода .on с каждым набором аргументов.

Пример:
```js
//один обработчик в объекте конфигурации
sel('#block').config({
    on: ['click', e => console.log('click')]
});
```
```js
//несколько обработчиков в объекте конфигурации
sel('#block').config({
    on: [
        ['click', e => console.log('click1')],
        ['click', e => console.log('click2')],
        ['hover', e => console.log('mouseenter')]
    ]
});
```

Эквивалент в нативном js:
```js
let block = document.querySelector('#block');
block.addEventListener('click', e => console.log('click'));
```
```js
let block = document.querySelector('#block');
block.addEventListener('click', e => console.log('click1'));
block.addEventListener('click', e => console.log('click2'));
block.addEventListener('mouseenter', e => {
    //creon is also make backup here
    console.log('click1'));
});
block.addEventListener('mouseleave', e => {
    //this handler generated automaticaly because of use onspecial - "hover"
    //here element is restored from backup

    //more about .on method in .on section of documentation
});
```

**Сокращения**

Можно писать имена свойств не полностью. Если в объекте конфинурации при настройке было обнаружено свойство, которое не принадлежит настраиваевому объекту, то будет выполнен поиск (чувствительный к регистру) похожих свойств:

1. ПЕРВОЕ свойство, которое начинается как описанное свойство объекта конфигурации;
2. Если прошлый поиск не дал результатов то будет выполнен поиск с абстрактными промежутками между символами, при условии что свойство начинается с той же буквы. ПЕРВОЕ свойство прошедшее поиск будет настроено как описано в объекте конфигурации.

Если вы знаете что такое регулярные выражения:
1. ПЕРВОЕ свойство которое удобвлетворяет 
```
/^prop/
```
, где prop - свойство объекта конфигурации;
1. ПЕРВОЕ свойство которое удобвлетворяет 
```
/^p.*r.*o.*p/
```
, где p, r, o, p - буквы названия свойства (prop) объекта конфигурации;

ПЕРВОЕ написано капсом не просто так. Иногда использование сокращений может приводить к тому, что вы будете настраивать одно свойство объекта, а настроиться другое, т. к. перед ним поиску удовлетворило другое свойство. 
Например, вы сокращаете свойство "textContent" до "text", но поиск найдёт метод textto раньше. В итоге вы не измените текстовое содержимое элемента и не сможете в дальнейшем исользовать метод textto. Для использования сокращений Вам надо будет немного поэксперементировать, но в данном случае мы можем сократить "textContent" до "tC" и все пройдёт гладко.

Чтобы посмотреть как функция преобразовала ваши сокращения передайте второй параметр как true. Тогда в консоль будут выведены все преобразования сокращений в полные имена свойств.

*Сокращенная запись свойств работает только для корневых свойств объекта конфигурации. Во вложенных объектах поиска полного названия свойства не будет. Например в объекте стилей - надо писать названия свойств полностью, не используя сокращения.*

Например:
```js
element.config({
    tC: 'text', 
    text: 'text',
    sty: {
        color: '#f00',
        border: '1px solid green',
    }
}, true);
//tC >> textContent
//text >> textto
//sty >> style
```

**Использование методов бибилиотеки в объекте конфигурации**

Чтобы свойство расценивалось как вызов метода библиотеки должно сойтись два условия:

1. Свойство в объекте конфигурации должно называтся так же как и сам метод (если вы используете сокращенное название то после определения полного имени оно должно быть именем какого-нибудь метода библиотеки);
2. Значение этого свойсвта - массив, каждый элемент когрого является аргументом для метода библиотеки;

Пример:
```js
sel('#block').config({
    class: ['class1', 'class2'],
    textto: ['новое текстовое содержимое'],
    to: [sel('#newParent')]
});
```

Эквивалент без использования метода конфигурации (каждый метод возвращает сам объект):
```js
sel('#block').class('class1', 'class2')
    .textto('новое текстовое содержимое')
    .to(sel('#newParent'));
```
Или методы по отдельности:
```js
let block = sel('#block');
block.class('class1', 'class2');
block.textto('новое текстовое содержимое');
block.to(sel('#newParent'));
```

Как видно из примеров, использование исключительно функций библиотеки проще без вызова метода конфугурации, так как каждая функция возвращаем сам объект. Но когда требуется настроить несколько свойств элемета и вызвать функции библиотеки на одном элементе, то возможность вызвать эти методы внутри объекта конфигурации будет полезна.

**Неприкосновенные свойства**

Если вы хотите чтобы переданное значение никак не преобразовывалось (например хотите перезаписать методы библиотеки на элементе), то используте специальную функцию - creon.sacred(data).
Эта функция говорит конфигуратору, что значение надо перисвоить как оно есть (без вызовов и тп).

Пусть нам надо чтобы в свойстве class хранился массив, а не функция библиотеки. Если мы просто передадим массив, то будет вызван метод class с аргументами. Решение ниже.
Пример :
```js
let block = sel('#block').config({
    tC: 'новое тексовое содержимое',
    class: creon.sacred([1, 2, 3])
});

console.log(block.class); //1,2,3
```

Справедливо заметить, что проще отдельно присовить нужное значение, но с другой стороны удобно, когда все преобразования над объктом происходят в одном месте.



### .backup


```js
element.backup ( [ props:array | mode:str | prop:str ]='tag' ) : configObject:object
```


Функция позволяет создать объект конфигурации по объекту. Соответсвенно, если выполнить конфигурацию по этому объекту, то старые значение восстановятся. Поэтому метод называется backup.

Все параметры передаваемые функции являются необязательными и влияют на получаемый объект конфигурации.

Аргументы (выберите один из вариантов):

1. props:array - массив строк, каждая из которых является названием свойства элемента. Если нужно скопировать, допустим название тэга и атрибуты, то аргументом функции станет массив \['tagName', 'attributes'];
2. mode:str - режим. creon.backup - это объект, который хранит режимы. Ключи этого объекта отражают название режима, а значения - это массивы строк, каждая из которых является названием свойства элемента (то есть массив как props:array). Когда аргументом функции является строка, сперва проиcходит поиск режима с таким именем. То есть каждый режим - это готовый вариант props. Фактически происходит обращение к объекту creon.backup, это можно записать так: 
```
element.backup(creon.backup[mode])
```
, где mode - это название режима;
3. prop:str - имя свойства. Если в функцию была передана строка и такого режима нет в объекте creon.backup, то аргумент расценивается как одно свойство, и в бэкапе будет только оно.

*Функция не является универсальной, например она не умеет копировать children, поэтому рекомендуется использовать режимы, так как они содержат только проверенные свойства.*


### cre, create - создание элеметов страницы


```js
cre ( tag:str [, config:object ] ) : HTMLElement
```


Функция создает элемент страницы и позволяет выполнить его первоначальную конфигурацию.

Функция create работает в два этапа:

1. Создаётся элемент страницы через document.createElement;
2. Если был передан объект конфигурации, то на созданном объекте вызывается метод .config с переданным объектом конфигурации.

Пример:
```js
cre('div', { 
    tC: 'text', 
    class: ['class1', 'class2'],
    to: [sel('#newParent')]
});
```

Эквивалент в нативном js:
```js
let block = document.createElement('div');
block.textContent = 'text';
block.classList.add('class1', 'class2');
document.querySelector('#newParent').append(block);
```

**Тэг как свойство**

Можно создавать объекты страницы, указывая имя тэга как своство create (или cre). Смотрите пример.

Пример:
```js
cre.div({
    textContent: 'text',
    class: ['class1', 'class2']
}); //тут имя тэга передаётся обращением к свойству

cre('div', {
    textContent: 'text',
    class: ['class1', 'class2']
}); //тут имя тэга передаётся как аргумент функции
```

Пример создания пустого блока:
```js
cre.div(); //как свойство
cre('div'); //как аргумент

//нативный js
document.createElement('div'); //этот элемент нужно выбрать функцией sel, прежде чем использовать функции библиотеки на нём
```


### .on


```js
element.on ( eventtypes:str, handler1:function, handler2:function, ...handlers:function, ( lasthandler:function | backuptype:str ) ) : element
```


eventtypes - это строка, которая содержит типы событий разедённые пробелом, например строка 
"click mouseenter mouseleave".

В функцию передаётся требуемое число обработчиков, каждый обработчик относится к каждому типу собитыя. Для стандартных типов нужен только один обработчик, но для автоматических типов (например hover), можно передавать несколько обработчиков. Подробнее о автоматических типах событий будет сказано позже.

Функция .on ялвяется краткой записью .addEventListener, но:

1. Все обработчики сохраняются в объекте, в свойстве events;
2. Можно сразу удалить все события или часть из них, вызвав метод remove на выбранном сохранённом обработчике;
3. Библиотека использует специальные обработчики событий (hover, clickToggle, focus, ...).

Теперь подробнее.

**events**

Объект events имеется у каждого объекта. Он хранит в себе все сохранённые обработчики и позволяет их быстро удалить.

Пример объекта events:
```js
//обращение к объекту событий
sel('#block').events;
//пример объекта событий
{
    click: {
        0: e => 'click handler',
        1: function (e) { 'another click handler' },
    },
    mouseenter: {
        0: e => e.target.style.color = 'red'
    },
    mouseleave: {
        0: e => e.target.style.color = 'black'
    }
}
```

Далее мы создадим такой же объект events. 

*Имейте в виду, что объект events не гарантирует точного отображения обработчиков событий, если вы будете его менять в ручную. Обработчики добавляются в него автоматически при вызове метода .on. Если вы будете использовать метод .addEventListener, то обработчики также не будут добавляться к объект events.*

Давайте присвоим все обработчики как в варианте выше.
Пример:
```js
//1. с использованием конфигурации:
sel('#block').config({
    on: [
        ['click', e => 'click handler'],
        ['click', function (e) { 'another click handler' }],
        ['mouseenter', e => e.target.style.color = 'red'],
        ['mouseleave', e => e.target.style.color = 'black'],
    ]
});

//2. без конфигурации, просто вызовы метода on
sel('#block')
    .on('click', e => 'click handler')
    .on('click', () => 'handler with name')
    .on('click', function (e) { 'another click handler' })
    .on('mouseenter', e => e.target.style.color = 'red')
    .on('mouseleave', e => e.target.style.color = 'black');
```

Теперь объект events полностью соотвествует тому, что был представлен в начале.

Допустим нам надо удалить обработчик

**Специальные обработчики событий (автообработчики)**

Функции автообработчиков хранятся в свойстве объекта creon - creon.onspecial. Каждое свойство этого объекта отвечает за специальные обработчики событий. Если функция .on получает тип события, который содержится в creon.onspecial, то все аргументы за исключением типа события пережаются из функции .on в функцию creon.onspecial.eventName. Далее будут рассмотрен список специальных обработчиков и варианты их использования. 

Список обработчиков:

- `hover ( hoverin:function, ( hoverout:function | [ backuptype:(str|array) ]='tag' ) ) : element`
- `clickToggle ( clickin:function, ( clickout:function | [ backuptype:(str|array) ]='tag' ) ) : element`
- `focus ( focusin:function, ( focusout:function | [ backuptype:(str|array) ]='tag' ) ) : element`

Простыми словами: каждая функция по-нормальному должна получать два обработчика, но если она получает один обработчик, то перед выполнением первого обработчика будет сделан бэкап элемента (.backup) и автоматически будет создан второй обработчик, в котором элемент восстанавливается из этого бэкапа. Вместо второго обработчика можно передать аргументы для функции бэкапа, но если ничего не пердать, то автоматически будет использован режим бэкапа tag, который сохраняет в резервную копию стили и классы элемента.

На примере:

Допустим надо при наведении (mouseenter) на блок изменить цвет его шрифта на красный, а при сведении (mouseleave) вернуть изначальный чёрный цвет шрифта.

Тогда будем использовать hover.
Пример:
```js
//вариант сделать всё руками
sel('#block')
    .on('mouseenter', e => e.target.style.color = 'red')
    .on('mouseleave', e => e.target.style.color = 'black');

//вариант использовать специальный тип событий hover и описать руками, передав две функции
sel('#block')
    .on('hover', 
        e => e.target.style.color = 'red', //первый на наведение
        e => e.target.style.color = 'black' //второй на сведение
    );

//самый короткий вариант - автообработчик (*)
sel('#block').on('hover', e => e.target.style.color = 'red');
```

Давайте разберёмся что происходит в самом коротком варианте (*) на самом деле.

1. Наводим на блок;
2. Библиотека делает бэкап блока;
3. Библиотека выполняет обработчик наведения, который был описан руками;
4. Сводим с блока;
5. Библиотека восстанавливает блок из бэкапа;

Подробно о бэкапе было сказано ранее. Всё специальные обработчики по умолчанию делают бэкап в режиме 'tag'. Режим tag создаёт бэкап стилей и классов элемента.

Действия автообработчика hover внутри (эквивалентны краткой форме (*) выше):
```js
let backup = {};
sel('#block')
    .on('mousenter', e => {
        backup = e.target.backup(); //бэкап перед применением обработчика
        (e => e.target.style.color = 'red')(e) //вызов самого обработчика
    })
    .on('mouseleave', e => { //создаётся автоматическое возвращение к начальным стилям
        e.target.config(backup); //возвращаемся к изначальным стилям
    });
```

Автообработчики полезны и позволяют упростить написание обработчиков, для противоположных или последовательных событий. 

Чтобы добавить свой автообработчик добавьте новое свойство объекту creon.onspecial. Этот объект используется во время вызовова метода .on, так что новый автообработчик станет полноценной частью библиотеки.

Например, представим что в библиотеке нет автообработчика focus, но мы хотим его добавить. Код автообработчика соответсвует коду в исходниках библиотеки.

Пример создания собственного автообработчика:
```html
<script src="creon.js"></script> <!-- creon library -->

<!-- out custom special event type -->
<script>
    creon.onspecial.focus = function (focusin, focusout = 'tag') {
        const elem = this; //in thisArgs is current element of page
        let backup; //closing variable
        this.on('focusin', e => { //add event listener for focusin
            if (!focusout || typeof focusout == "string") { //if focusout is not function
                backup = elem.backup(focusout); //make backup
            }
            focusin(e); //call focusin with event argument
        });
        this.on('focusout', e => { //add event listener for focusout
            if (!focusout || typeof focusout == "string") { //if focusout is not function
                elem.config(backup); //restore from backup
            } else { //if focusout exist
                focusout(e); //run focusout handler with event argument
            }
        });
    };
</script>

<script src="index.js"></script> <!-- script with page logic (using creon.on.focus() inside) -->
```


### plugin .style.few


```js
element.style.few ( { stylePropsObject:object } ) : element
```


В библиотеку по умолчанию встроен плагин .style.few. Как можно понять из названия, он добавляет к объекту style у элемента метод few. Этот метод сокращает написание множественных стилевых преобразований. stylePropsObject - это объект, названия свойств которого соотвествуют названиям свойств объекта style.

Пример:
```js
//использование метода few
sel('#block').style.few({
    color: 'red',
    backgroundColor: '#00f',
    opacity: 0.75,
    borderRadius: '1em'
});

//эквивалент без метода few
let block = sel('#block');
block.style.color: 'red',
block.style.backgroundColor: '#00f',
block.style.opacity: 0.75,
block.style.borderRadius: '1em'
});
```

*Этот метод используется в методе .config, для обработки объекта стилей из объекта конфигурации*


### .to


```js
element.to( newParent:HTMLElement ) : element
```


Отрывает элеметн от текущего родителя и добавляет в конец (append) к новому.

Пример:
```js
sel('#block').to(sel('#newParent'));
```

Эквивалент на нативном js:
```js
dosument.querySelector('#newParent').append(document.querySelector('#block'));
```

Часто удобно добавить элемент к родителю именно в конце, поэтому .to удобнее чем классический append.


### .class


```js
element.class( class1:str, class2:str, ...) : element
```


Добавляет элементу классы. Является сокращением от classList.add.

Пример:
```js
sel('#block').class('class1', 'class2');
```

Эквивалент в нативном js:
```js
document.querySelector('#block').classList.add('class1', 'class2');
```


### .unclass


```js
elem.unclass( class1:str, class2:str, ... ) : element
```


Удаляет классы у элемента. Является сокращением от classList.remove.

Пример:
```js
sel('#block').unclass('class1', 'class2');
```

Эквивалент в нативном js:
```js
document.querySelector('#block').classList.remove('class1', 'class2');
```


### .hasclass


```js
element.hasclass( class1:str, class2:str, ... ) : boolean
```


Проверяет наличие классов на элементе. Если на элементе присутствуют все переданные классы вернёт true. Если не найден хотя бы один класс - false.

Пример:
```js
sel('#block').class('class1', 'class2').hasclass('class1', 'class2') //true
sel('#block').unclass('class1').hasclass('class1', 'class2')         //false
```

Эквивалент в нативном js:
```js
const block = document.querySelector('#block');
block.classList.add('class1', 'class2');
block.classList.contains('class1') && block.classList.contains('class2'); //true
block.classList.remove('class1');
block.classList.contains('class1') && block.classList.contains('class2'); //false
```


### .hasanyclass


```js
element.hasanyclass( class1:str, class2:str, ... ) : boolean
```


Функция проверяет наличие хотя бы одного класса на элементе.

Пример:
```js
sel('#block').class('class1', 'class2').hasanyclass('class1', 'class2') //true
sel('#block').unclass('class1').hasanyclass('class1', 'class2')         //true
sel('#block').unclass('classw').hasanyclass('class1', 'class2')         //false
```

Эквивалент в нативном js:
```js
const block = document.querySelector('#block');
block.classList.add('class1', 'class2');
block.classList.contains('class1') || block.classList.contains('class2'); //true
block.classList.remove('class1');
block.classList.contains('class1') || block.classList.contains('class2'); //true
block.classList.remove('class2');
block.classList.contains('class1') || block.classList.contains('class2'); //false
```


### .attr


```js
element.attr( ( name:str [, value:any ] | attrsObject:object ) ) : (value:str | element)
```


Позволяет установить атрибут (или несколько) элементу или взять его значение. Если первый аргумент является строкой и передан аргумент value, то выполняется добавление атрибута (setAttribute), иначе возвращается значение атрибута (getAttribute). Если же первым элементом передан объект, то выполняется множественное назначение атрибутов, после которого возвращается сам элемент.

Пример:
```js
sel('#block').attr('my-attr', 'my-value').attr('my-attr'); //'my-value'

sel('#block').attr({
    myAttr1: 'value1',
    'my-attr-2': 'my-value-2'
})
sel('#block').attr('myAttr1'); //'value1'
sel('#block').attr('my-attr-2'); //'my-value-2'
```

Эквивалент в нативном js:
```js
const block = document.querySelector('#block');
block.setAttribute('my-attr', 'my-value');
block.getAttribute('my-attr'); //'my-value'

block.setAttribute('myAttr1', 'value1');
block.setAttribute('my-attr-2', 'my-value-2');
block.getAttribute('myAttr1'); //'value1'
block.getAttribute('my-attr-2'); //'my-value-2'
```


### .textto


```js
element.textto( text:str ) : element
```


Меняет текстовое содержимое элемента (textContent) на новое и возвращает элемент.

Пример:
```js
sel('#block').textto('new text');
```

Эквивалент в нативном js:
```js
document.querySelector('#block').textContent = 'new text';
```


### .htmlto


```js
element.htmlto( html:str ) : element
```


Меняет содержимое элемента (innerHTML) на новое и возвращает элемент.

Пример:
```js
sel('#block').htmlto('<strong>new innerHTML</strong>');
```

Эквивалент в нативном js:
```js
document.querySelector('#block').innerHTML = '<strong>new innerHTML</strong>';
```


### .parent


```js
element.parent( [times:number]=1 ) : HTMLElement
```


Проходит по цепочке родителей и возвращает нужного. Если нет аргументов, то вернёт родительский элемент (parentElement) текущего элемента. Если же передано число, большее чем 1, то будет идти по цепочке родителей вверх, пока счётчик переходов к родителям не достигнет нужного числа.

Пример:
```js
sel('#block').parent();
sel('#block').parent(3);
```

Эквивалент в нативном js:
```js
document.querySelector('#block').parentElement;
document.querySelector('#block').parentElement.parentElement.parentElement;
```


### .next


```js
element.next( [ times:number | selector:string ]=1 ) : HTMLElement
```


Возвращает элемент который находится после текущего. Если не передать никаких параметров то вызов будет равносилен обращению к свойству nextElementSibling и мы получим элемент рядом с текущим.
Если передать число то число переходов nextElementSibling будет соответсвовать этому числу.
Если передать селектор, будет будет возвращён первый элемент который расположен за текущим и удовлетворяет селектору.

Такая структура документа:
```pug
#blockParent
    div.n0
    #block
    div.n1
    div.n2
    div.n3
    span#target
```

Пример ():
```js
let block = sel('#block');
block.next(); //div.n1
block.next(1); //div.n1
block.next(3); //div.n3
block.next('div.n3'); //div.n3
block.next('span'); //span#target
block.next(0); //#block
block.next(-1); //if less then 0 return self #block
block.next('div.n0'); //null, because after #block there is no div.n0
```

Эквивалент в нативном js:
```js
let block = document.querySelector('#block');
block.nextElementSibling; //div.n1
block.nextElementSibling; //div.n1
block.nextElementSibling.nextElementSibling.nextElementSibling; //div.n3
block.parentElement.querySelector('div.n3'); //div.n3, but in creon is also check for child index be more than current element has
block.parentElement.querySelector('span'); //span#target, but in creon is also check for child index be more than current element has
block.nextElementSibling; //#block
block.nextElementSibling; //if less then 0 return self #block
null;
```


### .prev


```js
element.prev( [ times:number | selector:string ]=1 ) : HTMLElement
```


Возвращает элемент который находится до текущего. Если не передать никаких параметров то вызов будет равносилен обращению к свойству previousElementSibling и мы получим элемент рядом с текущим.
Если передать число то число переходов previousElementSibling будет соответсвовать этому числу.
Если передать селектор, будет будет возвращён первый элемент который расположен перед текущим и удовлетворяет селектору.

Такая структура документа:
```pug
#blockParent
    span#target
    div.n0
    div.n1
    div.n2
    #block
    div.n3
```

Пример ():
```js
let block = sel('#block');
block.prev(); //div.n2
block.prev(1); //div.n2
block.prev(3); //div.n0
block.prev('div.n0'); //div.n0
block.prev('span'); //span#target
block.prev(0); //#block
block.prev(-1); //if less then 0 return self #block
block.prev('div.n3'); //null, because after #block there is no div.n0
```

Эквивалент в нативном js:
```js
let block = document.querySelector('#block');
block.previousElementSibling; //div.n2
block.previousElementSibling; //div.n2
block.previousElementSibling.previousElementSibling.previousElementSibling; //div.n0
block.parentElement.querySelector('div.n3'); //div.n0, but in creon is also check for child index be more than current element has
block.parentElement.querySelector('span'); //span#target, but in creon is also check for child index be more than current element has
block.previousElementSibling; //#block
block.previousElementSibling; //if less then 0 return self #block
null;
```


### .firstchild


```js
element.firstchild( [ newchild:HTMLElement ] ) : HTMLElement
```


Если в функцию ничего не передать, то вернёт первого ребёнка элемента (firstElementChild). Если передать элемент то вставит этот элемент в начало (prepend) и вернёт его.

Пример:
```js
sel('#blockParent').firstchild(); //возвращает firstElementChild
sel('#blockParent').firstchild(sel('#block')); //отрывает #block от старого родителя и записывает первым ребёнком #blockParent. Возвращает #block
```

Эквивалент в нативном js:
```js
document.querySelector('#blockParent').firstElementChild;
document.querySelector('#blockParent').prepend(sel('#block'));
```


### .lastchild

```js
element.lastchild( [ newchild:HTMLElement ] ) : HTMLElement
```


Если в функцию ничего не передать, то вернёт последнего ребёнка элемента (lastElementChild). Если передать элемент то вставит этот элемент в конец (append) и вернёт его.

Пример:
```js
sel('#blockParent').lastchild(); //возвращает lastElementChild
sel('#blockParent').lastchild(sel('#block')); //отрывает #block от старого родителя и записывает последним ребёнком #blockParent. Возвращает #block
```

Эквивалент в нативном js:
```js
document.querySelector('#blockParent').lastElementChild;
document.querySelector('#blockParent').append(sel('#block'));
```


### .push


```js
element.push( tag:str [, config:object ] ) : HTMLElement
```


Последовательность действий функции:

1. Создаёт элемент функцией create, с переданными аргументами (функция create создаёт и настраивает элемент);
2. Добавляет созданный элемент как последего ребёнка текущему элементу;
3. Возвращает созданный элемент.

Пример:
```js
sel('#block').push('span', {
    style: {
        color: red,
        border: '1px solid pink',
        display: 'block'
    },
    class: ['class1', 'class2'],
}); //после выполнения функции в #block будет добавлен новый span.
```

Эквивалент на нативном js:
```js
let span = document.createElement('span');
span.style.color = 'red';
span.style.border = '1px solid pink';
span.style.display = 'block';
span.classList.add('class1', 'class2');
document.querySelector('#block').append(span);
```

**Имя тэга как свойство push**

Для удобства можно использовать свойство объекта push для передачи имени тэга.

Пример:
```js
sel('#block').push.span({
    style: {
        color: red,
        border: '1px solid pink',
        display: 'block'
    },
    class: ['class1', 'class2'],
}); //имя тэга как свойство

//эквивалент кода выше
sel('#block').push('span', {
    style: {
        color: red,
        border: '1px solid pink',
        display: 'block'
    },
    class: ['class1', 'class2'],
}); //имя тэга как параметр функции
```

*Для передачи имени свойства в параметр функции используется объект Proxy. Поэтому, когда вы вызываете свойство push, имя свойства передаётся в первый параметр функции push автоматически.*


### .insert.before


```js
element.insert.before( (tag:str | node:HTMLElement) [, config] ) : HTMLElement
```


Вставляет элемент перед текущим и возвращает его. 

Первым параметром можно передать имя тэга или элемент. Если передано имя тэга, то будет создан элемент с таким тэгом, и, при наличии аргумента config, будет выполнена его настройка. Если же первым аргументом был передан элемент страницы, то этот элемент будет оторван от старого родителя и добавлен перед текущим, также будет произведена конфигурация объекта по аргументу config.

Пример:
```js
sel('#block').insert.before(sel('#blockTwo'));
sel('#block').prev() == sel('#blockTwo'); //true
```
```js
sel('#block').insert.before('div', {
    tC: 'text content',
    className: 'class1 class2',
});

sel('#block').prev().className == 'class1 class2'; //true
```

Эквивалент на нативном js:
```js
let block = document.querySelector('#block');
block.parentElement
    .insertBefore(document.querySelector('#blockTwo'), block);
block.previousElementSibling == document.querySelector('#blockTwo'); //true
```
```js
let block = document.querySelector('#block');

let div = document.createElement('div');
div.textContent = 'text content';
div.className = 'class1 class2';

block.parentElement.insertBefore(div, block);

block.previousElementSibling.className == 'class1 class2'; //true
```


### .insert.after


```js
element.insert.after( (tag:str | node:HTMLElement) [, config] ) : HTMLElement
```


Вставляет элемент после текущего и возвращает его. 

Первым параметром можно передать имя тэга или элемент. Если передано имя тэга, то будет создан элемент с таким тэгом, и, при наличии аргумента config, будет выполнена его настройка. Если же первым аргументом был передан элемент страницы, то этот элемент будет оторван от старого родителя и добавлен перед текущим, также будет произведена конфигурация объекта по аргументу config.

Пример:
```js
sel('#block').insert.after(sel('#blockTwo'));
sel('#block').next() == sel('#blockTwo'); //true
```
```js
sel('#block').insert.after('div', {
    tC: 'text content',
    className: 'class1 class2',
});

sel('#block').next().className == 'class1 class2'; //true
```

Эквивалент на нативном js:
```js
let block = document.querySelector('#block');
block.parentElement
    .insertBefore(document.querySelector('#blockTwo'), block.nextElementSibling);
block.nextElementSibling == document.querySelector('#blockTwo'); //true
```
```js
let block = document.querySelector('#block');

let div = document.createElement('div');
div.textContent = 'text content';
div.className = 'class1 class2';

block.parentElement.insertBefore(div, block.nextElementSibling);

block.nextElementSibling.className == 'class1 class2'; //true
```


### .clone


```js
element.clone( [ deepCloning:bool ]=true ) : HTMLElement
```


Создаёт копию элемента и возвращает её. Параметр deepCloning является не обязательным. Если deepCloning == true, то будет скопирован сам элемент в глубоком режиме (HTMLElement.cloneNode(true)) и все пользовательские js свойства. Иначе Будет создана глубокая копия без копирования пользовательских свойств и методов объекта.

Пример:
```js
const blockClone = sel('#block').clone().config({
    tC: 'new text content',
});
blockClone.textContent == sel('#block').textContent; //false
```

Эквивалент на нативном js:
```js
const block = document.querySelector('#block');
const blockClone = block.cloneNode();
//creon is also clone custom props, e.g. typeof objects, making full copy of them.
blockClone.textContent = 'new text content';
blockClone.textContent == block.textContent; //false
```


### range


```js
range( end:number ) : array
```


```js
range( start:number, end:number ) : array
```


```js
range( start:number, end:number, step:number ) : array
```


Функция, которая создаёт перебираемый объект как range в python. Эта функция создана для использования с циклом for of.

Пример:
```js
for (let i of range(5))
    console.log(i); //0,1,2,3,4

for (let i of range(-1, 4))
    console.log(i); //-1,0,1,2,3

for (let i of range(-1, 4, 2))
    console.log(i); //-1,1,3

Array.isArray(range(3)); //true
range(3).forEach(i => console.log(i));
```


### keycode

Объект keycode хранит в себе номера клавиш и создан чтобы облегчить взаимодействие с событиями клаиватуры.

Пример:
```js
elem.on('keydown', e => {
    if (e.keyCode == keycode.enter) 
        console.log('GREAT! Pressed <Enter>');
    else if (e.keyCode == keycode.page.up) 
        console.log('ERROR! Expected <Enter> but pressed <Page Up>');
});
```


### Расширение и дополнение библиотеки (плагины)

Есть три варианта расширения библиотеки:

1. Методы для каждого элемента;
2. Автообработчики событий;
3. Добавление режимов бэкапирования.

Все эти варианты могут быть реализваны в плагине.

Чтобы добавить метод есть два варианта: 

1. creon.methods.push(function(element)); - добавить функцию, которая на вход получит элемент и уже внутри функции к элементу добавить метод, присвоив анонимную функцию в свойство;
2. creon.methods.push(object) - добавить объект, который содержит методы.

Пример добавления собственного метода:
```js
//вариант с функцией
typeof cre('div').sayHi; //undefined
creon.methods.push(
    elem => {
        //here can be any functionality relative to element
        elem.sayHi = function() { console.log('Hi, my tag name is ' + this.tagName); }
    });
typeof cre('div').sayHi; //function
```
```js
//вариант с объектом
typeof cre('div').sayHi; //undefined
//objects are only define methods and props of element
creon.methods.push({
    sayHi() {
        console.log('Hi, my tag name is ' + this.tagName);
    }
});
typeof cre('div').sayHi; //function
cre.div().sayHi(); //Hi, my tag name is DIV
```

Чтобы добавить автообработчики событий - нужно добавить метод объекту creon.onspecial.

Пример:
```js
let block = cre.div();
block.events; //{}
creon.onspecial.mySpecialEvent = function (onmouseenter, onclick, onblur, mode = 'tag') {
    let elem = this;
    let backup;
    elem.on('mouseenter', e => {
        backup = elem.backup(mode);
        onmouseenter(e);
    }).on('click', e => {
        console.log('click for:' + e.target + ';');
        onclick(e);
    }).on('blur', e => {
        elem.config(backup);
        onblur(e);
    });
};

block.on.mySpecialEvent(
    e => console.log('from mouse enter: ' + (e.target.color = 'red')),
    e => console.log('from click'),
    e => console.log('from blur')
);

block.events; //{ mouseenter: [...], click: [...], blur: [...] }

block.style.color; //''
block.dispatchEvent(new Event('mouseenter')); //from mouse enter: red
block.style.color; //'red'
block.dispatchEvent(new Event('click')); //click for: ...; from click
block.style.color; //'red'
block.dispatchEvent(new Event('blur')); //from blur
block.style.color; //''
```

Чтобы добавить новый режим бэкапирования надо добавить свойство в объект creon.backup. Значением этого свойства должнен быть массив строк (каждая строка - название свойства элемента).

Пример:
```js
let block = cre('div');
block.myProp = 'myValue';

block.backup('myMode'); // { myMode: undefined }

creon.backup.myMode = ['tagName', 'attributes', 'myProp'];

block.backup('myMode'); // { tagName: 'DIV', attributes: {}, myProp: 'myValue' }
```


## Готовые плагины

### lettering


```js
element.lettering() : HTMLCollection
```


Функция берёт текстовое содержимое элемента, разбивает его на буквы. Потом каждую букву оборачивает в тэг span, после чего меняет innerHTML элемента на новый. Возвращает новых детей блока (this.children);