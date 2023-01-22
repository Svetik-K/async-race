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
type Winner = {
    id?: number,
    wins?: number,
    time?: number
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

// Engine

// start engine
export const controlEngine = async(queryParams: Param[] = []) => {
    const response = await fetch(`${mainUrl}${paths.engine}${generateQueryParams(queryParams)}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const carInfo = await response.json();

    return carInfo;
}

export const driveEngine = async(queryParams: Param[] = []) => {
    const response = await fetch(`${mainUrl}${paths.engine}${generateQueryParams(queryParams)}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    // const carInfo = await response.json();

    return response.status;
}

// Winners

// get all winners
export const getWinners = async(queryParams: Param[] = []) => {
    const response = await fetch(`${mainUrl}${paths.winners}${generateQueryParams(queryParams)}`);
    const winners = await response.json();
    const count = Number(response.headers.get('X-Total-Count'));

    return { winners, count }
}

export const getWinner = async(id: number) => {
    const response = await fetch(`${mainUrl}${paths.winners}/${id}`);
    const winner = await response.json();
    return winner;
}

// create a winner
export const createWinner = async(winner: Winner) => {
    const response = await fetch(`${mainUrl}${paths.winners}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(winner)
    });
    const newWinner = await response.json();

    return newWinner;
}

// delete a winner by id
export const deleteWinner = async(id: number) => {
    const response = await fetch(`${mainUrl}${paths.winners}/${id}`, {
        method: 'DELETE'
    });
    const deletedWinner = await response.json();

    return deletedWinner;
}

// update winner's props with PATCH
export const updateWinner = async(id: number, winner: Winner) => {
    const response = await fetch(`${mainUrl}${paths.winners}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(winner)
    });
    const updatedWinner = await response.json();

    return updatedWinner;
}

export const getWinnerStatus = async(id: number) => (await fetch(`${mainUrl}${paths.winners}/${id}`)).status;

export const saveWinner = async(id: number, time: number) => {
    const winnerStatus = await getWinnerStatus(id);
    if(winnerStatus === 404) {
        await createWinner({
            id,
            wins: 1,
            time
        })
    } else {
        const winner = await getWinner(id);
        await updateWinner(id, {
            id,
            wins: winner.wins + 1,
            time: time < winner.time ? time : winner.time
        })
    }
}
