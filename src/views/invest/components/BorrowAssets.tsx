import React, { useContext } from 'react'

import { Box, Typography, Stack, Slider } from '@mui/material'
import { coins } from '../../../context/constant'
import { ITokenPrice, Web3Context } from '../../../context/Web3Context'
import { trim } from '../../../helper/trim';



export default function BorrowAssets(props: any) {
    const {
        tokens,
        borrowAmount,
        debt,
    } = props;


    const web3 = useContext(Web3Context)
    const tokenPrice = web3?.tokenPrice as ITokenPrice

    return (
        <Box
            sx={{
                background: '#16162d', borderRadius: '24px',
                padding: { xs: '25px', md: '40px' }
            }}>

            <Typography sx={{ py: 2 }}>
                3. Borrow Assets
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ whiteSpace: 'nowrap', mr: 3 }}>
                    Debt Ratio: {debt ?? 0}%
                </Typography>
                <Slider
                    disabled
                    value={debt ?? 0}
                    aria-labelledby="input-slider"
                />
            </Box>


            <Box sx={{ p: 2, border: '1px solid rgba(255,255,255,.3)', borderRadius: '13px', mt: 3 }}>
                <Stack
                    direction="row"
                    alignItems='center'
                    justifyContent='center'
                    gap={5}
                    sx={{
                        '& img': {
                            width: '20px', height: '20px', borderRadius: '50%'
                        },
                        '@media(max-width: 560px)': { flexDirection: 'column', gap: 1 },
                        '& .MuiTypography-root': { minWidth: '60px' }
                    }}
                >

                    <Typography variant="body1" sx={{ fontSize: '18px' }}>
                        Current Price
                    </Typography>

                    <Stack direction="row" alignItems='center' gap={1}>
                        <img src={coins[tokens[0]].logo} alt={coins[tokens[0]].name} />
                        <Typography >${tokenPrice[tokens[0]]}</Typography>
                    </Stack>

                    <Stack direction="row" alignItems='center' gap={1}>
                        <img src={coins[tokens[1]].logo} alt={coins[tokens[1]].name} />
                        <Typography >${tokenPrice[tokens[1]]}</Typography>
                    </Stack>

                    <Stack direction="row" alignItems='center' gap={1}>
                        <img src={coins['ezm'].logo} alt={coins['ezm'].name} />
                        <Typography >${tokenPrice['ezm']}</Typography>
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
                        p: 2,
                        border: '1px solid rgba(255,255,255,.3)',
                        borderRadius: '13px',
                        minWidth: '300px',
                        '@media(max-width: 430px)': {
                            minWidth: '100%',
                        },
                    },
                    '& img': {
                        width: '30px', height: '30px', borderRadius: '50%'
                    },
                    '& .MuiTypography-root': {
                        whiteSpace: 'nowrap'
                    }
                }}
            >

                <Stack direction={'row'} justifyContent="center" gap={3}
                    sx={{
                        '@media(max-width: 430px)': {
                            flexDirection: 'column',
                            alignItems: 'center'
                        }
                    }}
                >
                    <Stack direction={'row'} alignItems="center" gap={2}>
                        <img src={coins[tokens[0]].logo} alt={coins[tokens[0]].symbol} />
                        <Stack direction={'column'}>
                            <Typography sx={{ fontSize: '18px', fontWeight: 700 }}>
                                {trim(borrowAmount.tokenA, 3)} {coins[tokens[0]].name}
                            </Typography>
                            <Typography>~${trim(borrowAmount.tokenA * tokenPrice[tokens[0]], 3)}</Typography>
                        </Stack>
                    </Stack>

                    <Stack direction={'row'} alignItems="center" gap={2}>
                        <img src={coins[tokens[1]].logo} alt={coins[tokens[1].symbol]} />
                        <Stack direction={'column'}>
                            <Typography sx={{ fontSize: '18px', fontWeight: 700 }}>
                                {trim(borrowAmount.tokenB, 3)} {coins[tokens[1]].name}
                            </Typography>
                            <Typography>~${trim(borrowAmount.tokenB * tokenPrice[tokens[1]], 3)}</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
}
