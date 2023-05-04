import React, { useContext } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Typography, Stack, Button } from '@mui/material';

import { trim } from '../../../helper/trim';
import { coins, protocols, swap_aux, swap_liquid, swap_pancake, } from '../../../context/constant';
import { Web3Context } from '../../../context/Web3Context';


const useStyles = makeStyles((theme: any) => ({
    devideLine: {
        background: 'white',
        height: '1px',
        opacity: '.5',
        margin: '20px 0',
    },
}))

export default function YourActions(props: any) {
    const {
        tokens,
        tokenAmount,
        leverage, estimatiedAPR, borrowAmount
    } = props;

    const classes = useStyles();
    const web3 = useContext(Web3Context)

    const tokenPrice = web3?.tokenPrice

    const totalSupply = tokenAmount.tokenA * (tokenPrice?.[tokens[0]] ?? 0) + tokenAmount.tokenB * (tokenPrice?.[tokens[1]] ?? 0) + tokenAmount.tokenEZM * (tokenPrice?.ezm ?? 0)

    const onClickConfirm = async () => {
        // console.log('onClickConfirm', protocols[tokens[2]].name, coins[tokens[0]].symbol, coins[tokens[1]].symbol, valuePairX, valuePairY, valueEZM, valueLeverage);

        // await web3?.borrow('ezm', 0.001);
        // await web3?.swap('ezm', 'wbtc', 0.01, 0);
        // await web3?.swap('ezm', 'apt', 0.01, 0);
        // await web3?.swap('weth', 'apt', 0.001, 0);
        // await web3?.swap('ezm', 'weth', 0.001, 0);

        // Pools
        // PancakeSwap: 1. APT/USDC, 2. WETH/USDC, 3. Cake/APT, 4. BNB/USDC, 5. USDC/USDT
        // LiquidSwap: 1. APT/USDC, 2. Weth/USDC, 3. Weth/apt, 4. Wbtc/apt
        // AUX: 1. APT/USDC, 2. Sol/USDC, 3. Weth/USDC, 4. Wbtc/USDC, 5. USDC/USDT

        if (0) {
            await web3?.add_liquidity(swap_pancake, 'apt', 'usdc', 0.1, 5);
            await web3?.add_liquidity(swap_pancake, 'weth', 'usdc', 0.1, 5);
            await web3?.add_liquidity(swap_pancake, 'cake', 'apt', 0.1, 0.1);
            await web3?.add_liquidity(swap_pancake, 'bnb', 'usdc', 5, 5);
            await web3?.add_liquidity(swap_pancake, 'usdc', 'usdt', 5, 5);
            await web3?.add_liquidity(swap_pancake, 'ezm', 'apt', 5, 0.1);
            await web3?.add_liquidity(swap_pancake, 'ezm', 'usdc', 5, 5);
            await web3?.add_liquidity(swap_pancake, 'ezm', 'cake', 5, 5);
            await web3?.add_liquidity(swap_pancake, 'ezm', 'usdt', 5, 5);
            await web3?.add_liquidity(swap_pancake, 'ezm', 'bnb', 5, 5);
            await web3?.add_liquidity(swap_pancake, 'ezm', 'weth', 5, 0.1);

            await web3?.add_liquidity(swap_liquid, 'apt', 'usdc', 0.1, 5);
            await web3?.add_liquidity(swap_liquid, 'weth', 'usdc', 0.1, 5);
            await web3?.add_liquidity(swap_liquid, 'weth', 'apt', 0.1, 0.1);
            await web3?.add_liquidity(swap_liquid, 'wbtc', 'apt', 0.01, 0.1);
            await web3?.add_liquidity(swap_liquid, 'ezm', 'apt', 5, 0.1);
            await web3?.add_liquidity(swap_liquid, 'ezm', 'weth', 5, 0.1);
            await web3?.add_liquidity(swap_liquid, 'ezm', 'wbtc', 5, 0.01);
            await web3?.add_liquidity(swap_liquid, 'ezm', 'usdc', 5, 5);

            await web3?.add_liquidity(swap_aux, 'apt', 'usdc', 0.1, 5);
            await web3?.add_liquidity(swap_aux, 'sol', 'usdc', 5, 5);
            await web3?.add_liquidity(swap_aux, 'weth', 'usdc', 0.1, 5);
            await web3?.add_liquidity(swap_aux, 'wbtc', 'usdc', 0.01, 5);
            await web3?.add_liquidity(swap_aux, 'usdt', 'usdc', 5, 5);
            await web3?.add_liquidity(swap_aux, 'ezm', 'apt', 5, 0.1);
            await web3?.add_liquidity(swap_aux, 'ezm', 'weth', 5, 0.1);
            await web3?.add_liquidity(swap_aux, 'ezm', 'wbtc', 5, 0.01);
            await web3?.add_liquidity(swap_aux, 'ezm', 'usdc', 5, 5);
            await web3?.add_liquidity(swap_aux, 'ezm', 'usdt', 5, 5);
            await web3?.add_liquidity(swap_aux, 'ezm', 'sol', 5, 5);
        }


        // if (tokens[2] === "pancake") {
        //     await web3?.leverage_yield_farming(0, coins[tokens[0]].symbol, coins[tokens[1]].symbol,
        //         valuePairX ?? 0, valuePairY ?? 0, valueEZM ?? 0, valueLeverage ?? 1);
        // } else if (tokens[2] === "liquid") {
        //     await web3?.leverage_yield_farming(1, coins[tokens[0]].symbol, coins[tokens[1]].symbol,
        //         valuePairX ?? 0, valuePairY ?? 0, valueEZM ?? 0, valueLeverage ?? 1);
        // } else if (tokens[2] === "aux") {
        //     await web3?.leverage_yield_farming(2, coins[tokens[0]].symbol, coins[tokens[1]].symbol,
        //         valuePairX ?? 0, valuePairY ?? 0, valueEZM ?? 0, valueLeverage ?? 1);
        // }
    }

    return (
        <Box className={'modal4'}
            sx={{
                background: '#16162d', borderRadius: '24px',
                padding: { xs: '25px', md: '40px' },
                '& img': {
                    width: '25px', height: '25px', borderRadius: '50%'
                }
            }}>

            <Typography sx={{ py: 2 }}>
                Your Actions
            </Typography>

            <Box
                sx={{
                    background: '#241F3E',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '23px 45px',
                    justifyContent: 'center',
                    borderRadius: '13px',
                    '@media(max-width: 500px)': {
                        flexDirection: 'column',
                        textAlign: 'center',
                    },
                }}
            >
                <Box sx={{ flex: '1' }}>
                    <Typography whiteSpace='nowrap'>Estimated APR</Typography>
                    <Typography >{estimatiedAPR}%</Typography>
                </Box>

                <Box sx={{ flex: '1' }}>
                    <Typography whiteSpace='nowrap'>Your leverage</Typography>
                    <Typography >{leverage}x</Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 3,
                }}
            >
                <Box sx={{
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,

                }}>
                    <Typography sx={{ py: 2 }}>
                        Your Supply
                    </Typography>
                    <Stack direction={'row'} alignItems="center" gap={1}>
                        <img src={coins[tokens[0]].logo} alt={coins[tokens[0]].symbol} />
                        <Typography> {trim(tokenAmount.tokenA, 5)} {coins[tokens[0]].name}</Typography>
                    </Stack>

                    <Stack direction={'row'} alignItems="center" gap={1}>
                        <img src={coins[tokens[1]].logo} alt={coins[tokens[1]].symbol} />
                        <Typography> {trim(tokenAmount.tokenB, 5)} {coins[tokens[1]].name}</Typography>
                    </Stack>

                    <Stack direction={'row'} alignItems="center" gap={1}>
                        <img src={coins['ezm'].logo} alt="ezm" />
                        <Typography> {trim(tokenAmount.tokenEZM, 5)} {coins['ezm'].name}</Typography>
                    </Stack>
                </Box>

                <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography sx={{ py: 2 }}>
                        ~${trim(totalSupply, 3)}
                    </Typography>
                    <Typography >${trim(tokenAmount.tokenA * (tokenPrice?.[tokens[0]] ?? 0), 3)}</Typography>
                    <Typography>${trim(tokenAmount.tokenB * (tokenPrice?.[tokens[1]] ?? 0), 3)}</Typography>
                    <Typography >${trim(tokenAmount.tokenEZM * (tokenPrice?.ezm ?? 0), 3)}</Typography>
                </Box>
            </Box>

            <Box className={classes.devideLine} />

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 3
                }}
            >
                <Box sx={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography sx={{ py: 2 }}>
                        Total Debt
                    </Typography>

                    <Stack direction={'row'} alignItems="center" gap={1}>
                        <img src={coins[tokens[0]].logo} alt={coins[tokens[0]].symbol} />
                        <Typography > {trim(borrowAmount.tokenA, 3)} {coins[tokens[0]].name}</Typography>
                    </Stack>

                    <Stack direction={'row'} alignItems="center" gap={1}>
                        <img src={coins[tokens[1]].logo} alt={coins[tokens[1]].symbol} />
                        <Typography >{trim(borrowAmount.tokenB, 3)} {coins[tokens[1]].name}</Typography>
                    </Stack>
                </Box>

                <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography sx={{ py: 2 }}>
                        ~${trim(borrowAmount.tokenA * (tokenPrice?.[tokens[0]] ?? 0) + borrowAmount.tokenB * (tokenPrice?.[tokens[1]] ?? 0), 3)}
                    </Typography>
                    <Typography >${trim(borrowAmount.tokenA * (tokenPrice?.[tokens[0]] ?? 0), 3)}</Typography>
                    <Typography >${trim(borrowAmount.tokenB * (tokenPrice?.[tokens[1]] ?? 0), 3)}</Typography>
                </Box>
            </Box>

            <Box className={classes.devideLine} />

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 3
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ py: 2 }}>
                            Position Value <Typography whiteSpace='nowrap'>(After Swap)</Typography>
                        </Typography>
                        <Typography sx={{ py: 2 }}>
                            ~${trim(totalSupply * leverage, 3)}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box display='flex' gap={1}>
                            <img src={coins[tokens[0]].logo} alt={coins[tokens[0]].symbol} />
                            <Typography >{trim(totalSupply * leverage / (2 * (tokenPrice?.[tokens[0]] ?? 1)), 3)} {coins[tokens[0]].name}</Typography>
                        </Box>
                        <Typography >${trim(totalSupply * leverage / 2, 3)}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }} >
                        <Box display='flex' gap={1}>
                            <img src={coins[tokens[1]].logo} alt={coins[tokens[1]].symbol} />
                            <Typography>{trim(totalSupply * leverage / (2 * (tokenPrice?.[tokens[1]] ?? 1)), 3)} {coins[tokens[1]].name}</Typography>
                        </Box>
                        <Typography >${trim(totalSupply * leverage / 2, 3)}</Typography>
                    </Box>
                </Box>
            </Box>

            <Button
                sx={{
                    fontFamily: 'Square',
                    fontSize: '18px',
                    fontWeight: '500',
                    background: 'linear-gradient(90deg,#6e42ca,#8d29c1)',
                    borderRadius: '15px',
                    width: '100%',
                    color: 'white',
                    padding: '15px',
                    mt: 3,
                }}
                onClick={onClickConfirm}
            >
                Confirm
            </Button>
        </Box >
    );
}
