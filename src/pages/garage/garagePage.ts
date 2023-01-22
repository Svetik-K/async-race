import Header from '../../components/header/header';
import Car from '../../components/car/car';
import { createRandomColor, createCarName, raceAll} from '../../utils/helpers';
import { createCar, getCar, getCars, deleteCar, patchCar, controlEngine, deleteWinner, driveEngine } from '../../utils/api';
import './garage.css';

type CarData = {
    distance: number,
    velocity: number
}

class GaragePage {
    container: HTMLElement;
    header: Header;
    cars: HTMLDivElement;
    moveId: number;

    constructor() {
        this.container = document.createElement('main');
        this.container.className = 'garage';
        this.header = new Header();
        this.cars = document.createElement('div');
        this.cars.className = 'cars';
        this.moveId = 0;
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
        createCar(car)
        .then(() => {
            const currentPage = <HTMLSpanElement>document.querySelector('.garage__page-number');
            this.fetchGarageCars(`${currentPage.textContent}`);
            carsNumber.textContent = `(${Number(carsNumber.textContent?.slice(1, carsNumber.textContent.length - 1)) + 1})`;
            nameInput.value = '';
            colorInput.value = '#000000';
        })
        .catch((error) => console.log(error.message));  
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
        getCars([{key: '_page', value: `${page}`}, {key: '_limit', value: '7'}])
        .then((data) => {
            this.cars.innerHTML = '';
            data.cars.forEach((car: Car) => {
                const garageCar = new Car(car.name, car.color, car.id);
                this.cars.append(garageCar.draw());
            });
            const currentPage = <HTMLSpanElement>document.querySelector('.garage__page-number');
            currentPage.textContent = page;
        })
        .catch((error) => console.log(error.message));
    }

    private getNumberCarsInGarage() {
        getCars()
        .then((data) => {
            const carsNumber = <HTMLSpanElement>document.querySelector('.garage__number');
            carsNumber.textContent = `(${data.cars.length})`;
        })
        .catch((error) => console.log(error.message));
    }

    private animateCar(data: CarData, id: number) {
        const duration = Math.floor(data.distance / data.velocity);
        const carCard = <HTMLDivElement>document.getElementById(`${id}`);
        const carImage = <HTMLDivElement>carCard.lastChild;
                    
        let currentX = carImage.offsetLeft;
        const distance = carCard.offsetWidth - 160;
        const framesCount = duration / 1000 * 60;
        const moveX = (distance - carImage.offsetLeft) / framesCount;
        
        const move = () => {
            currentX += moveX;
            carImage.style.transform = `translateX(${currentX}px)`;         
            if(currentX < distance) {    
                this.moveId = requestAnimationFrame(move); 
            }
        }
        this.moveId = requestAnimationFrame(move);     
    }

    private driveCar(id: number) {
        driveEngine([{key: 'id', value: id}, {key: 'status', value: 'drive'}])
        .then((status) => {
            if(status === 500) {
                cancelAnimationFrame(this.moveId);
                controlEngine([{key: 'id', value: id}, {key: 'status', value: 'stopped'}])
            }
        })
        .catch((error) => console.log(error.message));
    }

    private stopCar(id: number) {
        const carCard = <HTMLDivElement>document.getElementById(`${id}`);
        const carImage = <HTMLDivElement>carCard.lastChild;
        controlEngine([{key: 'id', value: id}, {key: 'status', value: 'stopped'}])
        .then(() => {
            cancelAnimationFrame(this.moveId);
            carImage.style.transform = `translateX(0px)`;
        })
        .catch((error) => console.log(error));
    }

    private disableStartButtons() {
        const startButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.button_start');
        startButtons.forEach((button) => {
            button.classList.remove('active');
            button.classList.add('inactive');
            button.disabled = true; 
        })
    }

    private enableStartButtons() {
        const startButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.button_start');
        startButtons.forEach((button) => {
            button.classList.remove('inactive');
            button.classList.add('active');
            button.disabled = false; 
        })
    }

    private enableStopButtons() {
        const stopButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.button_stop');
        stopButtons.forEach((button) => {
            button.classList.remove('inactive');
            button.classList.add('active');
            button.disabled = false; 
        })
    }

    private disableStopButtons() {
        const stopButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.button_stop');
        stopButtons.forEach((button) => {
            button.classList.remove('active');
            button.classList.add('inactive');
            button.disabled = true; 
        })
    }

