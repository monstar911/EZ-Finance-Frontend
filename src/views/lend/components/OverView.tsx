import React, { useContext, useEffect, useState } from 'react';
import { Typography, Box, LinearProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
    styled,
    experimental_sx as sx,
} from '@mui/system';
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
            //color: '#333'
        },
        '& .valueText': {
            color: '#FFFFFF'
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

    const classes = useStyles()
    const web3 = useContext(Web3Context)
    const userInfo = web3?.userInfo as IUserInfo
    const poolInfo = web3?.poolInfo
    const tokenPrice = web3?.tokenPrice as any

    const [tvl, setTVL] = useState(0)
    const [supBalance, setSupplyBalance] = useState(0)

    useEffect(() => {
        let _tvl = 0;
        let _sup = 0;
        Object.keys(poolInfo).map((item) => {
            _tvl += poolInfo[item] * tokenPrice[item]
            _sup += (userInfo.deposit[item] ?? 0) * tokenPrice[item]

        })
        setTVL(_tvl)
        setSupplyBalance(_sup)
    }, [poolInfo, tokenPrice, userInfo])

    // const borrowLimit = supplyBalance > 0 ? borrowBalance * 100 / (supplyBalance * 0.8) > 100 ? 100 : borrowBalance * 100 / (supplyBalance * 0.8) : 0;
    // const totalRewards = userInfo.totalRewards * 10;


    return (
        <div className={classes.overview}>
            <Typography
                sx={{
                    color: '#fff',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    pl: '20px',
                    my: 2
                }}
            >
                Lending Pool Info
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    color: '#FFFFFF80',
                    padding: '20px',
                    background: '#16162d', borderRadius: '24px',
                    boxShadow: '0px 1px 4px #ccc',
                    flexDirection: 'column',
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
                        <Typography sx={{ mb: 2, color: '#FFFFFF80' }}>TVL</Typography>
                        <Typography sx={{ fontSize: '28px' }} className='valueText'>$ {formatValue(tvl, 3)}</Typography>
                    </Box>
                    <Box>
                        <Typography sx={{ mb: 2, color: '#FFFFFF80' }}>Supply Balance</Typography>
                        <Typography sx={{ fontSize: '28px' }} className='valueText'>$ {formatValue(supBalance, 3)}</Typography>
                    </Box>
                    <Box>
                        <Typography sx={{ mb: 2, color: '#FFFFFF80' }}>Net APY</Typography>
                        <Typography sx={{ fontSize: '28px' }} className='valueText'>7 %</Typography>
                    </Box>
                </Box>
            </Box>
        </div>
    )
}

export default OverView;