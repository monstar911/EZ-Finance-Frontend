import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { styled } from '@mui/system';

const Back = styled(Box)({
    position: 'absolute',
    top: '2px',
    left: '0',
    width: '100%',
    height: '100%',
    // background: 'linear-gradient(104.45deg, #6452DE 0%, #F76CC5 73.89%, #FF6F6F 112.74%)',
    background: 'linear-gradient(90deg,#6e42ca,#8d29c1)',
    zIndex: '-1',
    borderRadius: '13px',
});

export default function PoolModal(props: any) {
    const { title, number, imga, namea, imgb, nameb, position } = props;

    return (
        <Grid item xs={12} md={6} lg={4} sx={{ p: 2 }}>
            <Box
                sx={{
                    position: 'relative',
                    '@media(max-width: 350px)': {
                        width: '100%',
                        padding: '20px',
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
                            <Typography variant="h5">{title.replace('TVL', '').replace('pools', '')}</Typography>
                        </Box>
                    </Box>
                    <Typography variant="subtitle1">TVL</Typography>
                    <Typography variant="h5" sx={{ marginBottom: '20px' }}>
                        ${number}
                    </Typography>
                    <Typography variant="subtitle1">Positions</Typography>
                    <Typography variant="h5">{position}</Typography>
                </Box>
                {/* <Back /> */}
            </Box>
        </Grid>
    );
}
