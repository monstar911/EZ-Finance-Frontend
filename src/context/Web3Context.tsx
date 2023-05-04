import React, { ReactNode, useEffect, useState, createContext, useCallback } from 'react'
import { AptosClient, CoinClient } from 'aptos'
import { BACKEND_TOKEN_PRICE, BACKEND_VOLUME_DATA, ezfinance, pairs, swap_addr, swap_pancake, tokens } from './constant'
import { sleep } from '../helper/sleep'
import { ethers } from 'ethers'
import useSWR from 'swr'
import _ from 'lodash'


const client = new AptosClient('https://fullnode.testnet.aptoslabs.com/v1')
const coinClient = new CoinClient(client)

export interface IUserInfo {
    tokenBalance: Record<string, number>
    deposit: Record<string, number>
    claimable: boolean
    totalRewards: number
}

export interface ITokenPrice {
    ezm: number
    apt: number
    wbtc: number
    weth: number
    usdt: number
    usdc: number
    cake: number
    sol: number
    bnb: number
}

export interface IAptosInterface {
    arcTotalSupply: number
    poolInfo: any
    userInfo: IUserInfo
    pairTVLInfo: any
    positionInfo: any
    tokenPrice: ITokenPrice
    tokenVolume: any
    tokenPosition: any
    userPosition: any
    address: string | null
    isConnected: boolean
    connect: any
    disconnect: any
    claim: any
    deposit: any
    withdraw: any
    getFaucet: any
    checkBalance: any
    leverage_yield_farming: any
    position_withdraw: any
    add_liquidity: any
    swap: any
    borrow: any
}

interface Props {
    children?: ReactNode // any props that come into the component
}

export const Web3Context = createContext<IAptosInterface | null>(null);

