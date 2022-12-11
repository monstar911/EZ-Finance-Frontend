import React, { useState, useContext } from 'react';
import { IPoolInfo, Web3Context } from '../../../context/Web3Context';
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
    InputAdornment
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

const tableHeader = ['Asset', 'Deposit APY', 'Borrow APY', 'Total Deposited', 'Available', 'Operation']

function Market() {

    const emptyToken = {
        icon: '',
        asset: '',
        depositAPY: 0,
        borrowAPY: 0,
        totalDeposited: 0,
        available: 0
    }
    // const isMd = useMediaQuery('(max-width:768px)');
    const classes = useStyles();
    const web3 = useContext(Web3Context);
    const poolInfo = web3?.poolInfo as IPoolInfo;
    const [supModal, setSupModal] = useState(false);
    const [supToken, setSupToken] = useState<any | null>(emptyToken);
    const [borrModal, setBorrModal] = useState(false);
    const [borrToken, setBorrToken] = useState<any>(emptyToken);
    const [depoAmt, setDepoAmt] = useState(0);
    const [borrAmt, setBorrAmt] = useState(0);

    const datas = [
        {
            icon: AptosIcon,
            asset: 'APT',
            depositAPY: poolInfo.aptos.totalDeposit > 0 ? trim((poolInfo.aptos.totalBorrow * 0.2) / poolInfo.aptos.totalDeposit * 100, 3) : 0,
            borrowAPY: poolInfo.aptos.totalDeposit > 0 ? (0.025 + 0.2 * (poolInfo.aptos.totalBorrow / (poolInfo.aptos.totalBorrow + poolInfo.aptos.totalDeposit))) : 0,
            totalDeposited: trim(poolInfo.aptos.totalDeposit, 3),
            available: trim(poolInfo.aptos.totalDeposit - poolInfo.aptos.totalBorrow, 3),
        }, {
            icon: ArcoIcon,
            asset: 'ARC',
            depositAPY: poolInfo.arc.totalDeposit > 0 ? trim((poolInfo.arc.totalBorrow * 0.2) / poolInfo.arc.totalDeposit * 100, 3) : 0,
            borrowAPY: poolInfo.arc.totalDeposit > 0 ? (0.025 + 0.2 * (poolInfo.arc.totalBorrow / (poolInfo.arc.totalBorrow + poolInfo.arc.totalDeposit))) : 0,
            totalDeposited: trim(poolInfo.arc.totalDeposit, 3),
            available: trim(poolInfo.arc.totalDeposit - poolInfo.arc.totalBorrow, 3),
        }, {
            icon: BtcIcon,
            asset: 'BTC',
            depositAPY: 0,
            borrowAPY: 0,
            totalDeposited: 0,
            available: 0,
        }, {
            icon: EthereumIcon,
            asset: 'ETH',
            depositAPY: 0,
            borrowAPY: 0,
            totalDeposited: 0,
            available: 0,
        }, {
            icon: DaiIcon,
            asset: 'DAI',
            depositAPY: 0,
            borrowAPY: 0,
            totalDeposited: 0,
            available: 0,
        }, {
            icon: UsdcIcon,
            asset: 'USDC',
            depositAPY: 0,
            borrowAPY: 0,
            totalDeposited: 0,
            available: 0,
        }, {
            icon: UsdtIcon,
            asset: 'USDT',
            depositAPY: 0,
            borrowAPY: 0,
            totalDeposited: 0,
            available: 0,
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
        await web3?.deposit(supToken.asset.toLowerCase(), depoAmt);
    }

    const onClickBorrow = async () => {
        await web3?.borrow(borrToken.asset.toLowerCase(), borrAmt);
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
                    color: '#333',
                    fontSize: '18px',
                    pl: '20px',
                    mb: 1
                }}>
                Market
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    padding: '20px',
                    bgcolor: '#FFF',
                    borderRadius: '20px',
                    boxShadow: '0px 1px 4px #ccc'
                }}
            >
                <TableContainer>
                    <Table sx={{ '& .MuiTableCell-root': { textAlign: 'center' }, '& .assetfield': { textAlign: 'right' } }}>
                        <TableHead>
                            <TableRow>
                                {tableHeader.map((item, index) => (
                                    <TableCell key={index}>{item}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {datas.map((item, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row" className='assetfield'>
                                        <Box sx={{ display: 'flex', ml: '30px' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '40px' }}>
                                                <img src={item.icon} alt='logo' style={{ width: '24px', height: '24px', marginRight: '10px' }} />
                                            </Box>
                                            <Typography component='span' >{item.asset}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{item.depositAPY}%</TableCell>
                                    <TableCell>{trim(item.borrowAPY * 100, 3)}%</TableCell>
                                    <TableCell>{item.totalDeposited}</TableCell>
                                    <TableCell>{item.available}</TableCell>
                                    <TableCell sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <Button
                                            sx={{
                                                bgcolor: '#5361DC10',
                                                color: '#5361DC',
                                                borderRadius: '20px',
                                                mx: '3px',
                                                '&:hover': {
                                                    bgcolor: '#5361DC',
                                                    color: '#FFF'
                                                }
                                            }}
                                            disabled={index > 1 ? true : false}
                                            onClick={() => onSupModalOpen(index)}
                                        >
                                            Deposit
                                        </Button>
                                        <Button
                                            sx={{
                                                bgcolor: '#5361DC10',
                                                color: '#5361DC',
                                                borderRadius: '20px',
                                                mx: '3px',
                                                '&:hover': {
                                                    bgcolor: '#5361DC',
                                                    color: '#FFF'
                                                }
                                            }}
                                            disabled={index > 1 ? true : false}
                                            onClick={() => onBorrModalOpen(index)}
                                        >
                                            Borrow
                                        </Button>
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
                    <Box sx={{ ...modalStyle, width: { xs: '95%', md: '400px' } }}>
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
                                    color: '#333'
                                }}
                            >
                                {`Supply ${supToken.asset}`}
                            </Typography>
                            <IconX onClick={() => onSupModalClose()} />
                        </Box>
                        <Box sx={{}}>
                            <Typography sx={{ color: '#333', ml: 2, mb: 1 }}>Amount</Typography>
                            <TextField
                                fullWidth
                                type="number"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: '20px',
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#ccc"
                                        }
                                    },
                                    "& .MuiOutlinedInput-root:hover": {
                                        "& > fieldset": {
                                            borderColor: "#ccc"
                                        }
                                    }
                                }}
                                InputProps={{
                                    inputProps: { min: 0 },
                                    endAdornment:
                                        <InputAdornment position="end">
                                            <img src={supToken.icon} alt='logo' style={{ width: '24px', height: '24px', marginRight: '10px' }} />{supToken.asset}
                                        </InputAdornment>,
                                }}
                                onChange={onSetDepositAmount}
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Typography sx={{ color: '#333', ml: 2, mb: 1 }}>Transaction Overview</Typography>
                            <Box sx={{
                                width: '100%',
                                bgcolor: '#FFF',
                                boxShadow: '0px 1px 4px #ccc',
                                padding: '10px 20px',
                                borderRadius: '15px',
                                cursor: 'pointer',
                                '&:hover': {
                                    boxShadow: '0px 1px 4px #5361DC60',
                                },
                                '& .MuiTypography-root': {
                                    color: '#333'
                                },
                                '& .enableText': {
                                    color: '#5361DC'
                                }
                            }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography>Supply APY</Typography>
                                    <Typography>{supToken.depositAPY}%</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography>Collateralization</Typography>
                                    <Typography className='enableText'>Enabled</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Button
                            sx={{
                                mt: 3,
                                display: 'flex',
                                width: '100%',
                                backgroundColor: '#5361DC',
                                borderRadius: '20px',
                                py: 2,
                                '&:hover': {
                                    backgroundColor: '#5361DC'
                                }

                            }}
                            onClick={onClickSupply}
                        >
                            <Typography sx={{ textAlign: 'center', color: '#FFF' }}>Supply</Typography>
                        </Button>
                    </Box>
                </Modal>
                <Modal
                    open={borrModal}
                    onClose={onBorrModalClose}
                >
                    <Box sx={{ ...modalStyle, width: { xs: '95%', md: '400px' } }}>
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
                                    color: '#333'
                                }}
                            >
                                {`Borrow ${borrToken.asset}`}
                            </Typography>
                            <IconX onClick={() => onBorrModalClose()} />
                        </Box>
                        <Box sx={{}}>
                            <Typography sx={{ color: '#333', ml: 2, mb: 1 }}>Amount</Typography>
                            <TextField
                                fullWidth
                                type="number"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: '20px',
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#ccc"
                                        }
                                    },
                                    "& .MuiOutlinedInput-root:hover": {
                                        "& > fieldset": {
                                            borderColor: "#ccc"
                                        }
                                    }
                                }}
                                InputProps={{
                                    inputProps: { min: 0 },
                                    endAdornment:
                                        <InputAdornment position="end">
                                            <img src={borrToken.icon} alt='logo' style={{ width: '24px', height: '24px', marginRight: '10px' }} />{borrToken.asset}
                                        </InputAdornment>,
                                }}
                                onChange={onSetBorrowAmount}
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Typography sx={{ color: '#333', ml: 2, mb: 1 }}>Transaction Overview</Typography>
                            <Box sx={{
                                width: '100%',
                                bgcolor: '#FFF',
                                boxShadow: '0px 1px 4px #ccc',
                                padding: '10px 20px',
                                borderRadius: '15px',
                                cursor: 'pointer',
                                '&:hover': {
                                    boxShadow: '0px 1px 4px #5361DC60',
                                },
                                '& .MuiTypography-root': {
                                    color: '#333'
                                },
                                '& .enableText': {
                                    color: '#5361DC'
                                }
                            }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography>Health Factor</Typography>
                                    <Typography>1.78</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Typography className='enableText'>{'Liquidation at < 1.0'}</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Button
                            sx={{
                                mt: 3,
                                display: 'flex',
                                width: '100%',
                                backgroundColor: '#5361DC',
                                borderRadius: '20px',
                                py: 2,
                                '&:hover': {
                                    backgroundColor: '#5361DC'
                                }
                            }}
                            onClick={onClickBorrow}
                        >
                            <Typography sx={{ textAlign: 'center', color: '#FFF' }}>Borrow</Typography>
                        </Button>
                    </Box>
                </Modal>
            </Box>
        </div>
    )
}

export default Market;