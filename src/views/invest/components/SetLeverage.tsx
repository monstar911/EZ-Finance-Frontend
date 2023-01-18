import React, { useContext } from 'react';
import { Box, Typography, Stack, Slider, Switch, Input } from '@mui/material';
import { styled } from '@mui/system';
import { trim } from "../../../helper/trim";
import { coins } from '../../../context/constant';
import { ITokenPrice3, IUserInfo, Web3Context } from '../../../context/Web3Context';
import { getDebtX, getDebtY, getValuePositionDolarX, getValuePositionDolarY, getValuePositionX, getValuePositionY } from '../../../helper/getValuePosition';
import { calculateDebtRatio } from '../../../helper/calculate';


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
        valuePairX, setValuePairX, valuePairY, setValuePairY, valueEZM, setValueEZM,
        valueDolarPairX, setValueDolarPairX, valueDolarPairY, setValueDolarPairY, valueDolarEZM, setValueDolarEZM,
        valueBorrowPairX, setValueBorrowPairX, valueBorrowPairY, setValueBorrowPairY, valueBorrowEZM, setValueBorrowEZM,
        valueBorrowDolarPairX, setValueBorrowDolarPairX, valueBorrowDolarPairY, setValueBorrowDolarPairY, valueBorrowDolarEZM, setValueBorrowDolarEZM,
        selectValue, setSelectValue, valueLeverage, setValueLeverage, token, amount, setToken, setAmount,
        debt, setDebt, estimatiedAPR, setAPR,
        valueSupplyPairX, setValueSupplyPairX, valueSupplyPairY, setValueSupplyPairY, valueSupplyEZM, setValueSupplyEZM,
        valueTotalSupply, setValueTotalSupply,
        valueDebtA, setValueDebtA, valueDebtB, setValueDebtB, valueDolarDebtA, setValueDolarDebtA,
        valueDolarDebtB, setValueDolarDebtB, valueTotalDebt, setValueTotalDebt,
        valuePositionPairX, setValuePositionPairX, valuePositionPairY, setValuePositionPairY,
        valuePositionDolarPairX, setValuePositionDolarPairX, valuePositionDolarPairY, setValuePositionDolarPairY,
        valuePositionDolarTotal, setValuePositionDolarTotal,
    } = props;

    const getDebtRatio = (balance: number, amountSupply: number, leverage: number) => {
        console.log('getDebtRatio: balance, amountSupply, leverage', balance, amountSupply, leverage);

        const total_debt_amount = balance + amountSupply * (leverage - 1);
        const total_LP_amount = balance;
        const borrow_factor = 1.3;
        const collateral_factor = 0.8;
        const borrow_credit = total_debt_amount * 0.8 * (leverage - 1) / 1.6; //0.8;
        const collateral_credit = total_LP_amount * 1.05;
        console.log('getDebtRatio: borrow, collateral', borrow_credit, collateral_credit, 100 * borrow_credit / collateral_credit);
        if (borrow_credit == 0 || collateral_credit == 0) return 0;
        if (isNaN(borrow_credit) || isNaN(collateral_credit)) return 0;
        return trim(100 * borrow_credit / collateral_credit, 2);
    }

    const getEstimatedAPR = (leverage: number) => {
        return trim(4.64 - (4.64 + 4.57) / 1.41 * (leverage - 1), 2);
    }

    const web3 = useContext(Web3Context)
    const userInfo = web3?.userInfo as IUserInfo
    const tokenPrice3 = web3?.tokenPrice3 as ITokenPrice3

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            setValueLeverage(newValue);

            console.log('handleSliderChange: ', valuePairX, valuePairY, valueEZM, newValue);
            // setDebt(getDebtRatio(userInfo.tokenBalance[selectValue], amount, newValue));
            setDebt(calculateDebtRatio(valuePairX, valuePairY, newValue));
            setAPR(getEstimatedAPR(newValue));

            // setValueSupplyPairX(trim(valuePairX * newValue, 3))
            // setValueSupplyPairY(trim(valuePairY * newValue, 3))
            // setValueSupplyEZM(trim(valueEZM * newValue, 3))

            // setValueDolarPairX(trim(coins[strCoinPair[0]].price * valuePairX * newValue, 3))
            // setValueDolarPairY(trim(coins[strCoinPair[1]].price * valuePairY * newValue, 3))
            // setValueDolarEZM(trim(coins['ezm'].price * valueEZM * newValue, 3))

            // setValueTotalSupply(trim(parseFloat(valueDolarPairX) + parseFloat(valueDolarPairY) + parseFloat(valueDolarEZM), 3))


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

            console.log('handleSliderChange', valueLeverage, posDolarX, posDolarY)
            setValuePositionDolarTotal(trim((+posDolarX) + (+posDolarY), 2))
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValueLeverage(event.target.value === '' ? '' : Number(event.target.value));
    };

    function slideValue(value: number) {
        return `${value}`;
    }

    const [checked, setChecked] = React.useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);

        if (checked == false) {
            setValueLeverage(getMaxAPR()[0]);
            setAPR(getMaxAPR()[1]);
        }
    };

    function getMaxAPR() {
        let maxIndex = -1;
        let maxRatio = -100000;

        for (let i = 1; i < +tokenMaxLeverage(); i += 0.01) {
            const estAPR = +getEstimatedAPR(i);
            console.log('getMaxAPR i: ', i, maxIndex, maxRatio, estAPR);

            if (maxRatio < estAPR) {
                maxIndex = i;
                maxRatio = estAPR;
            }
        }
        console.log('getMaxAPR: ', maxRatio);
        return [maxIndex, maxRatio];
    }

    function tokenMaxLeverage() {
        const borrowFactor = 1.3;
        const collateralFactor = 0.8;
        const cappedDebtRatio = 0.95;

        const maxLeverage = Number(trim(borrowFactor / (borrowFactor - (collateralFactor * cappedDebtRatio)), 2)) + 1;
        marks.push({ value: maxLeverage, label: maxLeverage + 'x' })
        return maxLeverage;
    }

    const marks = [
        {
            value: 1,
            label: '1.00x',
        },
        {
            value: 1.24,
            label: '1.24x',
        },
        {
            value: 1.45,
            label: '1.45x',
        },
        {
            value: 1.77,
            label: '1.77x',
        },
        {
            value: 2,
            label: '2.00x',
        },
    ];

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
                    max={tokenMaxLeverage()}
                    disabled={checked}
                    color="primary"
                    value={typeof valueLeverage === 'number' ? valueLeverage : 0}
                    onChange={handleSliderChange}
                    aria-labelledby="input-slider"
                />

                {/* <Input
                    value={valueLeverage}
                    size="small"
                    onChange={handleInputChange}
                    // onBlur={handleBlur}
                    sx={{
                        color: '#FFF'
                    }}
                /> */}
            </Box>

            <Typography variant="body2" sx={{ fontSize: '18px' }}>
                Additional {trim(valueLeverage - 1, 3)}x of your supplied assets will be borrowed
            </Typography>
        </Box>
    );
}

