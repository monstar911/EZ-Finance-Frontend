import React, { useCallback, useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { NavLink, useLocation } from 'react-router-dom';
import { Link } from '@mui/material';

import SwapIcon from '../../asset/icons/swap.png';
import FarmIcon from '../../asset/icons/farm.png';
import DocsIcon from '../../asset/icons/docs.svg';
import HomeIcon from '../../asset/icons/home.png';
import GovernIcon from '../../asset/icons/govern.png';
import LendIcon from '../../asset/icons/lend2.png';
import { Typography } from '@mui/material';
import Logo from '../../asset/icons/Logo.png'

const useStyles = makeStyles((theme: any) => ({
    menuList: {
        '& .MuiTypography-root': {
            fontSize: '18px',
            fontFamily: 'Square',
            fontWeight: 500,
            lineHeight: '55px',
            color: '#FFF',
        },
    },
})) as any;

const menuList = [
    {
        title: 'Home',
        param: 'home',
        logo: HomeIcon,
    },
    {
        title: 'Farm Pools',
        param: 'farm',
        logo: FarmIcon,
    },
    {
        title: 'Your Position',
        param: 'position',
        logo: SwapIcon,
    },
    {
        title: 'Pool TVL',
        param: 'tvl',
        logo: GovernIcon,
    },
    {
        title: 'Lend',
        param: 'lend',
        logo: LendIcon,
    },
    // {
    //     title: 'Invest',
    //     param: 'invest',
    //     logo: Invest,
    // },
    {
        title: 'Docs',
        logo: DocsIcon,
        external: true,
        url: '',
    },
];

function MenuList() {
    const classes = useStyles();
    const [menu, setMenu] = useState('lend');
    const location = useLocation();

    const checkPage = useCallback((url: string): string => {
        const path = url.replace('/', '');
        if (path.indexOf('home') >= 0) {
            return 'home';
        } else if (path.indexOf('farm') >= 0) {
            return 'farm';
        } else if (path.indexOf('invest') >= 0) {
            return 'invest';
        } else if (path.indexOf('tvl') >= 0) {
            return 'tvl';
        } else if (path.indexOf('position') >= 0) {
            return 'position';
        } else if (path.indexOf('lend') >= 0) {
            return 'lend'
        }
        return '';
    }, []);

    useEffect(() => {
        const { pathname } = location;
        const menu = checkPage(pathname);
        setMenu(menu);
    }, [location]);

    return (
        <div className={classes.menuList}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img src={Logo} alt='logo' style={{ width: '60px', height: '60px' }} />
                <Typography textAlign="center" sx={{ fontSize: '24px !important', fontWeight: 'bold', mb: 0.5, ml: 1 }}>
                    ez finance
                </Typography>
            </Box>
            <Box sx={{ mt: 5 }}>
                {menuList?.map((item, index) =>
                    item.external ? (
                        <Link
                            key={index}
                            target="_blank"
                            href={item.url}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mt: 1,
                                borderRadius: '15px',
                                textDecoration: 'none',
                                backgroundImage:
                                    menu === item.param
                                        // ? 'linear-gradient(93.57deg, #543DFB 0.71%, #F76CC5 50.59%, #FF4848 97.83%)'
                                        ? 'linear-gradient(90deg,#6e42ca,#8d29c1)'
                                        : 'transparent',
                            }}
                        >
                            <img
                                src={item.logo}
                                style={{ width: '16px', height: '16px', margin: '15px 20px' }}
                                alt="menu_logo"
                            />
                            <Typography>{item.title}</Typography>
                        </Link>
                    ) : (
                        <Link
                            key={index}
                            component={NavLink}
                            to={`${item.param}`}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mt: 1,
                                borderRadius: '15px',
                                textDecoration: 'none',
                                backgroundImage:
                                    menu === item.param
                                        // ? 'linear-gradient(93.57deg, #543DFB 0.71%, #F76CC5 50.59%, #FF4848 97.83%)'
                                        ? 'linear-gradient(90deg,#6e42ca,#8d29c1)'
                                        : 'transparent',
                            }}
                        >
                            <img
                                src={item.logo}
                                style={{ width: '16px', height: '16px', margin: '15px 20px' }}
                                alt="menu_logo"
                            />
                            <Typography>{item.title}</Typography>
                        </Link>
                    )
                )}
            </Box>
        </div >
    );
}

export default MenuList;
