import Header from '../../components/header/header';
class GaragePage {
    container: HTMLDivElement;
    header: Header;

    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'garage';
        this.header = new Header();
    }

    draw() {
        this.header.draw();

        const createBlock = document.createElement('div');
        createBlock.className = 'garage__create create';
        createBlock.textContent = 'Garage';
        this.container.append(createBlock);

        return this.container;
    }
}

export default GaragePage;