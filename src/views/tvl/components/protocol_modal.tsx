import React, { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { Web3Context } from '../../../context/Web3Context';
import { coins } from '../../../context/constant';
import { trim } from '../../../helper/trim';

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
    const { title } = props;

    const web3 = useContext(Web3Context)
    const pairTVLInfo = web3?.pairTVLInfo

    var allPoolsTVL = 0;
    for (var key in coins) {
        if (key === 'ezm' || key === 'apt') continue;
        allPoolsTVL = allPoolsTVL + pairTVLInfo[key];
    }
    // console.log('allPoolsTVL', allPoolsTVL);

    const all_PoolsTVL = (title === 'PancakeSwap') ? allPoolsTVL : 0


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
            <Typography variant="subtitle1">{title}</Typography>
            <Typography variant="h5" sx={{ marginBottom: '20px' }}>
                ${trim(all_PoolsTVL, 2)}
            </Typography>
            {/* <Back /> */}
        </Box>
    );
}
