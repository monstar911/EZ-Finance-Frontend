import React, { useContext } from 'react'
import { alpha, Button, Menu, MenuProps, styled, Typography, useMediaQuery } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Avatar, Box, Select, MenuItem, Stack } from '@mui/material'
import { IconMenu2 } from '@tabler/icons'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import ConnectButton from './ConnectWallet'
import { coins } from '../../context/constant'
import { Web3Context } from '../../context/Web3Context'


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
        backgroundColor: '#241F3E',
        width: '100%',
        padding: '15px 0',
        zIndex: 100,
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
            textAlign: 'right',
            color: 'white',
            border: 'none',
            borderRadius: '100px',
            padding: '0 20px',
            justifyContent: 'center',
            background: 'linear-gradient(90deg,#6e42ca,#8d29c1)',
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

const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

function Header({ handleDrawerToggle }: IHeader) {
    const is1200 = useMediaQuery('(max-width: 1200px)');
    const isDown425 = useMediaQuery('(max-width: 425px)');
    const classes = useStyles();
    const [selectValue, setSelectValue] = React.useState('aptos');

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const web3 = useContext(Web3Context)

    const onGetFaucet = async (token: string) => {
        console.log('onGetFaucet: ', token);

        await web3?.getFaucet(token);
    }

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
                    marginLeft: '20px',
                    display: 'flex',
                    flexGrow: 1,
                    alignItems: 'center',
                    gap: '20px',
                }}
            >
                <Box className={classes.selectbutton}>
                    {/* <Select
                        value={selectValue}
                        label='Faucet'
                        onChange={(e: any) => setSelectValue(e.target.value)}
                        IconComponent={ExpandMoreIcon}
                    > */}
                    <Button
                        sx={{
                            color: 'white',
                            padding: '15px 20px',
                            background: 'linear-gradient(90deg,#6e42ca,#8d29c1)',
                            borderRadius: '200px',
                            marginRight: '-5px',
                            minWidth: '160px',
                        }}
                        id="demo-customized-button"
                        aria-controls={open ? 'demo-customized-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        variant="contained"
                        disableElevation
                        onClick={handleClick}
                        endIcon={<ExpandMoreIcon />}
                    >
                        Faucet
                    </Button>
                    <StyledMenu
                        id="demo-customized-menu"
                        MenuListProps={{
                            'aria-labelledby': 'demo-customized-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    >
                        {
                            Object.keys(coins).map((item, index) => (
                                (!(coins[item].name == 'APT') && <MenuItem key={index} value={coins[item].symbol} onClick={() => onGetFaucet(coins[item].symbol)}>
                                    < Stack
                                        direction={'row'}
                                        alignItems={'center'}
                                        gap={1}
                                        sx={{ '& img': { width: '30px', height: '30px', borderRadius: '50%' } }}
                                    >
                                        <Box sx={{ display: { xs: 'none', md: 'block' } }}><img src={coins[item].logo} alt="aptos" /></Box>
                                        <Typography >{coins[item].name}</Typography>
                                    </Stack>
                                </MenuItem>)
                            ))
                        }
                    </StyledMenu>
                </Box>
                <ConnectButton />
            </Box>
        </div >
    );
}

export default Header;
