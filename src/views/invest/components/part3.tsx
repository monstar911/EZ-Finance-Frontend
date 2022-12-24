import React from 'react';
import { Box, Typography, Slider, Stack } from '@mui/material';
import { makeStyles } from '@mui/styles';

import a from '../../../asset/icons/Aptos.png';
import b from '../../../asset/icons/crypto-usdc.png';
import { trim } from '../../../helper/trim';

const useStyles = makeStyles((theme: any) => ({
    left: {
        left: '5px',
        right: 'unset',
    },
    right: {
        right: '5px',
        left: 'unset',
    },
}));

export default function Part3(props: any) {
    const { imga, imgb, namea, nameb } = props;
    const classes = useStyles();
    const [debt, setDebt] = React.useState(75);
    const [rectCheck, setRectCheck] = React.useState(false);

    const handleClick = () => {
        setRectCheck(!rectCheck);
    };

    const getDebtRatio = () => {
        const total_debt_amount = 300;
        const total_LP_amount = 200;
        const borrow_factor = 1.3;
        const collateral_factor = 0.8;
        const borrow_credit = total_debt_amount * borrow_factor;
        const collateral_credit = total_LP_amount * collateral_factor;
        return trim(borrow_credit / collateral_credit, 2);
        // setDebt(borrow_credit / collateral_credit);
    }

    return (
        <Box
            sx={{
                background: '#16162d', borderRadius: '24px',
                padding: '40px',
            }}>

            <Typography variant="h4" sx={{ py: 2, '@media(max-width: 450px)': { fontSize: '24px' } }}>
                3. Borrow Assets
            </Typography>

            <Typography variant="h6">Select your option to borrow assets in order to open a new position</Typography>

            <Box
                onClick={handleClick}
                sx={{
                    // background: '#241F3E',
                    background: '#43395b',
                    borderRadius: '15px',
                    height: '80px',
                    mt: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    '@media(max-width: 500px)': { textAlign: 'center' },
                }}
            >
                <Box
                    sx={{
                        fontSize: '16px',
                        flex: '1',
                        height: '70px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1,
                        userSelect: 'none',
                    }}
                >
                    Minimize Price Impact
                </Box>

                <Box
                    sx={{
                        fontSize: '16px',
                        flex: '1',
                        height: '70px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1,
                        userSelect: 'none',
                    }}
                >
                    Custom
                </Box>

                <Box
                    sx={{
                        // background: 'linear-gradient(93.57deg, #543DFB 0.71%, #F76CC5 50.59%, #FF4848 97.83%)',
                        background: 'linear-gradient(90deg,#6e42ca,#8d29c1)',
                        width: '50%',
                        height: '70px',
                        position: 'absolute',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        borderRadius: '13px',
                        zIndex: 0,
                    }}
                    className={rectCheck ? classes.right : classes.left}
                ></Box>
            </Box>

            <Typography variant="h6" sx={{ my: 3 }}>
                Debt Ratio
            </Typography>

            <Typography variant="h4">{getDebtRatio()}%</Typography>

            <Slider defaultValue={debt} step={0.01} onChange={(e: any) => setDebt(e.target.value)} disabled />

            <Box sx={{ p: 4, border: '1px solid rgba(255,255,255,.3)', borderRadius: '13px', mt: 3 }}>
                <Typography variant="body1" sx={{ fontSize: '21px' }}>
                    Liquidiation Conditions
                </Typography>
                <Typography variant="h6" sx={{ lineHeight: '40px' }}>
                    Blandit at ornare sagittis in tortor tempus morbi dolor. Consectetur.
                </Typography>
                <Typography variant="h6" sx={{ lineHeight: '40px' }}>
                    Tempus justo semper augue hendrerit odio. Sem nulla ac.
                </Typography>
                <Typography variant="h6" sx={{ lineHeight: '40px', mb: 3 }}>
                    Morbi molestie ac posuere iaculis commodo lectus nec. Vulputate.
                </Typography>
                <hr />
                <Stack
                    direction="row"
                    alignItems={'center'}
                    gap={5}
                    sx={{ pt: 2, '@media(max-width: 560px)': { flexDirection: 'column', gap: 1 } }}
                >
                    <Typography variant="body1" sx={{ fontSize: '18px' }}>
                        Current Price
                    </Typography>
                    <Stack direction="row" alignItems={'center'} gap={1}>
                        <img src={imga} alt="" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                        <Typography variant="h6">$1.00</Typography>
                    </Stack>
                    <Stack direction="row" alignItems={'center'} gap={1}>
                        <img src={imgb} alt="" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                        <Typography variant="h6">$1,6403</Typography>
                    </Stack>
                </Stack>
            </Box>
            <Typography variant="body1" sx={{ fontSize: '18px', my: 2 }}>
                Borrow Assets
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 3,
                    '& > div': {
                        flex: '1',
                        p: 3,
                        border: '1px solid rgba(255,255,255,.3)',
                        borderRadius: '13px',
                        minWidth: '300px',
                        '@media(max-width: 430px)': {
                            minWidth: '100%',
                        },
                    },
                }}
            >
                <Stack direction={'row'} alignItems="center" gap={2}>
                    <img src={imga} alt="" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                    <Stack direction={'column'}>
                        <Typography variant="h5" sx={{ fontSize: '22px', fontWeight: 700 }}>
                            102.19 {namea}
                        </Typography>
                        <Typography variant="h6">-$102.45</Typography>
                    </Stack>
                </Stack>
                <Stack direction={'row'} alignItems="center" gap={2}>
                    <img src={imgb} alt="" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                    <Stack direction={'column'}>
                        <Typography variant="h5" sx={{ fontSize: '22px', fontWeight: 700 }}>
                            102.19 {nameb}
                        </Typography>
                        <Typography variant="h6">-$102.45</Typography>
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
}
