import React from 'react';
import { useMediaQuery } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Avatar, Box, Select, MenuItem, Stack } from '@mui/material';
import { IconMenu2 } from '@tabler/icons';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ConnectButton from './ConnectWallet';

import aptosIcon from '../../asset/icons/Aptos.png';
import suiIcon from '../../asset/icons/sui.png';

interface IHeader {
    handleDrawerToggle?: () => void;
    title: string;
}

const useStyles = makeStyles((theme) => ({
    topBar: {
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        backgroundColor: 'rgba(52, 45, 85, 1)',
        width: '100%',
        padding: '15px 0',
        zIndex: 100,
        // borderBottom: "2px solid #eee",
    },
    topBarShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: 1000,
        }),
        marginLeft: 0,
    },
    toggleButton: {
        marginLeft: '15px',
    },
    selectbutton: {
        '& .MuiInputBase-root': {
            minWidth: '170px',
            color: 'white',
            border: 'none',
            borderRadius: '100px',
            padding: '0 20px',
            justifyContent: 'center',
            background: 'linear-gradient(93.57deg, #543DFB 0.71%, #F76CC5 50.59%, #FF4848 97.83%)',
        },
        '& .MuiOutlinedInput-input': {
            padding: '10px',
        },
        '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
        },
        '& .MuiSvgIcon-root': {
            color: 'white',
        },
        '& ul': {
            background: 'red!important',
        },
    },
})) as any;

function Header({ handleDrawerToggle }: IHeader) {
    const is1200 = useMediaQuery('(max-width: 1200px)');
    const classes = useStyles();
    const [selectValue, setSelectValue] = React.useState('aptos');

    return (
        <div className={classes.topBar}>
            {is1200 && (
                <div onClick={handleDrawerToggle} className={classes.toggleButton}>
                    <Avatar
                        sx={{
                            bgcolor: '#FFF',
                            boxShadow: '0px 1px 4px #ccc',
                            mt: '3px',
                        }}
                    >
                        <IconMenu2 color="#888" />
                    </Avatar>
                </div>
            )}
            <Box
                sx={{
                    justifyContent: 'flex-end',
                    display: 'flex',
                    flexGrow: 1,
                    alignItems: 'center',
                    gap: '20px',
                }}
            >
                <Box className={classes.selectbutton}>
                    <Select
                        value={selectValue}
                        onChange={(e: any) => setSelectValue(e.target.value)}
                        IconComponent={ExpandMoreIcon}
                    >
                        <MenuItem value={'aptos'}>
                            <Stack
                                direction={'row'}
                                alignItems={'center'}
                                gap={1}
                                sx={{ '& img': { width: '30px', height: '30px', borderRadius: '50%' } }}
                            >
                                <img src={aptosIcon} alt="" />
                                Aptos
                            </Stack>
                        </MenuItem>
                        <MenuItem value={'sui'}>
                            <Stack
                                direction={'row'}
                                alignItems={'center'}
                                gap={1}
                                sx={{ '& img': { width: '30px', height: '30px', borderRadius: '50%' } }}
                            >
                                <img src={suiIcon} alt="" />
                                Sui
                            </Stack>
                        </MenuItem>
                    </Select>
                </Box>
                <ConnectButton />
            </Box>
        </div>
    );
}

export default Header;
