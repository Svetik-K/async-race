import './header.css';

class Header {
    container: HTMLElement;

    constructor() {
        this.container = document.createElement('header');
        this.container.className = 'header';
    }

    draw() {
        const garageButton = document.createElement('a');
        garageButton.className = 'header__button button_garage';
        garageButton.textContent = 'To Garage';
        garageButton.href = '#garage';
        this.container.append(garageButton);

        const winnersButton = document.createElement('a');
        winnersButton.className = 'header__button button_winners';
        winnersButton.textContent = 'To Winners';
        winnersButton.href = '#winners';
        this.container.append(winnersButton);

        document.body.append(this.container);
    }
}

export default Header;