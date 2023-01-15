import React, { useContext, useState } from 'react';
import { Box, Typography, Stack, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { IUserInfo, Web3Context } from '../../../context/Web3Context';
import { trim } from '../../../helper/trim';
import { coins } from '../../../context/constant';


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
        valuePairX, setValuePairX, valuePairY, setValuePairY, valueEZM, setValueEZM,
        valueDolarPairX, setValueDolarPairX, valueDolarPairY, setValueDolarPairY, valueDolarEZM, setValueDolarEZM,
        index, setIndex, token, amount, valueLeverage, setValueLeverage, debt, setDebt,
        estimatiedAPR, setAPR,
        valueSupplyEZM, setValueSupplyEZM, valueSupplyAPT, setValueSupplyAPT, valueSupplyLP, setValueSupplyLP,
        valueTotalSupply, setValueTotalSupply,
        valueDebtA, setValueDebtA, valueDebtB, setValueDebtB, valueDolarDebtA, setValueDolarDebtA,
        valueDolarDebtB, setValueDolarDebtB, valueTotalDebt, setValueTotalDebt,
        valuePositionPairX, setValuePositionPairX, valuePositionPairY, setValuePositionPairY,
        valuePositionDolarPairX, setValuePositionDolarPairX, valuePositionDolarPairY, setValuePositionDolarPairY,
        valuePositionDolarTotal, setValuePositionDolarTotal,
    } = props;

    const classes = useStyles();
    const web3 = useContext(Web3Context)

    const onClickConfirm = async () => {
        console.log('onClickConfirm', coins[strCoinPair[0]].symbol, coins[strCoinPair[1]].symbol, valuePairX, valuePairY, valueEZM, valueLeverage);

        // step 1. transfer apt to ezfinance
        // step 2. add_liquidity_pool

        await web3?.add_liquidity_pool('ezm', 'apt', 1, 1);
        await web3?.add_liquidity_pool('wbtc', 'apt', 0.001, 1);
        await web3?.add_liquidity_pool('wbtc', 'ezm', 0.001, 1);
        // await web3?.add_liquidity_pool('weth', 'apt', 0.01, 1);
        // await web3?.add_liquidity_pool('usdt', 'apt', 1, 1);
        // await web3?.add_liquidity_pool('usdc', 'apt', 1, 1);
        // await web3?.add_liquidity_pool('dai', 'apt', 1, 1);
        // await web3?.add_liquidity_pool('weth', 'ezm', 0.001, 1);
        // await web3?.add_liquidity_pool('usdt', 'ezm', 1, 1);
        // await web3?.add_liquidity_pool('usdc', 'ezm', 1, 1);
        // await web3?.add_liquidity_pool('dai', 'ezm', 1, 1);


        // await web3?.leverage_yield_farming(coins[strCoinPair[0]].symbol, coins[strCoinPair[1]].symbol,
        // valuePairX ?? 0, valuePairY ?? 0, valueEZM ?? 0, valueLeverage ?? 1);
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
                        <Typography variant={'h6'}> {trim(valuePairX * valueLeverage, 3)} {coins[strCoinPair[0]].name}</Typography>
                    </Stack>

                    <Stack direction={'row'} alignItems="center" gap={1}>
                        <img src={coins[strCoinPair[1]].logo} alt={coins[strCoinPair[1]].symbol} width={25} height={25} style={{ borderRadius: '50%' }} />
                        <Typography variant={'h6'}> {trim(valuePairY * valueLeverage, 3)} {coins[strCoinPair[1]].name}</Typography>
                    </Stack>

                    <Stack direction={'row'} alignItems="center" gap={1}>
                        <img src={coins['ezm'].logo} alt="lp" width={25} height={25} style={{ borderRadius: '50%' }} />
                        <Typography variant={'h6'}> {trim(valueEZM * valueLeverage, 3)} {coins['ezm'].name}</Typography>
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
                        <Typography variant={'h6'}>0.056432 {coins[strCoinPair[0]].name}</Typography>
                    </Stack>

                    <Stack direction={'row'} alignItems="center" gap={1}>
                        <img src={coins[strCoinPair[1]].logo} alt={coins[strCoinPair[1]].symbol} width={25} height={25} style={{ borderRadius: '50%' }} />
                        <Typography variant={'h6'}>0.056432 {coins[strCoinPair[1]].name}</Typography>
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
