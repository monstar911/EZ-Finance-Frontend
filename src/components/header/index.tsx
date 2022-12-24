import React, { useContext } from 'react'
import { alpha, Button, Menu, MenuProps, styled, Typography, useMediaQuery } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Avatar, Box, Select, MenuItem, Stack } from '@mui/material'
import { IconMenu2 } from '@tabler/icons'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ConnectButton from './ConnectWallet'

import aptosIcon from '../../asset/icons/Aptos.png'
import suiIcon from '../../asset/icons/sui.png'

import AptosIcon from '../../asset/icons/Aptos.png'
import BtcIcon from '../../asset/icons/crypto-btc.svg'
import UsdcIcon from '../../asset/icons/crypto-usdc.png'
import UsdtIcon from '../../asset/icons/crypto-usdt.png'
import EthereumIcon from '../../asset/icons/crypto-ethereum.png'
import DaiIcon from '../../asset/icons/crypto-dai.svg'
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
            textAlign: 'right',
            //minWidth: '170px',
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

    const faucetItems = [
        {
            value: 'dai',
            logo: DaiIcon,
            tokenName: 'DAI'
        }, {
            value: 'usdc',
            logo: UsdcIcon,
            tokenName: 'USDC'
        }, {
            value: 'usdt',
            logo: UsdtIcon,
            tokenName: 'USDT'
        }, {
            value: 'ceUsdc',
            logo: UsdcIcon,
            tokenName: 'ceUSDC'
        }, {
            value: 'wbtc',
            logo: BtcIcon,
            tokenName: 'WBTC'
        }, {
            value: 'weth',
            logo: EthereumIcon,
            tokenName: 'WETH'
        }
    ]

    const onGetFaucet = async (token: string) => {
        await web3?.getFaucet(token);
    }


    // return (
    //     <div className={classes.topBar}>
    //         {is1200 && (
    //             <div onClick={handleDrawerToggle} className={classes.toggleButton}>
    //                 <Avatar
    //                     sx={{
    //                         bgcolor: '#FFF',
    //                         boxShadow: '0px 1px 4px #ccc',
    //                         mt: '3px',
    //                     }}
    //                 >
    //                     <IconMenu2 color="#888" />
    //                 </Avatar>
    //             </div>
    //         )}
    //         <Box
    //             sx={{
    //                 justifyContent: 'flex-end',
    //                 marginLeft: '20px',
    //                 display: 'flex',
    //                 flexGrow: 1,
    //                 alignItems: 'center',
    //                 gap: '20px',
    //             }}
    //         >
    //             <Box className={classes.selectbutton}>
    //                 <Select
    //                     value={selectValue}
    //                     onChange={(e: any) => setSelectValue(e.target.value)}
    //                     IconComponent={ExpandMoreIcon}
    //                 >
    //                     <MenuItem value={'aptos'}>
    //                         < Stack
    //                             direction={'row'}
    //                             alignItems={'center'}
    //                             gap={1}
    //                             sx={{ '& img': { width: '30px', height: '30px', borderRadius: '50%' } }}
    //                         >
    //                             <Box sx={{ display: { xs: 'none', md: 'block' } }}><img src={aptosIcon} alt="aptos" /></Box>
    //                             <Typography >Aptos</Typography>
    //                         </Stack>
    //                     </MenuItem>
    //                     <MenuItem value={'sui'}>
    //                         <Stack
    //                             direction={'row'}
    //                             alignItems={'center'}
    //                             gap={1}
    //                             sx={{ '& img': { width: '30px', height: '30px', borderRadius: '50%' } }}
    //                         >
    //                             <Box sx={{ display: { xs: 'none', md: 'block' } }}><img src={suiIcon} alt="sui" /></Box>
    //                             <Typography >Sui</Typography>
    //                         </Stack>
    //                     </MenuItem>
    //                 </Select>
    //             </Box>
    //             <ConnectButton />
    //         </Box>
    //     </div >
    // );


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
                            backgroundImage: 'linear-gradient(93.57deg, #543DFB 0.71%, #F76CC5 50.59%, #FF4848 97.83%)',
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
                            faucetItems.map((item, index) => (
                                <MenuItem key={index} value={item.value} onClick={() => onGetFaucet(item.value)}>
                                    < Stack
                                        direction={'row'}
                                        alignItems={'center'}
                                        gap={1}
                                        sx={{ '& img': { width: '30px', height: '30px', borderRadius: '50%' } }}
                                    >
                                        <Box sx={{ display: { xs: 'none', md: 'block' } }}><img src={item.logo} alt="aptos" /></Box>
                                        <Typography >{item.tokenName}</Typography>
                                    </Stack>
                                </MenuItem>
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
