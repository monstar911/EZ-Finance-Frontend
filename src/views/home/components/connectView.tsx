import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import WalletLogo from '../../../asset/icons/wallet.png';

function ConnectView() {
    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    bgcolor: '#342D55',
                    borderRadius: '20px',
                    width: '80%',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 3,
                    }}
                >
                    <img src={WalletLogo} alt="wallet" />
                    <Typography sx={{ fontSize: '32px', color: '#FFF', ml: 2 }}>
                        Connect your wallet to access EZ
                    </Typography>
                </Box>
                <Box>
                    <Button sx={{ color: '#FFF', fontSize: '20px' }}>Connect Wallet</Button>
                </Box>
            </Box>
        </div>
    )
}

export default ConnectView;
