import React, { useContext, useState } from 'react';
import { Box, Typography, Paper, Grid, IconButton, Stack, InputAdornment, TextField, Modal, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import EastIcon from '@mui/icons-material/East';
import Container from '../../components/container';
import { Common_FillButton, Common_OutlineButton } from '../../components/button';
import Slider from 'react-slick';

import CryptoImage from '../../asset/icons/crypto-hand.png';
import CubeImage from '../../asset/icons/cube.png';
import PocketImage from '../../asset/icons/pocket-money.png';
import part1_img from '../../asset/icons/IDO.png';
import part2_img from '../../asset/icons/wallet.png';
import part3_img from '../../asset/icons/Private Key.png';
import SmartContract from '../../asset/icons/Smart_Contract.png';

import { coins, pairs, protocols } from '../../context/constant';
import { ITokenPrice3, IUserInfo, Web3Context } from '../../context/Web3Context';
import { formatValue } from '../../helper/formatValue';
import { useNavigate } from 'react-router-dom';
import { getEstimatedAPR, getMaxAPR } from '../../helper/getEstimateAPR';
import { tokenMaxLeverage } from '../../helper/getMaxLeverage';
import { trim } from '../../helper/trim';
import { IconX } from '@tabler/icons';

const useStyles = makeStyles((theme: any) => ({
    root: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        '& .MuiTypography-root': {
            color: '#FFF',
        },
        '& .slick-dots button::before': {
            color: 'white',
        },
        '& .slick-active button::before': {
            color: 'white!important',
        },
    },
    part1: {
        display: 'flex',
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
            flexWrap: 'wrap-reverse',
            flexDirection: 'column-reverse',
            justifyContent: 'center',
            textAlign: 'center',
        },
        justifyContent: 'space-between',
        width: '100%',
        background: '#16162d', borderRadius: '24px',
        boxShadow: '0px 1px 4px #ccc',

        marginBottom: '20px',
        '& > div:nth-child(1)': {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            flex: '1 1 65%',
            padding: '30px',
            [theme.breakpoints.down('sm')]: {
                padding: '15px',
            },
            '& > h1': {
                fontStyle: 'normal',
                fontSize: '30px',
                fontWeight: '700',
                lineHeight: '40px',
                letterSpacing: '-0.005em',
                padding: '10px 0',
                [theme.breakpoints.down('md')]: {
                    fontSize: '35px',
                },
            },
            '& > h3': {
                fontSize: '18px',
                fontWeight: '400',
                lineHeight: '158.6%',
                paddingBottom: '30px',
            },
            '& > div': {
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                direction: 'row',
                gap: '20px',
                flexWrap: 'wrap',
                '& > div': {
                    borderRadius: '10px',
                    backgroundColor: 'unset',
                    boxShadow: 'unset',
                    padding: '10px 20px',
                    border: '1px solid white',
                    width: '100%',
                    flex: '1',

                    '& > h2': {
                        fontSize: '40px',
                        letter: '2.5%',
                        lineHeight: '50px',
                        [theme.breakpoints.down('md')]: {
                            fontSize: '25px',
                        },
                    },
                },
            },
            [theme.breakpoints.down('lg')]: {
                flex: '1',
            },
        },
        '& > div:nth-child(2)': {
            flex: '1 1 35%',
            [theme.breakpoints.down('lg')]: {
                flex: '1',
            },
            display: 'flex',
            justifyContent: 'flex-end',
            '& > img': {
                width: '50%',
                [theme.breakpoints.down('md')]: {
                    display: 'none',
                },
                marginTop: '-40px',
            },
        },
    },
    part2: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
        width: '100%',
        marginTop: '20px',
        [theme.breakpoints.down('lg')]: {
            flexWrap: 'wrap',
        },
        '& > div': {
            flex: '1 1 50%',
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#16162d', borderRadius: '24px',
            boxShadow: '0px 1px 4px #ccc',

            '& img': {
                borderRadius: '10px',
                objectFit: 'cover',
                zIndex: 0,
            },
            '& h3': {
                fontSize: '30px',
                fontWeight: '700',
                lineHeight: '80px',
                letter: '-3%',
            },
            '& h6': {
                fontSize: '18px',
                fontWeight: '600',
                lineHeight: '30px',
            },
            '& p': {
                fontSize: '18px',
                opacity: '.5',
                lineHeight: '50px',
            },
        },
    },
    part3: {
        marginTop: '60px',
        textAlign: 'center',
        width: '100%',
        '& > h6': {
            fontSize: '18px',
            fontWeight: 'normal',
            opacity: '.5',
            marginBottom: '30px',
        },
        '& > div': {
            padding: '20px 10px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'flex-start',
            background: '#16162d', borderRadius: '24px',
            boxShadow: '0px 1px 4px #ccc',

            [theme.breakpoints.down('md')]: {
                alignItems: 'center',
                flexDirection: 'column',
                padding: '30px',
            },
            '& > div': {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px',
                flex: '1 1 33.3%',
                [theme.breakpoints.down('md')]: {
                    flex: '1',
                },
                '& > h5': {
                    color: '#ccc',
                    padding: '10px 0',
                },
                '& img': {
                    width: '80px',
                },
            },
        },
    },
    part4: {
        width: '100%',
        marginTop: '20px',
        '& .title': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            [theme.breakpoints.down('md')]: {
                gap: 20,
                textAlign: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            },
            '& h3': {
                fontSize: '30px',
                padding: '20px 0',
                [theme.breakpoints.down('md')]: {
                    padding: '10px 0',
                },
                [theme.breakpoints.down('sm')]: {
                    fontSize: '30px',
                },
            },
            '& h6': {
                fontSize: '18px',
                opacity: '0.5',
            },
        },
        '& .slide_card': {
            padding: '35px',
            background: '#16162d', borderRadius: '24px',
            boxShadow: '0px 1px 4px #ccc',

            '& h6': {
                opacity: '0.5',
                padding: '10px 0',
            },
            '& h5': {
                padding: '10px 0',
                borderBottom: '1px solid grey',
            },
            '& h3': {
                fontSize: '20px',
            },
        },
    },
    part5: {
        width: '100%',
        marginTop: '30px',
        textAlign: 'center',
        '& > h3': {
            fontSize: '30px',
            padding: '20px 0',
            [theme.breakpoints.down('md')]: {
                padding: '10px 0',
                fontSize: '28px',
            },
        },
        '& > h6': {
            fontSize: '18px',
            opacity: '0.5',
            marginBottom: '50px',
        },
        '& .card': {
            background: '#16162d', borderRadius: '24px',
            boxShadow: '0px 1px 4px #ccc',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '20px 30px',
            '& h5': {
                fontSize: '20px'
            },
            [theme.breakpoints.down('sm')]: {
                padding: '10px',
                '& h5': {
                    fontSize: '18px',
                },
            },
            '& img': {
                borderRadius: '50%',
                width: '40px',
                backgroundColor: 'white',
            },
            '& button': {
                color: 'white',
            },
        },
    },
    part6: {
        marginTop: '80px',
        width: '100%',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        background: '#16162d', borderRadius: '24px',
        boxShadow: '0px 1px 4px #ccc',

        [theme.breakpoints.down('md')]: {
            flexDirection: 'column-reverse',
            textAlign: 'center',
            padding: '20px',
        },
        '& div': {
            flex: '1 1 50%',
            '& h3': {
                fontSize: '24px',
                fontWeight: '500',
                lineHeight: '40px',
            },
            '& h6': {
                fontSize: '18px',
                fontWeight: '400',
                lineHeight: '30px',
                paddingBottom: '20px',
            },
            '& img': {
                width: '200px',
                [theme.breakpoints.down('lg')]: {
                    width: '250px',
                },
                [theme.breakpoints.down('sm')]: {
                    width: '100%',
                },
            },
        },
    },
    gradient__back: {
        position: 'absolute',
        top: '5px',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg,#6e42ca,#8d29c1)',
        zIndex: '-1',
        borderRadius: '10px',
    },
}));


