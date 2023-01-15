const mainUrl = 'http://127.0.0.1:3000';

const paths = {
    cars: '/garage',
    winners: '/winners'
}

type Param = { [key: string]: string}
type Car = {
    name?: string,
    color?: string
}

const generateQueryParams = (params: Param[] = []) => {
    return params ? `?${params.map((param) => `${param.key}=${param.value}`).join('&')}` : '';
}

// get cars both with params and without
export const getCars = async(queryParams: Param[]) => {
    const response = await fetch(`${mainUrl}${paths.cars}${generateQueryParams(queryParams)}`);
    const cars = await response.json();

    const count = Number(response.headers.get('X-Total-Count'));

    console.log(cars, count)

    return { cars, count }
}

// get car by id
export const getCar = async(id: number) => {
    const response = await fetch(`${mainUrl}${paths.cars}/${id}`);
    const car = await response.json();

    console.log(car);

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