    public async getStartPromises() {
        const cards: NodeListOf<HTMLDivElement> = document.querySelectorAll('.car-item');
        const promises: Promise<CarData>[] = [];
        Array.from(cards).forEach((card) => {
            const id = card.id;
            const promise = controlEngine([{key: 'id', value: id}, {key: 'status', value: 'started'}]);
            console.log(promise)
            promises.push(promise)
        });
        const result = await Promise.all(promises);
        return result;
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

        //remove a car
        this.cars.addEventListener('click', (e) => {
            const target = <HTMLButtonElement>e.target;
            const idParent = <HTMLDivElement>target.parentElement?.parentElement;
            const id = idParent.id;
            if(target.classList.contains('button_remove')) {
                deleteCar(Number(id))
                .then(() => {
                    const currentPage = <HTMLSpanElement>document.querySelector('.garage__page-number');
                    this.fetchGarageCars(`${currentPage.textContent}`);
                    const carsNumber = <HTMLSpanElement>document.querySelector('.garage__number');
                    carsNumber.textContent = `(${Number(carsNumber.textContent?.slice(1, carsNumber.textContent.length - 1)) - 1})`;
                    // deleteWinner(Number(id)); 
                })
                .catch((error) => console.log(error.message)); 
            } 
        })

        //update car
        this.cars.addEventListener('click', (e) => {
            e.preventDefault();
            const target = <HTMLButtonElement>e.target;
            const idParent = <HTMLDivElement>target.parentElement?.parentElement;
            const carName = <HTMLHeadingElement>target.nextElementSibling?.nextElementSibling;
            const id = idParent.id;
            if(target.classList.contains('button_select')) {
                updateNameInput.value = <string>carName.textContent;
                target.classList.add('active');
                updateButton.classList.add('active');
                updateBlock.classList.remove('blocked');
                updateButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    const newName =  updateNameInput.value;
                    const newColor = updateColorInput.value;
                    if(newName === '' || newColor === '#000000') {
                        return;
                    }
                    patchCar(Number(id), {name: newName, color: newColor})
                    .then(() => {
                        const currentPage = <HTMLSpanElement>document.querySelector('.garage__page-number');
                        this.fetchGarageCars(`${currentPage.textContent}`);
                        updateNameInput.value = '';
                        updateColorInput.value = '#000000';
                        target.classList.remove('active');
                        updateBlock.classList.add('blocked');
                        updateButton.classList.remove('active');
                    })
                    .catch((error) => console.log(error.message));
                })
            }
        })

        //animate single car
        this.cars.addEventListener('click', (e) => {
            e.preventDefault();
            const target = <HTMLButtonElement>e.target;
            const idParent = <HTMLDivElement>target.parentElement?.parentElement;
            const id = idParent.id;
            if(target.classList.contains('button_start')) {
                controlEngine([{key: 'id', value: id}, {key: 'status', value: 'started'}])
                .then((data: CarData) => {
                    this.animateCar(data, Number(id));
                    this.driveCar(Number(id));
                })
                .catch((error) => console.log(error.message));
            }
            if(target.classList.contains('button_stop')) {
                this.stopCar(Number(id));
            }
        })

        //animate all cars
        raceButton.addEventListener('click', (e) => {
            e.preventDefault();
            const cards: NodeListOf<HTMLDivElement> = document.querySelectorAll('.car-item');
            const ids = Array.from(cards).map((card) => card.id);

            this.getStartPromises().then((res) => {
                res.forEach((item, index) => {
                    this.animateCar(item, Number(ids[index]));
                    this.driveCar(Number(ids[index]));
                    this.disableStartButtons();
                    this.enableStopButtons();
                })
            })
            .catch((error) => console.log(error));   
        })

        // reset
        resetButton.addEventListener('click', (e) => {
            e.preventDefault();
            const cards: NodeListOf<HTMLDivElement> = document.querySelectorAll('.car-item');
           
            Array.from(cards).forEach((card) => {
                const id = card.id;
                controlEngine([{key: 'id', value: id}, {key: 'status', value: 'stopped'}])
                .then(() => {
                    this.stopCar(Number(id));
                    this.disableStopButtons();
                    this.enableStartButtons();
                })
                .catch((error) => console.log(error.message));
            })
        })

        return this.container;
    }
}

export default GaragePage;


