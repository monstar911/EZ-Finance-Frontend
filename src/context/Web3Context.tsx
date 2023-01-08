import React, { ReactNode, useEffect, useState, createContext } from 'react';
import { AptosClient, CoinClient } from 'aptos';
import { ezfinance, TokenPrice, tokens } from './constant'
import { sleep } from '../helper/sleep';
import { ethers } from 'ethers'

// const client = new AptosClient('https://fullnode.testnet.aptoslabs.com/v1');
const client = new AptosClient('https://fullnode.devnet.aptoslabs.com/v1');
const coinClient = new CoinClient(client);

import { MODULES_ACCOUNT, RESOURCES_ACCOUNT, TOKENS_MAPPING } from '../constants';
import SDK from '../main';


const sdk = new SDK({
    nodeUrl: 'https://fullnode.testnet.aptoslabs.com/v1',
    networkOptions: {
        resourceAccount: RESOURCES_ACCOUNT,
        moduleAccount: MODULES_ACCOUNT
    }
});

const curves = sdk.curves;


export interface IUserInfo {
    tokenBalance: Record<string, number>;
    deposit: Record<string, number>;
    claimable: boolean;
    totalRewards: number;
}

export interface ICoinRate {
    APTOS: number;
    USDT: number;
    BTC: number;
    WETH: number;
    USDC: number;
}

export interface IAptosInterface {
    arcTotalSupply: number;
    poolInfo: any;
    userInfo: IUserInfo;
    coinRate: ICoinRate;
    tokenPrice: Record<string, number>;
    address: string | null;
    isConnected: boolean;
    connect: any;
    disconnect: any;
    claim: any;
    deposit: any;
    withdraw: any;
    getFaucet: any;
    checkBalance: any;
    getCoinRate: any;
    leverage_yield_farming: any;
    add_liquidity: any;
}

interface Props {
    children?: ReactNode; // any props that come into the component
}

export const Web3Context = createContext<IAptosInterface | null>(null);

