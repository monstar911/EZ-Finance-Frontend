import React, { useContext, useState, useEffect } from 'react';
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
import AptIcon from '../../../asset/icons/Aptos.png';
import { IUserInfo, Web3Context } from '../../../context/Web3Context';
import { trim } from '../../../helper/trim';
import { IconX } from '@tabler/icons';

const useStyles = makeStyles((theme) => ({
    billView: {
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

const tableHeader = ['Asset', 'Deposited', 'Borrowed', 'Wallet Balance', '', 'Operation']

function Bill() {

    const empty = {
        icon: '',
        asset: '',
        deposit: 0,
        borrow: 0,
        balance: 0,
    }

    const classes = useStyles();
    const web3 = useContext(Web3Context);
    const user = web3?.userInfo as IUserInfo;
    const [withdrawModal, setWithdrawModal] = useState(false);
    const [withdrawToken, setWithdrawToken] = useState<any>(empty);
    const [repayModal, setRepayModal] = useState(false);
    const [repayToken, setRepayToken] = useState<any>(empty);
    const [withdrawAmt, setWithdrawAmt] = useState(0);
    const [repayAmt, setRepayAmt] = useState(0);

    const [userInfo, setUserInfo] = useState<IUserInfo>(user);

    useEffect(() => {
        setUserInfo(user);
    }, [user])

    const datas = [
        {
            icon: AptIcon,
            asset: 'APT',
            deposit: 0,
            borrow: 0,
            balance: 0,

        }, {
            icon: ArcoIcon,
            asset: 'ARC',
            deposit: 0,
            borrow: 0,
            balance: 0,
        }
    ];

    const onWithdrawModalClose = () => {
        setWithdrawToken(empty);
        setWithdrawModal(false);
    }

    const onWithdrawModalOpen = (index) => {
        setWithdrawToken(datas[index]);
        setWithdrawModal(true);
    }

    const onRepayModalClose = () => {
        setRepayToken(empty);
        setRepayModal(false);
    }

    const onRepayModalOpen = (index) => {
        setRepayToken(datas[index]);
        setRepayModal(true);
    }

    const onClickWithdraw = async () => {
        await web3?.withdraw(withdrawToken.asset.toLowerCase(), withdrawAmt);
    }

    const onClickRepay = async () => {

    }

    const onSetWithdrawAmount = (e: any) => {
        setWithdrawAmt(e.target.value);
    }

    const onSetRepayAmount = (e: any) => {
        setRepayAmt(e.target.value);
    }




    return (
        <div className={classes.billView}>
            <Typography
                sx={{
                    color: '#333',
                    fontSize: '18px',
                    pl: '20px',
                    mb: 1
                }}
            >
                My Bill
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
                    <Table sx={{ '& .MuiTableCell-root': { textAlign: 'center' } }}>
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
                                    <TableCell component="th" scope="row" >
                                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                            <img src={item.icon} alt='logo' style={{ width: '24px', height: '24px', marginRight: '10px' }} />
                                            <Typography component='span' >{item.asset}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{item.deposit}</TableCell>
                                    <TableCell>{item.borrow}</TableCell>
                                    <TableCell>{item.balance}</TableCell>
                                    <TableCell />
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
                                            onClick={() => onWithdrawModalOpen(index)}
                                        >
                                            Withdraw
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
                                            onClick={() => onRepayModalOpen(index)}
                                        >
                                            Repay
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Modal
                open={withdrawModal}
                onClose={onWithdrawModalClose}
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
                            {`Withdraw ${withdrawToken.asset}`}
                        </Typography>
                        <IconX onClick={() => onWithdrawModalClose()} />
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
                                        <img src={withdrawToken.icon} alt='logo' style={{ width: '24px', height: '24px', marginRight: '10px' }} />{withdrawToken.asset}
                                    </InputAdornment>,
                            }}
                            onChange={onSetWithdrawAmount}
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
                                <Typography>Remaining Supply</Typography>
                                <Typography>{withdrawToken.deposit - withdrawToken.borrow}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography>Health Factor</Typography>
                                <Typography className='enableText'>1.65</Typography>
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
                        onClick={onClickWithdraw}
                    >
                        <Typography sx={{ textAlign: 'center', color: '#FFF' }}>Withdraw</Typography>
                    </Button>
                </Box>
            </Modal>
            <Modal
                open={repayModal}
                onClose={onRepayModalClose}
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
                            {`Repay ${repayToken.asset}`}
                        </Typography>
                        <IconX onClick={() => onRepayModalClose()} />
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
                                        <img src={repayToken.icon} alt='logo' style={{ width: '24px', height: '24px', marginRight: '10px' }} />{repayToken.asset}
                                    </InputAdornment>,
                            }}
                            onChange={onSetRepayAmount}
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
                        onClick={onClickRepay}
                    >
                        <Typography sx={{ textAlign: 'center', color: '#FFF' }}>Repay</Typography>
                    </Button>
                </Box>
            </Modal>
        </div>
    )
}

export default Bill;