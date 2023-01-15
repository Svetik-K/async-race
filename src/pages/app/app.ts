import Header from '../../components/header/header';

class App {
    private static container: HTMLElement = document.body;
    header: Header;

    constructor() {
        this.header = new Header();
        // this.content = document.createElement('div');
        // this.content.className = 'content';
    }

    start() {
        this.header.draw();
    }
}

export default App;
