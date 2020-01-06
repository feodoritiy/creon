creon.methods.push({
    lettering() {
        let text = this.textContent.trim().split("");
        let newHTML = text.map(letter => '<span>' + letter + '</span>');
        this.htmlto(newHTML.join('\n'));
        return this.children;
    }
});