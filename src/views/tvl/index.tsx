import React, { useContext } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Container from '../../components/container';
import ProtocolModal from './components/protocol_modal';
import PoolModal from './components/pool_modal';
import { coins, pairs, protocols } from '../../context/constant';
import { ITokenPosition, IUserInfo, Web3Context } from '../../context/Web3Context';
import { trim } from '../../helper/trim';

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

    const protocolData = ['PancakeSwap', 'LiquidSwap', 'AUX Exchange'];

    const web3 = useContext(Web3Context)
    const userInfo = web3?.userInfo as IUserInfo
    const tokenPosition = web3?.tokenPosition as ITokenPosition
    const allPositions = tokenPosition['all_positions'] ?? 0;
    const pairTVLInfo = web3?.pairTVLInfo

    var allPoolsTVL = 0;
    for (var key in coins) {
        if (key === 'ezm' || key === 'apt') continue;
        allPoolsTVL = allPoolsTVL + pairTVLInfo[key];
    }
    // console.log('allPoolsTVL', allPoolsTVL);
    const poolData = React.useMemo(() => {
        const bump: any = [];

        Object.keys(pairs).forEach((dex) => {
            for (let pair in pairs[dex]) {
                const obj = {
                    title: protocols[dex].name,
                    aTokenIcon: pairs[dex][pair].x.logo,
                    aname: pairs[dex][pair].x.name,
                    bTokenIcon: pairs[dex][pair].y.logo,
                    bname: pairs[dex][pair].y.name,
                    number: 0.00,
                    position: 0,
                };
                // for (var key in coins) {
                //     if (key === 'ezm' || key === 'apt') continue;

                //     protocolData.map((item: string) => {
                //         const obj = {
                //             title: item,
                //             aTokenIcon: coins[key].logo,
                //             aname: coins[key].name,
                //             bTokenIcon: coins['apt'].logo,
                //             bname: coins['apt'].name,
                //             number: (item === 'PancakeSwap') ? trim(pairTVLInfo[key], 2) : '0.00',
                //             position: (item === 'PancakeSwap') ? userInfo.position_count[key] : 0,
                //         };
                bump.push(obj);
            }
        });

        return bump;
    }, []);

    return (
        <Container>
            <Box className={classes.root}>
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
                            <Typography variant="h5">${trim(allPoolsTVL, 2)}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="subtitle1">Protocol positions</Typography>
                            <Typography variant="h5">{allPositions}</Typography>
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
                            position={item.position ?? 0}
                            key={index}
                        />
                    ))}
                </Grid>
            </Box>
        </Container>
    );
}
