import React from 'react';
import { Box, Typography, Stack, Slider, Switch } from '@mui/material';
import { styled } from '@mui/system';

const StyledSwitch = styled(Switch)(({ theme }) => ({
    width: 42,
    height: 26,
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
        boxSizing: 'border-box',
        width: 22,
        height: 22,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === 'light' ? '#241F3E' : '#39393D',
        opacity: 1,
    },
}));

export default function Part2() {
    function slideValue(value: number) {
        return `${value}`;
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
        <Box sx={{ marginBottom: '20px', padding: '40px', background: '#342D55', borderRadius: '15px' }}>
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
                    max={2}
                    color="secondary"
                />
            </Box>
            <Typography variant="body2" sx={{ fontSize: '18px' }}>
                Additional 1.45x of your supplied assets will be borrowed
            </Typography>
        </Box>
    );
}
