import React from 'react';
import {
    Box,
    Typography,
    Stack,
    Switch,
    OutlinedInput,
    ToggleButtonGroup,
    ToggleButton,
    InputAdornment,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/system';

import a from '../../../asset/icons/Aptos.png';
import b from '../../../asset/icons/crypto-usdc.png';

const useStyles = makeStyles(() => ({
    root: {
        marginBottom: '20px',
        padding: '40px',
        background: '#342D55',
        borderRadius: '15px',
    },
    buttons: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap',
        marginBottom: '20px',
        '& .Mui-selected': {
            background: 'linear-gradient(93.41deg, #6452DE 0.68%, #F76CC5 53.61%, #FF6F6F 103.74%)',
        },
        '& button': {
            flex: '1',
            background: '#241F3E',
            border: 'none!important',
            padding: '18px 33px',
            color: 'white',
            fontSize: '18px',
            borderRadius: '50px!important',
        },
    },
}));

const StyledInput = styled(OutlinedInput)({
    color: 'white',
    border: '1px solid grey',
    outline: 'none',
    '& .MuiTypography-root': {
        color: 'white',
    },
    '&:hover': {
        border: '1px solid #ddd',
    },
    fieldset: {
        border: 'none',
    },
});

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

export default function Part1(props: any) {
    const { imga, imgb, namea, nameb } = props;
    const classes = useStyles();
    const [value, setValue] = React.useState('');
    const [alignment, setAlignment] = React.useState<string>('1');

    return (
        <Box className={classes.root}>
            <Typography variant="h4" sx={{ '@media(max-width: 450px)': { fontSize: '24px' } }}>
                1. Supply assets
            </Typography>
            <Typography variant="subtitle1" sx={{ pt: 2, pb: 3 }}>
                Turn on the toggle for the assets you wish to supply in
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 2,
                    '@media(max-width: 450px)': { flexDirection: 'column' },
                }}
            >
                <Stack direction={'row'} alignItems={'center'} gap={2}>
                    <StyledSwitch />
                    <Stack direction={'row'} alignItems={'center'} gap={1}>
                        <img src={imga} alt="" style={{ width: '25px', height: '25px', borderRadius: '50%' }} />
                        <Typography sx={{ fontWeight: 400, fontSize: '18px' }}>{namea}</Typography>
                    </Stack>
                </Stack>
                <Typography variant="subtitle1">Balance: 0.00 {namea}</Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '@media(max-width: 450px)': { flexDirection: 'column' },
                }}
            >
                <Stack direction={'row'} alignItems={'center'} gap={2}>
                    <StyledSwitch />
                    <Stack direction={'row'} alignItems={'center'} gap={1}>
                        <img src={imgb} alt="" style={{ width: '25px', height: '25px', borderRadius: '50%' }} />
                        <Typography sx={{ fontWeight: 400, fontSize: '18px' }}>{nameb}</Typography>
                    </Stack>
                </Stack>
                <Typography variant="subtitle1">Balance: 0.00 {nameb}</Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 2,
                }}
            >
                <StyledInput
                    value={value}
                    placeholder="$0.00"
                    onChange={(e: any) => setValue(e.target.value)}
                    endAdornment={<InputAdornment position="end">USDC</InputAdornment>}
                    sx={{ width: '100%' }}
                />
            </Box>
            <ToggleButtonGroup
                value={alignment}
                exclusive
                onChange={(e: any) => setAlignment(e.target.value)}
                className={classes.buttons}
            >
                <ToggleButton value="1">25%</ToggleButton>
                <ToggleButton value="2">50%</ToggleButton>
                <ToggleButton value="3">75%</ToggleButton>
                <ToggleButton value="4">100%</ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
}
