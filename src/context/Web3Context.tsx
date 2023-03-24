import React, { ReactNode, useEffect, useState, createContext } from 'react'
import { AptosClient, CoinClient } from 'aptos'
import { BACKEND_TOKEN_PRICE, BACKEND_VOLUME_DATA, ezfinance, pairs, swap_addr, swap_pancake, TokenPrice, tokens } from './constant'
import { sleep } from '../helper/sleep'
import { ethers } from 'ethers'
import useSWR from 'swr'
import _ from 'lodash'

// const WalletClient = require("aptos-wallet-api/src/wallet-client");
// const NODE_URL = "https://fullnode.testnet.aptoslabs.com/v1";
// const FAUCET_URL = "https://faucet.net.aptoslabs.com";
// const walletClient = new WalletClient(NODE_URL, FAUCET_URL);


const client = new AptosClient('https://fullnode.testnet.aptoslabs.com/v1');
const coinClient = new CoinClient(client);

export interface IUserInfo {
    tokenBalance: Record<string, number>;
    deposit: Record<string, number>;
    claimable: boolean;
    totalRewards: number;
}

export interface ITokenPrice3 {
    ezm: number;
    apt: number;
    wbtc: number;
    weth: number;
    usdt: number;
    usdc: number;
    cake: number;
    sol: number;
    bnb: number;
}

export interface IAptosInterface {
    arcTotalSupply: number;
    poolInfo: any;
    userInfo: IUserInfo;
    pairTVLInfo: any;
    positionInfo: any;
    tokenPrice: Record<string, number>;
    tokenPrice3: ITokenPrice3;
    tokenVolume: any;
    tokenPosition: any;
    userPosition: any;
    address: string | null;
    isConnected: boolean;
    connect: any;
    disconnect: any;
    claim: any;
    deposit: any;
    withdraw: any;
    getFaucet: any;
    checkBalance: any;
    leverage_yield_farming: any;
    position_withdraw: any;
    add_liquidity: any;
    swap: any;
    borrow: any;
}

interface Props {
    children?: ReactNode; // any props that come into the component
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
    const [positionInfo, setPositionInfo] = useState({})
    const [tokenPosition, setTokenPosition] = useState({})
    const [userPosition, setUserPosition] = useState({})

    const [tokenVolume, setTokenVolume] = useState({});
    const [tokenPrice3, setTokenPrice] = useState<ITokenPrice3>({
        ezm: 10,
        apt: 8.2,
        wbtc: 21167.33,
        weth: 1568.66,
        usdt: 1,
        usdc: 1,
        cake: 4,
        sol: 23.81,
        bnb: 305.24,
    });

    // get token volume
    const getTokenVolume = async () => {
        if (dataVolume === null || dataVolume === undefined) return;

        console.log('token volume:', dataVolume);

        Object.keys(dataVolume).forEach((dex) => {
            for (let pair in dataVolume[dex]) {
                setTokenVolume((tokenVolume) => (_.merge(
                    tokenVolume, {
                    [dex]: {
                        [pair]: {
                            ['vol']: dataVolume[dex][pair]['vol'],
                            ['liquidity']: dataVolume[dex][pair]['liquidity']
                        }
                    }
                })))
            }
        })
    };

    useEffect(() => {
        getTokenVolume();
    }, [dataVolume]);

    // get token price
    const getTokenPrice = async () => {
        // console.log('token price:', dataPrice);

        if (dataPrice) {
            Object.keys(dataPrice).map((symbol) => {
                // console.log('dataPrice item:', symbol);

                tokenPrice3[symbol] = dataPrice[symbol]
            })

            setTokenPrice(tokenPrice3);
        }
    };

    useEffect(() => {
        getTokenPrice();
    }, [dataPrice]);

    const [userInfo, setUserInfo] = useState<IUserInfo>({
        tokenBalance: {},
        deposit: {},
        claimable: false,
        totalRewards: 0,
    });



