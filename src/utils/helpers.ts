export function createRandomColor() {
    const hexValues = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F'];
    let hex = '#';
    for(let i = 0; i < 6; i++){
        const index = Math.floor(Math.random() * hexValues.length)
        hex += hexValues[index];
    }
    return hex;
}

export function createCarName() {
    const firstNames = ['Ford', 'Fiat', 'Honda', 'Isuzu', 'BMW', 'Kia', 'Mercedes', 'Mitsubishi', 'Mazda', 'Nissan', 'Opel', 'Porsche', 'Audi', 'Renault', 'Saab', 'SEAT', 'Skoda', 'Subaru', 'Volvo', 'Toyota'];
    const secondName = ['Integra', 'MDX', 'A3', 'Sorento', 'Encore', 'Escalade', 'Blazer', 'Charger', '500X', 'Bronco', 'Escape', 'Transit', 'G80', 'Canyon', 'Yukon', 'Pilot', 'Palisade', 'Compass', 'Carnival', 'Discovery'];
    const randomName = `${firstNames[Math.floor(Math.random() * 20)]} ${secondName[Math.floor(Math.random() * 20)]}`;
    return randomName;
}

export const raceAll = async(promises: any[], ids: string[]) => {
    const result = await Promise.race(promises);
    console.log(result)

    if(!result.success) {
        const failed = ids.findIndex(index => index === result.id);
    }
}