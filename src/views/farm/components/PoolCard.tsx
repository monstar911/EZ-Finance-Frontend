import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { Typography, Box, Grid } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { CommonFillButton } from '../../../components/button';
import {  protocols } from '../../../context/constant';
import { formatValue } from '../../../helper/formatValue';


const useStyles = makeStyles((theme: any) => ({
    root: {
        padding: '16px 0',
        color: 'white',
        textAlign: 'center',
        '& > div': {
            padding: '30px',
            background: '#16162d', borderRadius: '24px',
            boxShadow: '0px 1px 4px #ccc',

            '& .content': {
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                alignItems: 'center',
                [theme.breakpoints.down('md')]: {
                    flexDirection: 'column',
                },
            },
            '& .hidden_content': {
                marginTop: '20px',
                background: 'linear-gradient(90deg,#6e42ca,#8d29c1)',
                borderRadius: '13px',
                padding: '10px',
                textAlign: 'left',
                '& h5': {
                    fontSize: '24px',
                    fontWeight: '700',
                    lineHeight: '30px',
                    [theme.breakpoints.down('sm')]: {
                        fontSize: '20px',
                    },
                },
                '& h6': {
                    fontSize: '16px',
                    fontWeight: '500',
                    opacity: '.6',
                },
            },
        },
    },

    textContent: {
        textAlign: 'right',
        [theme.breakpoints.down('md')]: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0',
            width: '100%',
        },
    },
}));

function PoolCard(props: any) {
    const {
        dex,
        property,
        pool_tvl,
        from_multi,
        from_percent,
        max_apr,
        trade_fee,
        borrow,
        position,
        farm_apr,
        trade_volume,
        ez_tvl,
        pair,
    } = props.poolInfo;

    const classes = useStyles();
    const [dropOpen, setDropOpen] = useState(false);

    const navigate = useNavigate();


    return (
        <Box className={classes.root}>
            <Box>
                <Box className="content">
                    <Box
                        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}
                        className={classes.textContent}
                    >
                        <Box
                            sx={{
                                alignItems: 'center',
                                display: 'flex',
                                width: { xs: '100%' },
                                '& img': {
                                    width: '35px',
                                    height: '35px',
                                    borderRadius: '50%',
                                },
                            }}
                        >
                            <img src={property.x.logo} alt={property.x.name} />
                            <img src={property.y.logo} alt={property.y.name} style={{ marginLeft: '-8px' }} />
                            <Box>
                                <Typography sx={{ wordBreak: 'keep-all', marginLeft: '16px' }}>
                                    {property.x.name}-{property.y.name}
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    sx={{ opacity: '.5', fontSize: '12px', wordBreak: 'keep-all' }}
                                >
                                    {protocols[dex].name}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box className={classes.textContent}>
                        <Typography sx={{ opacity: '.5', wordBreak: 'keep-all' }}>
                            From {from_percent}% up to
                        </Typography>

                        <Typography sx={{ fontSize: '18px' }}>
                            {(Number(max_apr)).toFixed(2)}%
                        </Typography>
                    </Box>

                    <Box className={classes.textContent}>
                        <Typography sx={{ opacity: '.5', wordBreak: 'keep-all' }}>From 1.00x up to</Typography>
                        <Typography sx={{ fontSize: '18px' }}>
                            {Number(from_multi)}x
                        </Typography>
                    </Box>

                    <Box className={classes.textContent}>
                        <Typography sx={{ opacity: '.5', wordBreak: 'keep-all' }}>Pool TVL</Typography>
                        <Typography sx={{ fontSize: '18px' }}>${pool_tvl}</Typography>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            gap: '15px',
                            userSelect: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        <CommonFillButton
                            content={'Farm up to 1.00x'}
                            onClick={() => navigate(`/farm/${pair}`)}
                        />

                        <Box
                            onClick={() => setDropOpen(!dropOpen)}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                '&:hover': {
                                    color: 'grey',
                                },
                            }}
                        >
                            <Typography sx={{ opacity: '0.8' }}>Show details</Typography>
                            {dropOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </Box>
                    </Box>
                </Box>

                {dropOpen && (
                    <Box className="hidden_content">
                        <Grid container justifyContent={'flex-start'} alignItems={'center'}>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <Box sx={{ p: 1.5 }}>
                                    <Typography variant="subtitle1">Maximum APR</Typography>
                                    <Typography variant="h5">{max_apr}%</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <Box sx={{ p: 1.5 }}>
                                    <Typography variant="subtitle1">Trading Fee APY</Typography>
                                    <Typography variant="h5">{trade_fee}%</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <Box sx={{ p: 1.5 }}>
                                    <Typography variant="subtitle1">Borrowing Interest</Typography>
                                    <Typography variant="h5">{borrow}%</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <Box sx={{ p: 1.5 }}>
                                    <Typography variant="subtitle1">Positions</Typography>
                                    <Typography variant="h5">{position}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <Box sx={{ p: 1.5 }}>
                                    <Typography variant="subtitle1">Yield Farming APR</Typography>
                                    <Typography variant="h5">{farm_apr}%</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={3}>
                                <Box sx={{ p: 1.5 }}>
                                    <Typography variant="subtitle1">Trading Volume (24h)</Typography>
                                    <Typography variant="h5">${trade_volume}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4} lg={3} p={1}>
                                <Box sx={{ p: 1.5 }}>
                                    <Typography variant="subtitle1">TVL via EZ</Typography>
                                    <Typography variant="h5">${formatValue(ez_tvl, 2)}</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default PoolCard;