export const Web3ContextProvider = ({ children, ...props }: Props) => {

    const { data: dataPrice } = useSWR(BACKEND_TOKEN_PRICE);
    const { data: dataVolume } = useSWR(BACKEND_VOLUME_DATA);

    const [, setLoading] = useState(false);
    const [wallet, setWallet] = useState<string>('');
    const [address, setAddress] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const [poolInfo, setPoolInfo] = useState({});
    const [pairTVLInfo, setPairTVLInfo] = useState({});
    const [positionInfo,] = useState({})
    const [tokenPosition, setTokenPosition] = useState({})
    const [userPosition, setUserPosition] = useState({})

    const [tokenVolume, setTokenVolume] = useState({});
    const [tokenPrice, setTokenPrice] = useState<ITokenPrice>({
        ezm: 10,
        apt: 8.2,
        wbtc: 21167.33,
        weth: 1568.66,
        usdt: 1,
        usdc: 1,
        cake: 4,
        sol: 23.81,
        bnb: 305.24,
    })

    // get token volume
    const getTokenVolume = useCallback(async () => {
        if (dataVolume === null || dataVolume === undefined) return;

        Object.keys(dataVolume).forEach((dex) => {
            for (let pair in dataVolume[dex]) {
                setTokenVolume((tokenVolume) => (_.merge(
                    tokenVolume, {
                    [dex]: {
                        [pair]: {
                            vol: dataVolume[dex][pair]['vol'],
                            liquidity: dataVolume[dex][pair]['liquidity']
                        }
                    }
                })))
            }
        })
    }, [dataVolume])

    useEffect(() => {
        getTokenVolume()
    }, [getTokenVolume])

    // get token price
    const getTokenPrice = useCallback(async () => {

        if (dataPrice) {
            Object.keys(dataPrice).forEach((symbol) => {
                tokenPrice[symbol] = dataPrice[symbol]
            })

            setTokenPrice(tokenPrice)
        }
    }, [dataPrice, tokenPrice])

    useEffect(() => {
        getTokenPrice()
    }, [getTokenPrice])

    const [userInfo, setUserInfo] = useState<IUserInfo>({
        tokenBalance: {},
        deposit: {},
        claimable: false,
        totalRewards: 0,
    })


    const getTokenPosition = async () => {
        const resOfResource = await client.getAccountResources(ezfinance)

        Object.keys(pairs).forEach((dex) => {
            for (let pair in pairs[dex]) {
                const tokenPositionInfo = resOfResource.find((item) => (
                    (item.type === `${ezfinance}::farming::PositionInfoDex<${tokens[pairs[dex][pair].x.symbol]}, ${tokens[pairs[dex][pair].y.symbol]}>`) ||
                    (item.type === `${ezfinance}::farming::PositionInfoDex<${tokens[pairs[dex][pair].y.symbol]}, ${tokens[pairs[dex][pair].x.symbol]}>`)
                ))

                if (tokenPositionInfo) {
                    if (dex === 'pancake') {

                        const tokenPositionInfoItem = tokenPositionInfo.data as {
                            'positionInfo_pan': {
                                i: {
                                    borrowAmount_x: number,
                                    borrowAmount_y: number,
                                    borrowAmount_z: number,
                                    created_at: number,
                                    dex_name: string,
                                    leverage: number,
                                    signer_addr: string,
                                    status: boolean,
                                    supplyAmount_x: number,
                                    supplyAmount_y: number,
                                    supplyAmount_z: number,
                                }
                            }
                        }

                        setTokenPosition((tokenPosition) => (_.merge(
                            tokenPosition, {
                            pancake: {
                                [pair]: tokenPositionInfoItem['positionInfo_pan']
                            }
                        })))
                    } else if (dex === 'liquid') {

                        const tokenPositionInfoItem = tokenPositionInfo.data as {
                            positionInfo_liq: {
                                i: {
                                    borrowAmount_x: number,
                                    borrowAmount_y: number,
                                    borrowAmount_z: number,
                                    created_at: number,
                                    dex_name: string,
                                    leverage: number,
                                    signer_addr: string,
                                    status: boolean,
                                    supplyAmount_x: number,
                                    supplyAmount_y: number,
                                    supplyAmount_z: number,
                                }
                            }
                        }

                        setTokenPosition((tokenPosition) => (_.merge(
                            tokenPosition, {
                            liquid: {
                                [pair]: tokenPositionInfoItem['positionInfo_liq']
                            }
                        })))
                    } else if (dex === 'aux') {

                        const tokenPositionInfoItem = tokenPositionInfo.data as {
                            positionInfo_aux: {
                                i: {
                                    borrowAmount_x: number,
                                    borrowAmount_y: number,
                                    borrowAmount_z: number,
                                    created_at: number,
                                    dex_name: string,
                                    leverage: number,
                                    signer_addr: string,
                                    status: boolean,
                                    supplyAmount_x: number,
                                    supplyAmount_y: number,
                                    supplyAmount_z: number,
                                }
                            }
                        }

                        setTokenPosition((tokenPosition) => (_.merge(
                            tokenPosition, {
                            aux: {
                                [pair]: tokenPositionInfoItem['positionInfo_aux']
                            }
                        })))
                    }
                }
            }
        })
    }

    useEffect(() => {
        getTokenPosition()
    }, [])

    const getUserPosition = useCallback(async () => {

        if (!address) return

        const resOfResource = await client.getAccountResources(ezfinance)

        Object.keys(pairs).forEach((dex) => {
            for (let pair in pairs[dex]) {

                const userPositionInfo = resOfResource.find((item) => (
                    (item.type === `${ezfinance}::farming::PositionInfoDex<${tokens[pairs[dex][pair].x.symbol]}, ${tokens[pairs[dex][pair].y.symbol]}>`) ||
                    (item.type === `${ezfinance}::farming::PositionInfoDex<${tokens[pairs[dex][pair].y.symbol]}, ${tokens[pairs[dex][pair].x.symbol]}>`)
                ))

                if (!userPositionInfo) continue

                let length = 0
                let userPositionInfoData;
                let posInfo_dex = 'positionInfo_'
                if (dex === 'pancake') {
                    posInfo_dex = posInfo_dex + 'pan'
                    userPositionInfoData = userPositionInfo.data as { posInfo_dex: { length: number } }
                    length = userPositionInfoData.positionInfo_pan.length
                } else if (dex === 'liquid') {
                    posInfo_dex = posInfo_dex + 'liq'
                    userPositionInfoData = userPositionInfo.data as { posInfo_dex: { length: number } }
                    length = userPositionInfoData.positionInfo_liq.length
                } else if (dex === 'aux') {
                    posInfo_dex = posInfo_dex + 'aux'
                    userPositionInfoData = userPositionInfo.data as { posInfo_dex: { length: number } }
                    length = userPositionInfoData.positionInfo_aux.length
                }


                let idx = 0;
                for (let i = 0; i < length; i++) {
                    const userPositionInfoItem = userPositionInfo.data as {
                        posInfo_dex: {
                            i: {
                                amountAdd_x: number,
                                amountAdd_y: number,
                                borrowAmount_x: number,
                                borrowAmount_y: number,
                                borrowAmount_z: number,
                                created_at: number,
                                dex_name: string,
                                leverage: number,
                                signer_addr: string,
                                status: boolean,
                                supplyAmount_x: number,
                                supplyAmount_y: number,
                                supplyAmount_z: number,
                            }
                        }
                    }

                    if (address !== userPositionInfoItem[posInfo_dex][`${i}`]?.signer_addr) continue;


                    // eslint-disable-next-line no-loop-func
                    setUserPosition((userPosition) => (_.merge(
                        userPosition, {
                        [dex]: {
                            [pair]: {
                                idx: userPositionInfoItem[posInfo_dex][i],
                                length: idx + 1,
                            }
                        }
                    })))

                    idx++;
                }
            }
        })
    }, [address])

    useEffect(() => {
        getUserPosition()
    }, [getUserPosition])

    // get pull information
    const getPoolInfo = useCallback(async () => {

        const resOfPool = await client.getAccountResources(ezfinance);
        Object.keys(tokens).forEach((symbol) => {
            const tokenPoolInfo = resOfPool.find((item) => item.type === `${ezfinance}::lending::Pool<${tokens[symbol]}>`)

            if (tokenPoolInfo) {
                const tokenData = tokenPoolInfo.data as { borrowed_amount: number; deposited_amount: number }
                setPoolInfo((poolInfo) => ({
                    ...poolInfo,
                    [symbol]: tokenData.deposited_amount / Math.pow(10, 8)
                }))
            }
        })
    }, [])

    useEffect(() => {
        getPoolInfo()
    }, [getPoolInfo])


    const getTVLInfoByDex = useCallback(async (dex: string) => {
        const resOfPair = await client.getAccountResources(swap_addr[dex]);

        for (let pair in pairs[dex]) {
            const tokenPairInfo = resOfPair.find((item) => (
                (item.type === `${swap_addr[dex]}::swap::TokenPairMetadata<${tokens[pairs[dex][pair].x.symbol]}, ${tokens[pairs[dex][pair].y.symbol]}>`) ||
                (item.type === `${swap_addr[dex]}::swap::TokenPairMetadata<${tokens[pairs[dex][pair].y.symbol]}, ${tokens[pairs[dex][pair].x.symbol]}>`)
            ))

            if (tokenPairInfo) {
                const tokenData = tokenPairInfo.data as { balance_x: { value: number }; balance_y: { value: number } }

                const tvl = (tokenPrice[pairs[dex][pair].x.symbol] * tokenData.balance_x.value / Math.pow(10, 8) +
                    tokenPrice[pairs[dex][pair].y.symbol] * tokenData.balance_y.value / Math.pow(10, 8))
                setPairTVLInfo((pairTVLInfo) => (_.merge(
                    pairTVLInfo, {
                    [dex]: {
                        [pair]: tvl
                    }
                })))
            }
        }
    }, [tokenPrice])

    const getTVLInfo = useCallback(() => {
        Object.keys(pairs).forEach((dex) => {
            getTVLInfoByDex(dex);
        })
    }, [getTVLInfoByDex])

    useEffect(() => {
        getTVLInfo()
    }, [getTVLInfo])

    // get user information
    const getUserInfo = useCallback(async () => {

        if (!address) return

        const resOfUser = await client.getAccountResources(address)
        Object.keys(tokens).forEach((symbol) => {

            const tokenTicketInfo = resOfUser.find((item) => item.type === `${ezfinance}::lending::Ticket<${tokens[symbol]}>`)
            if (tokenTicketInfo) {
                const _data = tokenTicketInfo.data as {
                    borrow_amount: number;
                    lend_amount: number;
                    claim_amount: number;
                }

                userInfo.deposit[symbol] = _data.lend_amount / Math.pow(10, 8)
                setUserInfo(userInfo)
            } else {
                //   console.log('getUserInfo tokenTicketInfo is null');
            }

            const tokenInfo = resOfUser.find((item) => item.type === `0x1::coin::CoinStore<${tokens[symbol]}>`)
            if (tokenInfo) {
                const _data = tokenInfo.data as { coin: { value: number } }
                userInfo.tokenBalance[symbol] = _data.coin.value / Math.pow(10, 8)
                setUserInfo(userInfo)
            } else {
                //   console.log('getUserInfo tokenInfo is null');
            }
        })

        const rewardsInfo = resOfUser.find((item) => item.type === `${ezfinance}::lending::Rewards`)
        if (rewardsInfo) {
            const _data = rewardsInfo.data as { claim_amount: number; last_claim_at: number }
            setUserInfo((userInfo) => ({
                ...userInfo,
                totalRewards: _data.claim_amount / Math.pow(10, 8),
            }))
        }
    }, [address, userInfo])

    useEffect(() => {
        getUserInfo()
    }, [getUserInfo])

    const claim = async () => {
        if (wallet === '' || !isConnected) return;
        const petraTransaction = {
            arguments: [],
            function: ezfinance + '::ezfinance::claim',
            type: 'entry_function_payload',
            type_arguments: [],
        };

        const sender = address;
        const payload = {
            arguments: [],
            function: ezfinance + '::ezfinance::claim',
            type_arguments: [],
        };
        let transaction;
        if (wallet === 'petra') {
            transaction = petraTransaction;
        } else if (wallet === 'martian') {
            transaction = await window.martian.generateTransaction(sender, payload);
        } else if (wallet === 'pontem') {
            transaction = await window.pontem.generateTransaction(sender, payload);
        }
        try {
            setLoading(true);
            if (isConnected && wallet === 'petra') {
                await window.aptos.signAndSubmitTransaction(transaction);
            } else if (isConnected && wallet === 'martian') {
                await window.martian.signAndSubmitTransaction(transaction);
            } else if (isConnected && wallet === 'pontem') {
                await window.pontem.signAndSubmitTransaction(transaction);
            }
        } finally {
            setLoading(false);
            await getUserInfo();
            await getPoolInfo();
        }
    };

    const deposit = async (symbol: string, amount: number) => {
        if (wallet === '' || !isConnected) return;
        const tokenType = tokens[symbol]

        const amountInWei = ethers.utils.parseUnits(String(amount), 8).toNumber()

        const petraTransaction = {
            arguments: [amountInWei],
            function: ezfinance + '::lending::lend',
            type: 'entry_function_payload',
            type_arguments: [tokenType],
        };

        const sender = address;
        const payload = {
            function: ezfinance + '::lending::lend',
            type_arguments: [tokenType],
            arguments: [amountInWei],
        };
        let transaction;
        if (wallet === 'petra') {
            transaction = petraTransaction;
        } else if (wallet === 'martian') {
            transaction = await window.martian.generateTransaction(sender, payload);
        } else if (wallet === 'pontem') {
            // transaction = await window.pontem.generateTransaction(sender, payload);
        }

        if (isConnected && wallet === 'petra') {
            await window.aptos.signAndSubmitTransaction(transaction);
        } else if (isConnected && wallet === 'martian') {
            await window.martian.signAndSubmitTransaction(transaction);
        } else if (isConnected && wallet === 'pontem') {
            await window.pontem.signAndSubmit(payload);
        }

        await sleep(2)
        await getUserInfo()
        await getPoolInfo()
    }

    const withdraw = async (symbol: string, amount: number) => {
        if (wallet === '' || !isConnected) return;
        const tokenType = tokens[symbol]
        const amountInWei = ethers.utils.parseUnits(String(amount), 8).toNumber()

        const petraTransaction = {
            arguments: [amountInWei],
            function: ezfinance + '::lending::withdraw',
            type: 'entry_function_payload',
            type_arguments: [tokenType],
        };

        const sender = address;
        const payload = {
            function: ezfinance + '::lending::withdraw',
            type_arguments: [tokenType],
            arguments: [amountInWei],
        };

        let transaction;
        if (wallet === 'petra') {
            transaction = petraTransaction;
        } else if (wallet === 'martian') {
            transaction = await window.martian.generateTransaction(sender, payload);
        } else if (wallet === 'pontem') {
            // transaction = await window.pontem.generateTransaction(sender, payload);
        }

        if (isConnected && wallet === 'petra') {
            await window.aptos.signAndSubmitTransaction(transaction);
        } else if (isConnected && wallet === 'martian') {
            await window.martian.signAndSubmitTransaction(transaction);
        } else if (isConnected && wallet === 'pontem') {
            await window.pontem.signAndSubmit(payload);
        }

        await sleep(2)
        await getUserInfo()
        await getPoolInfo()
    }

    const getFaucet = async (symbol: string) => {

        if (wallet === '' || !isConnected) return;
        const tokenType = tokens[symbol];
        const petraTransaction = {
            arguments: [ezfinance],
            function: ezfinance + '::faucet_provider::request',
            type: 'entry_function_payload',
            type_arguments: [tokenType],
        };

        const sender = address;
        const payload = {
            function: ezfinance + '::faucet_provider::request',
            arguments: [ezfinance],
            type_arguments: [tokenType],
        };

        let transaction;
        if (wallet === 'petra') {
            transaction = petraTransaction;
        } else if (wallet === 'martian') {
            const options = {
                max_gas_amount: "10000"
            }
            transaction = await window.martian.generateTransaction(sender, payload, options);
        } else if (wallet === 'pontem') {
            // transaction = await window.pontem.generateTransaction(sender, payload);
        }

        if (isConnected && wallet === 'petra') {
            await window.aptos.signAndSubmitTransaction(transaction);
        } else if (isConnected && wallet === 'martian') {
            await window.martian.signAndSubmitTransaction(transaction);
        } else if (isConnected && wallet === 'pontem') {
            await window.pontem.signAndSubmit(payload);
        }

        await sleep(2)
        await getUserInfo()
        await getPoolInfo()
    }

    const checkBalance = async () => {
        if (isConnected && wallet === 'petra') {
            console.log(`Account balance: ${await coinClient.checkBalance(window?.aptos.account())}`);
        } else if (isConnected && wallet === 'martian') {
            console.log(`Account balance: ${await coinClient.checkBalance(window?.martian.account())}`);
        } else if (isConnected && wallet === 'pontem') {
            console.log(`Account balance: ${await coinClient.checkBalance(window?.pontem.account())}`);
        } else {
            console.log(`Account balance: 0`);
        }
    }


    const position_withdraw = async (
        protocol: number, coinX: string, coinY: string,
        created_at: number, leverage: number,
        supplyAmount_x: number, supplyAmount_y: number, supplyAmount_z: number,
        borrowAmount_x: number, borrowAmount_y: number, borrowAmount_z: number,
        amountAdd_x: number, amountAdd_y: number) => {

    }

    const leverage_yield_farming = async (protocol: number, coinX: string, coinY: string, valuePairX: number, valuePairY: number, valueEZM: number, valueLeverage: number) => {
        if (wallet === '' || !isConnected) return;

        const tokenTypeX = tokens[coinX]
        const tokenTypeY = tokens[coinY]
        const leverageBorrowPairX = (valueLeverage - 1) * valuePairX;
        const leverageBorrowPairY = (valueLeverage - 1) * valuePairY;
        const leverageBorrowEZM = (valueLeverage - 1) * valueEZM;

        console.log('leverage_yield_farming', protocol, tokenTypeX, tokenTypeY, valuePairX, valuePairY, valueEZM,
            valueLeverage, leverageBorrowPairX, leverageBorrowPairY, leverageBorrowEZM)

        const leverageInWei = ethers.utils.parseUnits(String(valueLeverage), 8).toNumber()
        const amountInWeiSupplyPairX = ethers.utils.parseUnits(String(valuePairX), 8).toNumber()
        const amountInWeiSupplyPairY = ethers.utils.parseUnits(String(valuePairY), 8).toNumber()
        const amountInWeiSupplyEZM = ethers.utils.parseUnits(String(valueEZM), 8).toNumber()

        const amountInWeiBorrowPairX = ethers.utils.parseUnits(String(leverageBorrowPairX.toFixed(7)), 8).toNumber()
        const amountInWeiBorrowPairY = ethers.utils.parseUnits(String(leverageBorrowPairY.toFixed(7)), 8).toNumber()
        const amountInWeiBorrowEZM = ethers.utils.parseUnits(String(leverageBorrowEZM.toFixed(7)), 8).toNumber()

        console.log('leverage_yield_farming', protocol, tokenTypeX, tokenTypeY, leverageInWei, amountInWeiSupplyPairX, amountInWeiSupplyPairY, amountInWeiSupplyEZM,
            valueLeverage, amountInWeiBorrowPairX, amountInWeiBorrowPairY, amountInWeiBorrowEZM)

        const petraTransaction = {
            arguments: [protocol, leverageInWei, amountInWeiSupplyPairX, amountInWeiSupplyPairY, amountInWeiSupplyEZM,
                amountInWeiBorrowPairX, amountInWeiBorrowPairY, 0],
            function: ezfinance + '::farming::leverage_yield_farming',
            type: 'entry_function_payload',
            type_arguments: [tokenTypeX, tokenTypeY],
        };

        const sender = address;
        const payload = {
            function: ezfinance + '::farming::leverage_yield_farming',
            arguments: [protocol, leverageInWei, amountInWeiSupplyPairX, amountInWeiSupplyPairY, amountInWeiSupplyEZM,
                amountInWeiBorrowPairX, amountInWeiBorrowPairY, 0],
            type_arguments: [tokenTypeX, tokenTypeY],
        };

        let transaction;
        if (wallet === 'petra') {
            transaction = petraTransaction;
        } else if (wallet === 'martian') {
            transaction = await window.martian.generateTransaction(sender, payload);
        } else if (wallet === 'pontem') {
            // transaction = await window.pontem.generateTransaction(sender, payload);
        }

        if (isConnected && wallet === 'petra') {
            await window.aptos.signAndSubmitTransaction(transaction);
        } else if (isConnected && wallet === 'martian') {
            await window.martian.signAndSubmitTransaction(transaction);
        } else if (isConnected && wallet === 'pontem') {
            await window.pontem.signAndSubmit(payload);
        }

        await sleep(2)
        await getUserInfo();
        await getPoolInfo();
        await getTokenPosition();
        await getUserPosition();
    }

    const add_liquidity = async (protocol: string, coinX: string, coinY: string, amountX: number, amountY: number) => {

        if (wallet === '' || !isConnected) return;

        const tokenTypeX = tokens[coinX]
        const tokenTypeY = tokens[coinY]
        const amountInWeiX = ethers.utils.parseUnits(String(amountX), 8).toNumber()
        const amountInWeiY = ethers.utils.parseUnits(String(amountY), 8).toNumber()

        console.log('add_liquidity', tokenTypeX, tokenTypeY, amountInWeiX, amountInWeiY)

        const petraTransaction = {
            arguments: [amountInWeiX, amountInWeiY, 0, 0],
            function: protocol + '::router::add_liquidity',
            type: 'entry_function_payload',
            type_arguments: [tokenTypeX, tokenTypeY],
        };

        const sender = address;
        const payload = {
            function: protocol + '::router::add_liquidity',
            arguments: [amountInWeiX, amountInWeiY, 0, 0],
            type_arguments: [tokenTypeX, tokenTypeY],
        };

        let transaction;
        if (wallet === 'petra') {
            transaction = petraTransaction;
        } else if (wallet === 'martian') {
            transaction = await window.martian.generateTransaction(sender, payload);
        } else if (wallet === 'pontem') {
            // transaction = await window.pontem.generateTransaction(sender, payload);
        }

        if (isConnected && wallet === 'petra') {
            await window.aptos.signAndSubmitTransaction(transaction);
        } else if (isConnected && wallet === 'martian') {
            await window.martian.signAndSubmitTransaction(transaction);
        } else if (isConnected && wallet === 'pontem') {
            await window.pontem.signAndSubmit(payload);
        }

        await sleep(2)
        await getUserInfo();
        await getPoolInfo();
    }

    const swap = async (coinX: string, coinY: string, amountX: number, amountY: number) => {

        if (wallet === '' || !isConnected) return;

        const tokenTypeX = tokens[coinX]
        const tokenTypeY = tokens[coinY]
        const amountInWeiX = ethers.utils.parseUnits(String(amountX), 8).toNumber()

        const petraTransaction = {
            arguments: [amountInWeiX, 0],
            function: swap_pancake + '::router::swap_exact_input',
            type: 'entry_function_payload',
            type_arguments: [tokenTypeX, tokenTypeY],
        };

        const sender = address;
        const payload = {
            function: swap_pancake + '::router::swap_exact_input',
            arguments: [amountInWeiX, 0],
            type_arguments: [tokenTypeX, tokenTypeY],
        };

        let transaction;
        if (wallet === 'petra') {
            transaction = petraTransaction;
        } else if (wallet === 'martian') {
            transaction = await window.martian.generateTransaction(sender, payload);
        } else if (wallet === 'pontem') {
            // transaction = await window.pontem.generateTransaction(sender, payload);
        }

        if (isConnected && wallet === 'petra') {
            await window.aptos.signAndSubmitTransaction(transaction);
        } else if (isConnected && wallet === 'martian') {
            await window.martian.signAndSubmitTransaction(transaction);
        } else if (isConnected && wallet === 'pontem') {
            await window.pontem.signAndSubmit(payload);
        }

        await sleep(2)
        await getUserInfo();
        await getPoolInfo();
    }

    const borrow = async (coin: string, amount: number) => {

        if (wallet === '' || !isConnected) return;

        const tokenType = tokens[coin]
        const amountInWei = ethers.utils.parseUnits(String(amount), 8).toNumber()

        console.log('borrow', tokenType, amountInWei)

        const petraTransaction = {
            arguments: [amountInWei],
            function: ezfinance + '::lending::borrow',
            type: 'entry_function_payload',
            type_arguments: [tokenType],
        };

        const sender = address;
        const payload = {
            function: ezfinance + '::lending::borrow',
            arguments: [amountInWei],
            type_arguments: [tokenType],
        };

        let transaction;
        if (wallet === 'petra') {
            transaction = petraTransaction;
        } else if (wallet === 'martian') {
            transaction = await window.martian.generateTransaction(sender, payload);
        } else if (wallet === 'pontem') {
            // transaction = await window.pontem.generateTransaction(sender, payload);
        }

        if (isConnected && wallet === 'petra') {
            await window.aptos.signAndSubmitTransaction(transaction);
        } else if (isConnected && wallet === 'martian') {
            await window.martian.signAndSubmitTransaction(transaction);
        } else if (isConnected && wallet === 'pontem') {
            await window.pontem.signAndSubmit(payload);
        }

        await sleep(2)
        await getUserInfo()
        await getPoolInfo()
    }

    const connect = async (wallet: string) => {
        try {
            if (wallet === 'petra') {
                if ('aptos' in window) await window.aptos.connect()
                else
                    (window as Window).open('https://petra.app/', `_blank`)
            } else if (wallet === 'martian') {
                if ('martian' in window) await window.martian.connect()
                else (window as Window).open('https://www.martianwallet.xyz/', '_blank')
            } else if (wallet === 'pontem') {
                if ('pontem' in window) await window.pontem.connect()
                else (window as Window).open('https://pontem.network/pontem-wallet', `_blank`)
            }
            setWallet(wallet)
            checkIsConnected(wallet)
        } catch (e) {
            console.log(e);
        }
    };

    const disconnect = async () => {
        try {
            if (wallet === 'petra') await window.aptos.disconnect()
            else if (wallet === 'martian') await window.martian.disconnect()
            else if (wallet === 'pontem') await window.pontem.disconnect()
            setWallet('')
            checkIsConnected(wallet)
        } catch (e) {
            console.log(e)
        }
    };

    const checkIsConnected = async (wallet: string) => {
        if (wallet === 'petra') {
            const x = await window.aptos.isConnected()
            setIsConnected(x)
        } else if (wallet === 'martian') {
            const x = await window.martian.isConnected()
            setIsConnected(x)
        } else if (wallet === 'pontem') {
            const x = await window.pontem.isConnected()
            setIsConnected(x)
        }
    };

    // update wallet address
    useEffect(() => {
        if (isConnected && wallet === 'petra') {
            window?.aptos.account().then((data: any) => {
                setAddress(data.address);
                console.log('web3 petra address', data.address)
            });
        } else if (isConnected && wallet === 'martian') {
            window?.martian.account().then((data: any) => {
                setAddress(data.address);
                console.log('web3 martian address', data.address)
            });
        } else if (isConnected && wallet === 'pontem') {
            window?.pontem.account().then((data: any) => {
                setAddress(data);
                console.log('web3 pontem address', data.address)
            });
        } else {
            setAddress(null);
        }

    }, [isConnected, wallet]);

    // update connection
    useEffect(() => {
        checkIsConnected(wallet);
    }, [wallet]);

    const contextValue: IAptosInterface = {
        arcTotalSupply: 100000,
        poolInfo,
        userInfo,
        pairTVLInfo,
        positionInfo,
        tokenPrice,
        tokenVolume,
        tokenPosition,
        userPosition,
        address,
        isConnected,
        connect,
        disconnect,
        claim,
        deposit,
        withdraw,
        getFaucet,
        checkBalance,
        leverage_yield_farming,
        position_withdraw,
        add_liquidity,
        swap,
        borrow,
    };

    return <Web3Context.Provider value={contextValue}> {children} </Web3Context.Provider>;
};
