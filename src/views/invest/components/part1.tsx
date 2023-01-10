import React, { useContext, useEffect, useState } from 'react';

import { makeStyles } from '@mui/styles';
import { styled } from '@mui/system';
import {
    Box,
    Typography,
    Stack,
    OutlinedInput,
    InputAdornment,
} from '@mui/material';

import { IUserInfo, Web3Context } from '../../../context/Web3Context';

import { trim } from '../../../helper/trim';
import { TokenIcon } from '../../../context/constant';
import { TokenPrice } from '../../../context/constant';


const useStyles = makeStyles(() => ({
    root: {
        marginBottom: '20px',
    },
    buttons: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap',

        '& .Mui-selected': {
            background: 'linear-gradient(90deg,#6e42ca,#8d29c1)',
            '&:hover': {
                background: 'linear-gradient(90deg,#6e42ca,#8d29c1) !important',
            }
        },
        '& button': {
            flex: '1',
            background: '#43395b',
            padding: '0.75rem 1.25rem',
            fontsize: '1rem',
            color: 'white',
            borderRadius: '100px!important',
            '&:hover': {
                background: '#483A6B',
            }
        },
    },
}));

const StyledInput = styled(OutlinedInput)({
    '& .MuiInputBase-input': {
        textAlign: 'right'
    },
    paddingRight: '0',
    fontSize: '1.5rem',
    color: 'white',
    outline: 'none',
    '& .MuiTypography-root': {
        color: 'white',
    },
    fieldset: {
        border: 'none',
    },
});

