import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/system';

const StyledButton = styled(Button)({
    // background: 'linear-gradient(93.41deg, #6452DE 0.68%, #F76CC5 53.61%, #FF6F6F 103.74%)',
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

export const Common_FillButton = (props: any) => {
    const { content, ...other } = props;

    return <StyledButton {...other}>{content}</StyledButton>;
};

export const Common_OutlineButton = (props: any) => {
    const { content, ...othe } = props;

    return <OutlineStyledButton {...othe}>{content}</OutlineStyledButton>;
};
