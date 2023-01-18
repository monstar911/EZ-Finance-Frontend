import { trim } from "./trim";

export const calculateDebtRatio = (supplyA: number, supplyB: number, leverage: number) => {
    const borrowRatio = 0.5;
    const duration = 60;
    const newPriceA = 1500;
    const newPriceB = 1;

    const priceA = 1000;
    const priceB = 1;
    const farmAPR = 0.4; //40%
    const borrowAPRA = 0.2; //20%
    const borrowAPRB = 0.1; //10%
    const collA = 8360;
    const collB = 9598;
    const collLP = Math.min(collA, collB);
    const borrA = 11961;
    const borrB = 10419;

    const priceAtoB: number = priceA / priceB;
    const posValue: number = leverage * (supplyA * priceAtoB + Number(supplyB));
    const liquidity: number = posValue / (2 * Math.sqrt(priceAtoB));
    const debtAmt: number = (leverage - 1) * (supplyA * priceAtoB + Number(supplyB));
    const debtA: number = debtAmt * borrowRatio / priceAtoB;
    const debtB: number = debtAmt * (1 - borrowRatio);
    const newPriceAtoB: number = newPriceA / newPriceB;
    console.log("calculateDebtRatio: ", posValue, debtAmt, debtA, debtB, newPriceAtoB, liquidity);
    const newPosA: number = (Number(1) + duration * farmAPR / 365) * liquidity / Math.sqrt(newPriceAtoB);
    const newPosB: number = (1 + duration * farmAPR / 365) * liquidity * Math.sqrt(newPriceAtoB);
    const newDebtA: number = (1 + duration * borrowAPRA / 365) * debtA;
    const newDebtB: number = (1 + duration * borrowAPRB / 365) * debtB;
    const netA: number = newPosA - newDebtA;
    const netB: number = newPosB - newDebtB;
    const netValue: number = netA * newPriceAtoB + Number(netB);
    const holdValue: number = supplyA * newPriceAtoB + Number(supplyB);
    console.log("calculateDebtRatio: ", newPosA, newPosB, newDebtA, newDebtB, netValue);
    const pnl: number = (netValue / holdValue - 1) * 100;
    const posCollCredit: number = (newPosA * newPriceAtoB + Number(newPosB)) * collLP;
    const posBorrCredit: number = newDebtA * newPriceAtoB * borrA + Number(newDebtB * borrB);
    const debtRatio: number = posBorrCredit / posCollCredit * 100;

    console.log("calculateDebtRatio: ", debtRatio);

    return trim(debtRatio, 2);
}