export const Web3ContextProvider = ({ children, ...props }: Props) => {
    const [, setLoading] = useState(false);
    const [wallet, setWallet] = useState<string>('');
    const [address, setAddress] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const [userInfo, setUserInfo] = useState<IUserInfo>({
        tokenBalance: {},
        deposit: {},
        claimable: false,
        totalRewards: 0,
    });

    const [coinRate, setCoinRate] = useState<ICoinRate>({
        APTOS: 1,
        USDT: 1,
        BTC: 1,
        WETH: 1,
        USDC: 1,
    });

    const [poolInfo, setPoolInfo] = useState({});

    // update wallet address
    useEffect(() => {
        if (isConnected && wallet === 'petra') {
            window?.aptos.account().then((data: any) => {
                setAddress(data.address);
            });
        } else if (isConnected && wallet === 'martian') {
            window?.martian.account().then((data: any) => {
                setAddress(data.address);
            });
        } else if (isConnected && wallet === 'pontem') {
            window?.pontem.account().then((data: any) => {
                setAddress(data);
            });
        } else {
            setAddress(null);
        }
    }, [isConnected, wallet]);

    // update connection
    useEffect(() => {
        checkIsConnected(wallet);
    }, [wallet]);

    // get pull information
    const getPoolInfo = async () => {

        const resOfPool = await client.getAccountResources(ezfinance);
        Object.keys(tokens).map((symbol) => {
            const tokenPoolInfo = resOfPool.find((item) => item.type === `${ezfinance}::lending::Pool<${tokens[symbol]}>`)
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

    // get user information
    const getUserInfo = async () => {
        if (address) {
            const resOfUser = await client.getAccountResources(address)
            Object.keys(tokens).map((symbol) => {
                const tokenTicketInfo = resOfUser.find(
                    (item) => item.type === `${ezfinance}::lending::Ticket<${tokens[symbol]}>`
                )
                const tokenInfo = resOfUser.find((item) => item.type === `0x1::coin::CoinStore<${tokens[symbol]}>`)
                if (tokenTicketInfo) {
                    const _data = tokenTicketInfo.data as {
                        borrow_amount: number;
                        lend_amount: number;
                        claim_amount: number;
                    }
                    userInfo.deposit[symbol] = _data.lend_amount / Math.pow(10, 8)
                    setUserInfo(userInfo)
                }
                if (tokenInfo) {
                    const _data = tokenInfo.data as { coin: { value: number } }
                    userInfo.tokenBalance[symbol] = _data.coin.value / Math.pow(10, 8)
                    setUserInfo(userInfo)
                }
            })
            const rewardsInfo = resOfUser.find((item) => item.type === `${ezfinance}::lending::Rewards`);
            if (rewardsInfo) {
                const _data = rewardsInfo.data as { claim_amount: number; last_claim_at: number }
                setUserInfo((userInfo) => ({
                    ...userInfo,
                    totalRewards: _data.claim_amount / Math.pow(10, 8),
                }))
            }
        }
    };

    useEffect(() => {
        getUserInfo();
    }, [address]);

    const getCoinRate = async () => {
        const sender = address;

        // Register account with coin
        // try {
        //     const coinRegisterPayload = {
        //         type: 'entry_function_payload',
        //         function: '0x1::managed_coin::register',
        //         type_arguments: [TOKENS_MAPPING.APTOS],
        //         arguments: [],
        //     }

        //     if (isConnected && wallet === 'petra') {
        //         const rawTxn = await window.aptos.generateTransaction(coinRegisterPayload);
        //         const bcsTxn = await window.aptos.signTransaction(rawTxn);
        //         const { hash } = await window.aptos.submitTransaction(bcsTxn);
        //         await window.aptos.waitForTransaction(hash);
        //     } else if (isConnected && wallet === 'martian') {
        //         const rawTxn = await window.martian.generateTransaction(coinRegisterPayload);
        //         const bcsTxn = await window.martian.signTransaction(rawTxn);
        //         const { hash } = await window.martian.submitTransaction(bcsTxn);
        //         await window.martian.waitForTransaction(hash);
        //     } else if (isConnected && wallet === 'pontem') {
        //         const rawTxn = await window.pontem.generateTransaction(coinRegisterPayload);
        //         const bcsTxn = await window.pontem.signTransaction(rawTxn);
        //         const { hash } = await window.pontem.submitTransaction(bcsTxn);
        //         await window.pontem.waitForTransaction(hash);
        //     }

        //     // const rawTxn = await client.generateTransaction(sender.address(), coinRegisterPayload);
        //     // const bcsTxn = await client.signTransaction(alice, rawTxn);
        //     // const { hash } = await client.submitTransaction(bcsTxn);
        //     // await client.waitForTransaction(hash);

        //     console.log(`Coin ${tokenTo} successfully Registered to Alice account`);
        //     // console.log(`Check on explorer: https://explorer.aptoslabs.com/txn/${hash}?network=${NETWORKS_MAPPING.TESTNET}`);
        // } catch (e) {
        //     console.log("Coin register error: ", e);
        // }


        // get Rate for USDT coin.
        const usdtRate = await sdk.Swap.calculateRates({
            fromToken: TOKENS_MAPPING.USDT,
            toToken: TOKENS_MAPPING.APTOS,
            amount: 100000000,
            curveType: 'uncorrelated',
            interactiveToken: 'from',
        });
        console.log('usdtRate: ', usdtRate);

        // get Rate for BTC coin.
        const btcRate = await sdk.Swap.calculateRates({
            fromToken: TOKENS_MAPPING.BTC,
            toToken: TOKENS_MAPPING.APTOS,
            amount: 100000000,
            curveType: 'uncorrelated',
            interactiveToken: 'from',
        });
        console.log('btcRate: ', btcRate);

        // get Rate for USDC coin.
        const usdcRate = await sdk.Swap.calculateRates({
            fromToken: TOKENS_MAPPING.USDC,
            toToken: TOKENS_MAPPING.APTOS,
            amount: 100000000,
            curveType: 'uncorrelated',
            interactiveToken: 'from',
        });
        console.log('usdcRate: ', usdcRate);

        // get Rate for WETH coin.
        const wethRate = await sdk.Swap.calculateRates({
            fromToken: TOKENS_MAPPING.WETH,
            toToken: TOKENS_MAPPING.APTOS,
            amount: 100000000,
            curveType: 'uncorrelated',
            interactiveToken: 'from',
        });
        console.log('wethRate: ', wethRate);

        setCoinRate(usdtRate, btcRate, wethRate, usdcRate);
    }

    useEffect(() => {
        getCoinRate();
    }, [address]);

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

    const checkBalance = async () => {
        const sender = address;

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

    const leverage_yield_farming = async (coinX: string, coinY: string, coinZ: string, amount: number) => {

        if (wallet === '' || !isConnected) return;

        const tokenTypeX = tokens[coinX]
        const tokenTypeY = tokens[coinY]
        const tokenTypeZ = tokens[coinZ]
        const amountInWei = ethers.utils.parseUnits(String(amount), 7).toNumber()

        console.log(tokenTypeX)
        console.log(tokenTypeY)
        console.log(tokenTypeZ)
        console.log(amountInWei)


        // const payload = await sdk.Liquidity.createAddLiquidityPayload({
        //     fromToken: TOKENS_MAPPING.APTOS,
        //     toToken: TOKENS_MAPPING.USDC,
        //     fromAmount: 400, // 0.000004 APTOS
        //     toAmount: 19, // 0.000019 USDC
        //     interactiveToken: 'from',
        //     slippage: 0.005,
        //     curveType: 'uncorrelated',
        // });


        //get USDC amount
        // const { rate, receiveLp } = await sdk.Liquidity.calculateRateAndMinReceivedLP({
        //     fromToken: TOKENS_MAPPING.APTOS,
        //     toToken: TOKENS_MAPPING.USDC,
        //     amount: 100000000, // 1 APTOS
        //     curveType: 'uncorrelated',
        //     interactiveToken: 'from',
        //     slippage: 0.005,
        // });
        // console.log(rate) // '4472498' ('4.472498' USDC)
        // console.log(receiveLp) // '19703137' ('19.703137' Minimum Received LP)

        // const payload = await sdk.Liquidity.createAddLiquidityPayload({
        //     fromToken: TOKENS_MAPPING.APTOS,
        //     toToken: TOKENS_MAPPING.USDC,
        //     fromAmount: 100000000, // 1 APTOS
        //     toAmount: 4472498, // '4.472498' USDC)
        //     interactiveToken: 'from',
        //     slippage: 0.005,
        //     // stableSwapType: 'normal',
        //     curveType: 'uncorrelated',
        // })

        // console.log(payload);

        // console.log('sdk.Liquidity.createAddLiquidityPayload: ', payload);


        // const payload = await sdk.Liquidity.createAddLiquidityPayload({
        //     fromToken: TOKENS_MAPPING.APTOS,
        //     toToken: TOKENS_MAPPING.USDT,
        //     fromAmount: 100000000, // 0.1 APTOS
        //     toAmount: Number(6980), // USDT
        //     interactiveToken: 'from',
        //     slippage: 0.005,
        //     curveType: 'uncorrelated',
        // });
        // console.log('Add liquidity pool payload', payload);

        const sender = address;
        const payload = {
            arguments: [amountInWei, 100000, amountInWei, 100000],
            function: '0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::scripts_v2::add_liquidity',
            type: 'entry_function_payload',
            type_arguments: [TOKENS_MAPPING.USDT, '0x1::aptos_coin::AptosCoin', '0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::curves::Uncorrelated'],
        };

        console.log(payload);

        let transaction;
        if (wallet === 'petra') {
            // transaction = await window.martian.generateTransaction(sender, payload);
            // transaction = petraTransaction;
        } else if (wallet === 'martian') {
            transaction = await window.martian.generateTransaction(sender, payload);
        } else if (wallet === 'pontem') {
            // transaction = await window.pontem.generateTransaction(sender, payload);
        }

        if (isConnected && wallet === 'petra') {
            await window.aptos.signAndSubmitTransaction(payload);
        } else if (isConnected && wallet === 'martian') {
            // await window.martian.signAndSubmitTransaction(transaction);
            const addLiquidityBcsTxn = await window.martian.signTransaction(transaction);
            const { hash: addLiquidityHash } = await window.martian.submitTransaction(addLiquidityBcsTxn);
            await client.waitForTransaction(addLiquidityHash);
            console.log(`Add liquidity transaction with hash ${addLiquidityHash} is submitted`);
            // console.log(`Check on explorer: https://explorer.aptoslabs.com/txn/${addLiquidityHash}?network=${NETWORKS_MAPPING.DEVNET}`);    
        } else if (isConnected && wallet === 'pontem') {
            await window.pontem.signAndSubmit(payload);
        }

        // const addLiquidityRawTxn = await client.generateTransaction(alice.address(), addLiquidityPoolPayload);
        // const addLiquidityBcsTxn = await client.signTransaction(alice, addLiquidityRawTxn);
        // const { hash: addLiquidityHash } = await client.submitTransaction(addLiquidityBcsTxn);
        // await client.waitForTransaction(addLiquidityHash);
        // console.log(`Add liquidity transaction with hash ${addLiquidityHash} is submitted`);
        // console.log(`Check on explorer: https://explorer.aptoslabs.com/txn/${addLiquidityHash}?network=${NETWORKS_MAPPING.DEVNET}`);



        // const addLiquidityRawTxn = await client.generateTransaction(sender, addLiquidityPoolPayload);
        // const addLiquidityBcsTxn = await client.signTransaction(alice, addLiquidityRawTxn);
        // const { hash: addLiquidityHash } = await client.submitTransaction(addLiquidityBcsTxn);
        // await client.waitForTransaction(addLiquidityHash);
        // console.log(`Add liquidity transaction with hash ${addLiquidityHash} is submitted`);
        // console.log(`Check on explorer: https://explorer.aptoslabs.com/txn/${addLiquidityHash}?network=${NETWORKS_MAPPING.DEVNET}`);






        await sleep(2)
        await getUserInfo();
        await getPoolInfo();
    }

    const add_liquidity = async (coinX: string, coinY: string, coinZ: string, amount: number) => {

        if (wallet === '' || !isConnected) return;

        const tokenTypeX = tokens[coinX]
        const tokenTypeY = tokens[coinY]
        const tokenTypeZ = tokens[coinZ]
        const amountInWei = ethers.utils.parseUnits(String(0.01), 8).toNumber()

        console.log(tokenTypeX)
        console.log(tokenTypeY)
        console.log(tokenTypeZ)
        console.log(amountInWei)

        const petraTransaction = {
            arguments: [amountInWei, amountInWei, 0, 0],
            function: ezfinance + '::router::add_liquidity',
            type: 'entry_function_payload',
            type_arguments: [tokenTypeX, tokenTypeY],
        };

        const sender = address;
        const payload = {
            function: ezfinance + '::router::add_liquidity',
            arguments: [amountInWei, amountInWei, 0, 0],
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

    const contextValue: IAptosInterface = {
        arcTotalSupply: 100000,
        poolInfo,
        userInfo,
        coinRate,
        tokenPrice: TokenPrice,
        address,
        isConnected,
        connect,
        disconnect,
        claim,
        deposit,
        withdraw,
        getFaucet,
        checkBalance,
        getCoinRate,
        leverage_yield_farming,
        add_liquidity
    };

    return <Web3Context.Provider value={contextValue}> {children} </Web3Context.Provider>;
};
