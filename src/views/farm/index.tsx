import React, { useEffect } from 'react';
import { Box, Typography, ToggleButtonGroup, ToggleButton, Stack } from '@mui/material';
import { makeStyles } from '@mui/styles';

import Container from '../../components/container';
import PoolCard from './components/PoolCard';
import { coins } from '../../context/constant';


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
        flexWrap: "wrap",
        gap: "4px",
        [theme.breakpoints.down('sm')]: {
            justifyContent: 'center',
        },
        '& .MuiToggleButtonGroup-root': {
            width: '100%',
            display: 'flex',
            gridTemplateAreas: 'auto auto',
            justifyContent: 'space-betwwen',
            alignItems: 'center',
            borderRadius: 'unset',
            gap: '10px',
            flexWrap: 'wrap',
        },
        '& .Mui-selected': {
            background: 'linear-gradient(90deg,#6e42ca,#8d29c1)',
        },
        '& button': {
            background: '#16162d',
            borderRadius: '24px !important',
            border: 'none!important',
            padding: '18px 33px',
            color: 'white',
            fontSize: '18px',
            minWidth: '180px',
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
            '&:hover': {
                background: '#483A6B',
            }
        },
    },
}));

function Farm() {
    const classes = useStyles();
    const [alignment, setAlignment] = React.useState<string>('1');

    const farmPools = React.useMemo(() => {
        const bump: any = [];

        for (var key in coins) {
            if (key == 'ezm' || key == 'apt') continue;

            const obj = {
                property: key,
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
                pair: key + '-apt',
                // pair: i + '-' + 0,
            };
            bump.push(obj);
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
                        <Typography variant="h5">5 Positions</Typography>
                    </Box>

                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="subtitle1">Total Value Locked</Typography>
                        <Typography variant="h5">$0</Typography>
                    </Box>
                </Box>
            </Box>

            <Box>
                <ToggleButtonGroup
                    value={alignment}
                    exclusive
                    className={classes.part2}
                    onChange={(e: any) => {
                        if (e.target.value !== undefined) setAlignment(e.target.value);
                        else setAlignment(e.target.accessKey);
                    }}
                >
                    <ToggleButton value="1">All assets</ToggleButton>
                    {
                        Object.keys(coins).map((key: string, index: number) => (
                            (key != 'ezm' && key != 'apt' &&
                                < ToggleButton value={String(index + 2)} key={index}>
                                    {<img src={coins[key].logo} alt="" accessKey={String(index + 2)} />}
                                    {coins[key].name}
                                </ToggleButton>
                            )
                        ))
                    }
                </ToggleButtonGroup>
            </Box>

            {/* Pool Component */}
            <Box>
                {farmPools.map((pool: any, property: any) => (
                    <PoolCard key={property} poolInfo={pool} param={pool.pair} />
                ))}
            </Box>
        </Container >
    );
}

export default Farm;
