import React from 'react';

import { Box, Typography, Slider, Stack } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { trim } from '../../../helper/trim';
import { TokenIcon } from '../../../context/constant';


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
    const { imga, imgb, namea, nameb, index, setIndex, amount, valueLeverage, setValueLeverage, debt, setDebt,
        valueBorrowEZM, setValueBorrowEZM, valueBorrowAPT, setValueBorrowAPT, valueBorrowLP, setValueBorrowLP,
        valueBorrowDolarEZM, setValueBorrowDolarEZM, valueBorrowDolarAPT, setValueBorrowDolarAPT, valueBorrowDolarLP, setValueBorrowDolarLP,
        valueEZM, setValueEZM, valueAPT, setValueAPT, valueLP, setValueLP,
        valueDolarEZM, setValueDolarEZM, valueDolarAPT, setValueDolarAPT, valueDolarLP, setValueDolarLP
    } = props;
    const classes = useStyles();
    const [rectCheck, setRectCheck] = React.useState(false);

    const handleClick = () => {
        setRectCheck(!rectCheck);
    };

    return (
        <Box
            sx={{
                background: '#16162d', borderRadius: '24px',
                padding: '40px',
            }}>

            <Typography variant="h4" sx={{ py: 2, '@media(max-width: 450px)': { fontSize: '24px' } }}>
                3. Borrow Assets
            </Typography>

            <Typography variant="h6" sx={{ mb: 3 }}>
                Debt Ratio
            </Typography>

            <Typography variant="h4">{/*getDebtRatio()*/debt}%</Typography>

            <Slider
                debt={typeof debt === 'number' ? debt : 0}
                step={0.01}
                onChange={(e: any) => setDebt(e.target.value)}
                disabled
                aria-labelledby="input-slider"
                value={debt}
            />

            <Box sx={{ p: 4, border: '1px solid rgba(255,255,255,.3)', borderRadius: '13px', mt: 3 }}>
                <Typography variant="body1" sx={{ fontSize: '21px' }}>
                    Liquidiation Conditions
                </Typography>
                {/* <Typography variant="h6" sx={{ lineHeight: '40px' }}>
                    Blandit at ornare sagittis in tortor tempus morbi dolor. Consectetur.
                </Typography>
                <Typography variant="h6" sx={{ lineHeight: '40px' }}>
                    Tempus justo semper augue hendrerit odio. Sem nulla ac.
                </Typography>
                <Typography variant="h6" sx={{ lineHeight: '40px', mb: 3 }}>
                    Morbi molestie ac posuere iaculis commodo lectus nec. Vulputate.
                </Typography> */}
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
                        <Typography variant="h6">${1.00}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems={'center'} gap={1}>
                        <img src={imgb} alt="" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                        <Typography variant="h6">$1,219.37</Typography>
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
                    <img src={TokenIcon.ezm} alt="ezm" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                    <Stack direction={'column'}>
                        <Typography variant="h5" sx={{ fontSize: '22px', fontWeight: 700 }}>
                            {valueBorrowEZM} {'EZM'}
                        </Typography>
                        <Typography variant="h6">~${valueBorrowDolarEZM}</Typography>
                    </Stack>

                    <img src={TokenIcon.apt} alt="apt" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                    <Stack direction={'column'}>
                        <Typography variant="h5" sx={{ fontSize: '22px', fontWeight: 700 }}>
                            {valueBorrowAPT} {'APT'}
                        </Typography>
                        <Typography variant="h6">~${valueBorrowDolarAPT}</Typography>
                    </Stack>

                    <img src={TokenIcon.lp} alt="lp" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                    <Stack direction={'column'}>
                        <Typography variant="h5" sx={{ fontSize: '22px', fontWeight: 700 }}>
                            {valueBorrowLP} {'LP'}
                        </Typography>
                        <Typography variant="h6">~${valueBorrowDolarLP}</Typography>
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
}
