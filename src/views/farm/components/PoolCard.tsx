import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { Typography, Box, Grid } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Common_FillButton } from '../../../components/button';

const useStyles = makeStyles((theme: any) => ({
    root: {
        padding: '20px 0',
        color: 'white',
        textAlign: 'center',
        '& > div': {
            padding: '30px',
            // borderRadius: '20px',
            // background: '#342D55',
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
                // background: 'linear-gradient(93.57deg, #543DFB 0.71%, #F76CC5 50.59%, #FF4848 97.83%)',
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
    const classes = useStyles();
    const [dropOpen, setDropOpen] = useState(false);
    const { param } = props;
    const {
        aTokenIcon,
        bTokenIcon,
        pool_count,
        pool_total,
        from_percent,
        from_multi,
        max_apr,
        trade_fee,
        borrow,
        position,
        acheive,
        farm_apr,
        trade_volume,
        tvl,
    } = props.poolInfo;
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
                                display: 'flex',
                                width: { xs: '100%' },
                                '& img': {
                                    width: '35px',
                                    height: '35px',
                                    borderRadius: '50%',
                                },
                            }}
                        >
                            <img src={aTokenIcon} />
                            <img src={bTokenIcon} style={{ marginLeft: '-15px' }} />
                        </Box>
                    </Box>
                    <Box className={classes.textContent}>
                        <Typography sx={{ opacity: '.5', wordBreak: 'keep-all' }}>
                            From {from_percent}% up to
                        </Typography>
                        <Typography sx={{ fontSize: '18px' }}>
                            {(Number(from_percent) + Number(Math.random() * 0.5 + 0.5)).toFixed(2)}%
                        </Typography>
                    </Box>
                    <Box className={classes.textContent}>
                        <Typography sx={{ opacity: '.5', wordBreak: 'keep-all' }}>From {from_multi}x up to</Typography>
                        <Typography sx={{ fontSize: '18px' }}>
                            {(Number(from_multi) + Number(Math.random() * 0.5 + 1)).toFixed(2)}x
                        </Typography>
                    </Box>
                    <Box className={classes.textContent}>
                        <Typography sx={{ opacity: '.5', wordBreak: 'keep-all' }}>Pool TVL</Typography>
                        <Typography sx={{ fontSize: '18px' }}>{pool_total}</Typography>
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
                        <Common_FillButton
                            content={'Farm up to ' + /*(Math.random() * 1 + 1).toFixed(2) +*/ '1.00x'}
                            onClick={() => navigate(`/farm/${param}`)}
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
                        <Grid container justifyContent={'center'} alignItems={'center'}>
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
                                    <Typography variant="subtitle1">Acheived From</Typography>
                                    <Typography variant="h5">{acheive}X</Typography>
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
                                    <Typography variant="h5">${tvl}</Typography>
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
