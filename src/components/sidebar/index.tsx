import React from 'react';

// material-ui
import { useTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box, Drawer, useMediaQuery } from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';
import { BrowserView, MobileView } from 'react-device-detect';

// project component
import MenuList from './Menu';

// style constant
const useStyles = makeStyles((theme) => ({
    drawerPaper: {
        width: '240px',
        color: theme.palette.text.primary,
    },
    scrollHeight: {
        height: 'calc(100vh - 68px)',
        paddingLeft: '16px',
        paddingRight: '16px',
        [theme.breakpoints.down('sm')]: {
            height: 'calc(100vh - 56px)',
        },
    },
})) as any;

//-----------------------|| SIDEBAR DRAWER ||-----------------------//

const Sidebar = ({ drawerOpen, drawerToggle }) => {
    const classes = useStyles();
    const theme = useTheme();
    const matchUpLg = useMediaQuery(theme.breakpoints.up('lg'));

    const drawer = (
        <React.Fragment>
            <BrowserView>
                <PerfectScrollbar component="div" className={classes.scrollHeight}>
                    <Box sx={{ mt: '20px', ml: '10px' }}>
                        <MenuList />
                    </Box>
                </PerfectScrollbar>
            </BrowserView>
            <MobileView>
                <Box sx={{ mt: '40px', ml: '10px' }}>
                    <MenuList />
                </Box>
            </MobileView>
        </React.Fragment>
    );

    const container = window.document.body;

    return (
        <nav className={classes.drawer}>
            <Drawer
                container={container}
                variant={matchUpLg ? 'persistent' : 'temporary'}
                anchor="left"
                open={drawerOpen}
                onClose={drawerToggle}
                classes={{
                    paper: classes.drawerPaper,
                }}
                ModalProps={{ keepMounted: true }}
                PaperProps={{
                    sx: {
                        backgroundColor: '#241F3E',
                        border: 'none',
                    },
                }}
            >
                {drawer}
            </Drawer>
        </nav>
    );
};

export default Sidebar;
