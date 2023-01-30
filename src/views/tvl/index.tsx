import React, { useContext } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Container from '../../components/container';
import ProtocolModal from './components/protocol_modal';
import PoolModal from './components/pool_modal';
import { coins, pairs, protocols } from '../../context/constant';
import { ITokenPrice3, IUserInfo, Web3Context } from '../../context/Web3Context';
import { trim } from '../../helper/trim';
import { formatValue } from '../../helper/formatValue';

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

    const protocolData = ['pancake', 'liquid', 'aux'];

    const web3 = useContext(Web3Context)
    const userInfo = web3?.userInfo as IUserInfo
    const tokenPosition = web3?.tokenPosition
    const pairTVLInfo = web3?.pairTVLInfo
    const tokenVolume = web3?.tokenVolume
    const tokenPrice3 = web3?.tokenPrice3 as ITokenPrice3

    console.log('Farm tokenVolume', tokenVolume);

    let farmPools: any = [];

    var allPoolsTVL = 0;
    var allPositions = 0;
    Object.keys(pairs).forEach((dex) => {
        for (let pair in pairs[dex]) {
            let _liquidityInfo = tokenVolume?.[dex]?.[pair]?.['liquidity']
            const _liquidity = _liquidityInfo ??= 0

            allPoolsTVL = allPoolsTVL + Number(_liquidity);

            let _tokenPositionInfo = tokenPosition?.[dex]?.[pair]?.['length']
            const _position = _tokenPositionInfo ??= 0
            allPositions = allPositions + Number(_position)
        }
    })

    // console.log('allPoolsTVL', allPoolsTVL);
    const poolData = React.useMemo(() => {
        const bump: any = [];

        Object.keys(pairs).forEach((dex) => {
            for (let pair in pairs[dex]) {
                let _liquidityInfo = tokenVolume?.[dex]?.[pair]?.['liquidity']
                const _liquidity = _liquidityInfo ??= 0

                let _tokenPositionInfo = tokenPosition?.[dex]?.[pair]?.['length']
                const _position = _tokenPositionInfo ??= 0

                // console.log('TVL', _tvlInfo, _tvl)
                const obj = {
                    title: protocols[dex].name,
                    aTokenIcon: pairs[dex][pair].x.logo,
                    aname: pairs[dex][pair].x.name,
                    bTokenIcon: pairs[dex][pair].y.logo,
                    bname: pairs[dex][pair].y.name,
                    tvl: formatValue(_liquidity, 2),
                    position: _position,
                };

                bump.push(obj);
            }
        });

        return bump;
    }, [pairTVLInfo]);

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
                            <Typography variant="h5">${formatValue(allPoolsTVL, 2)}</Typography>
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
                        <ProtocolModal dex={item} key={index} />
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
                <Grid container justifyContent="space-start" alignItems={'center'} sx={{ marginTop: '40px' }}>
                    {poolData.map((item: any, index: number) => (
                        <PoolModal
                            title={item.title}
                            tvl={item.tvl}
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
