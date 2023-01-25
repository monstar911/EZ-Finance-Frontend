import { maxDefaultAPR } from "../context/constant";
import { trim } from "./trim";

export const getEstimatedAPR = (symbol: string, leverage: number) => {
    return trim(maxDefaultAPR[symbol] - (4.64 + 4.57) / 1.41 * (leverage - 1), 2);
}

export const getMaxAPR = (symbol: string, maxLeverage: number) => {
    let maxIndex = -1;
    let maxRatio = -100000;

    for (let i = 1; i < maxLeverage; i += 0.01) {
        const estAPR = +getEstimatedAPR(symbol, i);
        // console.log('getMaxAPR i: ', i, maxIndex, maxRatio, estAPR);

        if (maxRatio < estAPR) {
            maxIndex = i;
            maxRatio = estAPR;
        }
    }

    // console.log('getMaxAPR: ', maxRatio);

    return [maxIndex, maxRatio];
}