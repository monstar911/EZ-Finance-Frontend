import React, { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { Web3Context } from '../../../context/Web3Context';
import { formatValue } from '../../../helper/formatValue';
import { pairs, protocols } from '../../../context/constant';

const Back = styled(Box)({
    position: 'absolute',
    top: '5px',
    left: '0',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg,#6e42ca,#8d29c1)',
    zIndex: '-1',
    borderRadius: '10px',
});

export default function ProtocolModal(props: any) {
    const { dex } = props;

    const web3 = useContext(Web3Context)
    const tokenVolume = web3?.tokenVolume

    var allPoolsTVL = 0;

    for (let pair in pairs[dex]) {

        let _liquidityInfo = tokenVolume?.[dex]?.[pair]?.['liquidity']
        const _liquidity = _liquidityInfo ??= 0

        allPoolsTVL += Number(_liquidity);
    }


    return (
        <Box
            sx={{
                flex: '1',
                position: 'relative',
                padding: '30px 50px',
                background: '#16162d', borderRadius: '24px',
                boxShadow: '0px 1px 4px #ccc',

                minWidth: '300px',
                '@media(max-width: 350px)': {
                    minWidth: 'unset',
                    width: '100%',
                    padding: '20px',
                },
            }}
        >
            <Typography variant="subtitle1">{protocols[dex].name}</Typography>
            <Typography variant="h5" sx={{ marginBottom: '20px' }}>
                ${formatValue(allPoolsTVL, 2)}
            </Typography>
            {/* <Back /> */}
        </Box>
    );
}
