import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Container from '../../components/container';
import ProtocolModal from './components/protocol_modal';
import PoolModal from './components/pool_modal';

import EthIcon from '../../asset/icons/crypto-ethereum.png';
import USDCIcon from '../../asset/icons/crypto-usdc.png';
import USDTIcon from '../../asset/icons/crypto-usdt.png';
import BTCIcon from '../../asset/icons/crypto-btc.png';
import DaiIcon from '../../asset/icons/crypto-dai.svg';

const useStyles = makeStyles((theme: any) => ({
    root: {
        color: 'white',
        '& > h2': {
            fontSize: '30px',
            fontWeight: 700,
            lineHeight: '40px',
        },
        '& h6': {
            fontSize: '18px',
            fontWeight: '500',
            opacity: '0.5',
        },
        '& .protocol_card': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '30px',
            margin: '40px 0',
            flexWrap: 'wrap',
        },
    },
    divide_line: {
        background: 'white',
        height: '1px',
        opacity: '.5',
    },
}));

export default function TVL() {
    const classes = useStyles();

    const protocolData = ['LiquidSwap pools TVL', 'PancakeSwap TVL', 'AUX Exchange TVL'];
    const coins = [
        {
            name: 'WBTC',
            img: BTCIcon,
        },
        {
            name: 'WETH',
            img: EthIcon,
        },
        {
            name: 'DAI',
            img: DaiIcon,
        },
        {
            name: 'USDC',
            img: USDCIcon,
        },
        {
            name: 'USDT',
            img: USDTIcon,
        },
        {
            name: 'ceUSDC',
            img: USDCIcon,
        },
    ];

    const poolData = React.useMemo(() => {
        const bump: any = [];
        for (let i = 0; i < coins.length; i++) {
            for (let j = i - 1; j >= 0; j--) {
                protocolData.map((item: string) => {
                    const obj = {
                        title: item,
                        aTokenIcon: coins[i].img,
                        aname: coins[i].name,
                        bTokenIcon: coins[j].img,
                        bname: coins[j].name,
                        number: '0.00',
                        position: Math.floor(Math.random() * 100) + 20,
                    };
                    bump.push(obj);
                });
            }
        }
        return bump;
    }, []);

    return (
        <Container>
            <Box className={classes.root}>
                <Typography variant="h2">Pool TVL</Typography>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '25px 0',
                        '@media(max-width: 768px)': {
                            justifyContent: 'center',
                            flexDirection: 'column',
                            '& h5': {
                                textAlign: 'center',
                            },
                        },
                    }}
                >
                    <Typography sx={{ fontSize: '24px', fontWeight: 600 }}>Protocol TVL</Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 5,
                            '@media(max-width: 450px)': {
                                flexDirection: 'column',
                                gap: 1,
                            },
                        }}
                    >
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="subtitle1">Protocol pools TVL</Typography>
                            <Typography variant="h5">$0</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="subtitle1">Protocol positions</Typography>
                            <Typography variant="h5">234</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box className={classes.divide_line} />
                <Box className={'protocol_card'}>
                    {protocolData.map((item: any, index: number) => (
                        <ProtocolModal title={item} key={index} />
                    ))}
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '25px 0',
                        '@media(max-width: 768px)': {
                            justifyContent: 'center',
                            flexDirection: 'column',
                            '& h5': {
                                textAlign: 'center',
                            },
                        },
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '24px',
                            fontWeight: 600,
                        }}
                    >
                        Pool TVL
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 5,
                            '@media(max-width: 450px)': {
                                flexDirection: 'column',
                                gap: 1,
                            },
                        }}
                    >
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="subtitle1">Protocol pools TVL</Typography>
                            <Typography variant="h5">$0</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="subtitle1">Protocol positions</Typography>
                            <Typography variant="h5">234</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box className={classes.divide_line} />
                <Grid container justifyContent="space-between" alignItems={'center'} sx={{ marginTop: '40px' }}>
                    {poolData.map((item: any, index: number) => (
                        <PoolModal
                            title={item.title}
                            number={item.number}
                            imga={item.aTokenIcon}
                            namea={item.aname}
                            imgb={item.bTokenIcon}
                            nameb={item.bname}
                            position={item.position}
                            key={index}
                        />
                    ))}
                </Grid>
            </Box>
        </Container>
    );
}
