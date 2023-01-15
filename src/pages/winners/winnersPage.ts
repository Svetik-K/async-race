import Header from '../../components/header/header';
class WinnersPage {
    container: HTMLDivElement;
    header: Header;

    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'winners';
        this.header = new Header();
    }

    draw() {
        this.header.draw();
        
        const createBlock = document.createElement('div');
        createBlock.className = 'garage__create create';
        createBlock.textContent = 'Winners';
        this.container.append(createBlock);

        return this.container;
    }
}

export default WinnersPage;