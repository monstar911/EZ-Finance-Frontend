import React, { ReactNode, useEffect, useState, createContext } from 'react';
import { AptosClient } from 'aptos';
import { arcToken, aptosToken, pool_address } from './constant';

const client = new AptosClient('https://fullnode.devnet.aptoslabs.com/v1');

export interface IUserInfo {
    tokenBalance: { arc: number; aptos: number };
    arc: { totalDeposit: number; totalBorrow: number };
    aptos: { totalDeposit: number; totalBorrow: number };
    claimable: boolean;
    totalRewards: number;
}

export interface IPoolInfo {
    arc: { totalDeposit: number; totalBorrow: number };
    aptos: { totalDeposit: number; totalBorrow: number };
}

export interface IAptosInterface {
    arcTotalSupply: number;
    poolInfo: IPoolInfo;
    userInfo: IUserInfo;
    tokenPrice: {
        aptos: number;
        arc: number;
    };
    address: string | null;
    isConnected: boolean;
    connect: Function;
    disconnect: Function;
    claim: Function;
    deposit: Function;
    borrow: Function;
    withdraw: Function;
    repay: Function;
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
        tokenBalance: { arc: 0, aptos: 0 },
        arc: { totalDeposit: 0, totalBorrow: 0 },
        aptos: { totalDeposit: 0, totalBorrow: 0 },
        claimable: false,
        totalRewards: 0,
    });

    const [poolInfo, setPoolInfo] = useState<IPoolInfo>({
        arc: { totalDeposit: 0, totalBorrow: 0 },
        aptos: { totalDeposit: 0, totalBorrow: 0 },
    });

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
        const resOfPool = await client.getAccountResources(pool_address);
        const arcPoolInfo = resOfPool.find((item) => item.type === `${pool_address}::arc_protocol::Pool<${arcToken}>`);
        const aptosPoolInfo = resOfPool.find(
            (item) => item.type === `${pool_address}::arc_protocol::Pool<${aptosToken}>`
        );

        if (arcPoolInfo && aptosPoolInfo) {
            const arcData = arcPoolInfo.data as { borrowed_amount: number; deposited_amount: number };
            const aptosData = aptosPoolInfo.data as { borrowed_amount: number; deposited_amount: number };
            setPoolInfo({
                ...poolInfo,
                arc: {
                    totalBorrow: arcData.borrowed_amount / Math.pow(10, 8),
                    totalDeposit: arcData.deposited_amount / Math.pow(10, 8),
                },
                aptos: {
                    totalBorrow: aptosData.borrowed_amount / Math.pow(10, 8),
                    totalDeposit: aptosData.deposited_amount / Math.pow(10, 8),
                },
            });
        }
    };
    useEffect(() => {
        getPoolInfo();
    }, []);

    // get user information

    const getUserInfo = async () => {
        if (address) {
            const resOfUser = await client.getAccountResources(address);
            const arcTicketInfo = resOfUser.find(
                (item) => item.type === `${pool_address}::arc_protocol::Ticket<${arcToken}>`
            );
            const aptosTicketInfo = resOfUser.find(
                (item) => item.type === `${pool_address}::arc_protocol::Ticket<${aptosToken}>`
            );
            const arcTokenInfo = resOfUser.find((item) => item.type === `0x1::coin::CoinStore<${arcToken}>`);
            const aptosTokenInfo = resOfUser.find((item) => item.type === `0x1::coin::CoinStore<${aptosToken}>`);
            const rewardsInfo = resOfUser.find((item) => item.type === `${pool_address}::arc_protocol::Rewards`);

            let data: IUserInfo = { ...userInfo };
            if (arcTicketInfo) {
                const _data = arcTicketInfo.data as {
                    borrow_amount: number;
                    lend_amount: number;
                    claim_amount: number;
                };
                data = {
                    ...data,
                    arc: {
                        totalDeposit: _data.lend_amount / Math.pow(10, 8),
                        totalBorrow: _data.borrow_amount / Math.pow(10, 8),
                    },
                };
            }
            if (aptosTicketInfo) {
                const _data = aptosTicketInfo.data as { borrow_amount: number; lend_amount: number };
                data = {
                    ...data,
                    aptos: {
                        totalDeposit: _data.lend_amount / Math.pow(10, 8),
                        totalBorrow: _data.borrow_amount / Math.pow(10, 8),
                    },
                };
            }
            if (arcTokenInfo) {
                const _data = arcTokenInfo.data as { coin: { value: number } };
                data = {
                    ...data,
                    tokenBalance: { arc: _data.coin.value / Math.pow(10, 8), aptos: 0 },
                };
            }
            if (aptosTokenInfo) {
                const _data = aptosTokenInfo.data as { coin: { value: number } };
                data = {
                    ...data,
                    tokenBalance: { arc: data.tokenBalance.arc, aptos: _data.coin.value / Math.pow(10, 8) },
                };
            }
            if (rewardsInfo) {
                const _data = rewardsInfo.data as { claim_amount: number; last_claim_at: number };
                data = {
                    ...data,
                    totalRewards: _data.claim_amount / Math.pow(10, 8),
                };
            }
            setUserInfo({ ...data });
        }
    };

    useEffect(() => {
        getUserInfo();
    }, [address]);

    const connect = async (wallet: string) => {
        try {
            console.log(wallet);
            if (wallet === 'petra') {
                if ('aptos' in window) await window.aptos.connect();
                // else window.open('https://petra.app/', `_blank`);
            } else if (wallet === 'martian') {
                if ('martian' in window) await window.martian.connect();
                // else window.open('https://www.martianwallet.xyz/', '_blank');
            } else if (wallet === 'pontem') {
                console.log('wallet === pontem');
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
            function: pool_address + '::arc_protocol::claim',
            type: 'entry_function_payload',
            type_arguments: [],
        };

        const sender = address;
        const payload = {
            arguments: [],
            function: pool_address + '::arc_protocol::claim',
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

    const deposit = async (token: string, amount: number) => {
        if (wallet === '' || !isConnected) return;
        let tokenType = '';
        let amountInWei = 0;
        if (token) {
            if (token === 'arc') {
                tokenType = arcToken;
                amountInWei = amount * Math.pow(10, 8);
            } else if (token === 'apt') {
                tokenType = aptosToken;
                amountInWei = amount * Math.pow(10, 8);
            }
        }
        const petraTransaction = {
            arguments: [amountInWei],
            function: pool_address + '::arc_protocol::lend',
            type: 'entry_function_payload',
            type_arguments: [tokenType],
        };

        const sender = address;
        const payload = {
            function: pool_address + '::arc_protocol::lend',
            type_arguments: [tokenType],
            arguments: [amountInWei],
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

    const borrow = async (token: string, amount: number) => {
        if (wallet === '' || !isConnected) return;
        let tokenType = '';
        let amountInWei = 0;
        if (token) {
            if (token === 'arc') {
                tokenType = arcToken;
                amountInWei = amount * Math.pow(10, 8);
            } else if (token === 'apt') {
                tokenType = aptosToken;
                amountInWei = amount * Math.pow(10, 8);
            }
        }
        const petraTransaction = {
            arguments: [amountInWei],
            function: pool_address + '::arc_protocol::borrow',
            type: 'entry_function_payload',
            type_arguments: [tokenType],
        };

        const sender = address;
        const payload = {
            function: pool_address + '::arc_protocol::borrow',
            type_arguments: [tokenType],
            arguments: [amountInWei],
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
            } else if (isConnected && wallet === 'martin') {
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

    const withdraw = async (token: string, amount: number) => {
        if (wallet === '' || !isConnected) return;
        let tokenType = '';
        let amountInWei = 0;
        if (token) {
            if (token === 'arc') {
                tokenType = arcToken;
                amountInWei = amount * Math.pow(10, 8);
            } else if (token === 'apt') {
                tokenType = aptosToken;
                amountInWei = amount * Math.pow(10, 8);
            }
        }
        const petraTransaction = {
            arguments: [amountInWei],
            function: pool_address + '::arc_protocol::withdraw',
            type: 'entry_function_payload',
            type_arguments: [tokenType],
        };

        const sender = address;
        const payload = {
            function: pool_address + '::arc_protocol::withdraw',
            type_arguments: [tokenType],
            arguments: [amountInWei],
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
            } else if (isConnected && wallet === 'martin') {
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

    const repay = async (token: string, amount: number) => {
        if (wallet === '' || !isConnected) return;
        let tokenType = '';
        let amountInWei = 0;
        if (token) {
            if (token === 'arc') {
                tokenType = arcToken;
                amountInWei = amount * Math.pow(10, 8);
            } else if (token === 'apt') {
                tokenType = aptosToken;
                amountInWei = amount * Math.pow(10, 8);
            }
        }
        const petraTransaction = {
            arguments: [amountInWei],
            function: pool_address + '::arc_protocol::repay',
            type: 'entry_function_payload',
            type_arguments: [tokenType],
        };

        const sender = address;
        const payload = {
            function: pool_address + '::arc_protocol::repay',
            type_arguments: [tokenType],
            arguments: [amountInWei],
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
            } else if (isConnected && wallet === 'martin') {
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

    const contextValue: IAptosInterface = {
        arcTotalSupply: 100000,
        poolInfo,
        userInfo,
        tokenPrice: { arc: 10, aptos: 10 },
        address,
        isConnected,
        connect,
        disconnect,
        claim,
        deposit,
        borrow,
        withdraw,
        repay,
    };

    return <Web3Context.Provider value={contextValue}> {children} </Web3Context.Provider>;
};
