import Header from '../../components/header/header';
import Car from '../../components/car/car';
import { createRandomColor, createCarName } from '../../utils/helpFuncs';
import { createCar, getCars, deleteCar, patchCar } from '../../utils/api';
import './garage.css';

class GaragePage {
    container: HTMLElement;
    header: Header;
    cars: HTMLDivElement;

    constructor() {
        this.container = document.createElement('main');
        this.container.className = 'garage';
        this.header = new Header();
        this.cars = document.createElement('div');
        this.cars.className = 'cars';
    }

    private createPaginationButtons() {
        const paginationButtons = document.createElement('div');
        paginationButtons.className = 'garage__pagination-buttons pagination';
        this.container.append(paginationButtons);

        const prevButton = document.createElement('button');
        prevButton.className = 'pagination__button button_prev inactive';
        prevButton.textContent = 'Prev';
        prevButton.disabled = true;
        paginationButtons.append(prevButton);

        const nextButton = document.createElement('button');
        nextButton.className = 'pagination__button button_next active';
        nextButton.textContent = 'Next';
        paginationButtons.append(nextButton);

        nextButton.addEventListener('click', (e) => {
            const carsNumber = <HTMLSpanElement>document.querySelector('.garage__number');
            const numberCars = Number(carsNumber.textContent?.slice(1, carsNumber.textContent.length - 1));
            if(numberCars <= 7) {
                return;
            }
            e.preventDefault();
            this.drawNextPage();   
        })

        prevButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.drawPreviousPage();
        })
    }

    private drawNextPage() {
        const currentPage = <HTMLSpanElement>document.querySelector('.garage__page-number');
        const buttonPrev = <HTMLButtonElement>document.querySelector('.button_prev');
        const pageToDraw = Number(currentPage.textContent) + 1;
        if(buttonPrev.classList.contains('inactive')) {
            buttonPrev.classList.remove('inactive');
            buttonPrev.classList.add('active');
            buttonPrev.disabled = false;
        }
        this.fetchGarageCars(String(pageToDraw));
    }

    private drawPreviousPage() {
        const currentPage = <HTMLSpanElement>document.querySelector('.garage__page-number');
        const buttonPrev = <HTMLButtonElement>document.querySelector('.button_prev');
        if(currentPage.textContent === '2') {
            buttonPrev.classList.remove('active');
            buttonPrev.classList.add('inactive');
            buttonPrev.disabled = true;
        }
        const pageToDraw = Number(currentPage.textContent) - 1;
        this.fetchGarageCars(String(pageToDraw));
    }
    
    private addOneCar() {
        const nameInput = <HTMLInputElement>document.querySelector('.create__name');
        const carName = nameInput.value;
        const colorInput = <HTMLInputElement>document.querySelector('.create__color');
        const carColor = colorInput.value;
        const carsNumber = <HTMLSpanElement>document.querySelector('.garage__number');

        if(carName === '' || carColor === '#000000') {
            return;
        }
        const car: Car = new Car(carName, carColor);
        createCar(car).then(() => {
            const currentPage = <HTMLSpanElement>document.querySelector('.garage__page-number');
            this.fetchGarageCars(`${currentPage.textContent}`);
            carsNumber.textContent = `(${Number(carsNumber.textContent?.slice(1, carsNumber.textContent.length - 1)) + 1})`;
            nameInput.value = '';
            colorInput.value = '#000000';
        });  
    }

    private generate100Cars() {
        for(let i = 0; i < 100; i++) {
            const carName = createCarName();
            const carColor = createRandomColor();
            const car: Car = new Car(carName, carColor);
            createCar(car);
        }
        const currentPage = <HTMLSpanElement>document.querySelector('.garage__page-number');
        this.fetchGarageCars(`${currentPage.textContent}`);
        const carsNumber = <HTMLSpanElement>document.querySelector('.garage__number');
        carsNumber.textContent = `(${Number(carsNumber.textContent?.slice(1, carsNumber.textContent.length - 1)) + 100})`;
    }

    private fetchGarageCars(page: string) {
        getCars([{key: '_page', value: `${page}`}, {key: '_limit', value: '7'}]).then((data) => {
            this.cars.innerHTML = '';
            data.cars.forEach((car: Car) => {
                const garageCar = new Car(car.name, car.color, car.id);
                this.cars.append(garageCar.draw());
            });
            const currentPage = <HTMLSpanElement>document.querySelector('.garage__page-number');
            currentPage.textContent = page; 
        });
    }

    private getNumberCarsInGarage() {
        getCars().then((data) => {
            const carsNumber = <HTMLSpanElement>document.querySelector('.garage__number');
            carsNumber.textContent = `(${data.cars.length})`;
        });
    }


    draw() {
        this.header.draw();

        const createBlock = document.createElement('div');
        createBlock.className = 'garage__create create';
        this.container.append(createBlock);

        const nameInput = document.createElement('input');
        nameInput.className = 'create__name';
        nameInput.type = 'text';
        nameInput.placeholder = 'Enter car\'s name';
        createBlock.append(nameInput);

        const colorInput = document.createElement('input');
        colorInput.className = 'create__color';
        colorInput.type = 'color';
        createBlock.append(colorInput);

        const createButton = document.createElement('button');
        createButton.className = 'create__button active';
        createButton.textContent = 'Create';
        createBlock.append(createButton);

        const updateBlock = document.createElement('div');
        updateBlock.className = 'garage__update update blocked';
        this.container.append(updateBlock);

        const updateNameInput = document.createElement('input');
        updateNameInput.className = 'update__name';
        updateNameInput.type = 'text';
        updateNameInput.placeholder = 'Enter new name';
        updateBlock.append(updateNameInput);

        const updateColorInput = document.createElement('input');
        updateColorInput.className = 'update__color';
        updateColorInput.type = 'color';
        updateBlock.append(updateColorInput);

        const updateButton = document.createElement('button');
        updateButton.className = 'update__button';
        updateButton.textContent = 'Update';
        updateBlock.append(updateButton);

        const garageButtons = document.createElement('div');
        garageButtons.className = 'garage__buttons';
        this.container.append(garageButtons);

        const raceButton = document.createElement('button');
        raceButton.className = 'garage__button button_race';
        raceButton.textContent = 'Race';
        garageButtons.append(raceButton);

        const resetButton = document.createElement('button');
        resetButton.className = 'garage__button button_reset';
        resetButton.textContent = 'Reset';
        garageButtons.append(resetButton);

        const generateButton = document.createElement('button');
        generateButton.className = 'garage__button button_generate';
        generateButton.textContent = 'Generate cars';
        garageButtons.append( generateButton);

        const carsCounter = document.createElement('div');
        carsCounter.className = 'garage__counter';
        this.container.append(carsCounter);

        const title = document.createElement('h1');
        title.className = 'garage__title';
        title.textContent = 'Garage';
        carsCounter.append(title);

        const carsNumber = document.createElement('span');
        carsNumber.className = 'garage__number';
        carsNumber.textContent = '';
        carsCounter.append(carsNumber);

        const pageCounter = document.createElement('div');
        pageCounter.className = 'page__counter';
        this.container.append(pageCounter);

        const page = document.createElement('h2');
        page.className = 'garage__page';
        page.textContent = 'Page #';
        pageCounter.append(page);

        const pageNumber = document.createElement('span');
        pageNumber.className = 'garage__page-number';
        pageNumber.textContent = '0';
        pageCounter.append(pageNumber);

        generateButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.generate100Cars();
        })

        createButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.addOneCar();
        })

        this.container.append(this.cars);

        this.fetchGarageCars('1');

        this.getNumberCarsInGarage();

        this.createPaginationButtons();

        this.cars.addEventListener('click', (e) => {
            const target = <HTMLButtonElement>e.target;
            const idParent = <HTMLDivElement>target.parentElement?.parentElement;
            if(target.classList.contains('button_remove')) {
                deleteCar(Number(idParent.id)).then(() => {
                    const currentPage = <HTMLSpanElement>document.querySelector('.garage__page-number');
                    this.fetchGarageCars(`${currentPage.textContent}`);
                    const carsNumber = <HTMLSpanElement>document.querySelector('.garage__number');
                    carsNumber.textContent = `(${Number(carsNumber.textContent?.slice(1, carsNumber.textContent.length - 1)) - 1})`;
                }); 
            } 
        })

        this.cars.addEventListener('click', (e) => {
            e.preventDefault();
            const target = <HTMLButtonElement>e.target;
            const idParent = <HTMLDivElement>target.parentElement?.parentElement;
            const id = idParent.id;
            target.classList.add('active');
            if(target.classList.contains('button_select')) {
                updateButton.classList.add('active');
                updateBlock.classList.remove('blocked');
                updateButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    const newName =  updateNameInput.value;
                    const newColor = updateColorInput.value;
                    if(newName === '' || newColor === '#000000') {
                        return;
                    }
                    patchCar(Number(id), {name: newName, color: newColor}).then(() => {
                        const currentPage = <HTMLSpanElement>document.querySelector('.garage__page-number');
                        this.fetchGarageCars(`${currentPage.textContent}`);
                        updateNameInput.value = '';
                        updateColorInput.value = '#000000';
                        target.classList.remove('active');
                        updateBlock.classList.add('blocked');
                        updateButton.classList.remove('active');
                    })
                })
            }
        })

        return this.container;
    }
}

export default GaragePage;