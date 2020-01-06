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