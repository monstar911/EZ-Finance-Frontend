import React, { useContext } from 'react';
import { Box, Typography, Stack, Slider, Switch, Input } from '@mui/material';
import { styled } from '@mui/system';
import { trim } from "../../../helper/trim";
import { IUserInfo, Web3Context } from '../../../context/Web3Context';

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
        // background: 'linear-gradient(93.41deg, #6452DE 0.68%, #F76CC5 53.61%, #FF6F6F 103.74%)',
        background: 'linear-gradient(90deg,#6e42ca,#8d29c1)',
        boxSizing: 'border-box',
        width: 20,
        height: 20,
    },
    // '& .MuiSlider-thumbColorPrimary': {
    //     display: 'none',
    // },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === 'light' ? '#241F3E' : '#39393D',
        opacity: 1,
    },
}));

export default function Part2(props: any) {
    const { selectValue, setSelectValue, valueLeverage, setValueLeverage, token, amount, setToken, setAmount, debt, setDebt, estimatiedAPR, setAPR } = props;

    const getDebtRatio = (balance: number, amountSupply: number, leverage: number) => {
        console.log('getDebtRatio: balance, amountSupply, leverage', balance, amountSupply, leverage);

        const total_debt_amount = balance + amountSupply * (leverage - 1);
        const total_LP_amount = balance;
        const borrow_factor = 1.3;
        const collateral_factor = 0.8;
        const borrow_credit = total_debt_amount * 0.8 * (leverage - 1) / 1.6; //0.8;
        const collateral_credit = total_LP_amount * 1.05;
        console.log('getDebtRatio: borrow, collateral', borrow_credit, collateral_credit, 100 * borrow_credit / collateral_credit);
        return trim(100 * borrow_credit / collateral_credit, 2);
        // setDebt(borrow_credit / collateral_credit);
    }

    const getEstimatedAPR = (leverage: number) => {
        return trim(4.64 - (4.64 + 4.57) / 1.41 * (leverage - 1), 2);
    }

    const web3 = useContext(Web3Context)
    const userInfo = web3?.userInfo as IUserInfo

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setValueLeverage(newValue);

        console.log('handleSliderChange: ', selectValue);
        setDebt(getDebtRatio(userInfo.tokenBalance[selectValue], amount, newValue));
        setAPR(getEstimatedAPR(newValue));
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValueLeverage(event.target.value === '' ? '' : Number(event.target.value));
    };

    function slideValue(value: number) {
        return `${value}`;
    }

    const [checked, setChecked] = React.useState(true);

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

        const maxLeverage = Number(trim(borrowFactor / (borrowFactor - (collateralFactor * cappedDebtRatio)), 2));
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

