import React, { useContext } from 'react';
import { Box, Typography, Stack, Slider, Switch } from '@mui/material';
import { styled } from '@mui/system';
import { trim } from "../../../helper/trim";
import { ITokenPrice3, Web3Context } from '../../../context/Web3Context';
import { calculateDebtRatio } from '../../../helper/calculate';
import { tokenMaxLeverage } from '../../../helper/getMaxLeverage';
import { getEstimatedAPR, getMaxAPR } from '../../../helper/getEstimateAPR';
import { getDebtX, getDebtY, getValuePositionDolarX, getValuePositionDolarY, getValuePositionX, getValuePositionY } from '../../../helper/getValuePosition';


const StyledSwitch = styled(Switch)(({ theme }) => ({
    width: 40,
    height: 24,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#294074',
                opacity: 1,
                border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
        },
    },
    '& .MuiSwitch-thumb': {
        background: 'linear-gradient(90deg,#6e42ca,#8d29c1)',
        boxSizing: 'border-box',
        width: 20,
        height: 20,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === 'light' ? '#241F3E' : '#39393D',
        opacity: 1,
    },
}));

export default function SetLeverage(props: any) {
    const {
        strCoinPair,
        valuePairX, valuePairY, valueEZM,
        setValueBorrowPairX, setValueBorrowPairY,
        setValueBorrowDolarPairX, setValueBorrowDolarPairY,
        valueLeverage, setValueLeverage,
        setDebt, setAPR,
        setValueDebtA, setValueDebtB,
        setValueDolarDebtA, setValueDolarDebtB,
        setValueTotalDebt,
        setValuePositionPairX, setValuePositionPairY,
        setValuePositionDolarPairX, setValuePositionDolarPairY,
        setValuePositionDolarTotal,
    } = props;

    const [checked, setChecked] = React.useState(false);

    const web3 = useContext(Web3Context)
    const tokenPrice3 = web3?.tokenPrice3 as ITokenPrice3

    const marks = [
        { value: 1, label: '1.00x', },
        { value: 1.24, label: '1.24x', },
        { value: 1.45, label: '1.45x', },
        { value: 1.77, label: '1.77x', },
        { value: 2, label: '2.00x', },
    ];

    function addMaxLeverage() {
        const maxLeverage = tokenMaxLeverage(strCoinPair[0]);
        if (maxLeverage > 2) {
            if (maxLeverage > 3) {
                marks.push({ value: 2.5, label: 2.5 + 'x' })
                marks.push({ value: 3.0, label: 3.0 + '.00x' })
            }
            if (maxLeverage > 4) {
                marks.push({ value: 3.5, label: 3.5 + 'x' })
                marks.push({ value: 4.0, label: 4.0 + '.00x' })
            }
            marks.push({ value: maxLeverage, label: maxLeverage + 'x' })
        }

        return maxLeverage;
    }

    function setAllStateByLeverage(newValue: number) {
        console.log('setAllStateByLeverage: ', valuePairX, valuePairY, valueEZM, newValue);
        setDebt(calculateDebtRatio(valuePairX, valuePairY, newValue));
        setAPR(getEstimatedAPR(strCoinPair[0], newValue));

        const debtX = getDebtX(valuePairX, valuePairY, valueEZM, tokenPrice3[strCoinPair[0]], tokenPrice3[strCoinPair[1]], tokenPrice3['ezm'], newValue);
        const debtY = getDebtY(valuePairX, valuePairY, valueEZM, tokenPrice3[strCoinPair[0]], tokenPrice3[strCoinPair[1]], tokenPrice3['ezm'], newValue);
        const debtDolarX = tokenPrice3[strCoinPair[0]] * (+debtX);
        const debtDolarY = tokenPrice3[strCoinPair[1]] * (+debtY);

        setValueDebtA(debtX);
        setValueDebtB(debtY);
        setValueDolarDebtA(trim(debtDolarX, 2))
        setValueDolarDebtB(trim(debtDolarY, 2))

        setValueTotalDebt(trim(debtDolarX + debtDolarY, 2))

        setValueBorrowPairX(trim(+debtX, 5))
        setValueBorrowPairY(trim(+debtY, 5))
        setValueBorrowDolarPairX(trim(+debtDolarX, 2))
        setValueBorrowDolarPairY(trim(+debtDolarY, 2))

        setValuePositionPairX(getValuePositionX(valuePairX, valuePairY, valueEZM, tokenPrice3[strCoinPair[0]], tokenPrice3[strCoinPair[1]], tokenPrice3['ezm'], valueLeverage))
        setValuePositionPairY(getValuePositionY(valuePairX, valuePairY, valueEZM, tokenPrice3[strCoinPair[0]], tokenPrice3[strCoinPair[1]], tokenPrice3['ezm'], valueLeverage))

        const posDolarX = getValuePositionDolarX(valuePairX, valuePairY, valueEZM, tokenPrice3[strCoinPair[0]], tokenPrice3[strCoinPair[1]], tokenPrice3['ezm'], valueLeverage)
        const posDolarY = getValuePositionDolarY(valuePairX, valuePairY, valueEZM, tokenPrice3[strCoinPair[0]], tokenPrice3[strCoinPair[1]], tokenPrice3['ezm'], valueLeverage)
        setValuePositionDolarPairX(posDolarX)
        setValuePositionDolarPairY(posDolarY)

        console.log('setAllStateByLeverage', valueLeverage, posDolarX, posDolarY)
        setValuePositionDolarTotal(trim((+posDolarX) + (+posDolarY), 2))
    }

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            setValueLeverage(newValue);

            setAllStateByLeverage(newValue);
        }
    };

    function slideValue(value: number) {
        return `${value}`;
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);

        console.log('hadleChange', checked)
        if (checked === false) {
            const [maxIndex, maxRatio] = getMaxAPR(strCoinPair[0], +addMaxLeverage())
            setValueLeverage(maxIndex);
            setAPR(maxRatio);

            setAllStateByLeverage(maxIndex);
        }
    };


    return (
        <Box
            sx={{
                background: '#16162d', borderRadius: '24px',
                marginBottom: '20px', padding: '40px',
            }}>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '@media(max-width: 576px)': { flexDirection: 'column' },
                }}
            >

                <Typography variant="h4" sx={{ py: 2, '@media(max-width: 450px)': { fontSize: '24px' } }}>
                    2. Set Leverage
                </Typography>

                <Stack direction="row" justifyContent={'center'} alignItems="center" gap={2}>
                    <Typography variant="body2" sx={{ fontSize: '18px' }}>
                        Get Max APR
                    </Typography>

                    <StyledSwitch
                        checked={checked}
                        onChange={handleChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </Stack>
            </Box>

            <Typography variant="h6">Set to manage the total leverage level</Typography>

            <Box
                sx={{
                    py: 3,
                    color: 'white',
                    '& .MuiSlider-markLabel': {
                        color: '#aaa',
                    },
                }}
            >
                <Slider
                    defaultValue={1}
                    getAriaValueText={slideValue}
                    step={0.01}
                    valueLabelDisplay="auto"
                    marks={marks}
                    min={1}
                    max={addMaxLeverage()}
                    disabled={checked}
                    color="primary"
                    value={typeof valueLeverage === 'number' ? valueLeverage : 0}
                    onChange={handleSliderChange}
                    aria-labelledby="input-slider"
                />
            </Box>

            <Typography variant="body2" sx={{ fontSize: '18px' }}>
                Additional {trim(valueLeverage - 1, 3)}x of your supplied assets will be borrowed
            </Typography>
        </Box>
    );
}

