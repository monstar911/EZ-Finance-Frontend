import React from 'react';
import { Box, Typography, Stack, Slider, Switch, Input } from '@mui/material';
import { styled } from '@mui/system';
import { trim } from "../../../helper/trim";

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
    const { valueLeverage, setValueLeverage, debt, setDebt } = props;
    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setValueLeverage(newValue);
        setDebt(newValue);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValueLeverage(event.target.value === '' ? '' : Number(event.target.value));
    };

    function slideValue(value: number) {
        return `${value}`;
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

                    <StyledSwitch />
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

