
export const ezfinance = "0xac864f0ac98704df22572b04ba1cf5630046b5534c1cfd8bcc68d493f9ad6452";
// export const ezfinance = "0xb926569bb507dafd750c44c26e9f9ab322da7010273d5c5f321c1c14e4bf2065";
// abc6f78cff1a65c65a5a9f672d374110b84bf83c5ce55ba3626bb6bdfc28d224
import LpIcon from '../asset/icons/LpToken.png'
import EzmIcon from '../asset/icons/EZM.png'
import AptosIcon from '../asset/icons/Aptos.png'
import BtcIcon from '../asset/icons/crypto-btc.svg'
import UsdcIcon from '../asset/icons/crypto-usdc.png'
import UsdtIcon from '../asset/icons/crypto-usdt.png'
import EthereumIcon from '../asset/icons/crypto-ethereum.png'
import DaiIcon from '../asset/icons/crypto-dai.svg'

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

