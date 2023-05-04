import React from 'react'
import { Box, Typography, Stack, Slider, Switch } from '@mui/material'
import { styled } from '@mui/system'
import { trim } from "../../../helper/trim"

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
}))

interface IProps {
    leverage: number,
    setLeverage: Function,
    maxLeverage: number
}

export default function SetLeverage(props: IProps) {
    const {
        leverage, setLeverage, maxLeverage
    } = props;

    const [checked, setChecked] = React.useState(false)

    const marks = [
        { value: 1, label: '1.00x', },
        { value: 1.25, label: '1.25x', },
        { value: 1.5, label: '1.5x', },
        { value: 1.75, label: '1.75x', },
        { value: 2, label: '2.00x', },
    ];


    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            setLeverage(newValue)
        }
    };

    function slideValue(value: number) {
        return `${value}`;
    }

    const handleChange = (event: any) => {
        setChecked(!checked)
    };


    return (
        <Box
            sx={{
                background: '#16162d',
                borderRadius: '24px',
                marginBottom: '20px',
                p: { xs: '25px', md: '40px' }
            }}>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '& .MuiTypography-root': {
                        whiteSpace: 'nowrap'
                    },
                    '@media(max-width: 500px)': {
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                    },
                }}
            >

                <Typography sx={{ py: 2 }}>
                    2. Set Leverage
                </Typography>

                <Stack direction="row" justifyContent='center' alignItems="center" gap={2}>
                    <Typography mb={1}>
                        Get Max APR
                    </Typography>
                    <StyledSwitch
                        checked={checked}
                        onChange={handleChange}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                </Stack>
            </Box>
            <Typography variant="h6" sx={{ fontSize: '11px' }}>Set to manage the total leverage level</Typography>
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
                    max={maxLeverage}
                    disabled={checked}
                    color="primary"
                    value={typeof leverage === 'number' ? leverage : 0}
                    onChange={handleSliderChange}
                    aria-labelledby="input-slider"
                />
            </Box>
            <Typography >
                Additional {trim(leverage - 1, 3)}x of your supplied assets will be borrowed
            </Typography>
        </Box>
    );
}

