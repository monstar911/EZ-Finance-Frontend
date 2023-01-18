import React, { useContext } from 'react';

import { Box, Typography, Stack, Slider } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { trim } from '../../../helper/trim';
import { coins } from '../../../context/constant';
import { ITokenPrice3, Web3Context } from '../../../context/Web3Context';


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

export default function BorrowAssets(props: any) {
    const {
        strCoinPair,
        valueBorrowPairX, valueBorrowPairY, valueBorrowEZM,
        valueBorrowDolarPairX, valueBorrowDolarPairY, valueBorrowDolarEZM,
        debt,
    } = props;

    const classes = useStyles();
    const [rectCheck, setRectCheck] = React.useState(false);

    const handleClick = () => {
        setRectCheck(!rectCheck);
    };

    const web3 = useContext(Web3Context)
    const tokenPrice3 = web3?.tokenPrice3 as ITokenPrice3

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
                disabled
                value={debt}
                aria-labelledby="input-slider"
            />

            <Box sx={{ p: 4, border: '1px solid rgba(255,255,255,.3)', borderRadius: '13px', mt: 3 }}>
                {/* <Typography variant="body1" sx={{ fontSize: '21px' }}>
                    Liquidiation Conditions
                </Typography> */}
                {/* <Typography variant="h6" sx={{ lineHeight: '40px' }}>
                    Blandit at ornare sagittis in tortor tempus morbi dolor. Consectetur.
                </Typography>
                <Typography variant="h6" sx={{ lineHeight: '40px' }}>
                    Tempus justo semper augue hendrerit odio. Sem nulla ac.
                </Typography>
                <Typography variant="h6" sx={{ lineHeight: '40px', mb: 3 }}>
                    Morbi molestie ac posuere iaculis commodo lectus nec. Vulputate.
                </Typography> */}
                {/* <hr /> */}

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
                        <img src={coins[strCoinPair[0]].logo} alt={coins[strCoinPair[0]].name} style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                        <Typography variant="h6">${tokenPrice3[strCoinPair[0]]}</Typography>
                    </Stack>

                    <Stack direction="row" alignItems={'center'} gap={1}>
                        <img src={coins[strCoinPair[1]].logo} alt={coins[strCoinPair[1]].name} style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                        <Typography variant="h6">${tokenPrice3[strCoinPair[1]]}</Typography>
                    </Stack>

                    <Stack direction="row" alignItems={'center'} gap={1}>
                        <img src={coins['ezm'].logo} alt={coins['ezm'].name} style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                        <Typography variant="h6">${tokenPrice3['ezm']}</Typography>
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

                <Stack direction={'row'} alignItems="center" gap={5}>
                    <Stack direction={'row'} alignItems="center" gap={2}>
                        <img src={coins[strCoinPair[0]].logo} alt={coins[strCoinPair[0]].symbol} style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                        <Stack direction={'column'}>
                            <Typography variant="h5" sx={{ fontSize: '22px', fontWeight: 700 }}>
                                {valueBorrowPairX} {coins[strCoinPair[0]].name}
                            </Typography>
                            <Typography variant="h6">~${valueBorrowDolarPairX}</Typography>
                        </Stack>
                    </Stack>

                    <Stack direction={'row'} alignItems="center" gap={2}>
                        <img src={coins[strCoinPair[1]].logo} alt={coins[strCoinPair[1].symbol]} style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                        <Stack direction={'column'}>
                            <Typography variant="h5" sx={{ fontSize: '22px', fontWeight: 700 }}>
                                {valueBorrowPairY} {coins[strCoinPair[1]].name}
                            </Typography>
                            <Typography variant="h6">~${valueBorrowDolarPairY}</Typography>
                        </Stack>
                    </Stack>

                    {/* <Stack direction={'row'} alignItems="center" gap={2}>
                        <img src={coins['ezm'].logo} alt='ezm' style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                        <Stack direction={'column'}>
                            <Typography variant="h5" sx={{ fontSize: '22px', fontWeight: 700 }}>
                                {valueBorrowEZM} {'EZM'}
                            </Typography>
                            <Typography variant="h6">~${valueBorrowDolarEZM}</Typography>
                        </Stack>
                    </Stack> */}
                </Stack>
            </Box>
        </Box>
    );
}
