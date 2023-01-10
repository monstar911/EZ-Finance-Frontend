import React, { useContext, useState } from 'react';
import { IUserInfo, Web3Context } from '../../../context/Web3Context';

import { Box, Typography, Stack, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { TokenIcon } from '../../../context/constant';


const useStyles = makeStyles((theme: any) => ({
    devideLine: {
        background: 'white',
        height: '1px',
        opacity: '.5',
        margin: '20px 0',
    },
}));

export default function Part4(props: any) {
    const { imga, imgb, namea, nameb, index, setIndex, token, amount, valueLeverage, setValueLeverage, debt, setDebt,
        estimatiedAPR, setAPR, valueEZM, setValueEZM, valueAPT, setValueAPT, valueLP, setValueLP,
        valueDolarEZM, setValueDolarEZM, valueDolarAPT, setValueDolarAPT, valueDolarLP, setValueDolarLP,
        valueSupplyEZM, setValueSupplyEZM, valueSupplyAPT, setValueSupplyAPT, valueSupplyLP, setValueSupplyLP, valueTotalSupply, setValueTotalSupply,
        valueDebtA, setValueDebtA, valueDebtB, setValueDebtB, valueDolarDebtA, setValueDolarDebtA,
        valueDolarDebtB, setValueDolarDebtB, valueTotalDebt, setValueTotalDebt } = props;

    const classes = useStyles();
    const web3 = useContext(Web3Context)

    const onClickConfirm = async () => {
        console.log('Part4');
        console.log(namea);
        console.log(nameb);
        console.log(valueEZM);
        console.log(valueAPT);
        console.log(valueLP);
        console.log(valueLeverage);

        // await web3?.leverage_yield_farming_swap(namea, nameb, valueEZM, valueAPT, valueLP, valueLeverage);
        // await web3?.leverage_yield_farming_dapp(namea, nameb, valueEZM, valueAPT, valueLP, valueLeverage);
        await web3?.leverage_yield_farming(namea, nameb, valueEZM, valueAPT, valueLP, valueLeverage);
        // await web3?.add_liquidity_aptos(namea, nameb, token, amount);
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
                        <img src={TokenIcon.ezm} alt="ezm" width={25} height={25} style={{ borderRadius: '50%' }} />
                        <Typography variant={'h6'}> {(valueEZM * valueLeverage).toFixed(3)} {'EZM'}</Typography>
                    </Stack>

                    <Stack direction={'row'} alignItems="center" gap={1}>
                        <img src={TokenIcon.apt} alt="Aptos" width={25} height={25} style={{ borderRadius: '50%' }} />
                        <Typography variant={'h6'}> {(valueAPT * valueLeverage).toFixed(3)} {'APT'}</Typography>
                    </Stack>

                    <Stack direction={'row'} alignItems="center" gap={1}>
                        <img src={TokenIcon.lp} alt="lp" width={25} height={25} style={{ borderRadius: '50%' }} />
                        <Typography variant={'h6'}> {(valueLP * valueLeverage).toFixed(3)} {'LP'}</Typography>
                    </Stack>
                </Box>

                <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="h5" sx={{ fontSize: '18px', py: 2 }}>
                        ~${valueTotalSupply.toFixed(3)}
                    </Typography>
                    <Typography variant="h6">${(valueDolarEZM).toFixed(3)}</Typography>
                    <Typography variant="h6">${(valueDolarAPT).toFixed(3)}</Typography>
                    <Typography variant="h6">${(valueDolarLP).toFixed(3)}</Typography>
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
                        <img src={imga} alt="" width={25} height={25} style={{ borderRadius: '50%' }} />
                        <Typography variant={'h6'}>0.056432 {namea.toUpperCase()}</Typography>
                    </Stack>

                    <Stack direction={'row'} alignItems="center" gap={1}>
                        <img src={imgb} alt="" width={25} height={25} style={{ borderRadius: '50%' }} />
                        <Typography variant={'h6'}>0.056432 {nameb.toUpperCase()}</Typography>
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
