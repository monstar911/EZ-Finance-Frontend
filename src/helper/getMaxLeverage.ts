import { tokenColBorFactor } from "../context/constant";
import { trim } from "./trim";

export const tokenMaxLeverage = (symbol: string) => {
    // const borrowFactor = 1.3;
    // const collateralFactor = 0.8;
    const borrowFactor = tokenColBorFactor[symbol].bor;
    const collateralFactor = tokenColBorFactor[symbol].col;
    const cappedDebtRatio = 0.95;

    const maxLeverage = Number(trim(borrowFactor / (borrowFactor - (collateralFactor * cappedDebtRatio)), 2)) + 1;

    // console.log('max leverage: ', symbol, borrowFactor, collateralFactor, maxLeverage)

    return maxLeverage;
}
