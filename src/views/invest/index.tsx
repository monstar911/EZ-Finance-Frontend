import React, { useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

import Container from '../../components/container';
import SupplyAssets from './components/SupplyAssets';
import SetLeverage from './components/SetLeverage';
import BorrowAssets from './components/BorrowAssets';
import YourActions from './components/YourActions';

import { coins } from '../../context/constant';


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

    const [valuePairX, setValuePairX] = useState('');
    const [valuePairY, setValuePairY] = useState('');
    const [valueEZM, setValueEZM] = useState('');
    const [valueDolarPairX, setValueDolarPairX] = useState(0);
    const [valueDolarPairY, setValueDolarPairY] = useState(0);
    const [valueDolarEZM, setValueDolarEZM] = useState(0);

    const [valueBorrowPairX, setValueBorrowPairX] = useState(0);
    const [valueBorrowPairY, setValueBorrowPairY] = useState(0);
    const [valueBorrowEZM, setValueBorrowEZM] = useState(0);
    const [valueBorrowDolarPairX, setValueBorrowDolarPairX] = useState(0);
    const [valueBorrowDolarPairY, setValueBorrowDolarPairY] = useState(0);
    const [valueBorrowDolarEZM, setValueBorrowDolarEZM] = useState(0);

    const [selectValue, setSelectValue] = useState('dai');

    const [index, setIndex] = useState(0);
    const [token, setToken] = useState('dai');

    const [valueSupplyPairX, setValueSupplyPairX] = useState(0);
    const [valueSupplyPairY, setValueSupplyPairY] = useState(0);
    const [valueSupplyEZM, setValueSupplyEZM] = useState(0);

    const [valueTotalSupply, setValueTotalSupply] = useState(0);

    const [valueDebtA, setValueDebtA] = useState(0.056432);
    const [valueDebtB, setValueDebtB] = useState(0.056432);
    const [valueDolarDebtA, setValueDolarDebtA] = useState(0);
    const [valueDolarDebtB, setValueDolarDebtB] = useState(0);
    const [valueTotalDebt, setValueTotalDebt] = useState(0);

    const [amount, setAmount] = useState(0);
    const [valueLeverage, setValueLeverage] = useState<number | string | Array<number | string>>(1);
    const [debt, setDebt] = useState<number | string | Array<number | string>>(0);
    const [estimatiedAPR, setAPR] = useState(0)

    const strCoinPair: any = React.useMemo(() => {
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
                                <img src={coins[strCoinPair[0]].logo} alt={coins[strCoinPair[0]].name} />
                                <img src={coins[strCoinPair[1]].logo} alt={coins[strCoinPair[1]].name} style={{ marginLeft: '-8px' }} />
                            </Stack>
                            <Typography variant="h4">
                                {coins[strCoinPair[0]].name}/{coins[strCoinPair[1]].name}
                            </Typography>
                        </Stack>
                        <Typography variant="subtitle1">Yield farming on PancakeSwap</Typography>
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
                            <Typography variant="h5">0</Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle1">TVL via EZ</Typography>
                            <Typography variant="h5">$0</Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle1">TVL on PancakeSwap</Typography>
                            <Typography variant="h5">$0</Typography>
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

                            valueLeverage={valueLeverage}
                            setValueLeverage={setValueLeverage}
                            amount={amount}
                            setAmount={setAmount}

                            valueTotalSupply={valueTotalSupply}
                            setValueTotalSupply={setValueTotalSupply}
                        />
                        <SetLeverage
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

                            selectValue={selectValue}
                            setSelectValue={setSelectValue}
                            valueLeverage={valueLeverage}
                            setValueLeverage={setValueLeverage}
                            token={token}
                            amount={amount}
                            setToken={setToken}
                            setAmount={setAmount}
                            debt={debt}
                            setDebt={setDebt}
                            estimatiedAPR={estimatiedAPR}
                            setAPR={setAPR}

                            valueSupplyPairX={valueSupplyPairX}
                            setValueSupplyPairX={setValueSupplyPairX}
                            valueSupplyPairY={valueSupplyPairY}
                            setValueSupplyPairY={setValueSupplyPairY}
                            valueSupplyEZM={valueSupplyEZM}
                            setValueSupplyEZM={setValueSupplyEZM}

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

                            index={index}
                            setIndex={setIndex}
                            token={token}
                            amount={amount}
                            valueLeverage={valueLeverage}
                            setValueLeverage={setValueLeverage}
                            debt={debt}
                            setDebt={setDebt}
                            estimatiedAPR={estimatiedAPR}
                            setAPR={setAPR}

                            valueSupplyPairX={valueSupplyPairX}
                            setValueSupplyPairX={setValueSupplyPairX}
                            valueSupplyPairY={valueSupplyPairY}
                            setValueSupplyPairY={setValueSupplyPairY}
                            valueSupplyEZM={valueSupplyEZM}
                            setValueSupplyEZM={setValueSupplyEZM}

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
                        />
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
