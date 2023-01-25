import React, { useContext } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Typography, Stack, Button } from '@mui/material';

import { trim } from '../../../helper/trim';
import { coins, protocols, } from '../../../context/constant';
import { Web3Context } from '../../../context/Web3Context';


const useStyles = makeStyles((theme: any) => ({
    devideLine: {
        background: 'white',
        height: '1px',
        opacity: '.5',
        margin: '20px 0',
    },
}));

export default function YourActions(props: any) {
    const {
        strCoinPair,
        valuePairX, valuePairY, valueEZM,
        valueDolarPairX, valueDolarPairY, valueDolarEZM,
        valueLeverage, estimatiedAPR, valueTotalSupply,
        valueDebtA, valueDebtB,
        valueDolarDebtA, valueDolarDebtB, valueTotalDebt,
        valuePositionPairX, valuePositionPairY,
        valuePositionDolarPairX, valuePositionDolarPairY,
        valuePositionDolarTotal,
    } = props;

    const classes = useStyles();
    const web3 = useContext(Web3Context)

    const onClickConfirm = async () => {
        console.log('onClickConfirm', protocols[strCoinPair[2]].name, coins[strCoinPair[0]].symbol, coins[strCoinPair[1]].symbol, valuePairX, valuePairY, valueEZM, valueLeverage);

        // await web3?.borrow('ezm', 0.001);
        // await web3?.swap('ezm', 'wbtc', 0.01, 0);
        // await web3?.swap('ezm', 'apt', 0.01, 0);
        // await web3?.swap('weth', 'apt', 0.001, 0);
        // await web3?.swap('ezm', 'weth', 0.001, 0);

        // Pools
        // PancakeSwap: 1. APT/USDC, 2. WETH/USDC, 3. Cake/APT, 4. BNB/USDC, 5. USDC/USDT
        // LiquidSwap: 1. APT/USDC, 2. Weth/USDC, 3. Weth/apt, 4. Wbtc/apt
        // AUX: 1. APT/USDC, 2. Sol/USDC, 3. Weth/USDC, 4. Wbtc/USDC, 5. USDC/USDT

        // await web3?.add_liquidity(swap_pancake, 'apt', 'usdc', 0.1, 5);
        // await web3?.add_liquidity(swap_pancake, 'weth', 'usdc', 0.1, 5);
        // // await web3?.add_liquidity(swap_pancake, 'cake', 'apt', 0.1, 0.1);
        // await web3?.add_liquidity(swap_pancake, 'bnb', 'usdc', 5, 5);
        // await web3?.add_liquidity(swap_pancake, 'usdc', 'usdt', 5, 5);
        // await web3?.add_liquidity(swap_pancake, 'ezm', 'apt', 5, 0.1);
        // await web3?.add_liquidity(swap_pancake, 'ezm', 'usdc', 5, 5);
        // // await web3?.add_liquidity(swap_pancake, 'ezm', 'cake', 5, 5);
        // await web3?.add_liquidity(swap_pancake, 'ezm', 'usdt', 5, 5);
        // await web3?.add_liquidity(swap_pancake, 'ezm', 'bnb', 5, 5);
        // await web3?.add_liquidity(swap_pancake, 'ezm', 'weth', 5, 0.1);

        // await web3?.add_liquidity(swap_liquid, 'apt', 'usdc', 0.1, 5);
        // await web3?.add_liquidity(swap_liquid, 'weth', 'usdc', 0.1, 5);
        // await web3?.add_liquidity(swap_liquid, 'weth', 'apt', 0.1, 0.1);
        // await web3?.add_liquidity(swap_liquid, 'wbtc', 'apt', 0.01, 0.1);
        // await web3?.add_liquidity(swap_liquid, 'ezm', 'apt', 5, 0.1);
        // await web3?.add_liquidity(swap_liquid, 'ezm', 'weth', 5, 0.1);
        // await web3?.add_liquidity(swap_liquid, 'ezm', 'wbtc', 5, 0.01);
        // await web3?.add_liquidity(swap_liquid, 'ezm', 'usdc', 5, 5);

        // await web3?.add_liquidity(swap_aux, 'apt', 'usdc', 0.1, 5);
        // await web3?.add_liquidity(swap_aux, 'sol', 'usdc', 5, 5);
        // await web3?.add_liquidity(swap_aux, 'weth', 'usdc', 0.1, 5);
        // await web3?.add_liquidity(swap_aux, 'wbtc', 'usdc', 0.01, 5);
        // await web3?.add_liquidity(swap_aux, 'usdt', 'usdc', 5, 5);
        // await web3?.add_liquidity(swap_aux, 'ezm', 'apt', 5, 0.1);
        // await web3?.add_liquidity(swap_aux, 'ezm', 'weth', 5, 0.1);
        // await web3?.add_liquidity(swap_aux, 'ezm', 'wbtc', 5, 0.01);
        // await web3?.add_liquidity(swap_aux, 'ezm', 'usdc', 5, 5);
        // await web3?.add_liquidity(swap_aux, 'ezm', 'usdt', 5, 5);
        // await web3?.add_liquidity(swap_aux, 'ezm', 'sol', 5, 5);


        if (strCoinPair[2] === "pancake") {
            await web3?.leverage_yield_farming(0, coins[strCoinPair[0]].symbol, coins[strCoinPair[1]].symbol,
                valuePairX ?? 0, valuePairY ?? 0, valueEZM ?? 0, valueLeverage ?? 1);
        } else if (strCoinPair[2] === "liquid") {
            await web3?.leverage_yield_farming(1, coins[strCoinPair[0]].symbol, coins[strCoinPair[1]].symbol,
                valuePairX ?? 0, valuePairY ?? 0, valueEZM ?? 0, valueLeverage ?? 1);
        } else if (strCoinPair[2] === "aux") {
            await web3?.leverage_yield_farming(2, coins[strCoinPair[0]].symbol, coins[strCoinPair[1]].symbol,
                valuePairX ?? 0, valuePairY ?? 0, valueEZM ?? 0, valueLeverage ?? 1);
        }
    }

    return (
        <Box className={'modal4'}
            sx={{
                background: '#16162d', borderRadius: '24px',
                padding: '40px',
            }}>

            <Typography variant="h4" sx={{ py: 2, fontSize: '24px' }}>
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
                    <Typography variant="h6">Estimated APR</Typography>
                    <Typography variant="h5">{estimatiedAPR}%</Typography>
                </Box>

                <Box sx={{ flex: '1' }}>
                    <Typography variant="h6">Your leverage</Typography>
                    <Typography variant="h5">{valueLeverage}x</Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 3,
                }}
            >
                <Box sx={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="h5" sx={{ fontSize: '18px', py: 2 }}>
                        Total Supply
                    </Typography>

                    <Stack direction={'row'} alignItems="center" gap={1}>
                        <img src={coins[strCoinPair[0]].logo} alt={coins[strCoinPair[0]].symbol} width={25} height={25} style={{ borderRadius: '50%' }} />
                        <Typography variant={'h6'}> {trim(valuePairX, 5)} {coins[strCoinPair[0]].name}</Typography>
                    </Stack>

                    <Stack direction={'row'} alignItems="center" gap={1}>
                        <img src={coins[strCoinPair[1]].logo} alt={coins[strCoinPair[1]].symbol} width={25} height={25} style={{ borderRadius: '50%' }} />
                        <Typography variant={'h6'}> {trim(valuePairY, 5)} {coins[strCoinPair[1]].name}</Typography>
                    </Stack>

                    <Stack direction={'row'} alignItems="center" gap={1}>
                        <img src={coins['ezm'].logo} alt="lp" width={25} height={25} style={{ borderRadius: '50%' }} />
                        <Typography variant={'h6'}> {trim(valueEZM, 5)} {coins['ezm'].name}</Typography>
                    </Stack>
                </Box>

                <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="h5" sx={{ fontSize: '18px', py: 2 }}>
                        ~${trim(valueTotalSupply, 3)}
                    </Typography>
                    <Typography variant="h6">${trim(valueDolarPairX, 3)}</Typography>
                    <Typography variant="h6">${trim(valueDolarPairY, 3)}</Typography>
                    <Typography variant="h6">${trim(valueDolarEZM, 3)}</Typography>
                </Box>
            </Box>

            <Box className={classes.devideLine} />

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 3,
                }}
            >
                <Box sx={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="h5" sx={{ fontSize: '18px', py: 2 }}>
                        Total Debt
                    </Typography>

                    <Stack direction={'row'} alignItems="center" gap={1}>
                        <img src={coins[strCoinPair[0]].logo} alt={coins[strCoinPair[0]].symbol} width={25} height={25} style={{ borderRadius: '50%' }} />
                        <Typography variant={'h6'}> {valueDebtA} {coins[strCoinPair[0]].name}</Typography>
                    </Stack>

                    <Stack direction={'row'} alignItems="center" gap={1}>
                        <img src={coins[strCoinPair[1]].logo} alt={coins[strCoinPair[1]].symbol} width={25} height={25} style={{ borderRadius: '50%' }} />
                        <Typography variant={'h6'}>{valueDebtB} {coins[strCoinPair[1]].name}</Typography>
                    </Stack>
                </Box>

                <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="h5" sx={{ fontSize: '18px', py: 2 }}>
                        ~${valueTotalDebt}
                    </Typography>
                    <Typography variant="h6">${valueDolarDebtA}</Typography>
                    <Typography variant="h6">${valueDolarDebtB}</Typography>
                </Box>
            </Box>

            <Box className={classes.devideLine} />

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 3,
                }}
            >
                <Box sx={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Stack direction={'row'} alignItems="center" gap={1}>
                        <Typography variant="h5" sx={{ fontSize: '18px', py: 2 }}>
                            Position Value(After Swap)
                        </Typography>
                    </Stack>

                    <Stack direction={'row'} alignItems="center" gap={1}>
                        <img src={coins[strCoinPair[0]].logo} alt={coins[strCoinPair[0]].symbol} width={25} height={25} style={{ borderRadius: '50%' }} />
                        <Typography variant={'h6'}>{valuePositionPairX} {coins[strCoinPair[0]].name}</Typography>
                    </Stack>

                    <Stack direction={'row'} alignItems="center" gap={1}>
                        <img src={coins[strCoinPair[1]].logo} alt={coins[strCoinPair[1]].symbol} width={25} height={25} style={{ borderRadius: '50%' }} />
                        <Typography variant={'h6'}>{valuePositionPairY} {coins[strCoinPair[1]].name}</Typography>
                    </Stack>
                </Box>

                <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="h5" sx={{ fontSize: '18px', py: 2 }}>
                        ~${valuePositionDolarTotal}
                    </Typography>
                    <Typography variant="h6">${valuePositionDolarPairX}</Typography>
                    <Typography variant="h6">${valuePositionDolarPairY}</Typography>
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
                    padding: '20px',
                    mt: 3,
                }}
                onClick={onClickConfirm}
            >
                Confirm
            </Button>
        </Box>
    );
}
