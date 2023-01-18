
import EzmIcon from '../asset/icons/EZM.png'
import AptIcon from '../asset/icons/Aptos.png'
import BtcIcon from '../asset/icons/crypto-btc.svg'
import EthIcon from '../asset/icons/crypto-ethereum.png'
import UsdtIcon from '../asset/icons/crypto-usdt.png'
import UsdcIcon from '../asset/icons/crypto-usdc.png'
import DaiIcon from '../asset/icons/crypto-dai.svg'


export const ezfinance = "0x9ff56be1fb43f6bdb628f7b3842560300beb9e1f7026ec618ba35b8e5cec39de";
export const pancake = "0xc4911c40cf758ec21c0ebf0e547933ef6bb0f53ad581c08d2ecc7ad11364be1b";
// export const BACKEND_TOKEN_PRICE = "https://82.180.160.21:4000/api/prices";
export const BACKEND_TOKEN_PRICE = "https://localhost:5000/api/prices";

export const tokens = {
    apt: '0x1::aptos_coin::AptosCoin',
    ezm: `${ezfinance}::faucet_tokens::EZM`,
    wbtc: `${ezfinance}::faucet_tokens::WBTC`,
    weth: `${ezfinance}::faucet_tokens::WETH`,
    usdt: `${ezfinance}::faucet_tokens::USDT`,
    usdc: `${ezfinance}::faucet_tokens::USDC`,
    dai: `${ezfinance}::faucet_tokens::DAI`,
}

export const TokenPrice = {
    lp: 3,
    ezm: 10,
    usdc: 1,
    usdt: 1,
    dai: 1,
    weth: 1200,
    wbtc: 17000,
    apt: 4
}

export const coins = {
    ezm: { name: 'EZM', symbol: 'ezm', logo: EzmIcon },
    apt: { name: 'APT', symbol: 'apt', logo: AptIcon },
    wbtc: { name: 'WBTC', symbol: 'wbtc', logo: BtcIcon },
    weth: { name: 'WETH', symbol: 'weth', logo: EthIcon },
    usdt: { name: 'USDT', symbol: 'usdt', logo: UsdtIcon },
    usdc: { name: 'USDC', symbol: 'usdc', logo: UsdcIcon },
    dai: { name: 'DAI', symbol: 'dai', logo: DaiIcon },
}