const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '20px'
};

const slide_settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    arrows: false,
    responsive: [
        {
            breakpoint: 1500,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
            },
        },
        {
            breakpoint: 1350,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
            },
        },
        {
            breakpoint: 1050,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 889,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
            },
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
    ],
};

function Home() {
    const classes = useStyles();

    const poolData = React.useMemo(() => {
        const bump: any = [];

        Object.keys(pairs).forEach((dex) => {
            for (let pair in pairs[dex]) {
                const obj = {
                    dex: dex,
                    aTokenIcon: pairs[dex][pair].x.logo,
                    bTokenIcon: pairs[dex][pair].y.logo,
                    aname: pairs[dex][pair].x.name,
                    bname: pairs[dex][pair].y.name,
                    from_percent: getEstimatedAPR(pairs[dex][pair].x.symbol, 1.0),
                    max_apr: getMaxAPR(pairs[dex][pair].x.symbol, tokenMaxLeverage(pairs[dex][pair].x.symbol))[1],
                    pair: pairs[dex][pair].x.symbol + '-' + pairs[dex][pair].y.symbol + '-' + dex,
                };

                bump.push(obj)
            }
        })

        return bump;
    }, []);

    const web3 = useContext(Web3Context)
    const tokenVolume = web3?.tokenVolume
    const tokenPrice3 = web3?.tokenPrice3 as ITokenPrice3
    const tokenPosition = web3?.tokenPosition

    const [poolInfo, setPoolInfo] = useState<any>()
    const [userInfo, setUserInfo] = useState<IUserInfo>()

    console.log('Farm tokenVolume', tokenVolume);

    let farmPools: any = [];

    var allPoolsTVL = 0;
    var allPositions = 0;
    Object.keys(pairs).forEach((dex) => {
        for (let pair in pairs[dex]) {
            let _liquidityInfo = tokenVolume?.[dex]?.[pair]?.['liquidity']
            const _liquidity = _liquidityInfo ??= 0

            allPoolsTVL = allPoolsTVL + Number(_liquidity);

            let _tokenPositionInfo = tokenPosition?.[dex]?.[pair]?.['length']
            const _position = _tokenPositionInfo ??= 0
            allPositions = allPositions + Number(_position)
        }
    })

    const navigate = useNavigate();

    const emptyToken = {
        icon: '',
        asset: '',
        symbol: '',
        depositAPY: 0,
        totalDeposited: 0,
        depositBalance: 0,
        walletBalance: 0
    }

    const datas = [
        {
            icon: coins['ezm'].logo,
            asset: 'EZM',
            symbol: 'ezm',
            depositAPY: 1.3,
            totalDeposited: trim(poolInfo?.ezm ?? 0, 3),
            depositBalance: trim(userInfo?.deposit['ezm'] ?? 0, 3),
            walletBalance: trim(userInfo?.tokenBalance['ezm'] ?? 0, 3)
        }, {
            icon: coins['apt'].logo,
            asset: 'APT',
            symbol: 'apt',
            depositAPY: 1.3,
            totalDeposited: trim(poolInfo?.apt ?? 0, 3),
            depositBalance: trim(userInfo?.deposit['apt'] ?? 0, 3),
            walletBalance: trim(userInfo?.tokenBalance['apt'] ?? 0, 3)
        }, {
            icon: coins['wbtc'].logo,
            asset: 'WBTC',
            symbol: 'wbtc',
            depositAPY: 2.4,
            totalDeposited: trim(poolInfo?.wbtc ?? 0, 3),
            depositBalance: userInfo?.deposit['wbtc'] ?? 0,
            walletBalance: trim(userInfo?.tokenBalance['wbtc'] ?? 0, 3)
        }, {
            icon: coins['weth'].logo,
            asset: 'WETH',
            symbol: 'weth',
            depositAPY: 2.3,
            totalDeposited: trim(poolInfo?.weth ?? 0, 3),
            depositBalance: userInfo?.deposit['weth'] ?? 0,
            walletBalance: trim(userInfo?.tokenBalance['weth'] ?? 0, 3)
        }, {
            icon: coins['usdt'].logo,
            asset: 'USDT',
            symbol: 'usdt',
            depositAPY: 1.0,
            totalDeposited: trim(poolInfo?.usdt ?? 0, 3),
            depositBalance: userInfo?.deposit['usdt'] ?? 0,
            walletBalance: trim(userInfo?.tokenBalance['usdt'] ?? 0, 3)
        }, {
            icon: coins['usdc'].logo,
            asset: 'USDC',
            symbol: 'usdc',
            depositAPY: 0.9,
            totalDeposited: trim(poolInfo?.usdc ?? 0, 3),
            depositBalance: userInfo?.deposit['usdc'] ?? 0,
            walletBalance: trim(userInfo?.tokenBalance['usdc'] ?? 0, 3)
        }, {
            icon: coins['sol'].logo,
            asset: 'SOL',
            symbol: 'sol',
            depositAPY: 1.1,
            totalDeposited: trim(poolInfo?.sol ?? 0, 3),
            depositBalance: userInfo?.deposit['sol'] ?? 0,
            walletBalance: trim(userInfo?.tokenBalance['sol'] ?? 0, 3)
        }, {
            icon: coins['bnb'].logo,
            asset: 'BNB',
            symbol: 'bnb',
            depositAPY: 1.1,
            totalDeposited: trim(poolInfo?.bnb ?? 0, 3),
            depositBalance: userInfo?.deposit['bnb'] ?? 0,
            walletBalance: trim(userInfo?.tokenBalance['bnb'] ?? 0, 3)
        }
    ];

    const [supModal, setSupModal] = useState(false)
    const [supToken, setSupToken] = useState<any | null>(emptyToken)
    const [depoAmt, setDepoAmt] = useState(0)

    const onSupModalClose = () => {
        setSupToken(emptyToken);
        setSupModal(false);
    }

    const onSupModalOpen = (index) => {
        setSupToken(datas[index]);
        setSupModal(true);
    }

    const onClickSupply = async () => {
        await web3?.deposit(supToken.symbol, depoAmt);
    }

    const onSetDepositAmount = (e: any) => {
        setDepoAmt(e.target.value);
    }


    return (
        <Container>
            <Box className={classes.root}>
                <Box className={classes.part1}>
                    <Box>
                        <Typography variant="h1">The home of Yield Boosting</Typography>
                        <Typography variant="h3">
                            Your lending & leveraged yield farming protocol on Aptos and Sui
                        </Typography>
                        <Box>
                            <Paper>
                                <Typography variant="subtitle1">Aptos TVL</Typography>
                                <Typography variant="h2">${formatValue(allPoolsTVL, 2)}</Typography>
                            </Paper>
                            <Paper>
                                <Typography variant="subtitle1">Sui TVL</Typography>
                                <Typography variant="h2">$0</Typography>
                            </Paper>
                        </Box>
                    </Box>
                    <Box>
                        <img src={CryptoImage} alt="img" />
                    </Box>
                </Box>

                <Box className={classes.part2}>
                    <Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-around',
                                flexDirection: 'column',
                                p: 3,
                                width: { md: '70%', sm: '80%', xs: '100%' },
                                zIndex: 2,
                            }}
                        >
                            <Box>
                                <Typography variant="h3">Farm</Typography>
                                <Typography variant="subtitle1">Earn up to 15% APR</Typography>
                                <Typography variant="body1">Boost farming yield from top exchanges</Typography>
                            </Box>
                            <Common_FillButton
                                content="View Pools Now"
                                onClick={() => navigate(`/farm`)}
                            >
                            </Common_FillButton>
                        </Box>

                        <Box sx={{ position: 'absolute', bottom: 0, right: 0 }}>
                            <img src={CubeImage} alt="cube" />
                        </Box>
                        {/* <Box className={classes.gradient__back}></Box> */}
                    </Box>
                    <Box>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-around',
                                flexDirection: 'column',
                                p: 3,
                                zIndex: 2,
                                width: { md: '70%', sm: '80%', xs: '100%' },
                            }}
                        >
                            <Box>
                                <Typography variant="h3">Lend</Typography>
                                <Typography variant="subtitle1">Earn up to 6% APR</Typography>
                                <Typography variant="body1">Boost farming yield from top exchanges</Typography>
                            </Box>
                            <Common_FillButton
                                content="Deposit Now"
                                onClick={() => navigate(`/lend`)}                             >

                            </Common_FillButton>
                        </Box>
                        <Box sx={{ position: 'absolute', bottom: 0, right: 0, zIndex: 0 }}>
                            <img src={PocketImage} alt="pocket" />
                        </Box>
                        {/* <Box className={classes.gradient__back}></Box> */}
                    </Box>
                </Box>

                <Box className={classes.part3}>
                    <Typography variant="h3" sx={{ fontSize: { xs: '20px', sm: '30px', md: '30px' } }}>
                        Why Farm with EZ?
                    </Typography>
                    <Typography variant="subtitle1">High Yield. High Security. Quality Pools.</Typography>
                    <Box>
                        <Box>
                            <img src={part1_img} alt="" />
                            <Typography variant="h5">Start with what you have</Typography>
                            <Typography variant="subtitle1">Only a single asset needed to open positions</Typography>
                        </Box>
                        <Box>
                            <img src={part2_img} alt="" />
                            <Typography variant="h5">Borrow other assets you need</Typography>
                            <Typography variant="subtitle1">
                                Flexible borrowing of multiple assets to suit any farming strategies
                            </Typography>
                        </Box>
                        <Box>
                            <img src={part3_img} alt="" />
                            <Typography variant="h5">Up to 10x Leverage</Typography>
                            <Typography variant="subtitle1">Get higher APR from higher leverage</Typography>
                        </Box>
                    </Box>
                </Box>

                <Box className={classes.part4}>
                    <Box className="title">
                        <Box ml={3}>
                            <Typography variant="h3" >Popular Pools</Typography>
                            <Typography variant="subtitle1">
                                Seek the best available pools from top exchanges
                            </Typography>
                        </Box>
                        <Box>
                            <Common_FillButton
                                content="View All Pools"
                                onClick={() => navigate(`/farm`)}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ paddingTop: '20px' }}>
                        <Slider {...slide_settings}>
                            {poolData.map((item: any, index: any) => (
                                <Box sx={{ padding: '20px' }} key={index}>
                                    <Box className="slide_card">
                                        <Typography variant="subtitle1">{protocols[item.dex].name}</Typography>
                                        <Stack direction={'row'} alignContent={'center'} gap="20px">
                                            <Stack direction={'row'} alignItems="center" justifyContent={'center'}>
                                                <img
                                                    src={item.aTokenIcon}
                                                    alt=""
                                                    style={{ width: '35px', height: '35px', borderRadius: '50%' }}
                                                />
                                                <img
                                                    src={item.bTokenIcon}
                                                    alt=""
                                                    style={{
                                                        width: '35px',
                                                        height: '35px',
                                                        borderRadius: '50%',
                                                        marginLeft: '-13px',
                                                    }}
                                                />
                                            </Stack>
                                            <Common_FillButton
                                                content={1.00 + '.00x'}
                                                padding="10px 20px"
                                                onClick={() => navigate(`/farm/${item.pair}`)}
                                            />
                                        </Stack>
                                        <Typography variant="h5">
                                            {item.aname}-{item.bname}
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            From {item.from_percent}% to
                                        </Typography>
                                        <Typography variant="h3">
                                            {item.max_apr}% APR
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Slider>
                    </Box>
                </Box>

                <Box className={classes.part5}>
                    <Typography variant="h3">Lend with EZ</Typography>
                    <Typography variant="subtitle1">Earn more than HODLing in your wallets</Typography>
                    <Grid container spacing={4}>
                        {Object.keys(coins).map((item: any, index: any) => (
                            <Grid item xs={12} sm={12} md={6} lg={4} key={index}>
                                <Box className="card">
                                    <img src={coins[item].logo} alt="" />
                                    <Box mr={2}>
                                        <Typography variant="subtitle1">Lend</Typography>
                                        <Typography variant="h5">{coins[item].name}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle1">APY</Typography>
                                        <Typography variant="h5">{(coins[item].apy * 5 + 5).toFixed(2)}%</Typography>
                                    </Box>
                                    <IconButton>
                                        <EastIcon
                                            onClick={() => onSupModalOpen(index)}
                                        />
                                    </IconButton>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Box className={classes.part6}>
                    <Box>
                        <Typography variant="h3" mb={3}>
                            Yield Strategies & Vault Partners
                        </Typography>
                        <Stack
                            direction={'row'}
                            alignContent="center"
                            flexWrap={'wrap'}
                            gap={2}
                            sx={{ justifyContent: { lg: 'flex-start', xs: 'center' } }}
                        >
                            <Common_FillButton content="Partner with us" />
                            <Common_OutlineButton content="View Integration" />
                        </Stack>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src={SmartContract} alt="" />
                    </Box>
                </Box>
            </Box>
            <Modal
                open={supModal}
                onClose={onSupModalClose}
            >
                <Box sx={{ ...modalStyle, width: { xs: '95%', md: '400px' }, color: 'white', background: '#342D55' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            mb: 1
                        }}
                    >
                        <Typography
                            variant="h5"
                            component="h2"
                            sx={{
                                textAlign: 'center',
                                mb: 1,
                                //color: '#333'
                            }}
                        >
                            {`Deposit ${supToken.asset}`}
                        </Typography>
                        <IconX onClick={() => onSupModalClose()} />
                    </Box>
                    <Box sx={{}}>
                        <Typography sx={{ color: '#fff', ml: 2, mb: 1 }}>Amount</Typography>
                        <TextField
                            fullWidth
                            type="number"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    color: "white",
                                    borderRadius: '20px',
                                    borderColor: '#888',
                                    "&.Mui-focused fieldset": {
                                        borderColor: '#888'
                                    },
                                    '& fieldset': {
                                        borderColor: '#888',
                                    },
                                },
                                "& .MuiOutlinedInput-root:hover": {
                                    "& > fieldset": {
                                        borderColor: "#888"
                                    }
                                }
                            }}
                            InputProps={{
                                inputProps: { min: 0 },
                                endAdornment:
                                    <InputAdornment position="end" sx={{ color: "white" }} >
                                        <img src={supToken.icon} alt='logo' style={{ width: '24px', height: '24px', marginRight: '10px', color: "#fff" }} />{supToken.asset}
                                    </InputAdornment>,
                            }}
                            onChange={onSetDepositAmount}
                        />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography sx={{ color: '#fff', ml: 2, mb: 1 }}>Transaction Overview</Typography>
                        <Box sx={{
                            width: '100%',
                            background: '#42396B',
                            boxShadow: '0px 0px 4px #5361DC60',
                            padding: '10px 20px',
                            borderColor: 'gray',
                            border: '1px gray solid',
                            borderRadius: '15px',
                            cursor: 'pointer',
                            '&:hover': {
                                boxShadow: '0px 0px 4px #5361DC60',
                            },
                            '& .MuiTypography-root': {
                                color: '#fff'
                            },
                            '& .enableText': {
                                color: '#5361DC'
                            },
                            '& .MuiBox-root': {
                                display: 'flex',
                                justifyContent: 'space-between',
                                my: 1
                            }
                        }}>
                            <Box >
                                <Typography>Wallet Balance </Typography>
                                <Typography>{supToken.walletBalance}</Typography>
                            </Box>
                            <Box >
                                <Typography>Deposit Balance</Typography>
                                <Typography>{supToken.depositBalance}</Typography>
                            </Box>
                            <Box>
                                <Typography>Deposit APY</Typography>
                                <Typography>1.45 %</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Button
                        sx={{
                            mt: 3,
                            display: 'flex',
                            width: '100%',
                            background: '#42396B',
                            boxShadow: '0px 0px 4px #5361DC60',
                            borderColor: 'gray',
                            border: '1px gray solid',
                            borderRadius: '20px',
                            py: 2,
                            '&:hover': {
                                boxShadow: '0px 0px 4px #5361DC60',
                            }

                        }}
                        onClick={onClickSupply}
                    >
                        <Typography sx={{ textAlign: 'center', color: '#FFF' }}>Deposit</Typography>
                    </Button>
                </Box>
            </Modal>
        </Container>
    );
}

export default Home;
