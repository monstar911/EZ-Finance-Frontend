import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Container from '../../components/container';
import { Common_FillButton } from '../../components/button';

import notExist from '../../asset/icons/not_exist.png';
import { ITokenPrice3, Web3Context } from '../../context/Web3Context';
import { coins, pairs, protocols } from '../../context/constant';
import { trim } from '../../helper/trim';
import { formatValue } from '../../helper/formatValue';

const useStyles = makeStyles((theme: any) => ({
    root: {
        color: 'white',
        '& > h2': {
            fontSize: '30px',
            fontWeight: 700,
            lineHeight: '70px',
            paddingBottom: '25px',
        },
        '& .devideLine': {
            background: 'white',
            height: '1px',
            opacity: '.5',
        },
        '& .modal': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '30px',
            flexWrap: 'wrap',
            '& h6': {
                fontSize: '18px',
                opacity: '.6',
            },
            '& > div:first-child': {
                position: 'relative',
                flex: '1',
                background: '#16162d', borderRadius: '24px',
                boxShadow: '0px 1px 4px #ccc',

                minWidth: '600px',
                [theme.breakpoints.down('md')]: {
                    minWidth: 'unset',
                    width: '100%',
                },
                '& .header': {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px',
                    [theme.breakpoints.down('sm')]: {
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        textAlign: 'center',
                    },
                    padding: '50px',
                    '& h4': {
                        fontSize: '40px',
                        fontWeight: 700,
                    },
                },
                '& .footer': {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px',
                    [theme.breakpoints.down('sm')]: {
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        textAlign: 'center',
                    },
                    padding: '30px 50px',
                    '& p': {
                        fontSize: '18px',
                        fontWeight: 500,
                    },
                },
            },
            '& > div:last-child': {
                position: 'relative',
                flex: '1',
                background: '#16162d', borderRadius: '24px',
                boxShadow: '0px 1px 4px #ccc',

                minWidth: '600px',
                [theme.breakpoints.down('md')]: {
                    minWidth: 'unset',
                    width: '100%',
                },
                '& .header': {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '30px 50px',
                },
                '& .footer': {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '50px',
                    textAlign: 'center',
                    [theme.breakpoints.down('sm')]: {
                        padding: '30px',
                        textAlign: 'center',
                    },
                    '@media(max-width: 450px)': {
                        flexDirection: 'column',
                        justifyContent: 'center',
                    },
                    '& h4': {
                        fontSize: '32px',
                        fontWeight: 600,
                    },
                },
            },
        },
        '& .positions': {
            marginTop: '50px',
            background: '#16162d', borderRadius: '24px',
            boxShadow: '0px 1px 4px #ccc',
            '& .header': {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '10px',
                opacity: '.6',
                [theme.breakpoints.down('sm')]: {
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    textAlign: 'center',
                },
                padding: '50px',
                '& h4': {
                    fontSize: '40px',
                    fontWeight: 700,
                },
            },
            '& h4': {
                [theme.breakpoints.down('sm')]: {
                    fontSize: '25px',
                },
            },
            '& h6': {
                // padding: '50px',
                fontSize: '18px',
                fontWeight: '500',
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

const tableHeader = ['', 'Position Value', 'Equity Value', 'Debt Value', 'Action']

export default function Position() {
    const classes = useStyles();

    const web3 = useContext(Web3Context)
    const [userPosition, setUserPosition] = useState<any>(web3?.userPosition)
    const [tokenVolume, setTokenVolume] = useState<any>()
    const [tokenPrice3, setTokenPrice] = useState<ITokenPrice3>()
    const [allPositions, setAllPositions] = useState(0);
    const [totalPositionValue, setTotalPositionValue] = useState(0);
    const [totalDebtValue, setTotalDebtValue] = useState(0);
    const [totalEquityValue, setTotalEquityValue] = useState(0);

    const [poolData, setPoolData] = useState<any>([]);

    const getAllPosition = (tokenVolume: any, tokenPrice3: any, userPosition: any) => {
        let _allPositions = 0
        let _totalPositionValue = 0
        let _totalDebtValue = 0
        let _totalEquityValue = 0

        Object.keys(pairs).forEach((dex) => {
            for (let pair in pairs[dex]) {
                let _liquidityInfo = tokenVolume?.[dex]?.[pair]?.['liquidity']
                const _liquidity = _liquidityInfo ??= 0

                let _userPositionInfo = userPosition?.[dex]?.[pair]?.['length']
                const _position = _userPositionInfo ??= 0
                _allPositions = _allPositions + Number(_position)

                for (let i = 0; i < _position; i++) {
                    console.log('getAllPosition token price', tokenPrice3?.[pairs[dex][pair].x.symbol], userPosition?.[dex]?.[pair]?.[i]?.['amountAdd_x'], userPosition?.[dex]?.[pair]?.[i]?.['amountAdd_y'])
                    console.log('getAllPosition user position', userPosition?.[dex]?.[pair]?.[i]?.['borrowAmount_x'], userPosition?.[dex]?.[pair]?.[i]?.['borrowAmount_y'])

                    let _positionValue = tokenPrice3?.[pairs[dex][pair].x.symbol] * userPosition?.[dex]?.[pair]?.[i]?.amountAdd_x / Math.pow(10, 8) +
                        tokenPrice3?.[pairs[dex][pair].y.symbol] * userPosition?.[dex]?.[pair]?.[i]?.amountAdd_y / Math.pow(10, 8)
                    if (isNaN(_positionValue)) { _positionValue = 0 }
                    let _debtValue = tokenPrice3?.[pairs[dex][pair].x.symbol] * userPosition?.[dex]?.[pair]?.[i]?.borrowAmount_x / Math.pow(10, 8) +
                        tokenPrice3?.[pairs[dex][pair].y.symbol] * userPosition?.[dex]?.[pair]?.[i]?.borrowAmount_y / Math.pow(10, 8)
                    if (isNaN(_debtValue)) { _debtValue = 0 }

                    // console.log('getAllPosition - tokenPrice3, tokenPrice3', { tokenPrice3, userPosition });
                    // console.log('getAllPosition - i', { _positionValue, _debtValue });

                    _totalPositionValue = _totalPositionValue + Number(_positionValue)
                    _totalDebtValue = _totalDebtValue + Number(_debtValue)
                    _totalEquityValue = _totalEquityValue + Number(_positionValue) - Number(_debtValue)
                    // console.log('getAllPosition - i', { tokenVolume, userPosition, _allPositions, _totalPositionValue, _totalDebtValue, _totalEquityValue });
                }
            }
        })
        // console.log('getAllPosition', { tokenVolume, userPosition, _allPositions, _totalPositionValue, _totalDebtValue, _totalEquityValue });
        return {
            allPositions: _allPositions,
            totalPositionValue: _totalPositionValue,
            totalDebtValue: _totalDebtValue,
            totalEquityValue: _totalEquityValue,
        }
    }

    useEffect(() => {
        console.log('Position useEffect')

        const tokenVolume = web3?.tokenVolume
        const tokenPrice3 = web3?.tokenPrice3
        const userPosition = web3?.userPosition
        setUserPosition(userPosition)
        setTokenVolume(tokenVolume)
        setTokenPrice(tokenPrice3)
        const positionInfo = getAllPosition(tokenVolume, tokenPrice3, userPosition);
        // console.log('Position useEffect', tokenVolume, userPosition, positionInfo.allPositions, positionInfo.totalPositionValue, positionInfo.totalDebtValue, positionInfo.totalEquityValue);
        setAllPositions(positionInfo.allPositions)
        setTotalPositionValue(positionInfo.totalPositionValue)
        setTotalDebtValue(positionInfo.totalDebtValue)
        setTotalEquityValue(positionInfo.totalEquityValue)


        // console.log('Position useMemo')

        const bump: any = [];

        Object.keys(pairs).forEach((dex) => {
            for (let pair in pairs[dex]) {
                let _userPositionInfo = userPosition?.[dex]?.[pair]?.['length']
                const _position = _userPositionInfo ??= 0

                // console.log('Position', dex, pair, _position, userPosition, userPosition?.[dex]?.[pair])
                for (let i = 0; i < _position; i++) {
                    // console.log('Position token price', tokenPrice3?.[pairs[dex][pair].x.symbol], userPosition?.[dex]?.[pair]?.[i]?.['amountAdd_x'], userPosition?.[dex]?.[pair]?.[i]?.['amountAdd_y'])
                    // console.log('Position user position', userPosition?.[dex]?.[pair]?.[i]?.['borrowAmount_x'], userPosition?.[dex]?.[pair]?.[i]?.['borrowAmount_y'])

                    let _positionValue = tokenPrice3?.[pairs[dex][pair].x.symbol] * userPosition?.[dex]?.[pair]?.[i]?.amountAdd_x / Math.pow(10, 8) +
                        tokenPrice3?.[pairs[dex][pair].y.symbol] * userPosition?.[dex]?.[pair]?.[i]?.amountAdd_y / Math.pow(10, 8)
                    if (isNaN(_positionValue)) { _positionValue = 0 }
                    let _debtValue = tokenPrice3?.[pairs[dex][pair].x.symbol] * userPosition?.[dex]?.[pair]?.[i]?.borrowAmount_x / Math.pow(10, 8) +
                        tokenPrice3?.[pairs[dex][pair].y.symbol] * userPosition?.[dex]?.[pair]?.[i]?.borrowAmount_y / Math.pow(10, 8)
                    if (isNaN(_debtValue)) { _debtValue = 0 }

                    const obj = {
                        dex: dex,
                        created_at: userPosition?.[dex]?.[pair]?.[i]?.created_at,
                        leverage: userPosition?.[dex]?.[pair]?.[i]?.leverage,
                        supplyAmount_x: userPosition?.[dex]?.[pair]?.[i]?.supplyAmount_x,
                        supplyAmount_y: userPosition?.[dex]?.[pair]?.[i]?.supplyAmount_y,
                        supplyAmount_z: userPosition?.[dex]?.[pair]?.[i]?.supplyAmount_z,
                        borrowAmount_x: userPosition?.[dex]?.[pair]?.[i]?.borrowAmount_x,
                        borrowAmount_y: userPosition?.[dex]?.[pair]?.[i]?.borrowAmount_y,
                        borrowAmount_z: userPosition?.[dex]?.[pair]?.[i]?.borrowAmount_z,
                        amountAdd_x: userPosition?.[dex]?.[pair]?.[i]?.amountAdd_x,
                        amountAdd_y: userPosition?.[dex]?.[pair]?.[i]?.amountAdd_y,
                        aTokenIcon: pairs[dex][pair].x.logo,
                        bTokenIcon: pairs[dex][pair].y.logo,
                        aname: pairs[dex][pair].x.name,
                        bname: pairs[dex][pair].y.name,
                        pair: pairs[dex][pair].x.symbol + '-' + pairs[dex][pair].y.symbol + '-' + dex,
                        positionValue: Number(_positionValue),
                        debtValue: Number(_debtValue),
                        equityValue: Number(_positionValue) - Number(_debtValue)
                    };

                    bump.push(obj)
                }
            }
        })

        setPoolData(bump);
    }, [web3])

    const onWithdraw = async (index: number) => {
        console.log('onWithdraw', index, poolData[index]);

        await web3?.position_withdraw(
            poolData[index].dex,
            poolData[index].aname,
            poolData[index].bname,
            poolData[index].created_at,
            poolData[index].leverage,
            poolData[index].supplyAmount_x,
            poolData[index].supplyAmount_y,
            poolData[index].supplyAmount_z,
            poolData[index].borrowAmount_x,
            poolData[index].borrowAmount_y,
            poolData[index].borrowAmount_z,
            poolData[index].amountAdd_x,
            poolData[index].amountAdd_y
        );
    }


    return (
        <Container>
            <Box className={classes.root}>
                <Typography variant="h2">Your Position</Typography>
                <Box className="modal">
                    <Box>
                        <Box className="header">
                            <Box>
                                <Typography variant="subtitle1">Claimable $EZM Rewards</Typography>
                                <Typography variant="h4">0.00 $EZM</Typography>
                            </Box>
                            <Common_FillButton content="Claim" />
                        </Box>
                        <Box className="devideLine" />
                        <Box className="footer">
                            <Typography variant="subtitle1">Pending $EZM Rewards</Typography>
                            <Typography variant="body1">~0.00 $EZM</Typography>
                        </Box>
                        {/* <Box className={classes.gradient__back}></Box> */}
                    </Box>
                    <Box>
                        <Box className="header">
                            <Typography variant="subtitle1">Your Info</Typography>
                            <Typography variant="h4">
                                <AccountCircleIcon />
                            </Typography>
                        </Box>
                        <Box className="devideLine" />
                        <Box className="footer">
                            <Box>
                                <Typography variant="subtitle1">Total Position Value</Typography>
                                <Typography variant="h4">${formatValue(totalPositionValue, 2)}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle1">Total Equity Value</Typography>
                                <Typography variant="h4">${formatValue(totalEquityValue, 2)}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle1">Total Debt Value</Typography>
                                <Typography variant="h4">${formatValue(totalDebtValue, 2)}</Typography>
                            </Box>
                        </Box>
                        {/* <Box className={classes.gradient__back}></Box> */}
                    </Box>
                </Box>

                <Box className="positions">
                    <Box className="header">
                        <Typography variant="subtitle1">Your positions</Typography>
                    </Box>
                    {/* <Box className="devideLine" /> */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            p: 2,
                            '& img': {
                                sm: { width: '30%' },
                                md: { width: '150px' },
                            },
                        }}
                    >
                        {(allPositions === 0) && (
                            <Box>
                                <img src={notExist} alt="" />
                                <Typography variant="h4">You don't have any positions yet</Typography>
                            </Box>
                        )}

                        {allPositions !== 0 && (
                            <TableContainer>
                                <Table sx={{ '& .MuiTableCell-root': { textAlign: 'center' } }}>
                                    <TableHead>
                                        <TableRow sx={{ '.MuiTableCell-root': { color: '#FFFFFF80' } }}>
                                            {tableHeader.map((item, index) => (
                                                <TableCell sx={{ fontSize: '20px' }} key={index} > {item}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {poolData.map((item, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '.MuiTableCell-root': { color: '#fff' } }}
                                            >
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', ml: '30px' }}>
                                                        <Box
                                                            sx={{
                                                                alignItems: 'center',
                                                                display: 'flex',
                                                                width: { xs: '100%' },
                                                                '& img': {
                                                                    width: '32px',
                                                                    height: '32px',
                                                                    borderRadius: '50%',
                                                                },
                                                            }}
                                                        // sx={{ display: 'flex', justifyContent: 'flex-start', width: '40px' }}
                                                        >
                                                            <img src={item.aTokenIcon} alt={item.aname} />
                                                            <img src={item.bTokenIcon} alt={item.bname} style={{ marginLeft: '-8px' }} />

                                                            {/* <img src={item.icon} alt='logo' style={{ width: '24px', height: '24px', marginRight: '3px' }} /> */}
                                                            <Box>
                                                                <Typography variant="subtitle1" sx={{ wordBreak: 'keep-all', marginLeft: '16px' }}>
                                                                    {item.aname}-{item.bname}
                                                                </Typography>
                                                                <Typography
                                                                    variant="subtitle1"
                                                                    sx={{ opacity: '.5', fontSize: '12px', wordBreak: 'keep-all', marginLeft: '16px' }}
                                                                >
                                                                    {protocols[item.dex].name}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                        <Typography component='span' >{item.asset}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>${formatValue(item.positionValue, 2)}</TableCell>
                                                <TableCell>${formatValue(item.equityValue, 2)}</TableCell>
                                                <TableCell>${formatValue(item.debtValue, 2)}</TableCell>
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
                                                            onClick={() => onWithdraw(index)}
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
                        )}
                    </Box>
                </Box>
            </Box>
        </Container >
    );
}
