import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

import Container from '../../components/container';
import SupplyAssets from './components/SupplyAssets';
import SetLeverage from './components/SetLeverage';
import BorrowAssets from './components/BorrowAssets';
import YourActions from './components/YourActions';

import { coins, protocols } from '../../context/constant';
import { Web3Context } from '../../context/Web3Context';

import { formatValue } from '../../helper/formatValue';


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

    const { poolId } = useParams()
    const classes = useStyles()

    const web3 = useContext(Web3Context)

    const [tokenAmount, setTokenAmount] = useState({
        tokenA: 0,
        tokenB: 0,
        tokenEZM: 0
    })

    const [borrowAmount, setBorrAmount] = useState({
        tokenA: 0,
        tokenB: 0
    })

    const tokens: Array<string> = React.useMemo(() => {
        const t = poolId?.split('-')
        return [t?.[0] ?? 'apt', t?.[1] ?? 'usdc', 'ezm']
    }, [poolId])

    const dex = useMemo(() => {
        return poolId?.split('-')[2] ?? 'pancake'
    }, [poolId])

    const [leverage, setLeverage] = useState<number>(1)
    const maxLeverage = useMemo(() => {
        return 2
    }, [])

    useEffect(() => {
        if (web3) {
            const ezmToA = 0.5 * tokenAmount.tokenEZM * web3.tokenPrice.ezm / web3.tokenPrice[tokens[0]]
            const ezmToB = 0.5 * tokenAmount.tokenEZM * web3.tokenPrice.ezm / web3.tokenPrice[tokens[1]]
            setBorrAmount({
                tokenA: (leverage - 1) * (tokenAmount.tokenA + ezmToA),
                tokenB: (leverage - 1) * (tokenAmount.tokenB + ezmToB)
            })
        }
    }, [tokenAmount, leverage, web3])



    const [debt, setDebt] = useState<number>(0);
    const [estimatiedAPR, setAPR] = useState(0)

    const [tokenPosition,] = useState({})
    const [allPositions, setAllPositions] = useState(0);
    const [tvl, setTVL] = useState(0);
    const [liquidity, setLiquidity] = useState(0);


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
                                <img src={coins[tokens[0]].logo} alt={coins[tokens[0]].name} />
                                <img src={coins[tokens[1]].logo} alt={coins[tokens[1]].name} style={{ marginLeft: '-8px' }} />
                            </Stack>
                            <Typography variant="h4">
                                {coins[tokens[0]].name}/{coins[tokens[1]].name}
                            </Typography>
                        </Stack>
                        <Typography variant="subtitle1">Yield farming on {protocols[dex].name}</Typography>
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
                            <Typography variant="h5">{allPositions}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle1">TVL via EZ</Typography>
                            <Typography variant="h5">${formatValue(tvl, 2)}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle1">TVL on {protocols[dex].name}</Typography>
                            <Typography variant="h5">${formatValue(liquidity, 2)}</Typography>
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
                        <SupplyAssets
                            tokens={tokens}
                            tokenAmount={tokenAmount}
                            setTokenAmount={setTokenAmount}
                        />
                        <SetLeverage
                            leverage={leverage}
                            setLeverage={setLeverage}
                            maxLeverage={maxLeverage}
                        />
                        <BorrowAssets
                            tokens={tokens}
                            borrowAmount={borrowAmount}
                            debt={debt}
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
                        <YourActions
                            tokens={tokens}
                            tokenAmount={tokenAmount}
                            leverage={leverage}
                            borrowAmount={borrowAmount}
                            estimatiedAPR={estimatiedAPR}
                        />
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
