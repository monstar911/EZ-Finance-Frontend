import React, { useContext, useEffect } from 'react';
import { Box, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { makeStyles } from '@mui/styles';

import Container from '../../components/container';
import PoolCard from './components/PoolCard';
import { coins, pairs, protocols } from '../../context/constant';
import { ITokenPosition, IUserInfo, Web3Context } from '../../context/Web3Context';
import { trim } from '../../helper/trim';
import { tokenMaxLeverage } from '../../helper/getMaxLeverage';
import { getEstimatedAPR, getMaxAPR } from '../../helper/getEstimateAPR';
import { tradingFee } from '../../helper/tradingFee';
import { formatValue } from '../../helper/formatValue';


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
        // justifyContent: 'space-between',
        padding: '30px 0',
        flexWrap: "wrap",
        gap: "16px",
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
    const [viewPoolList, setPoolList] = React.useState(0);

    const web3 = useContext(Web3Context)
    const userInfo = web3?.userInfo as IUserInfo
    const tokenPosition = web3?.tokenPosition as ITokenPosition
    const pairTVLInfo = web3?.pairTVLInfo
    const tokenVolume = web3?.tokenVolume

    console.log('Farm tokenVolume', tokenVolume);

    let farmPools: any = [];

    var allPoolsTVL = 0;
    Object.keys(pairs).forEach((dex) => {
        for (let pair in pairs[dex]) {
            let _liquidityInfo = tokenVolume?.[dex]?.[pair]?.['liquidity']
            const _liquidity = _liquidityInfo ??= 0

            allPoolsTVL = allPoolsTVL + Number(_liquidity);
        }
    })

    const allPositions = tokenPosition['all_positions'] ?? 0;

    // useEffect(() => {
    Object.keys(pairs).forEach((dex) => {
        for (let pair in pairs[dex]) {
            let _tvlInfo = pairTVLInfo?.[dex]?.[pair]
            const _tvl = _tvlInfo ??= 0

            let _volumeInfo = tokenVolume?.[dex]?.[pair]?.['vol']
            const _volume = _volumeInfo ??= 0

            let _liquidityInfo = tokenVolume?.[dex]?.[pair]?.['liquidity']
            const _liquidity = _liquidityInfo ??= 0

            const pool = {
                dex: dex,
                property: pairs[dex][pair],
                pool_tvl: formatValue(_liquidity, 2),
                from_multi: tokenMaxLeverage(pairs[dex][pair].x.symbol),
                from_percent: getEstimatedAPR(pairs[dex][pair].x.symbol, 1.0),
                max_apr: getMaxAPR(pairs[dex][pair].x.symbol, tokenMaxLeverage(pairs[dex][pair].x.symbol))[1],
                trade_fee: tradingFee(_volume, _liquidity),
                borrow: '0.25',
                position: '0', //userInfo.position_count[key] ?? 0,
                acheive: '0',
                farm_apr: '0',
                trade_volume: formatValue(_volume, 2),
                ezm_tvl: '0',
                pair: pairs[dex][pair].x.symbol + '-' + pairs[dex][pair].y.symbol + '-' + dex,
            };

            farmPools.push(pool)
        }
    })
    // }, [pairTVLInfo])

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
                        <Typography variant="h5">{allPositions} Positions</Typography>
                    </Box>

                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="subtitle1">Total Value Locked</Typography>
                        <Typography variant="h5">${formatValue(allPoolsTVL, 2)}</Typography>
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
                    <ToggleButton
                        value="1"
                        onClick={() => setPoolList(0)}
                    >
                        All Markets
                    </ToggleButton>

                    {
                        Object.keys(protocols).map((key: string, index: number) => (
                            < ToggleButton
                                value={String(index + 2)} key={index}
                                onClick={() => setPoolList(index + 1)}
                            >
                                {<img src={protocols[key].logo} alt={protocols[key].name} accessKey={String(index + 2)} />}
                                {protocols[key].name}
                            </ToggleButton>
                        ))
                    }
                </ToggleButtonGroup>
            </Box>

            {/* Pool Component */}
            <Box>
                {
                    farmPools.filter((pool) => {
                        switch (viewPoolList) {
                            case 0: return true;
                                break;
                            case 1:
                                return pool.dex === 'pancake';
                                break;
                            case 2:
                                return pool.dex === 'liquid';
                                break;
                            case 3:
                                return pool.dex === 'aux';
                                break;
                            default: return true;
                                break;
                        }
                    }).map((pool) => (<PoolCard poolInfo={pool} />))
                }
            </Box>
        </Container >
    );
}

export default Farm;
