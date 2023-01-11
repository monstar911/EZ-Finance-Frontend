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
import { coins } from '../../../context/constant';


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

export default function SupplyAssets(props: any) {
    const {
        strCoinPair,
        valuePairX, setValuePairX, valuePairY, setValuePairY, valueEZM, setValueEZM,
        valueDolarPairX, setValueDolarPairX, valueDolarPairY, setValueDolarPairY, valueDolarEZM, setValueDolarEZM,
        valueLeverage, setValueLeverage,
        amount, setAmount,
        valueTotalSupply, setValueTotalSupply
    } = props;

    const classes = useStyles();
    const web3 = useContext(Web3Context)
    const userInfo = web3?.userInfo as IUserInfo
    const poolInfo = web3?.poolInfo

    const [tvl, setTVL] = useState(0)
    const [supBalance, setSupplyBalance] = useState(0)

    return (
        <Box className={classes.root}
            sx={{
                background: '#16162d', borderRadius: '24px',
                padding: '40px',
            }}>

            <Typography variant="h4" sx={{ '@media(max-width: 450px)': { fontSize: '24px' } }}>
                1. Supply Assets
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
                        <Box sx={{ display: { xs: 'none', md: 'block' } }}><img src={coins[strCoinPair[0]].logo} alt={coins[strCoinPair[0]].symbol} /></Box>
                        <Typography >{coins[strCoinPair[0]].name}</Typography>
                    </Stack>
                </Box>

                <Typography
                    variant="subtitle1" sx={{ fontSize: '14px !important', whiteSpace: "nowrap" }} textAlign='right'>Balance: {userInfo?.tokenBalance[coins[strCoinPair[0]].symbol]?.toFixed(4) ?? 0}
                </Typography>

                <StyledInput
                    value={valuePairX}
                    type="number"
                    placeholder="e.g 1.83"
                    onChange={(e: any) => {
                        setValuePairX(e.target.value)
                        setValueDolarPairX(coins[strCoinPair[0]].price * valueLeverage * e.target.value)
                        setValueTotalSupply(coins[strCoinPair[0]].price * valueLeverage * e.target.value + valueDolarPairY + valueDolarEZM)
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
                        <Box sx={{ display: { xs: 'none', md: 'block' } }}><img src={coins[strCoinPair[1]].logo} alt={coins[strCoinPair[1]].symbol} /></Box>
                        <Typography >{coins[strCoinPair[1]].name}</Typography>
                    </Stack>
                </Box>

                <Typography
                    variant="subtitle1" sx={{ fontSize: '14px !important', whiteSpace: "nowrap" }} textAlign='right'>Balance: {userInfo?.tokenBalance['apt']?.toFixed(4) ?? 0}
                </Typography>

                <StyledInput
                    value={valuePairY}
                    type="number"
                    placeholder="e.g 1.83"
                    onChange={(e: any) => {
                        setValuePairY(e.target.value)
                        setValueDolarPairY(coins[strCoinPair[1]].price * e.target.value)
                        setValueTotalSupply(coins[strCoinPair[1]].price * e.target.value + valueDolarPairX + valueDolarEZM)
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
                        <Box sx={{ display: { xs: 'none', md: 'block' } }}><img src={coins['ezm'].logo} alt="ezm" /></Box>
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
                        setValueDolarEZM(coins['ezm'].price * e.target.value)
                        setValueTotalSupply(coins['ezm'].price * e.target.value + valueDolarPairX + valueDolarPairY)
                    }
                    }
                    endAdornment={<InputAdornment position="end"></InputAdornment>}
                    sx={{ width: '100%' }}
                />
            </Box>
        </Box >
    );
}
