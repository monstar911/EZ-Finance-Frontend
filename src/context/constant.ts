import LpIcon from '../asset/icons/LpToken.png'
import EzmIcon from '../asset/icons/EZM.png'
import AptosIcon from '../asset/icons/Aptos.png'
import BtcIcon from '../asset/icons/crypto-btc.svg'
import UsdcIcon from '../asset/icons/crypto-usdc.png'
import UsdtIcon from '../asset/icons/crypto-usdt.png'
import EthereumIcon from '../asset/icons/crypto-ethereum.png'
import DaiIcon from '../asset/icons/crypto-dai.svg'


export const ezfinance = "0xd346a1afda73c8f9bab2a5ed12ed1f44761fed4ce90049dfbda27bfba943ea0d";

export const tokens = {
    ezm: `${ezfinance}::faucet_tokens::EZM`,
    usdc: `${ezfinance}::faucet_tokens::USDC`,
    usdt: `${ezfinance}::faucet_tokens::USDT`,
    dai: `${ezfinance}::faucet_tokens::DAI`,
    ceUsdc: `${ezfinance}::faucet_tokens::CEUSDC`,
    weth: `${ezfinance}::faucet_tokens::WETH`,
    wbtc: `${ezfinance}::faucet_tokens::WBTC`,
    apt: '0x1::aptos_coin::AptosCoin',
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
    weth: EthereumIcon,
    wbtc: BtcIcon,
    apt: AptosIcon
}

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
        logo: EthereumIcon,
        tokenName: 'WETH'
    }
]