    // 0x4d63574ba8d90a5926e2866d8291e57683108a47b96d884232a871fe4feddf41::farming::PositionInfoDex
    // <
    // 0x1::aptos_coin::AptosCoin, 
    // 0x4d63574ba8d90a5926e2866d8291e57683108a47b96d884232a871fe4feddf41::faucet_tokens::USDC
    // >
    // {
    //     positionInfo_aux: []
    //     positionInfo_liq: []
    //     positionInfo_pan: [
    //         0: {
    //             borrowAmount_x: "1160000"
    //             borrowAmount_y: "116000000"
    //             borrowAmount_z: "0"
    //             created_at: "1674781684"
    //             dex_name: "PancakeSwap"
    //             leverage: "216000000"
    //             signer_addr: "0xb926569bb507dafd750c44c26e9f9ab322da7010273d5c5f321c1c14e4bf2065"
    //             status: true
    //             supplyAmount_x: "1000000"
    //             supplyAmount_y: "100000000"
    //             supplyAmount_z: "100000000"
    //         }
    //     ]
    // }
    const getTokenPosition = async () => {
        const resOfResource = await client.getAccountResources(ezfinance)

        // console.log('getTokenPosition start')
        Object.keys(pairs).forEach((dex) => {
            for (let pair in pairs[dex]) {
                const tokenPositionInfo = resOfResource.find((item) => (
                    (item.type === `${ezfinance}::farming::PositionInfoDex<${tokens[pairs[dex][pair].x.symbol]}, ${tokens[pairs[dex][pair].y.symbol]}>`) ||
                    (item.type === `${ezfinance}::farming::PositionInfoDex<${tokens[pairs[dex][pair].y.symbol]}, ${tokens[pairs[dex][pair].x.symbol]}>`)
                ))

                // console.log('getTokenPosition tokenPositionInfo', dex, pair, tokenPositionInfo);
                if (tokenPositionInfo) {
                    let tokenPositionInfoData;
                    if (dex === 'pancake') {
                        tokenPositionInfoData = tokenPositionInfo.data as { positionInfo_pan: { length: number } }
                        // console.log('getTokenPosition position count', tokenPositionInfoData.positionInfo_pan.length)

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
                        // console.log('getTokenPosition tokenPositionInfoItem', tokenPositionInfoItem['positionInfo_pan'])

                        setTokenPosition((tokenPosition) => (_.merge(
                            tokenPosition, {
                            ['pancake']: {
                                [pair]: tokenPositionInfoItem['positionInfo_pan']
                            }
                        })))
                    } else if (dex === 'liquid') {
                        tokenPositionInfoData = tokenPositionInfo.data as { positionInfo_liq: { length: number } }
                        // console.log('getTokenPosition position count', tokenPositionInfoData.positionInfo_liq.length)

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
                        // console.log('getTokenPosition tokenPositionInfoItem', tokenPositionInfoItem['positionInfo_liq'])

                        setTokenPosition((tokenPosition) => (_.merge(
                            tokenPosition, {
                            ['liquid']: {
                                [pair]: tokenPositionInfoItem['positionInfo_liq']
                            }
                        })))
                    } else if (dex === 'aux') {
                        tokenPositionInfoData = tokenPositionInfo.data as { positionInfo_aux: { length: number } }
                        // console.log('getTokenPosition position count', tokenPositionInfoData.positionInfo_aux.length)

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
                        // console.log('getTokenPosition tokenPositionInfoItem', tokenPositionInfoItem['positionInfo_aux'])
                        setTokenPosition((tokenPosition) => (_.merge(
                            tokenPosition, {
                            ['aux']: {
                                [pair]: tokenPositionInfoItem['positionInfo_aux']
                            }
                        })))
                    }
                }
            }
        })

        // setTokenPosition(tokenPositionInfoAll)
        // console.log('getTokenPosition tokenPositionInfoAll', tokenPosition);
    }

    useEffect(() => {
        getTokenPosition();
    }, []);

