import Header from '../../components/header/header';
import './winners.css';
class WinnersPage {
    container: HTMLDivElement;
    header: Header;

    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'winners';
        this.header = new Header();
    }

    private createWinnersTable() {
        const table = document.createElement('table');
        table.className = 'winners__table';
        this.container.append(table);

        const headers = document.createElement('tr');
        table.append(headers);
        
        const col1 = document.createElement('th');
        col1.textContent = 'Number';
        headers.append(col1);

        const col2 = document.createElement('th');
        col2.textContent = 'Car';
        headers.append(col2);

        const col3 = document.createElement('th');
        col3.textContent = 'Name';
        headers.append(col3);

        const col4 = document.createElement('th');
        col4.textContent = 'Wins';
        headers.append(col4);

        const col5 = document.createElement('th');
        col5.textContent = 'Best time (seconds)';
        headers.append(col5);
    }

    private createPaginationButtons() {
        const paginationButtons = document.createElement('div');
        paginationButtons.className = 'winners__pagination-buttons win-pagination';
        this.container.append(paginationButtons);

        const prevButton = document.createElement('button');
        prevButton.className = 'win-pagination__button button_prev inactive';
        prevButton.textContent = 'Prev';
        prevButton.disabled = true;
        paginationButtons.append(prevButton);

        const nextButton = document.createElement('button');
        nextButton.className = 'win-pagination__button button_next active';
        nextButton.textContent = 'Next';
        paginationButtons.append(nextButton);

        nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            // this.drawNextPage();
        })

        prevButton.addEventListener('click', (e) => {
            e.preventDefault();
            // this.drawPreviousPage();
        })
    }

    draw() {
        this.header.draw();
        
        const winnersCounter = document.createElement('div');
        winnersCounter.className = 'winners__counter';
        this.container.append(winnersCounter);

        const title = document.createElement('h1');
        title.className = 'winners__title';
        title.textContent = 'Winners';
        winnersCounter.append(title);

        const winnersNumber = document.createElement('span');
        winnersNumber.className = 'winners__number';
        winnersNumber.textContent = '(0)';
        winnersCounter.append(winnersNumber);

        const winPageCounter = document.createElement('div');
        winPageCounter.className = 'win-page__counter';
        this.container.append(winPageCounter);

        const page = document.createElement('h2');
        page.className = 'winners__page';
        page.textContent = 'Page #';
        winPageCounter.append(page);

        const pageNumber = document.createElement('span');
        pageNumber.className = 'winners__page-number';
        pageNumber.textContent = '0';
        winPageCounter.append(pageNumber);

        this.createWinnersTable();

        this.createPaginationButtons();

        return this.container;
    }
}

export default WinnersPage;