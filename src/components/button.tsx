import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/system';

const StyledButton = styled(Button)({
    background: 'linear-gradient(90deg,#6e42ca,#8d29c1)',
    borderRadius: '100px',
    color: 'white',
    padding: '14px 33px',
    fontSize: '18px',
    lineHeight: '23px',
});

const OutlineStyledButton = styled(Button)({
    background: 'transparent',
    borderRadius: '100px',
    color: 'white',
    border: '1px solid #ddd',
    padding: '14px 33px',
    fontSize: '18px',
    lineHeight: '23px',
});

export const CommonFillButton = (props: any) => {
    const { content, ...other } = props;

    return <StyledButton {...other}>{content}</StyledButton>;
};

export const CommonOutlineButton = (props: any) => {
    const { content, ...othe } = props;

    return <OutlineStyledButton {...othe}>{content}</OutlineStyledButton>;
};
