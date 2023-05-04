import React, { useContext } from 'react'
import { makeStyles } from '@mui/styles'
import { styled } from '@mui/system'
import {
    Box,
    Typography,
    Stack,
    OutlinedInput,
    InputAdornment,
} from '@mui/material'
import { IUserInfo, Web3Context } from '../../../context/Web3Context'
import { coins } from '../../../context/constant'


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

interface IProps {
    tokens: Array<string>,
    tokenAmount: any,
    setTokenAmount: Function
}

export default function SupplyAssets(props: IProps) {

    const { tokens, tokenAmount, setTokenAmount } = props

    const classes = useStyles()
    const web3 = useContext(Web3Context)
    const userInfo = web3?.userInfo as IUserInfo

    return (
        <Box className={classes.root}
            sx={{
                background: '#16162d', borderRadius: '24px',
                padding: { xs: '25px', md: '40px' },
            }}>
            <Typography ml={2}>
                1. Supply Assets
            </Typography>
            {
                tokens.map((token, index) => (
                    <Box key={index}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            <Box sx={{ width: '200px' }}>
                                < Stack
                                    color={'#FFF'}
                                    direction={'row'}
                                    alignItems={'center'}
                                    gap={1}
                                    sx={{ '& img': { width: '30px', height: '30px', borderRadius: '50%' } }}
                                >
                                    <Box><img src={coins[token].logo} alt={coins[token].symbol} /></Box>
                                    <Typography sx={{ minWidth: '35px' }}>{coins[token].name}</Typography>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ fontSize: '10px !important', whiteSpace: "nowrap" }}
                                        textAlign='right'
                                    >
                                        ( Balance: {userInfo?.tokenBalance[coins[token].symbol]?.toFixed(4) ?? 0} )
                                    </Typography>
                                </Stack>
                            </Box>
                            <StyledInput
                                value={
                                    index === 0 ? tokenAmount.tokenA : index === 1 ? tokenAmount.tokenB : tokenAmount.tokenEZM}
                                type="number"
                                placeholder="e.g 1.83"
                                onChange={(e: any) => {
                                    if (e.target.value < 0) return;
                                    if (index === 0)
                                        setTokenAmount({ ...tokenAmount, tokenA: Number(e.target.value) })
                                    else if (index === 1)
                                        setTokenAmount({ ...tokenAmount, tokenB: Number(e.target.value) })
                                    else
                                        setTokenAmount({ ...tokenAmount, tokenEZM: Number(e.target.value) })
                                }}
                                endAdornment={<InputAdornment position="end"></InputAdornment>}
                                sx={{ width: '100%' }}
                            />
                        </Box>
                    </Box>
                ))
            }
        </Box >
    );
}
