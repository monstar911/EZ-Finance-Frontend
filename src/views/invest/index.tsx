import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import Container from '../../components/container';
import Part1 from './components/part1';
import Part2 from './components/part2';
import Part3 from './components/part3';
import Part4 from './components/part4';

import BTCIcon from '../../asset/icons/crypto-btc.png';
import EthereumIcon from '../../asset/icons/crypto-ethereum.png';
import USDCIcon from '../../asset/icons/crypto-usdc.png';
import USDTIcon from '../../asset/icons/crypto-usdt.png';
import DaiIcon from '../../asset/icons/crypto-dai.svg';

const useStyles = makeStyles((theme: any) => ({
    root: {
        color: 'white',
        '& h6': {
            fontSize: '18px',
            fontWeight: 500,
            opacity: '.6',
        },
        '& .header': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            '@media(max-width: 960px)': {
                flexDirection: 'column',
                gap: 20,
                textAlign: 'center',
            },
        },
        '& .content': {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            marginTop: '20px',
            flexWrap: 'wrap',
            gap: '20px',
            '& .MuiSwitch-thumb': {
                background: 'linear-gradient(93.41deg, #6452DE 0.68%, #F76CC5 53.61%, #FF6F6F 103.74%)',
            },
            '& .MuiSlider-thumbColorPrimary': {
                display: 'none',
            },
            '& .modal4': {
                padding: '40px',
                background: '#342D55',
                borderRadius: '15px',
            },
        },
    },
    devideLine: {
        background: 'white',
        height: '1px',
        opacity: '.5',
        margin: '20px 0',
    },
}));

export default function Invest() {
    const { poolid } = useParams();
    const classes = useStyles();

    const coins = {
        0: { img: BTCIcon, name: 'WBTC' },
        1: { img: EthereumIcon, name: 'WETH' },
        2: { img: DaiIcon, name: 'DAI' },
        3: { img: USDCIcon, name: 'USDC' },
        4: { img: USDTIcon, name: 'USDT' },
        5: { img: USDCIcon, name: 'ceUSDC' },
    };

    const strArr: any = React.useMemo(() => {
        return poolid?.split('-');
    }, [poolid]);

    return (
        <Container>
            <Box className={classes.root}>
                <Box className={'header'}>
                    <Stack direction={'column'} justifyContent="center" gap={1}>
                        <Stack direction={'row'} alignItems="center" gap={2}>
                            <Stack
                                direction={'row'}
                                alignItems={'center'}
                                sx={{ '& img': { width: '40px', height: '40px', borderRadius: '50%' } }}
                            >
                                <img src={coins[Number(strArr[0])].img} alt="" />
                                <img src={coins[Number(strArr[1])].img} alt="" style={{ marginLeft: '-15px' }} />
                            </Stack>
                            <Typography variant="h4">
                                {coins[Number(strArr[0])].name}/{coins[Number(strArr[1])].name}
                            </Typography>
                        </Stack>
                        <Typography variant="subtitle1">Yield farming on LiquidSwap</Typography>
                    </Stack>
                    <Stack
                        direction={'row'}
                        alignItems="center"
                        gap={6}
                        sx={{
                            '@media(max-width: 650px)': {
                                flexDirection: 'column',
                                gap: 1,
                                textAlign: 'center',
                            },
                        }}
                    >
                        <Box>
                            <Typography variant="subtitle1">Positions</Typography>
                            <Typography variant="h5">9</Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle1">TVL via EZ</Typography>
                            <Typography variant="h5">$5,435.43</Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle1">TVL on Sushiswap</Typography>
                            <Typography variant="h5">$12,422,434.54</Typography>
                        </Box>
                    </Stack>
                </Box>
                <Box className={'content'}>
                    <Box
                        sx={{
                            flex: '3',
                            minWidth: '540px',
                            '@media(max-width: 600px)': {
                                minWidth: 'unset',
                                width: '100%',
                            },
                        }}
                    >
                        <Part1
                            imga={coins[Number(strArr[0])].img}
                            imgb={coins[Number(strArr[1])].img}
                            namea={coins[Number(strArr[0])].name}
                            nameb={coins[Number(strArr[1])].name}
                        />
                        <Part2 />
                        <Part3
                            imga={coins[Number(strArr[0])].img}
                            imgb={coins[Number(strArr[1])].img}
                            namea={coins[Number(strArr[0])].name}
                            nameb={coins[Number(strArr[1])].name}
                        />
                    </Box>
                    <Box
                        sx={{
                            flex: '2',
                            minWidth: '450px',
                            '@media(max-width: 600px)': {
                                minWidth: 'unset',
                                width: '100%',
                            },
                        }}
                    >
                        <Part4
                            imga={coins[Number(strArr[0])].img}
                            imgb={coins[Number(strArr[1])].img}
                            namea={coins[Number(strArr[0])].name}
                            nameb={coins[Number(strArr[1])].name}
                        />
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
