import { makeStyles } from '@mui/styles';
import { useMediaQuery } from '@mui/material';
import React, { useState } from 'react';
import Header from '../header';
import Sidebar from '../sidebar';
import clsx from 'clsx';
import BgImage from '../../asset/icons/bgImage.png';

interface IViewBaseProps {
    children: React.ReactNode;
}

const useStyles = makeStyles((theme) => ({
    content: {
        marginTop: '80px',
        marginLeft: '280px',
        padding: '20px',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: 1000,
        }),
        width: `calc(100% - ${280}px)`,
        [theme.breakpoints.down('lg')]: {
            marginLeft: '20px',
            width: `calc(100% - ${40}px)`,
            padding: '0px',
            paddingTop: '20px',
        },
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: 1000,
        }),
        paddingLeft: 0,
    },
})) as any;

function ViewBase({ children }: IViewBaseProps) {
    const classes = useStyles();
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const isUpMd = useMediaQuery('(min-width: 1200px)');

    return (
        <div style={{ backgroundImage: BgImage }}>
            <Header handleDrawerToggle={handleDrawerToggle} title="lend" />
            {isUpMd ? (
                <Sidebar drawerOpen={true} drawerToggle={handleDrawerToggle} />
            ) : (
                <Sidebar drawerOpen={mobileOpen} drawerToggle={handleDrawerToggle} />
            )}
            {/* main content */}
            <main
                className={clsx([
                    classes.content,
                    {
                        [classes.contentShift]: !isUpMd,
                    },
                ])}
            >
                <div>{children}</div>
            </main>
        </div>
    );
}

export default ViewBase;
