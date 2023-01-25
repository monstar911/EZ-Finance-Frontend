import { trim } from "./trim";

export const tradingFee = (vol: number, liquidity: number) => {
    if (vol === 0 || liquidity === 0) {
        return 0.17
    }

    return trim(((vol * 0.17) / 100 / liquidity) * 100, 2)
}