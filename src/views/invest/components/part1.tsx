import React, { useContext, useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Stack,
    Switch,
    OutlinedInput,
    ToggleButtonGroup,
    ToggleButton,
    InputAdornment,
    Button,
    MenuItem,
    Select,
    Menu,
    alpha,
    MenuProps,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/system';
import { IUserInfo, Web3Context } from '../../../context/Web3Context';
import { trim } from '../../../helper/trim';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import LpIcon from '../../../asset/icons/LpToken.png'
import EzmIcon from '../../../asset/icons/EZM.png'
import AptosIcon from '../../../asset/icons/Aptos.png'
import BtcIcon from '../../../asset/icons/crypto-btc.svg'
import UsdcIcon from '../../../asset/icons/crypto-usdc.png'
import UsdtIcon from '../../../asset/icons/crypto-usdt.png'
import EthereumIcon from '../../../asset/icons/crypto-ethereum.png'
import DaiIcon from '../../../asset/icons/crypto-dai.svg'

const faucetItems = [
    {
        value: 'dai',
        logo: DaiIcon,
        tokenName: 'DAI'
    }, {
        value: 'usdc',
        logo: UsdcIcon,
        tokenName: 'USDC'
    }, {
        value: 'usdt',
        logo: UsdtIcon,
        tokenName: 'USDT'
    }, {
        value: 'ceUsdc',
        logo: UsdcIcon,
        tokenName: 'ceUSDC'
    }, {
        value: 'wbtc',
        logo: BtcIcon,
        tokenName: 'WBTC'
    }, {
        value: 'weth',
        logo: EthereumIcon,
        tokenName: 'WETH'
    }
]

const useStyles = makeStyles(() => ({
    root: {
        marginBottom: '20px',
        // padding: '40px',
        // background: '#43395b',
        // borderRadius: '15px',
    },
    buttons: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: '20px',
        flexWrap: 'wrap',
        // marginBottom: '20px',

        '& .Mui-selected': {
            // background: 'linear-gradient(93.41deg, #6452DE 0.68%, #F76CC5 53.61%, #FF6F6F 103.74%)',
            background: 'linear-gradient(90deg,#6e42ca,#8d29c1)',
            // zindex: '1',
            // background: '#6e42ca',
            // zindex: '-1',
            // transition: 'all .25s ease-in-out',
            // opacity: '0',
            '&:hover': {
                background: 'linear-gradient(90deg,#6e42ca,#8d29c1) !important',
            }
        },
        '& button': {
            flex: '1',
            background: '#43395b',
            // border: 'none!important',
            // border: '1px solid #cbd5e1',
            padding: '0.75rem 1.25rem',
            fontsize: '1rem',
            // padding: '12px 20px',
            color: 'white',
            // fontSize: '16px',
            // borderRadius: '50px!important',
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
    // border: '1px solid grey',
    outline: 'none',
    '& .MuiTypography-root': {
        color: 'white',
    },
    '&:hover': {
        // border: '1px solid #ddd',
    },
    fieldset: {
        border: 'none',
    },
});

export default function Part1(props: any) {
    const { imga, imgb, namea, nameb, selectValue, setSelectValue, index, setIndex, token, setToken,
        amount, setAmount, valueAPT, setValueAPT, valueToken, setValueToken } = props;

    const classes = useStyles();
    const [alignment, setAlignment] = React.useState<string>('1');
    // const [token, setToken] = React.useState('');
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
            setValueToken('' + trim(0 / 4, precision));
            setAmount('' + trim(0 / 8, precision));
            return;
        }

        if (amount === '25') {
            valueAmountPercent = '25';
            setValueToken('' + trim(balance / 4, precision));
            setAmount('' + trim(balance / 8, precision));
        } else if (amount === '50') {
            valueAmountPercent = '50';
            setValueToken('' + trim(balance / 2, precision));
            setAmount('' + trim(balance / 4, precision));
        } else if (amount === '75') {
            valueAmountPercent = '75';
            setValueToken('' + trim(3 * balance / 4, precision));
            setAmount('' + trim(3 * balance / 8, precision));
        } else if (amount === '100') {
            valueAmountPercent = '100';
            setValueToken('' + trim(balance, precision));
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

    // useEffect(() => {
    //     let _tvl = 0;
    //     let _sup = 0;
    //     Object.keys(poolInfo).map((item) => {
    //         _tvl += poolInfo[item] * tokenPrice[item]
    //         _sup += (userInfo.deposit[item] ?? 0) * tokenPrice[item]

    //     })
    //     setTVL(_tvl)
    //     setSupplyBalance(_sup)
    // }, [poolInfo, tokenPrice, userInfo])

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
                    // pt: 2,
                    '@media(max-width: 450px)': { flexDirection: 'column' },
                }}
            >

                <Box sx={{ width: '200px', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}>
                    < Stack
                        color={'#FFF'}
                        // boder={'0'}
                        direction={'row'}
                        alignItems={'center'}
                        gap={1}
                        sx={{ padding: '16.5px 14px', '& img': { width: '30px', height: '30px', borderRadius: '50%' } }}
                    >
                        <Box sx={{ display: { xs: 'none', md: 'block' } }}><img src={EzmIcon} alt="ezm" /></Box>
                        <Typography >{'EZM'}</Typography>
                    </Stack>
                </Box>

                <Typography
                    variant="subtitle1" sx={{ fontSize: '14px !important' }} textAlign='right'>Balance: {userInfo?.tokenBalance['ezm']?.toFixed(4) ?? 0}
                </Typography>

                <StyledInput
                    value={valueAPT}
                    placeholder="e.g 1.83"
                    onChange={(e: any) => setValueAPT(e.target.value)}
                    endAdornment={<InputAdornment position="end"></InputAdornment>}
                    sx={{ width: '100%' }}
                />
            </Box>

            {/* <Typography
                variant="subtitle1" sx={{ pb: '10px', fontSize: '14px !important' }} textAlign='right'>Balance: {userInfo.tokenBalance['apt'].toFixed(4)}
            </Typography> */}
            {/* <Typography
                variant="subtitle1" sx={{ fontSize: '14px !important' }} textAlign='right'>Balance: {userInfo.tokenBalance['apt'].toFixed(4)}
            </Typography> */}

            {/* <ToggleButtonGroup
                className={classes.buttons}
                value={alignment}
                exclusive
                onChange={(e: any) => setAlignment(e.target.value)}
                sx={{ marginTop: '20px' }}
            >
                <ToggleButton value="1" onClick={() => onSetSupplyVal('25', userInfo.tokenBalance[selectValue])}>25%</ToggleButton>
                <ToggleButton value="2" onClick={() => onSetSupplyVal('50', userInfo.tokenBalance[selectValue])}>50%</ToggleButton>
                <ToggleButton value="3" onClick={() => onSetSupplyVal('75', userInfo.tokenBalance[selectValue])}>75%</ToggleButton>
                <ToggleButton value="4" onClick={() => onSetSupplyVal('100', userInfo.tokenBalance[selectValue])}>100%</ToggleButton>
            </ToggleButtonGroup> */}

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    // pt: 2,
                    '@media(max-width: 450px)': { flexDirection: 'column' },
                }}
            >

                <Box sx={{ width: '200px', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}>
                    < Stack
                        color={'#FFF'}
                        // boder={'0'}
                        direction={'row'}
                        alignItems={'center'}
                        gap={1}
                        sx={{ padding: '16.5px 14px', '& img': { width: '30px', height: '30px', borderRadius: '50%' } }}
                    >
                        <Box sx={{ display: { xs: 'none', md: 'block' } }}><img src={AptosIcon} alt="aptos" /></Box>
                        <Typography >{'APT'}</Typography>
                    </Stack>
                </Box>

                <Typography
                    variant="subtitle1" sx={{ fontSize: '14px !important' }} textAlign='right'>Balance: {userInfo?.tokenBalance['apt']?.toFixed(4) ?? 0}
                </Typography>

                <StyledInput
                    value={valueToken}
                    placeholder="e.g 1.83"
                    onChange={(e: any) => setValueToken(e.target.value)}
                    endAdornment={<InputAdornment position="end"></InputAdornment>}
                    sx={{ width: '100%' }}
                />
            </Box>

            {/* <ToggleButtonGroup
                className={classes.buttons}
                value={alignment}
                exclusive
                onChange={(e: any) => setAlignment(e.target.value)}
                sx={{ marginTop: '20px' }}
            >
                <ToggleButton value="1" onClick={() => onSetSupplyVal('25', userInfo.tokenBalance[selectValue])}>25%</ToggleButton>
                <ToggleButton value="2" onClick={() => onSetSupplyVal('50', userInfo.tokenBalance[selectValue])}>50%</ToggleButton>
                <ToggleButton value="3" onClick={() => onSetSupplyVal('75', userInfo.tokenBalance[selectValue])}>75%</ToggleButton>
                <ToggleButton value="4" onClick={() => onSetSupplyVal('100', userInfo.tokenBalance[selectValue])}>100%</ToggleButton>
            </ToggleButtonGroup> */}

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    // pt: 2,
                    '@media(max-width: 450px)': { flexDirection: 'column' },
                }}
            >

                <Box sx={{ width: '200px', '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}>
                    < Stack
                        color={'#FFF'}
                        // boder={'0'}
                        direction={'row'}
                        alignItems={'center'}
                        gap={1}
                        sx={{ padding: '16.5px 14px', '& img': { width: '30px', height: '30px', borderRadius: '50%' } }}
                    >
                        <Box sx={{ display: { xs: 'none', md: 'block' } }}><img src={LpIcon} alt="lp" /></Box>
                        <Typography >{'LP'}</Typography>
                    </Stack>
                </Box>

                <Typography
                    variant="subtitle1" sx={{ fontSize: '14px !important' }} textAlign='right'>Balance: {userInfo?.tokenBalance['apt']?.toFixed(4) ?? 0}
                </Typography>

                <StyledInput
                    value={valueToken}
                    placeholder="e.g 1.83"
                    onChange={(e: any) => setValueToken(e.target.value)}
                    endAdornment={<InputAdornment position="end"></InputAdornment>}
                    sx={{ width: '100%' }}
                />
            </Box>
        </Box >
    );
}
