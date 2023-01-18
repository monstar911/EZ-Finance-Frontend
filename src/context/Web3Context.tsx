import React, { ReactNode, useEffect, useState, createContext } from 'react';
import { AptosClient, CoinClient } from 'aptos';
import { BACKEND_TOKEN_PRICE, ezfinance, pancake, TokenPrice, tokens } from './constant'
import { sleep } from '../helper/sleep';
import { ethers } from 'ethers';
import useSWR from 'swr';

const client = new AptosClient('https://fullnode.testnet.aptoslabs.com/v1');
const coinClient = new CoinClient(client);

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

export interface ITokenPrice3 {
    ezm: number;
    apt: number;
    wbtc: number;
    weth: number;
    usdt: number;
    usdc: number;
    dai: number;
}

export interface IAptosInterface {
    arcTotalSupply: number;
    poolInfo: any;
    userInfo: IUserInfo;
    coinRate: ICoinRate;
    tokenPrice: Record<string, number>;
    tokenPrice3: ITokenPrice3;
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
    add_liquidity: any;
    swap: any;
    borrow: any;
}

interface Props {
    children?: ReactNode; // any props that come into the component
}

export const Web3Context = createContext<IAptosInterface | null>(null);

export const Web3ContextProvider = ({ children, ...props }: Props) => {

    const { data } = useSWR(BACKEND_TOKEN_PRICE);

    console.log('data:', data);
    // console.log('data:', data.date);

    const [, setLoading] = useState(false);
    const [wallet, setWallet] = useState<string>('');
    const [address, setAddress] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [tokenPrice3, setTokenPrice] = useState<ITokenPrice3>({
        ezm: 10,
        apt: 8.2,
        wbtc: 21167.33,
        weth: 1568.66,
        usdt: 1,
        usdc: 1,
        dai: 1,
    });

    // get token price
    const getTokenPrice = async () => {
        console.log('token price:', data);

        if (data) {
            Object.keys(data).map((symbol) => {
                console.log('data item:', symbol);

                tokenPrice3[symbol] = data[symbol]
            })

            setTokenPrice(tokenPrice3);
        }
    };

    useEffect(() => {
        getTokenPrice();
    }, [data]);

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
        console.log('getUserInfo address:', address);

        if (address) {
            const resOfUser = await client.getAccountResources(address)
            Object.keys(tokens).map((symbol) => {
                console.log('getUserInfo Ticket:', symbol);

                const tokenTicketInfo = resOfUser.find(
                    (item) => item.type === `${ezfinance}::lending::Ticket<${tokens[symbol]}>`
                )

                const tokenInfo = resOfUser.find((item) => item.type === `0x1::coin::CoinStore<${tokens[symbol]}>`)
                if (tokenTicketInfo) {
                    console.log('getUserInfo tokenTicketInfo is not null');
                    const _data = tokenTicketInfo.data as {
                        borrow_amount: number;
                        lend_amount: number;
                        claim_amount: number;
                    }
                    console.log('getUserInfo borrow_amount:', _data.borrow_amount);

                    userInfo.deposit[symbol] = _data.lend_amount / Math.pow(10, 8)
                    setUserInfo(userInfo)
                } else {
                    console.log('getUserInfo tokenTicketInfo is null');
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

    const leverage_yield_farming = async (coinX: string, coinY: string, valuePairX: number, valuePairY: number, valueEZM: number, valueLeverage: number) => {
        if (wallet === '' || !isConnected) return;

        const tokenTypeX = tokens[coinX]
        const tokenTypeY = tokens[coinY]
        const leverageBorrowPairX = (valueLeverage - 1) * valuePairX;
        const leverageBorrowPairY = (valueLeverage - 1) * valuePairY;
        const leverageBorrowEZM = (valueLeverage - 1) * valueEZM;

        console.log('leverage_yield_farming', ezfinance, tokenTypeX, tokenTypeY, valuePairX, valuePairY, valueEZM,
            valueLeverage, leverageBorrowPairX, leverageBorrowPairY, leverageBorrowEZM)

        const amountInWeiSupplyPairX = ethers.utils.parseUnits(String(valuePairX), 8).toNumber()
        const amountInWeiSupplyPairY = ethers.utils.parseUnits(String(valuePairY), 8).toNumber()
        const amountInWeiSupplyEZM = ethers.utils.parseUnits(String(valueEZM), 8).toNumber()

        const amountInWeiBorrowPairX = ethers.utils.parseUnits(String(leverageBorrowPairX.toFixed(7)), 8).toNumber()
        const amountInWeiBorrowPairY = ethers.utils.parseUnits(String(leverageBorrowPairY.toFixed(7)), 8).toNumber()
        const amountInWeiBorrowEZM = ethers.utils.parseUnits(String(leverageBorrowEZM.toFixed(7)), 8).toNumber()

        console.log('leverage_yield_farming', ezfinance, tokenTypeX, tokenTypeY, amountInWeiSupplyPairX, amountInWeiSupplyPairY, amountInWeiSupplyEZM,
            valueLeverage, amountInWeiBorrowPairX, amountInWeiBorrowPairY, amountInWeiBorrowEZM)

        const petraTransaction = {
            arguments: [amountInWeiSupplyPairX, amountInWeiSupplyPairY, amountInWeiSupplyEZM,
                amountInWeiBorrowPairX, amountInWeiBorrowPairY, amountInWeiBorrowEZM],
            function: ezfinance + '::farming::leverage_yield_farming',
            type: 'entry_function_payload',
            type_arguments: [tokenTypeX, tokenTypeY],
        };

        const sender = address;
        const payload = {
            function: ezfinance + '::farming::leverage_yield_farming',
            arguments: [amountInWeiSupplyPairX, amountInWeiSupplyPairY, amountInWeiSupplyEZM,
                amountInWeiBorrowPairX, amountInWeiBorrowPairY, amountInWeiBorrowEZM],
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

    const add_liquidity = async (coinX: string, coinY: string, amountX: number, amountY: number) => {

        if (wallet === '' || !isConnected) return;

        const tokenTypeX = tokens[coinX]
        const tokenTypeY = tokens[coinY]
        const amountInWeiX = ethers.utils.parseUnits(String(amountX), 8).toNumber()
        const amountInWeiY = ethers.utils.parseUnits(String(amountY), 8).toNumber()

        console.log('add_liquidity', tokenTypeX, tokenTypeY, amountInWeiX, amountInWeiY)

        const petraTransaction = {
            arguments: [amountInWeiX, amountInWeiY, 0, 0],
            function: pancake + '::router::add_liquidity',
            type: 'entry_function_payload',
            type_arguments: [tokenTypeX, tokenTypeY],
        };

        const sender = address;
        const payload = {
            function: pancake + '::router::add_liquidity',
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
            function: pancake + '::router::swap_exact_input',
            type: 'entry_function_payload',
            type_arguments: [tokenTypeX, tokenTypeY],
        };

        const sender = address;
        const payload = {
            function: pancake + '::router::swap_exact_input',
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

    const contextValue: IAptosInterface = {
        arcTotalSupply: 100000,
        poolInfo,
        userInfo,
        coinRate,
        tokenPrice: TokenPrice,
        tokenPrice3,
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
        add_liquidity,
        swap,
        borrow,
    };

    return <Web3Context.Provider value={contextValue}> {children} </Web3Context.Provider>;
};
