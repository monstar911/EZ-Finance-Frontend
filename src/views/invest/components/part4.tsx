import React, { useContext, useState } from 'react';
import { IUserInfo, Web3Context } from '../../../context/Web3Context';

import { Box, Typography, Stack, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';

import a from '../../../asset/icons/Aptos.png';
import b from '../../../asset/icons/crypto-usdc.png';

import LpIcon from '../../../asset/icons/LpToken.png'
import EzmIcon from '../../../asset/icons/EZM.png'
import AptosIcon from '../../../asset/icons/Aptos.png'
import BtcIcon from '../../../asset/icons/crypto-btc.svg'
import UsdcIcon from '../../../asset/icons/crypto-usdc.png'
import UsdtIcon from '../../../asset/icons/crypto-usdt.png'
import EthereumIcon from '../../../asset/icons/crypto-ethereum.png'
import DaiIcon from '../../../asset/icons/crypto-dai.svg'
import { trim } from '../../../helper/trim';


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
        estimatiedAPR, setAPR, valueAPT, setValueAPT, valueToken, setValueToken } = props;
    const classes = useStyles();

    const web3 = useContext(Web3Context)

    const onClickConfirm = async () => {
        console.log('Part4');
        console.log(namea);
        console.log(nameb);
        console.log(token);
        console.log(amount);


        // await web3?.leverage_yield_farming(namea, nameb, token, amount);
        await web3?.add_liquidity(namea, nameb, token, amount);
    }

    const faucetItems = [
        {
            value: 'dai',
            logo: DaiIcon,
            tokenName: 'DAI'
        }, {
            value: 'usdc',
            logo: UsdcIcon,
            tokenName: 'USDC'
        }, {
            value: 'usdt',
            logo: UsdtIcon,
            tokenName: 'USDT'
        }, {
            value: 'ceUsdc',
            logo: UsdcIcon,
            tokenName: 'ceUSDC'
        }, {
            value: 'wbtc',
            logo: BtcIcon,
            tokenName: 'WBTC'
        }, {
            value: 'weth',
            logo: EthereumIcon,
            tokenName: 'WETH'
        }
    ]

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
                    // background: '#43395b',
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
                        <img src={EzmIcon} alt="ezm" width={25} height={25} style={{ borderRadius: '50%' }} />
                        <Typography variant={'h6'}> {valueAPT} {'EZM'}</Typography>
                    </Stack>

                    <Stack direction={'row'} alignItems="center" gap={1}>
                        <img src={AptosIcon} alt="Aptos" width={25} height={25} style={{ borderRadius: '50%' }} />
                        <Typography variant={'h6'}> {valueAPT} {'APT'}</Typography>
                    </Stack>

                    <Stack direction={'row'} alignItems="center" gap={1}>
                        <img src={LpIcon} alt="lp" width={25} height={25} style={{ borderRadius: '50%' }} />
                        <Typography variant={'h6'}> {valueAPT} {'LP'}</Typography>
                    </Stack>

                    {/* <Stack direction={'row'} alignItems="center" gap={1}>
                        <img src={imgb} alt="" width={25} height={25} style={{ borderRadius: '50%' }} />
                        <Typography variant={'h6'}>0 {nameb}</Typography>
                    </Stack> */}
                </Box>

                <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="h5" sx={{ fontSize: '18px', py: 2 }}>
                        -$90.21
                    </Typography>
                    <Typography variant="h6">$0.00</Typography>
                    <Typography variant="h6">$0.00</Typography>
                    <Typography variant="h6">$0.00</Typography>
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
                        <Typography variant={'h6'}>0.056432 {namea}</Typography>
                    </Stack>

                    <Stack direction={'row'} alignItems="center" gap={1}>
                        <img src={imgb} alt="" width={25} height={25} style={{ borderRadius: '50%' }} />
                        <Typography variant={'h6'}>0.056432 {nameb}</Typography>
                    </Stack>
                </Box>

                <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="h5" sx={{ fontSize: '18px', py: 2 }}>
                        ~$90.21
                    </Typography>
                    <Typography variant="h6">$0.00</Typography>
                    <Typography variant="h6">$0.00</Typography>
                </Box>
            </Box>

            {/* <Box className={classes.devideLine} /> */}

            <Button
                sx={{
                    fontFamily: 'Square',
                    fontSize: '18px',
                    fontWeight: '500',
                    // background: 'linear-gradient(93.57deg, #543DFB 0.71%, #F76CC5 50.59%, #FF4848 97.83%)',
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
