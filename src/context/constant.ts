
import EzmIcon from '../asset/icons/EZM.png'
import AptIcon from '../asset/icons/Aptos.png'
import BtcIcon from '../asset/icons/crypto-btc.svg'
import EthIcon from '../asset/icons/crypto-ethereum.png'
import UsdtIcon from '../asset/icons/crypto-usdt.png'
import UsdcIcon from '../asset/icons/crypto-usdc.png'
import DaiIcon from '../asset/icons/crypto-dai.svg'

import LpIcon from '../asset/icons/LpToken.png'


export const ezfinance = "0xd346a1afda73c8f9bab2a5ed12ed1f44761fed4ce90049dfbda27bfba943ea0d";

export const tokens = {
    apt: '0x1::aptos_coin::AptosCoin',
    ezm: `${ezfinance}::faucet_tokens::EZM`,
    wbtc: `${ezfinance}::faucet_tokens::WBTC`,
    weth: `${ezfinance}::faucet_tokens::WETH`,
    usdt: `${ezfinance}::faucet_tokens::USDT`,
    usdc: `${ezfinance}::faucet_tokens::USDC`,
    dai: `${ezfinance}::faucet_tokens::DAI`,
    ceUsdc: `${ezfinance}::faucet_tokens::CEUSDC`,
}

export const TokenPrice = {
    lp: 3,
    ezm: 10,
    usdc: 1,
    usdt: 1,
    dai: 1,
    ceUsdc: 1,
    weth: 1200,
    wbtc: 17000,
    apt: 4
}

export const TokenIcon = {
    lp: LpIcon,
    ezm: EzmIcon,
    usdc: UsdcIcon,
    usdt: UsdtIcon,
    dai: DaiIcon,
    ceUsdc: UsdcIcon,
    weth: EthIcon,
    wbtc: BtcIcon,
    apt: AptIcon
}

export const coin_ezm = { name: 'EZM', symbol: 'ezm', logo: EzmIcon, }
export const coin_apt = { name: 'APT', symbol: 'apt', logo: AptIcon, }
export const coins = [
    { name: 'WBTC', symbol: 'wbtc', logo: BtcIcon },
    { name: 'WETH', symbol: 'weth', logo: EthIcon },
    { name: 'USDT', symbol: 'usdt', logo: UsdtIcon },
    { name: 'USDC', symbol: 'usdc', logo: UsdcIcon },
    { name: 'DAI', symbol: 'dai', logo: DaiIcon },
]


export const faucetItems = [
    {
        value: 'ezm',
        logo: EzmIcon,
        tokenName: 'EZM'
    }, {
        value: 'dai',
        logo: DaiIcon,
        tokenName: 'DAI'
    }, {
        value: 'usdc',
        logo: UsdcIcon,
        tokenName: 'USDC'
    }, {
        value: 'usdt',
        logo: UsdtIcon,
        tokenName: 'USDT'
    }, {
        value: 'ceUsdc',
        logo: UsdcIcon,
        tokenName: 'ceUSDC'
    }, {
        value: 'wbtc',
        logo: BtcIcon,
        tokenName: 'WBTC'
    }, {
        value: 'weth',
        logo: EthIcon,
        tokenName: 'WETH'
    }
]

