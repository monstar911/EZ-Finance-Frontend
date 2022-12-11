import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';

const Back = styled(Box)({
    position: 'absolute',
    top: '5px',
    left: '0',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(104.45deg, #6452DE 0%, #F76CC5 73.89%, #FF6F6F 112.74%)',
    zIndex: '-1',
    borderRadius: '10px',
});

export default function ProtocolModal(props: any) {
    const { title } = props;

    return (
        <Box
            sx={{
                flex: '1',
                background: '#342D55',
                position: 'relative',
                padding: '30px 50px',
                borderRadius: '13px',
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
                $0
            </Typography>
            <Back />
        </Box>
    );
}
