const links = sela('aside span.aside__link');
const titles = sela('main > .content h3');
links.forEach((link, i) => {
    link.style.cursor = 'pointer';
    link.on.click(e => {
        titles[i].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

const asideFloat = sel('aside.float');
const menuButton = asideFloat.sel('.menu-button');
const preElemenets = sela('main pre');

menuButton.on('clickToggle',
    e => {
        [asideFloat.style.few({ width: '0', minWidth: '0' }), menuButton.style.left = '-1em'];
        for (let pre of preElemenets) pre.style.overflow = '';
    },
    e => {
        [asideFloat.style.few({ width: '', minWidth: '' }), menuButton.style.left = ''];
        for (let pre of preElemenets) pre.style.overflow = 'hidden';
    },
);

window.onload = window.onresize = () => {
    if (screen.width <= 600) {

    } else {
        if (asideFloat.style.width === '0px' || asideFloat.style.width === '0') {
            menuButton.dispatchEvent(new Event('click'));
        }
    }
};
