import Header from '../../components/header/header';
import Car from '../../components/car/car';
import { createRandomColor, createCarName } from '../../utils/helpFuncs';
import './garage.css';

const mainUrl = 'http://127.0.0.1:3000';
const paths = {
    cars: '/garage',
    winners: '/winners'
}

type Param = { [key: string]: string}
type CarModel = {
    name: string,
    color: string,
    id?: number
}

class GaragePage {
    container: HTMLElement;
    header: Header;

    constructor() {
        this.container = document.createElement('main');
        this.container.className = 'garage';
        this.header = new Header();
    }

    private generateQueryParams = (params: Param[] = []) => {
        return params ? `?${params.map((param) => `${param.key}=${param.value}`).join('&')}` : '';
    }

    private getCars = async(queryParams: Param[] = []) => {
        const response = await fetch(`${mainUrl}${paths.cars}${this.generateQueryParams(queryParams)}`);
        const cars: CarModel[] = await response.json();
        const count = Number(response.headers.get('X-Total-Count'));

        return { cars, count };
    }

    private createCar = async(body: { name: string, color: string }) => {
        const response = await fetch(`${mainUrl}${paths.cars}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const newCar = await response.json();
    
        return newCar;
    }

    private generate100Cars() {
        for(let i = 0; i < 100; i++) {
            const carName = createCarName();
            const carColor = createRandomColor();
            const car: Car = new Car(carName, carColor);
            this.createCar(car);
            this.container.append(car.draw());
        }
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
        createButton.className = 'create__button';
        createButton.textContent = 'Create';
        createBlock.append(createButton);

        const updateBlock = document.createElement('div');
        updateBlock.className = 'garage__update update';
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
        carsNumber.textContent = '()';
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
        pageNumber.textContent = '';
        pageCounter.append(pageNumber);

        this.getCars().then((data) => {
            data.cars.forEach((car) => {
                const garageCar = new Car(car.name, car.color, car.id);
                this.container.append(garageCar.draw());
            });
            carsNumber.textContent = `(${data.cars.length})`;
            console.log(data.cars)
        });

        const paginationButtons = document.createElement('div');
        paginationButtons.className = 'garage__pagination-buttons pagination';
        this.container.append(paginationButtons);

        const prevButton = document.createElement('button');
        prevButton.className = 'pagination__button button_prev';
        prevButton.textContent = 'Prev';
        paginationButtons.append(prevButton);

        const nextButton = document.createElement('button');
        nextButton.className = 'pagination__button button_next';
        nextButton.textContent = 'Next';
        paginationButtons.append(nextButton);

        generateButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.generate100Cars();
            carsNumber.textContent = `${Number(carsNumber.textContent) + 100}`;
        })

        return this.container;
    }
}

export default GaragePage;