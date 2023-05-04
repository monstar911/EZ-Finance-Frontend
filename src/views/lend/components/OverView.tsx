import React, { useContext, useEffect, useState } from 'react'
import { Typography, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'

import 'react-circular-progressbar/dist/styles.css'
import { ITokenPrice, IUserInfo, Web3Context } from '../../../context/Web3Context'
import { formatValue } from '../../../helper/formatValue'

const useStyles = makeStyles((theme) => ({
    overview: {
        padding: '0 50px 20px',
        [theme.breakpoints.down('md')]: {
            padding: '0 0 20px',
        },
        '& .valueText': {
            color: '#FFF'
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
})) as any

function OverView() {

    const classes = useStyles()
    const web3 = useContext(Web3Context)
    const userInfo = web3?.userInfo as IUserInfo
    const poolInfo = web3?.poolInfo
    const tokenPrice = web3?.tokenPrice as ITokenPrice

    const [tvl, setTVL] = useState(0)
    const [supBalance, setSupplyBalance] = useState(0)

    useEffect(() => {
        let _tvl = 0;
        let _sup = 0;
        Object.keys(poolInfo).forEach((item) => {
            _tvl += poolInfo[item] * tokenPrice[item]
            _sup += (userInfo.deposit[item] ?? 0) * tokenPrice[item]
        })
        setTVL(_tvl)
        setSupplyBalance(_sup)
    }, [poolInfo, tokenPrice, userInfo])

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
                        <Typography >TVL</Typography>
                        <Typography sx={{ fontSize: '28px', mb: 2 }} className='valueText'>$ {formatValue(tvl, 3)}</Typography>
                    </Box>
                    <Box>
                        <Typography >Supply Balance</Typography>
                        <Typography sx={{ fontSize: '28px', mb: 2 }} className='valueText'>$ {formatValue(supBalance, 3)}</Typography>
                    </Box>
                    <Box>
                        <Typography >Net APY</Typography>
                        <Typography sx={{ fontSize: '28px', mb: 2 }} className='valueText'>7 %</Typography>
                    </Box>
                </Box>
            </Box>
        </div>
    )
}

export default OverView;