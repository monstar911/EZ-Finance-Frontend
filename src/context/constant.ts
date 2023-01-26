
import EzmIcon from '../asset/icons/EZM.png'
import AptIcon from '../asset/icons/Aptos.png'
import BtcIcon from '../asset/icons/crypto-btc.svg'
import EthIcon from '../asset/icons/crypto-ethereum.png'
import UsdtIcon from '../asset/icons/crypto-usdt.png'
import UsdcIcon from '../asset/icons/crypto-usdc.png'
import DaiIcon from '../asset/icons/crypto-dai.svg'
import SolIcon from '../asset/icons/sol.png'
import BnbIcon from '../asset/icons/bnb.png'

import LiquidIcon from '../asset/icons/logo-swap-liquid.png'
import PancakeIcon from '../asset/icons/logo-swap-pancake.png'
import AuxIcon from '../asset/icons/logo-swap-aux.png'

//lending, farming
export const ezfinance = "0x9f9398105e1a0367d9d92b48cf36570e8e323b5a5fa73b94b3e4ddc106960351";

export const swap_pancake = "0xc4911c40cf758ec21c0ebf0e547933ef6bb0f53ad581c08d2ecc7ad11364be1b";
export const swap_liquid = "0x4649d843c7fe546a580aaebc58db6d242a3ce381545e13a5d0888ac1a35dd4f1";
export const swap_aux = "0xf97e20653eb6765182275d11adb8ebe62d1456b3d73780e9e59925d7305c595e";

export const swap_addr = {
    pancake: swap_pancake,
    liquid: swap_liquid,
    aux: swap_aux,
}

// export const BACKEND_TOKEN_PRICE = "https://82.180.160.21:4000/api/prices";
// export const BACKEND_VOLUME_DATA = "https://82.180.160.21:4000/api/dexes";

export const BACKEND_TOKEN_PRICE = "https://localhost:5000/api/prices";
export const BACKEND_VOLUME_DATA = "https://localhost:5000/api/dexes";

export const tokens = {
    apt: '0x1::aptos_coin::AptosCoin',
    ezm: `${ezfinance}::faucet_tokens::EZM`,
    wbtc: `${ezfinance}::faucet_tokens::WBTC`,
    weth: `${ezfinance}::faucet_tokens::WETH`,
    usdt: `${ezfinance}::faucet_tokens::USDT`,
    usdc: `${ezfinance}::faucet_tokens::USDC`,
    sol: `${ezfinance}::faucet_tokens::SOL`,
    bnb: `${ezfinance}::faucet_tokens::BNB`,
}

export const protocols = {
    pancake: { name: 'PancakeSwap', symbol: 'pancakeswap', logo: PancakeIcon },
    liquid: { name: 'LiquidSwap', symbol: 'liquidswap', logo: LiquidIcon },
    aux: { name: 'AUX Exchange', symbol: 'auxswap', logo: AuxIcon },
}

export const coins = {
    ezm: { name: 'EZM', symbol: 'ezm', logo: EzmIcon },
    apt: { name: 'APT', symbol: 'apt', logo: AptIcon },
    wbtc: { name: 'WBTC', symbol: 'wbtc', logo: BtcIcon },
    weth: { name: 'WETH', symbol: 'weth', logo: EthIcon },
    usdt: { name: 'USDT', symbol: 'usdt', logo: UsdtIcon },
    usdc: { name: 'USDC', symbol: 'usdc', logo: UsdcIcon },
    // cake: {name:'Cake', symbol:'cake', logo:},
    sol: { name: 'SOL', symbol: 'sol', logo: SolIcon },
    bnb: { name: 'BNB', symbol: 'bnb', logo: BnbIcon },
}

// Pools
// PancakeSwap: 1. APT/USDC, 2. WETH/USDC, 3. Cake/APT, 4. BNB/USDC, 5. USDC/USDT
// LiquidSwap: 1. APT/USDC, 2. Weth/USDC, 3. Weth/apt, 4. Wbtc/apt
// AUX: 1. APT/USDC, 2. Sol/USDC, 3. Weth/USDC, 4. Wbtc/USDC, 5. USDC/USDT
export const pairs = {
    pancake: {
        'apt-usdc': {
            x: coins.apt,
            y: coins.usdc
        },
        'weth-usdc': {
            x: coins.weth,
            y: coins.usdc
        },
        // 'cake-apt': {
        //     x: coins.cake,
        //     y: coins.apt
        // },
        'bnb-usdc': {
            x: coins.bnb,
            y: coins.usdc
        },
        'usdc-usdt': {
            x: coins.usdc,
            y: coins.usdt
        },
    },

    liquid: {
        'apt-usdc': {
            x: coins.apt,
            y: coins.usdc
        },
        'weth-usdc': {
            x: coins.weth,
            y: coins.usdc
        },
        'weth-apt': {
            x: coins.weth,
            y: coins.apt
        },
        'wbtc-apt': {
            x: coins.wbtc,
            y: coins.apt
        },
    },

    aux: {
        'apt-usdc': {
            x: coins.apt,
            y: coins.usdc
        },
        'sol-usdc': {
            x: coins.sol,
            y: coins.usdc
        },
        'weth-usdc': {
            x: coins.weth,
            y: coins.usdc
        },
        'wbtc-usdc': {
            x: coins.wbtc,
            y: coins.usdc
        },
        'usdc-usdt': {
            x: coins.usdc,
            y: coins.usdt
        },
    }
}

export const TokenPrice = {
    lp: 3,
    ezm: 10,
    usdc: 1,
    usdt: 1,
    sol: 23.81,
    weth: 1200,
    wbtc: 17000,
    apt: 4,
    bnb: 305.24,
}

//https://docs.alphaventuredao.io/homora-v2/additional-information/collateral-factor-and-borrow-factor/ethereum
// https://homora-v2.alphaventuredao.io/positions
export const tokenColBorFactor = {
    apt: { col: 0.61, bor: 1.37 },
    ezm: { col: 0.67, bor: 1.49 },
    wbtc: { col: 0.79, bor: 1.26 },
    weth: { col: 0.79, bor: 1.26 },
    usdt: { col: 0.85, bor: 1.15 },
    usdc: { col: 0.85, bor: 1.15 },
    sol: { col: 0.82, bor: 1.18 },
    bnb: { col: 0.75, bor: 1.35 },
}

export const maxDefaultAPR = {
    apt: 4.64,
    ezm: 4.64,
    wbtc: 6.52,
    weth: 6.52,
    usdt: 4.64,
    usdc: 4.64,
    sol: 4.64,
    bnb: 6.52
}
