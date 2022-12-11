import React, { useContext } from 'react';
import { Typography, Box, LinearProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
    styled,
    experimental_sx as sx,
} from '@mui/system';
// import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { IUserInfo, Web3Context } from '../../../context/Web3Context';
import { trim } from '../../../helper/trim';
import { formatValue } from '../../../helper/formatValue';

const useStyles = makeStyles((theme) => ({
    overview: {
        padding: '0 50px 20px',
        [theme.breakpoints.down('md')]: {
            padding: '0 20px 20px',
        },
        '& .MuiTypography-root': {
            color: '#333'
        },
        '& .valueText': {
            color: '#444'
        }
    },
    circularData: {
        position: 'absolute',
        top: '32px',
        left: '42px',
        height: '50px',
        backgroundColor: 'transparent',
        zIndex: 20,
    }

})) as any;

const CustomBox = styled('div')(
    sx({
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        flex: '1 1 0',
        justifyContent: 'space-between',
        alignItems: 'center',
        my: 2,
        "& .CircularProgressbar": {
            width: '120px',
            height: '120px'
        },
        "& .CircularProgressbar-path": {
            stroke: '#5361DC'
        }
    })
)

const CustomDivider = styled('div')(
    sx({
        width: { xs: '0px', md: '2px' },
        height: { xs: '0px', md: '50px' },
        border: '1px solid #ccc',
    })
)

function OverView() {

    const classes = useStyles();
    const web3 = useContext(Web3Context);
    const userInfo = web3?.userInfo as IUserInfo;
    const tokenPrice = web3?.tokenPrice as any;

    const supplyBalance = userInfo.aptos.totalDeposit * tokenPrice.aptos + userInfo.arc.totalDeposit * tokenPrice.arc;
    const borrowBalance = userInfo.aptos.totalBorrow * tokenPrice.aptos + userInfo.arc.totalBorrow * tokenPrice.arc;

    const borrowLimit = supplyBalance > 0 ? borrowBalance * 100 / (supplyBalance * 0.8) > 100 ? 100 : borrowBalance * 100 / (supplyBalance * 0.8) : 0;
    const totalRewards = userInfo.totalRewards * 10;

    return (
        <div className={classes.overview}>
            <Typography
                sx={{
                    color: '#333',
                    fontSize: '18px',
                    pl: '20px',
                    mb: 1
                }}
            >
                Overview
            </Typography>
            <Box
                sx={{
                    display: 'flex',

                    padding: '20px',
                    bgcolor: '#FFF',
                    borderRadius: '20px',
                    boxShadow: '0px 1px 4px #ccc',
                    flexDirection: 'column'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        width: '100%',
                        '& .MuiBox-root': {
                            flex: '1 1 0',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }
                    }}
                >
                    <Box>
                        <Typography sx={{ mb: 2 }}>Supply Balance</Typography>
                        <Typography sx={{ fontSize: '28px' }} className='valueText'>$ {formatValue(supplyBalance, 3)}</Typography>
                    </Box>
                    <CustomBox>
                        <CustomDivider />
                        {/* <div style={{ position: "relative" }}>
                            <CircularProgressbar value={23} strokeWidth={11} background={true}
                                styles={buildStyles({
                                    backgroundColor: "transparent",
                                    trailColor: "#ccc",
                                    textColor: "#FFF",
                                })}
                            />
                            <Box
                                className={classes.circularData}
                                sx={{
                                    '& .MuiTypography-root': {
                                        color: '#333'
                                    }
                                }}
                            >
                                <Typography>APY</Typography>
                                <Typography sx={{ fontSize: '24px' }}>13%</Typography>
                            </Box>
                        </div> */}
                        <Box>
                            <Typography sx={{ mb: 2 }}>Claimed Rewards To Date</Typography>
                            <Typography sx={{ fontSize: '28px' }} className='valueText'>${formatValue(totalRewards, 3)}</Typography>
                        </Box>
                        <CustomDivider />
                    </CustomBox>
                    <Box>
                        <Typography sx={{ mb: 2 }}>Borrow Balance</Typography>
                        <Typography sx={{ fontSize: '28px' }} className='valueText'>${formatValue(borrowBalance, 3)}</Typography>
                    </Box>
                </Box>
                <Box sx={{ width: '100%', display: 'flex', mt: { xs: 1, md: 0 } }}>
                    <Typography>
                        Borrow Limit {trim(borrowLimit, 1)}%
                    </Typography>
                    <Box
                        sx={{
                            flexGrow: 1,
                            mx: { xs: '10px', md: 3 },
                            '& .MuiLinearProgress-barColorPrimary': {
                                bgcolor: '#5361DC'
                            },
                            '& .MuiLinearProgress-colorPrimary': {
                                bgcolor: '#ccc'
                            }
                        }}
                    >
                        <LinearProgress variant="determinate" value={borrowLimit} sx={{ mt: '10px' }} />
                    </Box>
                    <Typography>
                        ${trim(supplyBalance * 0.8, 3)}
                    </Typography>
                </Box>
            </Box>
        </div>
    )
}

export default OverView;