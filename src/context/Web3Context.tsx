import React, { ReactNode, useEffect, useState, createContext } from 'react';
import { AptosClient, CoinClient } from 'aptos';
import { ezfinance, TokenPrice, tokens } from './constant'
import { sleep } from '../helper/sleep';

const client = new AptosClient('https://fullnode.testnet.aptoslabs.com/v1');
// const client = new AptosClient('https://fullnode.devnet.aptoslabs.com/v1');
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
    leverage_yield_farming: any;
    leverage_yield_farming_dapp: any;
    leverage_yield_farming_swap: any;
    add_liquidity: any;
    add_liquidity_aptos: any;
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
        console.log('getUserInfo address:', address);

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

    const leverage_yield_farming = async (coinX: string, coinY: string, valueEZM: number, valueAPT: number, valueLP: number, valueLeverage: number) => {
        if (wallet === '' || !isConnected) return;

        const tokenTypeX = tokens[coinX]
        const tokenTypeY = tokens[coinY]
        const leverageBorrowEZM = (valueLeverage - 1) * valueEZM;
        const leverageBorrowAPT = (valueLeverage - 1) * valueAPT;
        const leverageBorrowLP = (valueLeverage - 1) * valueLP;

        console.log('leverage_yield_farming')
        console.log(tokenTypeX)
        console.log(tokenTypeY)
        console.log(valueEZM)
        console.log(valueAPT)
        console.log(valueLP)
        console.log(valueLeverage)
        console.log("leverageBorrowEZM", leverageBorrowEZM)

        const amountInWeiSupplyEZM = ethers.utils.parseUnits(String(valueEZM), 8).toNumber()
        const amountInWeiSupplyAPT = ethers.utils.parseUnits(String(valueAPT), 8).toNumber()
        const amountInWeiSupplyLP = ethers.utils.parseUnits(String(valueLP), 8).toNumber()

        console.log("amountInWeiSupplyEZM", amountInWeiSupplyEZM)
        console.log(amountInWeiSupplyAPT)
        console.log(amountInWeiSupplyLP)

        const amountInWeiBorrowEZM = ethers.utils.parseUnits(String(leverageBorrowEZM.toFixed(7)), 8).toNumber()
        const amountInWeiBorrowAPT = ethers.utils.parseUnits(String(leverageBorrowAPT.toFixed(7)), 8).toNumber()
        const amountInWeiBorrowLP = ethers.utils.parseUnits(String(leverageBorrowLP.toFixed(7)), 8).toNumber()

        // const amountInWeiBorrowEZM = ethers.utils.parseUnits(String(valueEZM), 8).toNumber()
        // const amountInWeiBorrowAPT = ethers.utils.parseUnits(String(valueEZM), 8).toNumber()
        // const amountInWeiBorrowLP = ethers.utils.parseUnits(String(valueEZM), 8).toNumber()

        console.log(amountInWeiBorrowEZM)
        console.log(amountInWeiBorrowAPT)
        console.log(amountInWeiBorrowLP)


        const petraTransaction = {
            arguments: [amountInWeiSupplyEZM, amountInWeiSupplyAPT, amountInWeiSupplyLP, amountInWeiBorrowEZM, amountInWeiBorrowAPT, amountInWeiBorrowLP],
            function: ezfinance + '::router::leverage_yield_farming',
            type: 'entry_function_payload',
            type_arguments: [tokenTypeX, tokenTypeY],
        };

        const sender = address;
        const payload = {
            function: ezfinance + '::router::leverage_yield_farming',
            arguments: [amountInWeiSupplyEZM, amountInWeiSupplyAPT, amountInWeiSupplyLP, amountInWeiBorrowEZM, amountInWeiBorrowAPT, amountInWeiBorrowLP],
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

    const leverage_yield_farming_dapp = async (coinX: string, coinY: string, valueEZM: number, valueAPT: number, valueLP: number, valueLeverage: number) => {
        if (wallet === '' || !isConnected) return;

        const tokenTypeX = tokens[coinX]
        const tokenTypeY = tokens[coinY]
        const leverageBorrowEZM = (valueLeverage - 1) * valueEZM;
        const leverageBorrowAPT = (valueLeverage - 1) * valueAPT;
        const leverageBorrowLP = (valueLeverage - 1) * valueLP;

        console.log('leverage_yield_farming_dapp')
        console.log(tokenTypeX)
        console.log(tokenTypeY)
        console.log(valueEZM)
        console.log(valueAPT)
        console.log(valueLP)
        console.log(valueLeverage)

        const amountInWeiSupplyEZM = ethers.utils.parseUnits(String(valueEZM), 8).toNumber()
        const amountInWeiSupplyAPT = ethers.utils.parseUnits(String(valueAPT), 8).toNumber()
        const amountInWeiSupplyLP = ethers.utils.parseUnits(String(valueLP), 8).toNumber()

        console.log(amountInWeiSupplyEZM)
        console.log(amountInWeiSupplyAPT)
        console.log(amountInWeiSupplyLP)

        const amountInWeiBorrowEZM = ethers.utils.parseUnits(String(leverageBorrowEZM.toFixed(7)), 8).toNumber()
        const amountInWeiBorrowAPT = ethers.utils.parseUnits(String(leverageBorrowAPT.toFixed(7)), 8).toNumber()
        const amountInWeiBorrowLP = ethers.utils.parseUnits(String(leverageBorrowLP.toFixed(7)), 8).toNumber()

        // const amountInWeiBorrowEZM = ethers.utils.parseUnits(String(valueAPT), 8).toNumber()
        // const amountInWeiBorrowAPT = ethers.utils.parseUnits(String(valueAPT), 8).toNumber()
        // const amountInWeiBorrowLP = ethers.utils.parseUnits(String(valueAPT), 8).toNumber()

        console.log(amountInWeiBorrowEZM)
        console.log(amountInWeiBorrowAPT)
        console.log(amountInWeiBorrowLP)

        // if (amountInWeiBorrowEZM > 0) {
        //     lending:: borrow<EZM>(sender, amountInWeiBorrowEZM);
        // };

        // if (amountInWeiBorrowAPT > 0) {
        //     lending:: borrow<AptosCoin>(sender, amountInWeiBorrowAPT);
        // };

        // if (amountInWeiBorrowLP > 0) {
        //     // lending::borrow<ezfinance::faucet_tokens::LP>(sender, amountInWeiBorrowLP);
        // };

        const petraTransaction = {
            arguments: [amountInWeiBorrowEZM],
            function: ezfinance + '::lending::borrow',
            type: 'entry_function_payload',
            type_arguments: [tokens['apt']],
        };

        const sender = address;
        const payload = {
            function: ezfinance + '::lending::borrow',
            arguments: [amountInWeiBorrowEZM],
            type_arguments: [tokens['apt']],
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

    const leverage_yield_farming_swap = async (coinX: string, coinY: string, valueEZM: number, valueAPT: number, valueLP: number, valueLeverage: number) => {
        if (wallet === '' || !isConnected) return;

        const tokenTypeX = tokens[coinX]
        const tokenTypeY = tokens[coinY]
        const leverageBorrowEZM = (valueLeverage - 1) * valueEZM;
        const leverageBorrowAPT = (valueLeverage - 1) * valueAPT;
        const leverageBorrowLP = (valueLeverage - 1) * valueLP;

        console.log('leverage_yield_farming_dapp')
        console.log(tokenTypeX)
        console.log(tokenTypeY)
        console.log(valueEZM)
        console.log(valueAPT)
        console.log(valueLP)
        console.log(valueLeverage)

        const amountInWeiSupplyEZM = ethers.utils.parseUnits(String(valueEZM), 8).toNumber()
        const amountInWeiSupplyAPT = ethers.utils.parseUnits(String(valueAPT), 8).toNumber()
        const amountInWeiSupplyLP = ethers.utils.parseUnits(String(valueLP), 8).toNumber()

        console.log(amountInWeiSupplyEZM)
        console.log(amountInWeiSupplyAPT)
        console.log(amountInWeiSupplyLP)

        // const amountInWeiBorrowEZM = ethers.utils.parseUnits(String(leverageBorrowEZM), 8).toNumber()
        // const amountInWeiBorrowAPT = ethers.utils.parseUnits(String(leverageBorrowAPT), 8).toNumber()
        // const amountInWeiBorrowLP = ethers.utils.parseUnits(String(leverageBorrowLP), 8).toNumber()

        const amountInWeiBorrowEZM = ethers.utils.parseUnits(String(valueAPT), 8).toNumber()
        const amountInWeiBorrowAPT = ethers.utils.parseUnits(String(valueAPT), 8).toNumber()
        const amountInWeiBorrowLP = ethers.utils.parseUnits(String(valueAPT), 8).toNumber()

        console.log(amountInWeiBorrowEZM)
        console.log(amountInWeiBorrowAPT)
        console.log(amountInWeiBorrowLP)

        // if (amountInWeiBorrowEZM > 0) {
        //     lending:: borrow<EZM>(sender, amountInWeiBorrowEZM);
        // };

        // if (amountInWeiBorrowAPT > 0) {
        //     lending:: borrow<AptosCoin>(sender, amountInWeiBorrowAPT);
        // };

        // if (amountInWeiBorrowLP > 0) {
        //     // lending::borrow<ezfinance::faucet_tokens::LP>(sender, amountInWeiBorrowLP);
        // };
        // router::swap_exact_input<EZM, X>(sender, (amountInWeiSupplyEZM + amountInWeiBorrowEZM)/2, 0);
        // router::swap_exact_input<EZM, Y>(sender, (amountInWeiSupplyEZM + amountInWeiBorrowEZM)/2, 0);

        // router::swap_exact_input<AptosCoin, X>(sender, (amountInWeiSupplyAPT + amountInWeiBorrowAPT)/2, 0);
        // router::swap_exact_input<AptosCoin, Y>(sender, (amountInWeiSupplyAPT + amountInWeiBorrowAPT)/2, 0);

        // let token_x_after_balance = coin::balance<X>(signer::address_of(sender));
        // let token_y_after_balance = coin::balance<Y>(signer::address_of(sender));

        // router::add_liquidity<X, Y>(sender, token_x_after_balance, token_y_after_balance, 0, 0);

        const petraTransaction = {
            arguments: [(amountInWeiSupplyEZM + amountInWeiBorrowEZM) / 2, 0],
            function: ezfinance + '::router::swap_exact_input',
            type: 'entry_function_payload',
            type_arguments: [tokens['ezm'], tokenTypeX],
        };

        const sender = address;
        const payload = {
            function: ezfinance + '::router::swap_exact_input',
            arguments: [(amountInWeiSupplyEZM + amountInWeiBorrowEZM) / 2, 0],
            type_arguments: [tokens['ezm'], tokenTypeX],
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

    const add_liquidity = async (coinX: string, coinY: string, coinZ: string, amount: number) => {

        if (wallet === '' || !isConnected) return;

        const tokenTypeX = tokens[coinX]
        // const tokenTypeY = tokens[coinY]
        const tokenTypeY = tokens['ezm']
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

    const add_liquidity_aptos = async (coinX: string, coinY: string, coinZ: string, amount: number) => {

        if (wallet === '' || !isConnected) return;

        const tokenTypeX = tokens['dai']
        const tokenTypeY = tokens['ezm']
        const amountInWeiX = ethers.utils.parseUnits(String(10), 8).toNumber()
        const amountInWeiY = ethers.utils.parseUnits(String(10), 8).toNumber()

        console.log(tokenTypeX)
        console.log(tokenTypeY)
        console.log(amountInWeiX)
        console.log(amountInWeiY)

        const petraTransaction = {
            arguments: [amountInWeiX, amountInWeiY, 0, 0],
            function: ezfinance + '::router::add_liquidity',
            type: 'entry_function_payload',
            type_arguments: [tokenTypeX, tokenTypeY],
        };

        const sender = address;
        const payload = {
            function: ezfinance + '::router::add_liquidity',
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
        leverage_yield_farming,
        leverage_yield_farming_dapp,
        leverage_yield_farming_swap,
        add_liquidity,
        add_liquidity_aptos
    };

    return <Web3Context.Provider value={contextValue}> {children} </Web3Context.Provider>;
};
