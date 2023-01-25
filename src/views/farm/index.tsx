import React, { useContext, useEffect } from 'react';
import { Box, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { makeStyles } from '@mui/styles';

import Container from '../../components/container';
import PoolCard from './components/PoolCard';
import { coins, pairs, protocols } from '../../context/constant';
import { ITokenPosition, ITokenVolume, IUserInfo, Web3Context } from '../../context/Web3Context';
import { trim } from '../../helper/trim';
import { tokenMaxLeverage } from '../../helper/getMaxLeverage';
import { getEstimatedAPR, getMaxAPR } from '../../helper/getEstimateAPR';
import { tradingFee } from '../../helper/tradingFee';


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
    const ezmTVLInfo = web3?.ezmTVLInfo
    const tokenVolume = web3?.tokenVolume as ITokenVolume

    var allPoolsTVL = 0;
    let farmPools: any = [];

    for (var key in coins) {
        if (key === 'ezm' || key === 'apt') continue;
        allPoolsTVL = allPoolsTVL + pairTVLInfo[key];
    }

    const allPositions = tokenPosition['all_positions'] ?? 0;

    // useEffect(() => {
    Object.keys(pairs).forEach((dex) => {
        for (let pair in pairs[dex]) {
            const pool = {
                dex: dex,
                property: pairs[dex][pair],
                pool_tvl: '0',//trim(pairTVLInfo[key] ?? 0, 3),
                from_multi: '0', //tokenMaxLeverage(key),
                from_percent: '0', //getEstimatedAPR(key, 1.0),
                max_apr: '0', //getMaxAPR(key, tokenMaxLeverage(key))[1],
                trade_fee: '0', //tradingFee(tokenVolume[key]['vol'] ?? 0, tokenVolume[key]['liquidity'] ?? 0),
                borrow: '0.25',
                position: '0', //userInfo.position_count[key] ?? 0,
                acheive: '0',
                farm_apr: '0',
                trade_volume: '0', //trim(tokenVolume[key]['vol'], 2),
                ezm_tvl: '0', //trim(ezmTVLInfo[key] ?? 0, 3),
                pair: pairs[dex][pair].x.symbol + '-' + pairs[dex][pair].y.symbol + '-' + dex,
            };

            farmPools.push(pool)
        }
    })
    // }, [pairTVLInfo, ezmTVLInfo])

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
                        <Typography variant="h5">${trim(allPoolsTVL, 2)}</Typography>
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
