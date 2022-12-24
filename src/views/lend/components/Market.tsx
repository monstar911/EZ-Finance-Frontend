import React, { useState, useContext, useMemo, useEffect } from 'react';
import { IUserInfo, Web3Context } from '../../../context/Web3Context';
import { makeStyles } from '@mui/styles';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Button,
    Modal,
    TextField,
    InputAdornment,
    useMediaQuery
} from '@mui/material';

import ArcoIcon from '../../../asset/icons/arco.svg';
import AptosIcon from '../../../asset/icons/Aptos.png';
import BtcIcon from '../../../asset/icons/crypto-btc.svg';
import UsdcIcon from '../../../asset/icons/crypto-usdc.png';
import UsdtIcon from '../../../asset/icons/crypto-usdt.png';
import EthereumIcon from '../../../asset/icons/crypto-ethereum.png';
import DaiIcon from '../../../asset/icons/crypto-dai.svg';
import { IconX } from '@tabler/icons';
import { trim } from '../../../helper/trim';

const useStyles = makeStyles((theme) => ({
    marketView: {
        padding: '0 50px 20px',
        [theme.breakpoints.down('md')]: {
            padding: '0 20px 20px',
        }
    }
})) as any;


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

const tableHeader = ['', 'Deposit APY', 'Total Deposit', 'Deposit Balance', 'Wallet Balance', 'Action']

