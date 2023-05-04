import React, { useState, useContext } from 'react';

// import { makeStyles } from '@mui/styles';
import { Button, Box, Typography, Modal, useMediaQuery } from '@mui/material';

import PontemWallet from '../../asset/icons/Pontem.png'
import MartianIcon from '../../asset/icons/Martian.jpg';
import PetraIcon from '../../asset/icons/Petra.jpg';
import { IconX } from '@tabler/icons';
import { formart } from '../../helper/formatAddress';
import { Web3Context } from '../../context/Web3Context';

const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    bgcolor: '#342D55',
    p: 4,
    borderRadius: '13px',
    color: 'white',
};

const wallets = [
    {
        logo: PontemWallet,
        name: 'Pontem',
    },
    {
        logo: MartianIcon,
        name: 'Martian',
    },
    {
        logo: PetraIcon,
        name: 'Petra',
    },
];

function ConnectButton() {
    const isXs = useMediaQuery('(max-width:375px)');
    const [open, setOpen] = useState(false);
    const web3 = useContext(Web3Context)

    const onClose = () => {
        setOpen(false);
    };


    const onConnectWallet = async (wallet: string) => {
        await web3?.connect(wallet)
        setOpen(false)
    }

    const userAddress = web3?.address
    return (
        <div>
            <Box
                sx={{
                    display: 'flex',
                    alignContent: 'center',
                    justifyContent: 'center',
                }}
            >
                <Button
                    sx={{
                        color: 'white',
                        padding: '15px 20px',
                        background: 'linear-gradient(90deg,#6e42ca,#8d29c1)',
                        borderRadius: '200px',
                        marginRight: '20px',
                        minWidth: '160px',
                        '@media(max-width: 450px)': {
                            minWidth: '100px',
                            padding: '15px 5px'
                        }
                    }}
                    onClick={() => setOpen(!open)}
                >
                    {userAddress ? formart(userAddress) : isXs ? 'Connect' : 'Connect Wallet'}
                </Button>
            </Box>
            <Modal open={open} onClose={onClose}>
                <Box sx={{ ...modalStyle, width: { xs: '95%', md: '400px' } }}>

                    <Box
                        sx={{
                            display: 'flex', justifyContent: 'space-between', marginBottom: '12px'
                        }}
                    >
                        <Typography variant="h5" sx={{ display: 'flex', color: '#FFF' }}>
                            Connect Wallet
                        </Typography>
                        <Box
                            sx={{ display: 'flex', cursor: 'pointer', alignItems: 'center' }}
                            onClick={() => setOpen(false)}
                        >
                            <IconX />
                        </Box>
                    </Box>
                    <Typography variant="h6" sx={{ textAlign: 'left', mb: 3, color: '#EEE', fontSize: '14px' }}>
                        To continue working with the site, you need to connnect a wallet and allow the site access to your account
                    </Typography>
                    {wallets.map((wallet, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                width: '100%',
                                color: 'white',
                                background: '#42396B',
                                padding: '15px',
                                borderColor: 'gray',
                                borderStyle: 'groove',
                                borderRadius: '50px',
                                border: '1px gray solid',
                                my: 2,
                                cursor: 'pointer',
                                '&:hover': {
                                    boxShadow: '0px 0px 4px #5361DC60',
                                }
                            }}

                            onClick={() => onConnectWallet(wallet.name.toLocaleLowerCase())}
                        >
                            <img
                                src={wallet.logo}
                                alt="martian_logo"
                                style={{ width: '40px', borderRadius: '50%' }}
                            />
                            <Typography sx={{ display: 'flex', alignItems: 'center', px: 3 }}>{wallet.name}</Typography>
                        </Box>
                    ))}
                </Box>
            </Modal>
        </div>
    );
}

export default ConnectButton;