export default function Part1(props: any) {
    const { imga, imgb, namea, nameb, selectValue, setSelectValue, valueLeverage, setValueLeverage, token, setToken,
        amount, setAmount, valueEZM, setValueEZM, valueAPT, setValueAPT, valueLP, setValueLP,
        valueDolarEZM, setValueDolarEZM, valueDolarAPT, setValueDolarAPT, valueDolarLP, setValueDolarLP,
        valueTotalSupply, setValueTotalSupply } = props;

    const classes = useStyles();

    const [alignment, setAlignment] = React.useState<string>('1');
    const [supplyVal, setSupplyVal] = React.useState('100');

    let valueAmountPercent = '25';

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const onSetSupplyVal = (amount: string, balance: number) => {
        console.log('onSetSupplyVal:', amount, ',', balance);

        const precision = 3;

        if (isNaN(balance)) {
            setValueLP('' + trim(0 / 4, precision));
            setAmount('' + trim(0 / 8, precision));
            return;
        }

        if (amount === '25') {
            valueAmountPercent = '25';
            setValueLP('' + trim(balance / 4, precision));
            setAmount('' + trim(balance / 8, precision));
        } else if (amount === '50') {
            valueAmountPercent = '50';
            setValueLP('' + trim(balance / 2, precision));
            setAmount('' + trim(balance / 4, precision));
        } else if (amount === '75') {
            valueAmountPercent = '75';
            setValueLP('' + trim(3 * balance / 4, precision));
            setAmount('' + trim(3 * balance / 8, precision));
        } else if (amount === '100') {
            valueAmountPercent = '100';
            setValueLP('' + trim(balance, precision));
            setAmount('' + trim(balance / 2, precision));
        }

        valueAmountPercent = amount;
    }

    const handleChange = (name: string) => {
        setToken(name)
    }

    const web3 = useContext(Web3Context)
    const userInfo = web3?.userInfo as IUserInfo
    const poolInfo = web3?.poolInfo
    const tokenPrice = web3?.tokenPrice as any

    const [tvl, setTVL] = useState(0)
    const [supBalance, setSupplyBalance] = useState(0)

    return (
        <Box className={classes.root}
            sx={{
                background: '#16162d', borderRadius: '24px',
                padding: '40px',
            }}>

            <Typography variant="h4" sx={{ '@media(max-width: 450px)': { fontSize: '24px' } }}>
                1. Supply assets
            </Typography>

            <Typography variant="subtitle1" sx={{ pt: 2, pb: 2 }}>
                Turn on the toggle for the assets you wish to supply in
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '@media(max-width: 450px)': { flexDirection: 'column' },
                }}
            >

                <Box sx={{ width: '200px', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}>
                    < Stack
                        color={'#FFF'}
                        direction={'row'}
                        alignItems={'center'}
                        gap={1}
                        sx={{ padding: '16.5px 14px', '& img': { width: '30px', height: '30px', borderRadius: '50%' } }}
                    >
                        <Box sx={{ display: { xs: 'none', md: 'block' } }}><img src={TokenIcon.ezm} alt="ezm" /></Box>
                        <Typography >{'EZM'}</Typography>
                    </Stack>
                </Box>

                <Typography
                    variant="subtitle1" sx={{ fontSize: '14px !important', whiteSpace: "nowrap" }} textAlign='right'>Balance: {userInfo?.tokenBalance['ezm']?.toFixed(4) ?? 0}
                </Typography>

                <StyledInput
                    value={valueEZM}
                    type="number"
                    placeholder="e.g 1.83"
                    onChange={(e: any) => {
                        setValueEZM(e.target.value)
                        setValueDolarEZM(TokenPrice.ezm * valueLeverage * e.target.value)
                        setValueTotalSupply(TokenPrice.ezm * valueLeverage * e.target.value + valueDolarAPT + valueDolarLP)
                    }
                    }
                    endAdornment={<InputAdornment position="end"></InputAdornment>}
                    sx={{ width: '100%' }}
                />
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '@media(max-width: 450px)': { flexDirection: 'column' },
                }}
            >

                <Box sx={{ width: '200px', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}>
                    < Stack
                        color={'#FFF'}
                        direction={'row'}
                        alignItems={'center'}
                        gap={1}
                        sx={{ padding: '16.5px 14px', '& img': { width: '30px', height: '30px', borderRadius: '50%' } }}
                    >
                        <Box sx={{ display: { xs: 'none', md: 'block' } }}><img src={TokenIcon.apt} alt="aptos" /></Box>
                        <Typography >{'APT'}</Typography>
                    </Stack>
                </Box>

                <Typography
                    variant="subtitle1" sx={{ fontSize: '14px !important', whiteSpace: "nowrap" }} textAlign='right'>Balance: {userInfo?.tokenBalance['apt']?.toFixed(4) ?? 0}
                </Typography>

                <StyledInput
                    value={valueAPT}
                    type="number"
                    placeholder="e.g 1.83"
                    onChange={(e: any) => {
                        setValueAPT(e.target.value)
                        setValueDolarAPT(TokenPrice.apt * e.target.value)
                        setValueTotalSupply(TokenPrice.apt * e.target.value + valueDolarEZM + valueDolarLP)
                    }
                    }
                    endAdornment={<InputAdornment position="end"></InputAdornment>}
                    sx={{ width: '100%' }}
                />
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '@media(max-width: 450px)': { flexDirection: 'column' },
                }}
            >

                <Box sx={{ width: '200px', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}>
                    < Stack
                        color={'#FFF'}
                        direction={'row'}
                        alignItems={'center'}
                        gap={1}
                        sx={{ padding: '16.5px 14px', '& img': { width: '30px', height: '30px', borderRadius: '50%' } }}
                    >
                        <Box sx={{ display: { xs: 'none', md: 'block' } }}><img src={TokenIcon.lp} alt="lp" /></Box>
                        <Typography >{'LP'}</Typography>
                    </Stack>
                </Box>

                <Typography
                    variant="subtitle1" sx={{ fontSize: '14px !important', whiteSpace: "nowrap" }} textAlign='right'>Balance: {userInfo?.tokenBalance['lp']?.toFixed(4) ?? 0}
                </Typography>

                <StyledInput
                    value={valueLP}
                    type="number"
                    placeholder="e.g 1.83"
                    onChange={(e: any) => {
                        setValueLP(e.target.value)
                        setValueDolarLP(TokenPrice.lp * e.target.value)
                        setValueTotalSupply(TokenPrice.lp * e.target.value + valueDolarEZM + valueDolarAPT)
                    }
                    }
                    endAdornment={<InputAdornment position="end"></InputAdornment>}
                    sx={{ width: '100%' }}
                />
            </Box>
        </Box >
    );
}
