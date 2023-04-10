import React from 'react';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) => ({
    root: {
        width: '100%',
        padding: '30px',
        [theme.breakpoints.down('sm')]: {
            padding: '0',
        },
    },
}));

export default function Container({ children }: { children: React.ReactNode }) {
    const classes = useStyles();
    return <Box className={classes.root}>
        {children}
    </Box>;
}
