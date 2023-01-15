import { trim } from "./trim";

export const getValuePositionX = (x: number, y: number, z: number, priceX: number, priceY: number, priceZ: number, leverage: number) => {
    return trim(leverage * ((x / 2) + (y / 2) * (priceY / priceX) + (z / 2) * (priceZ / priceX)), 3);
};

export const getValuePositionY = (x: number, y: number, z: number, priceX: number, priceY: number, priceZ: number, leverage: number) => {
    return trim(leverage * ((y / 2) + (x / 2) * (priceX / priceY) + (z / 2) * (priceZ / priceY)), 3);
}

export const getValuePositionDolarX = (x: number, y: number, z: number, priceX: number, priceY: number, priceZ: number, leverage: number) => {
    return trim(leverage * (priceX * ((x / 2) + (y / 2) * (priceY / priceX) + (z / 2) * (priceZ / priceX))), 2);
}

export const getValuePositionDolarY = (x: number, y: number, z: number, priceX: number, priceY: number, priceZ: number, leverage: number) => {
    return trim(leverage * (priceY * ((y / 2) + (x / 2) * (priceX / priceY) + (z / 2) * (priceZ / priceY))), 2);
}