function Market() {

    const emptyToken = {
        icon: '',
        asset: '',
        symbol: '',
        depositAPY: 0,
        totalDeposited: 0,
        depositBalance: 0,
        walletBalance: 0
    }
    // const isMd = useMediaQuery('(max-width:375px)');
    const classes = useStyles()
    const web3 = useContext(Web3Context)
    const [poolInfo, setPoolInfo] = useState<any>()
    const [userInfo, setUserInfo] = useState<IUserInfo>()

    const [supModal, setSupModal] = useState(false)
    const [supToken, setSupToken] = useState<any | null>(emptyToken)
    const [borrModal, setBorrModal] = useState(false)
    const [borrToken, setBorrToken] = useState<any>(emptyToken)
    const [depoAmt, setDepoAmt] = useState(0)
    const [borrAmt, setBorrAmt] = useState(0)

    useEffect(() => {
        console.log(web3?.userInfo)
        const poolInfo = web3?.poolInfo
        const userInfo = web3?.userInfo
        setPoolInfo(poolInfo)
        setUserInfo(userInfo)
    }, [web3?.poolInfo, web3?.userInfo])



    const datas = [
        {
            icon: AptosIcon,
            asset: 'APT',
            symbol: 'apt',
            depositAPY: 1.3,
            totalDeposited: trim(poolInfo?.apt ?? 0, 3),
            depositBalance: trim(userInfo?.deposit['apt'] ?? 0, 3),
            walletBalance: trim(userInfo?.tokenBalance['apt'] ?? 0, 3)
        }, {
            icon: BtcIcon,
            asset: 'WBTC',
            symbol: 'wbtc',
            depositAPY: 2.4,
            totalDeposited: trim(poolInfo?.wbtc ?? 0, 3),
            depositBalance: userInfo?.deposit['wbtc'] ?? 0,
            walletBalance: trim(userInfo?.tokenBalance['wbtc'] ?? 0, 3)
        }, {
            icon: UsdcIcon,
            asset: 'ceUSDC',
            symbol: 'ceUsdc',
            depositAPY: 1.6,
            totalDeposited: trim(poolInfo?.ceUsdc ?? 0, 3),
            depositBalance: userInfo?.deposit['ceUsdc'] ?? 0,
            walletBalance: trim(userInfo?.tokenBalance['ceUsdc'] ?? 0, 3)
        }, {
            icon: EthereumIcon,
            asset: 'WETH',
            symbol: 'weth',
            depositAPY: 2.3,
            totalDeposited: trim(poolInfo?.weth ?? 0, 3),
            depositBalance: userInfo?.deposit['weth'] ?? 0,
            walletBalance: trim(userInfo?.tokenBalance['weth'] ?? 0, 3)
        }, {
            icon: DaiIcon,
            asset: 'DAI',
            symbol: 'dai',
            depositAPY: 1.1,
            totalDeposited: trim(poolInfo?.dai ?? 0, 3),
            depositBalance: userInfo?.deposit['dai'] ?? 0,
            walletBalance: trim(userInfo?.tokenBalance['dai'] ?? 0, 3)
        }, {
            icon: UsdcIcon,
            asset: 'USDC',
            symbol: 'usdc',
            depositAPY: 0.9,
            totalDeposited: trim(poolInfo?.usdc ?? 0, 3),
            depositBalance: userInfo?.deposit['usdc'] ?? 0,
            walletBalance: trim(userInfo?.tokenBalance['usdc'] ?? 0, 3)
        }, {
            icon: UsdtIcon,
            asset: 'USDT',
            symbol: 'usdt',
            depositAPY: 1.0,
            totalDeposited: trim(poolInfo?.usdt ?? 0, 3),
            depositBalance: userInfo?.deposit['usdt'] ?? 0,
            walletBalance: trim(userInfo?.tokenBalance['usdt'] ?? 0, 3)
        }
    ];

    const onSupModalClose = () => {
        setSupToken(emptyToken);
        setSupModal(false);
    }

    const onSupModalOpen = (index) => {
        setSupToken(datas[index]);
        setSupModal(true);
    }

    const onBorrModalClose = () => {
        setBorrToken(emptyToken);
        setBorrModal(false);
    }

    const onBorrModalOpen = (index) => {
        setBorrToken(datas[index]);
        setBorrModal(true);
    }

    const onClickSupply = async () => {
        await web3?.deposit(supToken.symbol, depoAmt);
    }

    const onClickWithdraw = async () => {
        await web3?.withdraw(borrToken.symbol, borrAmt);
    }

    const onSetDepositAmount = (e: any) => {
        setDepoAmt(e.target.value);
    }

    const onSetBorrowAmount = (e: any) => {
        setBorrAmt(e.target.value);
    }


    return (
        <div className={classes.marketView}>
            <Typography
                sx={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    pl: '20px',
                    my: 2,
                    color: '#FFFFFF',
                }}>
                Lending
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    padding: '20px',
                    //bgcolor: '#222',
                    bgcolor: '#342D55',
                    borderRadius: '20px',
                    boxShadow: '0px 1px 4px #ccc',
                    color: "#FFFFFF80"
                }}
            >
                <TableContainer>
                    <Table sx={{ '& .MuiTableCell-root': { textAlign: 'center' } }}>
                        <TableHead>
                            <TableRow sx={{ '.MuiTableCell-root': { color: '#FFFFFF80' } }}>
                                {tableHeader.map((item, index) => (
                                    <TableCell key={index}>{item}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {datas.map((item, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, '.MuiTableCell-root': { color: '#fff' } }}
                                >
                                    <TableCell>
                                        <Box sx={{ display: 'flex', ml: '30px' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '40px' }}>
                                                <img src={item.icon} alt='logo' style={{ width: '24px', height: '24px', marginRight: '3px' }} />
                                            </Box>
                                            <Typography component='span' >{item.asset}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{item.depositAPY}%</TableCell>
                                    <TableCell>{item.totalDeposited}</TableCell>
                                    <TableCell>{item.depositBalance}</TableCell>
                                    <TableCell>{item.walletBalance}</TableCell>
                                    <TableCell >
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                                            <Button
                                                sx={{
                                                    minWidth: '120px',
                                                    border: '1px solid #fff',
                                                    bgcolor: '#5361DC10',
                                                    color: '#fff',
                                                    borderRadius: '20px',
                                                    mx: '3px',
                                                    '&:hover': {
                                                        bgcolor: '#5361DC10',
                                                        color: '#FFF'
                                                    }
                                                }}
                                                //disabled={index > 1 ? true : false}
                                                onClick={() => onSupModalOpen(index)}
                                            >
                                                Deposit
                                            </Button>
                                            <Button
                                                sx={{
                                                    minWidth: '120px',
                                                    border: '1px solid #fff',
                                                    bgcolor: '#5361DC10',
                                                    color: '#fff',
                                                    borderRadius: '20px',
                                                    mx: '3px',
                                                    '&:hover': {
                                                        bgcolor: '#5361DC10',
                                                        color: '#FFFFFF'
                                                    }
                                                }}
                                                //disabled={index > 1 ? true : false}
                                                onClick={() => onBorrModalOpen(index)}
                                            >
                                                Withdraw
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
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
                <Modal
                    open={borrModal}
                    onClose={onBorrModalClose}
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
                                    //color: '#fff'
                                }}
                            >
                                {`Withdraw ${borrToken.asset}`}
                            </Typography>
                            <IconX onClick={() => onBorrModalClose()} />
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
                                            borderColor: "#888"
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
                                            <img src={borrToken.icon} alt='logo' style={{ width: '24px', height: '24px', marginRight: '10px', color: "#fff" }} />{borrToken.asset}
                                        </InputAdornment>,
                                }}
                                onChange={onSetBorrowAmount}
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
                                    <Typography>Wallet Balance</Typography>
                                    <Typography>{borrToken.walletBalance}</Typography>
                                </Box>
                                <Box >
                                    <Typography>Supply Balance</Typography>
                                    <Typography>{borrToken.depositBalance}</Typography>
                                </Box>
                                <Box >
                                    <Typography>APY</Typography>
                                    <Typography>1.38%</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Button
                            sx={{
                                mt: 3,
                                display: 'flex',
                                width: '100%',
                                //backgroundColor: '#5361DC',
                                background: '#42396B',
                                boxShadow: '0px 0px 4px #5361DC60',
                                borderColor: 'gray',
                                border: '1px gray solid',
                                borderRadius: '20px',
                                py: 2,
                                '&:hover': {
                                    //backgroundColor: '#5361DC'
                                    boxShadow: '0px 0px 4px #5361DC60',
                                }
                            }}
                            onClick={onClickWithdraw}
                        >
                            <Typography sx={{ textAlign: 'center', color: '#FFF' }}>Withdraw</Typography>
                        </Button>
                    </Box>
                </Modal>
            </Box>
        </div >
    )
}

export default Market;