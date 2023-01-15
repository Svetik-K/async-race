import Garagepage from '../garage/garagePage';
import WinnersPage from '../winners/winnersPage';

class App {
    container: HTMLElement;

    constructor() {
        this.container = document.body;
    }

    renderNewPage(idPage: string) {
        this.container.innerHTML = '';
        let page = null;

        if (idPage === 'garage') {
            page = new Garagepage();
        }
        else if (idPage === 'winners') {
            page = new WinnersPage();
        }

        if (page) {
            const pageHtml: HTMLElement = page.draw();
            this.container.append(pageHtml);
        }
    }

    private enableRouteChange() {
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1);
            this.renderNewPage(hash);
        });
    }

    start() {

        const hash = window.location.hash.slice(1);
        if (hash) {
            this.renderNewPage(hash);
        } else {
            this.renderNewPage('garage');
        }
        this.enableRouteChange();
    }
}

export default App;
