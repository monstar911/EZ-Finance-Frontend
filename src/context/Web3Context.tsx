import React, { ReactNode, useEffect, useState, createContext } from 'react';
import { AptosClient } from 'aptos';
import { ezfinance, TokenPrice, tokens } from './constant'
import { sleep } from '../helper/sleep';
import { ethers } from 'ethers'

const client = new AptosClient('https://fullnode.testnet.aptoslabs.com/v1');

export interface IUserInfo {
    tokenBalance: Record<string, number>;
    deposit: Record<string, number>;
    claimable: boolean;
    totalRewards: number;
}


export interface IAptosInterface {
    arcTotalSupply: number;
    poolInfo: any;
    userInfo: IUserInfo;
    tokenPrice: Record<string, number>;
    address: string | null;
    isConnected: boolean;
    connect: Function;
    disconnect: Function;
    claim: Function;
    deposit: Function;
    withdraw: Function;
    getFaucet: Function;
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
        }
        else if (isConnected && wallet === 'pontem') {
            window?.pontem.account().then((data: any) => {
                setAddress(data);
            });
        }
        else {
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

        let amountInWei = ethers.utils.parseUnits(String(amount), 8).toNumber()

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
        let amountInWei = ethers.utils.parseUnits(String(amount), 8).toNumber()

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



    const contextValue: IAptosInterface = {
        arcTotalSupply: 100000,
        poolInfo,
        userInfo,
        tokenPrice: TokenPrice,
        address,
        isConnected,
        connect,
        disconnect,
        claim,
        deposit,
        withdraw,
        getFaucet
    };

    return <Web3Context.Provider value={contextValue}> {children} </Web3Context.Provider>;
};
