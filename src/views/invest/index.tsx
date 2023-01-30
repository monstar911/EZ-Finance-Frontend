import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

import Container from '../../components/container';
import SupplyAssets from './components/SupplyAssets';
import SetLeverage from './components/SetLeverage';
import BorrowAssets from './components/BorrowAssets';
import YourActions from './components/YourActions';

import { coins, pairs, protocols } from '../../context/constant';
import { ITokenPrice3, IUserInfo, Web3Context } from '../../context/Web3Context';
import { trim } from '../../helper/trim';
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
    const { poolid } = useParams();
    const classes = useStyles();

    const [valuePairX, setValuePairX] = useState('0');
    const [valuePairY, setValuePairY] = useState('0');
    const [valueEZM, setValueEZM] = useState('0');
    const [valueDolarPairX, setValueDolarPairX] = useState(0);
    const [valueDolarPairY, setValueDolarPairY] = useState(0);
    const [valueDolarEZM, setValueDolarEZM] = useState(0);

    const [valueBorrowPairX, setValueBorrowPairX] = useState(0);
    const [valueBorrowPairY, setValueBorrowPairY] = useState(0);
    const [valueBorrowEZM, setValueBorrowEZM] = useState(0);
    const [valueBorrowDolarPairX, setValueBorrowDolarPairX] = useState(0);
    const [valueBorrowDolarPairY, setValueBorrowDolarPairY] = useState(0);
    const [valueBorrowDolarEZM, setValueBorrowDolarEZM] = useState(0);

    const [valueTotalSupply, setValueTotalSupply] = useState(0);

    const [valueDebtA, setValueDebtA] = useState(0);
    const [valueDebtB, setValueDebtB] = useState(0);
    const [valueDolarDebtA, setValueDolarDebtA] = useState(0);
    const [valueDolarDebtB, setValueDolarDebtB] = useState(0);
    const [valueTotalDebt, setValueTotalDebt] = useState(0);

    const [valuePositionPairX, setValuePositionPairX] = useState(0);
    const [valuePositionPairY, setValuePositionPairY] = useState(0);
    const [valuePositionDolarPairX, setValuePositionDolarPairX] = useState(0);
    const [valuePositionDolarPairY, setValuePositionDolarPairY] = useState(0);
    const [valuePositionDolarTotal, setValuePositionDolarTotal] = useState(0);

    const [amount, setAmount] = useState(0);
    const [valueLeverage, setValueLeverage] = useState<number | string | Array<number | string>>(1);
    const [debt, setDebt] = useState<number | string | Array<number | string>>(0);
    const [estimatiedAPR, setAPR] = useState(0)

    const strCoinPair: any = React.useMemo(() => {
        return poolid?.split('-');
    }, [poolid]);

    const web3 = useContext(Web3Context)
    const [userPosition, setUserPosition] = useState<any>(web3?.userPosition)
    const [tokenVolume, setTokenVolume] = useState<any>()
    const [tokenPrice3, setTokenPrice] = useState<ITokenPrice3>()
    const [tokenPosition, setTokenPosition] = useState({})
    const [allPositions, setAllPositions] = useState(0);
    const [tvl, setTVL] = useState(0);
    const [liquidity, setLiquidity] = useState(0);

    console.log('Farm tokenVolume', tokenVolume);
    console.log('Invest', strCoinPair[0], strCoinPair[1], strCoinPair[2])

    const dex = strCoinPair[2]
    const pair = strCoinPair[0] + '-' + strCoinPair[1]

    const getAllPosition = (tokenVolume: any, tokenPrice3: any) => {
        let _allPositions = 0

        let _liquidityInfo = tokenVolume?.[dex]?.[pair]?.['liquidity']
        const _liquidity = _liquidityInfo ??= 0

        let _tokenPositionInfo = tokenPosition?.[dex]?.[pair]?.['length']
        const _position = _tokenPositionInfo ??= 0
        _allPositions = _allPositions + Number(_position)

        let tvl = 0;

        for (let i = 0; i < _position; i++) {
            let _tvlInfo_amountAdd_x = tokenPosition?.[dex]?.[pair]?.[i]?.amountAdd_x / Math.pow(10, 8)
            let _tvlInfo_amountAdd_y = tokenPosition?.[dex]?.[pair]?.[i]?.amountAdd_y / Math.pow(10, 8)
            const _tvl_x = _tvlInfo_amountAdd_x ??= 0
            const _tvl_y = _tvlInfo_amountAdd_y ??= 0

            console.log(_tvl_x, _tvl_y, tokenPrice3[strCoinPair[0]], tokenPrice3[strCoinPair[1]], Number(_tvl_x) * Number(tokenPrice3[strCoinPair[0]]), Number(_tvl_y) * Number(tokenPrice3[strCoinPair[1]]))
            tvl = Number(tvl) + Number(_tvl_x) * Number(tokenPrice3[strCoinPair[0]]) + Number(_tvl_y) * Number(tokenPrice3[strCoinPair[1]]);
        }

        return {
            allPositions: _allPositions,
            tvl: tvl,
            liquidity: _liquidity,
        }
    }

    useEffect(() => {
        const tokenVolume = web3?.tokenVolume
        const tokenPrice3 = web3?.tokenPrice3
        const userPosition = web3?.userPosition
        setUserPosition(userPosition)
        setTokenVolume(tokenVolume)
        setTokenPrice(tokenPrice3)
        const positionInfo = getAllPosition(tokenVolume, tokenPrice3);

        setAllPositions(positionInfo.allPositions)
        setTVL(positionInfo.tvl)
        setLiquidity(positionInfo.liquidity)
    }, [web3])

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
                                <img src={coins[strCoinPair[0]].logo} alt={coins[strCoinPair[0]].name} />
                                <img src={coins[strCoinPair[1]].logo} alt={coins[strCoinPair[1]].name} style={{ marginLeft: '-8px' }} />
                            </Stack>
                            <Typography variant="h4">
                                {coins[strCoinPair[0]].name}/{coins[strCoinPair[1]].name}
                            </Typography>
                        </Stack>
                        <Typography variant="subtitle1">Yield farming on {protocols[strCoinPair[2]].name}</Typography>
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
                            <Typography variant="subtitle1">TVL on {protocols[strCoinPair[2]].name}</Typography>
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
                            strCoinPair={strCoinPair}

                            valuePairX={valuePairX}
                            setValuePairX={setValuePairX}
                            valuePairY={valuePairY}
                            setValuePairY={setValuePairY}
                            valueEZM={valueEZM}
                            setValueEZM={setValueEZM}

                            valueDolarPairX={valueDolarPairX}
                            setValueDolarPairX={setValueDolarPairX}
                            valueDolarPairY={valueDolarPairY}
                            setValueDolarPairY={setValueDolarPairY}
                            valueDolarEZM={valueDolarEZM}
                            setValueDolarEZM={setValueDolarEZM}

                            valueBorrowPairX={valueBorrowPairX}
                            setValueBorrowPairX={setValueBorrowPairX}
                            valueBorrowPairY={valueBorrowPairY}
                            setValueBorrowPairY={setValueBorrowPairY}
                            valueBorrowEZM={valueBorrowEZM}
                            setValueBorrowEZM={setValueBorrowEZM}

                            valueBorrowDolarPairX={valueBorrowDolarPairX}
                            setValueBorrowDolarPairX={setValueBorrowDolarPairX}
                            valueBorrowDolarPairY={valueBorrowDolarPairY}
                            setValueBorrowDolarPairY={setValueBorrowDolarPairY}
                            valueBorrowDolarEZM={valueBorrowDolarEZM}
                            setValueBorrowDolarEZM={setValueBorrowDolarEZM}

                            valueLeverage={valueLeverage}
                            setValueLeverage={setValueLeverage}
                            amount={amount}
                            setAmount={setAmount}

                            valueTotalSupply={valueTotalSupply}
                            setValueTotalSupply={setValueTotalSupply}

                            valueDebtA={valueDebtA}
                            setValueDebtA={setValueDebtA}
                            valueDebtB={valueDebtB}
                            setValueDebtB={setValueDebtB}
                            valueDolarDebtA={valueDolarDebtA}
                            setValueDolarDebtA={setValueDolarDebtA}
                            valueDolarDebtB={valueDolarDebtB}
                            setValueDolarDebtB={setValueDolarDebtB}
                            valueTotalDebt={valueTotalDebt}
                            setValueTotalDebt={setValueTotalDebt}

                            valuePositionPairX={valuePositionPairX}
                            setValuePositionPairX={setValuePositionPairX}
                            valuePositionPairY={valuePositionPairY}
                            setValuePositionPairY={setValuePositionPairY}
                            valuePositionDolarPairX={valuePositionDolarPairX}
                            setValuePositionDolarPairX={setValuePositionDolarPairX}
                            valuePositionDolarPairY={valuePositionDolarPairY}
                            setValuePositionDolarPairY={setValuePositionDolarPairY}
                            valuePositionDolarTotal={valuePositionDolarTotal}
                            setValuePositionDolarTotal={setValuePositionDolarTotal}
                        />
                        <SetLeverage
                            strCoinPair={strCoinPair}

                            valuePairX={valuePairX}
                            valuePairY={valuePairY}
                            valueEZM={valueEZM}

                            setValueBorrowPairX={setValueBorrowPairX}
                            setValueBorrowPairY={setValueBorrowPairY}

                            setValueBorrowDolarPairX={setValueBorrowDolarPairX}
                            setValueBorrowDolarPairY={setValueBorrowDolarPairY}

                            valueLeverage={valueLeverage}
                            setValueLeverage={setValueLeverage}
                            setDebt={setDebt}
                            setAPR={setAPR}

                            setValueDebtA={setValueDebtA}
                            setValueDebtB={setValueDebtB}
                            setValueDolarDebtA={setValueDolarDebtA}
                            setValueDolarDebtB={setValueDolarDebtB}

                            setValueTotalDebt={setValueTotalDebt}

                            setValuePositionPairX={setValuePositionPairX}
                            setValuePositionPairY={setValuePositionPairY}
                            setValuePositionDolarPairX={setValuePositionDolarPairX}
                            setValuePositionDolarPairY={setValuePositionDolarPairY}

                            setValuePositionDolarTotal={setValuePositionDolarTotal}
                        />
                        <BorrowAssets
                            strCoinPair={strCoinPair}

                            valueBorrowPairX={valueBorrowPairX}
                            valueBorrowPairY={valueBorrowPairY}
                            valueBorrowEZM={valueBorrowEZM}

                            valueBorrowDolarPairX={valueBorrowDolarPairX}
                            valueBorrowDolarPairY={valueBorrowDolarPairY}
                            valueBorrowDolarEZM={valueBorrowDolarEZM}

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
                            strCoinPair={strCoinPair}

                            valuePairX={valuePairX}
                            valuePairY={valuePairY}
                            valueEZM={valueEZM}

                            valueDolarPairX={valueDolarPairX}
                            valueDolarPairY={valueDolarPairY}
                            valueDolarEZM={valueDolarEZM}

                            valueLeverage={valueLeverage}
                            estimatiedAPR={estimatiedAPR}
                            valueTotalSupply={valueTotalSupply}

                            valueDebtA={valueDebtA}
                            valueDebtB={valueDebtB}
                            valueDolarDebtA={valueDolarDebtA}
                            valueDolarDebtB={valueDolarDebtB}
                            valueTotalDebt={valueTotalDebt}

                            valuePositionPairX={valuePositionPairX}
                            valuePositionPairY={valuePositionPairY}
                            valuePositionDolarPairX={valuePositionDolarPairX}
                            valuePositionDolarPairY={valuePositionDolarPairY}
                            valuePositionDolarTotal={valuePositionDolarTotal}
                        />
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
