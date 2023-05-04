import React from 'react';
import { Box, Typography, Grid } from '@mui/material';


export default function PoolCard(props: any) {
    const { title, tvl, imga, namea, imgb, nameb, position } = props;

    return (
        <Grid item xs={12} md={6} lg={4} sx={{p:2}}>
            <Box
                sx={{
                    position: 'relative',
                    '@media(max-width: 350px)': {
                        width: '100%',         
                    },
                    transition: '0.3s all',
                    '&:hover': {
                        transform: 'translateY(-10px)',
                    },
                }}
            >
                <Box sx={{ background: '#16162d', borderRadius: '24px', boxShadow: '0px 1px 4px #ccc', padding: '30px' }}>
                    <Typography variant="subtitle1">{title}</Typography>

                    <Box sx={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                '& img': {
                                    width: '35px',
                                    height: '35px',
                                    borderRadius: '50%',
                                },
                            }}
                        >
                            <img src={imga} alt="" />
                            <img src={imgb} alt="" style={{ marginLeft: '-15px' }} />
                        </Box>

                        <Box
                            sx={{
                                '& h5': {
                                    fontSize: '18px',
                                    fontWeight: 500,
                                },
                            }}
                        >
                            <Typography variant="h5">
                                {namea}/{nameb}
                            </Typography>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                        }}
                    >
                        <Box>
                            <Typography variant="subtitle1">TVL</Typography>
                            <Typography variant="h5">${tvl}</Typography>
                        </Box>

                        <Box>
                            <Typography variant="subtitle1">Positions</Typography>
                            <Typography variant="h5">{position}</Typography>
                        </Box>
                    </Box>
                </Box>

            </Box>
        </Grid>
    );
}
