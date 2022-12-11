import React, { useEffect } from 'react';
import { Box, Typography, ToggleButtonGroup, ToggleButton, Stack } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Container from '../../components/container';
import PoolCard from './components/PoolCard';

import EthereumIcon from '../../asset/icons/crypto-ethereum.png';
import USDCIcon from '../../asset/icons/crypto-usdc.png';
import USDTIcon from '../../asset/icons/crypto-usdt.png';
import BTCIcon from '../../asset/icons/crypto-btc.png';
import DaiIcon from '../../asset/icons/crypto-dai.svg';

const useStyles = makeStyles((theme: any) => ({
    part1: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '20px',
        color: '#FFF',
        gap: '20px',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
            justifyContent: 'center',
        },
        '& h1': {
            fontSize: '30px',
            fontWeight: '700',
            lineHeight: '40px',
            [theme.breakpoints.down('sm')]: {
                fontSize: '35px',
            },
        },
        '& h6': {
            opacity: '.5',
        },
    },
    part2: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '30px 0',
        [theme.breakpoints.down('sm')]: {
            justifyContent: 'center',
        },
        '& .MuiToggleButtonGroup-root': {
            width: '100%',
            display: 'flex',
            gridTemplateAreas: 'auto auto',
            justifyContent: 'flex-start',
            alignItems: 'center',
            borderRadius: 'unset',
            gap: '10px',
            flexWrap: 'wrap',
        },
        '& .Mui-selected': {
            background: 'linear-gradient(93.41deg, #6452DE 0.68%, #F76CC5 53.61%, #FF6F6F 103.74%)',
        },
        '& button': {
            background: '#342D55',
            borderRadius: '100px !important',
            border: 'none!important',
            padding: '18px 33px',
            color: 'white',
            fontSize: '18px',
            minWidth: '190px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            '& img': {
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                zIndex: 0,
                userSelect: 'none',
            },
            [theme.breakpoints.down('sm')]: {
                width: '100%',
            },
        },
    },
}));

function Farm() {
    const classes = useStyles();
    const [alignment, setAlignment] = React.useState<string>('1');

    const coins = [
        {
            name: 'WBTC',
            img: BTCIcon,
        },
        {
            name: 'WETH',
            img: EthereumIcon,
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

    const testPool = React.useMemo(() => {
        let bump: any = [];
        for (var i = 0; i < coins.length; i++) {
            for (var j = i - 1; j >= 0; j--) {
                let obj: Object = {
                    aTokenIcon: coins[i].img,
                    bTokenIcon: coins[j].img,
                    pool_total: '$0.00',
                    from_multi: (Math.random() * 1 + 1).toFixed(2),
                    from_percent: (Math.random() * 1 + 0.4).toFixed(2),
                    max_apr: (Math.random() * 0.7 + 0.4).toFixed(2),
                    trade_fee: (Math.random() * 0.5 + 0.1).toFixed(2),
                    borrow: '-0.00',
                    position: Math.floor(Math.random() * 10 + 5),
                    acheive: (Math.random() * 0.5 + 1).toFixed(2),
                    farm_apr: (Math.random() * 0.5 + 0.1).toFixed(2),
                    trade_volume: '0.00',
                    tvl: '0.00',
                    pair: i + '-' + j,
                };
                bump.push(obj);
            }
        }
        return bump;
    }, []);

    return (
        <Container>
            <Box className={classes.part1}>
                <Box>
                    <Typography variant="h1">FarmPools</Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: { sm: '100px', xs: '10px' },
                        flexDirection: {
                            sm: 'row',
                            xs: 'column',
                        },
                    }}
                >
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="subtitle1">Total Positions</Typography>
                        <Typography variant="h5">234 Positions</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="subtitle1">Total Value Locked</Typography>
                        <Typography variant="h5">$0</Typography>
                    </Box>
                </Box>
            </Box>
            <Box className={classes.part2}>
                <ToggleButtonGroup
                    value={alignment}
                    exclusive
                    onChange={(e: any) => {
                        if (e.target.value !== undefined) setAlignment(e.target.value);
                        else setAlignment(e.target.accessKey);
                    }}
                >
                    <ToggleButton value="1">All assets</ToggleButton>
                    {coins.map((item: any, index: number) => (
                        <ToggleButton value={String(index + 2)} key={index}>
                            <img src={item.img} alt="" accessKey={String(index + 2)} />
                            {item.name}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </Box>

            {/* Pool Component */}
            <Box>
                {testPool.map((pool: any, index: number) => (
                    <PoolCard key={index} poolInfo={pool} param={pool.pair} />
                ))}
            </Box>
        </Container>
    );
}

export default Farm;