    const getUserPosition = async () => {
        console.log('web3 getUserPosition address', address)
        if (!address) return

        const resOfResource = await client.getAccountResources(ezfinance)

        console.log('web3 getUserPosition getAccountResources')
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

                // console.log('web3 getPositionInfo posInfo_dex:', posInfo_dex)

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

                    // console.log('web3 getUserPosition addr', address, userPositionInfoItem[posInfo_dex][`${i}`]?.signer_addr)

                    if (address !== userPositionInfoItem[posInfo_dex][`${i}`]?.signer_addr) continue;


                    setUserPosition((userPosition) => (_.merge(
                        userPosition, {
                        [dex]: {
                            [pair]: {
                                [`${idx}`]: userPositionInfoItem[posInfo_dex][i],
                                ['length']: idx + 1,
                            }
                        }
                    })))

                    idx++;
                }
            }
        })

        console.log('web3 getUserPosition', userPosition);
    }

    useEffect(() => {
        getUserPosition();
    }, [address, userPosition]);

    // get pull information
    const getPoolInfo = async () => {

        const resOfPool = await client.getAccountResources(ezfinance);
        Object.keys(tokens).map((symbol) => {
            const tokenPoolInfo = resOfPool.find((item) => item.type === `${ezfinance}::lending::Pool<${tokens[symbol]}>`)
            // console.log('getPoolInfo', tokenPoolInfo)
            if (tokenPoolInfo) {
                const tokenData = tokenPoolInfo.data as { borrowed_amount: number; deposited_amount: number }
                setPoolInfo((poolInfo) => ({
                    ...poolInfo,
                    [symbol]: tokenData.deposited_amount / Math.pow(10, 8)
                }))
            }
        })
    };

    useEffect(() => {
        getPoolInfo();
    }, []);

    // get total value locked information
    // 0xc4911c40cf758ec21c0ebf0e547933ef6bb0f53ad581c08d2ecc7ad11364be1b::swap::TokenPairMetadata
    // <
    //     0xb0b237b5df754b80d46d27616e63252305e7724dc2bb304a7db4cbc5adb0a97b::faucet_tokens::DAI, 
    //     0xb0b237b5df754b80d46d27616e63252305e7724dc2bb304a7db4cbc5adb0a97b::faucet_tokens::EZM
    // >
    const getTVLInfoByDex = async (dex: string) => {
        const resOfPair = await client.getAccountResources(swap_addr[dex]);

        for (let pair in pairs[dex]) {
            const tokenPairInfo = resOfPair.find((item) => (
                (item.type === `${swap_addr[dex]}::swap::TokenPairMetadata<${tokens[pairs[dex][pair].x.symbol]}, ${tokens[pairs[dex][pair].y.symbol]}>`) ||
                (item.type === `${swap_addr[dex]}::swap::TokenPairMetadata<${tokens[pairs[dex][pair].y.symbol]}, ${tokens[pairs[dex][pair].x.symbol]}>`)
            ))

            // console.log('getTVLInfo tokenPairInfo', pair, tokenPairInfo);
            if (tokenPairInfo) {
                const tokenData = tokenPairInfo.data as { balance_x: { value: number }; balance_y: { value: number } }
                // console.log('getTVLInfo tokenData.balance_x', tokenData.balance_x.value);
                const tvl = (tokenPrice3[pairs[dex][pair].x.symbol] * tokenData.balance_x.value / Math.pow(10, 8) +
                    tokenPrice3[pairs[dex][pair].y.symbol] * tokenData.balance_y.value / Math.pow(10, 8))
                setPairTVLInfo((pairTVLInfo) => (_.merge(
                    pairTVLInfo, {
                    [dex]: {
                        [pair]: tvl
                    }
                })))
                // console.log('getTVLInfo pairTVLInfo', pairTVLInfo);
            }
        }
    }

    const getTVLInfo = () => {
        Object.keys(pairs).forEach((dex) => {
            getTVLInfoByDex(dex);
        })
    }

    useEffect(() => {
        getTVLInfo();
    }, []);

    // get user information
    const getUserInfo = async () => {
        // console.log('getUserInfo address:', address);

        if (!address) return


        const resOfUser = await client.getAccountResources(address)
        Object.keys(tokens).map((symbol) => {
            // console.log('getUserInfo Ticket:', symbol);

            // Type:0x1144baa18fd0f3cbf2d40d49f8bedcd7afc8eeca4f6c73be5e073db45aa16f55::lending::Ticket
            // <
            // 0x1144baa18fd0f3cbf2d40d49f8bedcd7afc8eeca4f6c73be5e073db45aa16f55::faucet_tokens::EZM
            // >
            // {
            // borrow_amount:"0"
            // lend_amount:"10000000000"
            // }
            const tokenTicketInfo = resOfUser.find((item) => item.type === `${ezfinance}::lending::Ticket<${tokens[symbol]}>`)
            if (tokenTicketInfo) {
                const _data = tokenTicketInfo.data as {
                    borrow_amount: number;
                    lend_amount: number;
                    claim_amount: number;
                }
                // console.log('getUserInfo borrow_amount:', _data.borrow_amount);

                userInfo.deposit[symbol] = _data.lend_amount / Math.pow(10, 8)
                setUserInfo(userInfo)
            } else {
                // console.log('getUserInfo tokenTicketInfo is null');
            }

            const tokenInfo = resOfUser.find((item) => item.type === `0x1::coin::CoinStore<${tokens[symbol]}>`)
            if (tokenInfo) {
                const _data = tokenInfo.data as { coin: { value: number } }
                userInfo.tokenBalance[symbol] = _data.coin.value / Math.pow(10, 8)
                setUserInfo(userInfo)
            } else {
                // console.log('getUserInfo tokenInfo is null');
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
    };

    useEffect(() => {
        getUserInfo();
    }, [address, userInfo]);

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
        await getUserInfo();
        await getPoolInfo();
    };

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
        await getUserInfo();
        await getPoolInfo();
    };

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
        await getUserInfo();
        await getPoolInfo();
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

    // const getMinimumReceivedLP = async (tokenX: string, tokenY: string, amount: number) => {

    // }

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
        const amountInWeiY = ethers.utils.parseUnits(String(amountY), 8).toNumber()

        console.log('swap', tokenTypeX, tokenTypeY, amountInWeiX, amountInWeiY)

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
        await getUserInfo();
        await getPoolInfo();
    }

    const connect = async (wallet: string) => {
        try {
            if (wallet === 'petra') {
                if ('aptos' in window) await window.aptos.connect();
                //  else window.open('https://petra.app/', `_blank`);
            } else if (wallet === 'martian') {
                if ('martian' in window) await window.martian.connect();
                // else window.open('https://www.martianwallet.xyz/', '_blank');
            } else if (wallet === 'pontem') {
                if ('pontem' in window) await window.pontem.connect();
                // else window.open('https://petra.app/', `_blank`);
            }
            setWallet(wallet);
            checkIsConnected(wallet);
        } catch (e) {
            console.log(e);
        }
    };

    const disconnect = async () => {
        try {
            if (wallet === 'petra') await window.aptos.disconnect();
            else if (wallet === 'martian') await window.martian.disconnect();
            else if (wallet === 'pontem') await window.pontem.disconnect();
            setWallet('');
            checkIsConnected(wallet);
        } catch (e) {
            console.log(e);
        }
    };

    const checkIsConnected = async (wallet: string) => {
        if (wallet === 'petra') {
            const x = await window.aptos.isConnected();
            setIsConnected(x);
        } else if (wallet === 'martian') {
            const x = await window.martian.isConnected();
            setIsConnected(x);
        } else if (wallet === 'pontem') {
            const x = await window.pontem.isConnected();
            setIsConnected(x);
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
        tokenPrice: TokenPrice,
        tokenPrice3,
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
