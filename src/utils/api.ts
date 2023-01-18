const mainUrl = 'http://127.0.0.1:3000';

const paths = {
    cars: '/garage',
    winners: '/winners',
    engine: '/engine'
}

type Param = { [key: string]: string | number}
type Car = {
    name?: string,
    color?: string,
    id?: number
}

export const generateQueryParams = (params: Param[] = []) => {
    return params ? `?${params.map((param) => `${param.key}=${param.value}`).join('&')}` : '';
}

// get cars both with params and without
export const getCars = async(queryParams: Param[] = []) => {
    const response = await fetch(`${mainUrl}${paths.cars}${generateQueryParams(queryParams)}`);
    const cars = await response.json();
    const count = Number(response.headers.get('X-Total-Count'));

    return { cars, count }
}

// get car by id
export const getCar = async(id: number) => {
    const response = await fetch(`${mainUrl}${paths.cars}/${id}`);
    const car = await response.json();

    return car;
}

// create a new car
export const createCar = async(car: Car) => {
    const response = await fetch(`${mainUrl}${paths.cars}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(car)
    });
    const newCar = await response.json();

    return newCar;
}

// update car with PUT
export const updateCar = async(id: number, car: Car) => {
    const response = await fetch(`${mainUrl}${paths.cars}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(car)
    });
    const updatedCar = await response.json();

    return updatedCar;
}

// update car's props with PATCH
export const patchCar = async(id: number, car: Car) => {
    const response = await fetch(`${mainUrl}${paths.cars}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(car)
    });
    const updatedCar = await response.json();

    return updatedCar;
}

// delete a car by id
export const deleteCar = async(id: number) => {
    const response = await fetch(`${mainUrl}${paths.cars}/${id}`, {
        method: 'DELETE'
    });
    const deletedCar = await response.json();

    return deletedCar;
}

// start engine
export const startEngine = async(queryParams: Param[] = []) => {
    const response = await fetch(`${mainUrl}${paths.engine}${generateQueryParams(queryParams)}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const carInfo = await response.json();

    return carInfo;
}

// Winners

// get all winners
export const getWinners = async(queryParams: Param[] = []) => {
    const response = await fetch(`${mainUrl}${paths.winners}${generateQueryParams(queryParams)}`);
    const winners = await response.json();
    const count = Number(response.headers.get('X-Total-Count'));

    return { winners, count }
}