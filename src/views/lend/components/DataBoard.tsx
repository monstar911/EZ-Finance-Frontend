import React, { useContext } from 'react';
import BankIcon from '../../../asset/icons/bank.svg';
import WalletIcon from '../../../asset/icons/wallet.svg';
import PiehartIcon from '../../../asset/icons/pie-chart.svg';
import Piehart1Icon from '../../../asset/icons/pie-chart1.svg';

import { Box, Typography } from '@mui/material';
import { Web3Context, IAptosInterface } from '../../../context/Web3Context';
import { formatValue } from '../../../helper/formatValue';

function DataBoard() {
    const aptosContext = useContext(Web3Context) as IAptosInterface;
    const arcPrice = aptosContext.tokenPrice.arc;
    const aptosPrice = aptosContext.tokenPrice.aptos;
    const poolInfo = aptosContext.poolInfo;
    const totalDeposit = poolInfo.aptos.totalDeposit * aptosPrice + poolInfo.arc.totalDeposit * arcPrice;
    const totalBorrow = poolInfo.aptos.totalBorrow * aptosPrice + poolInfo.arc.totalBorrow * arcPrice;

    const datas = [
        {
            text: 'Total Deposited',
            logo: BankIcon,
            value: formatValue(totalDeposit, 2),
        },
        {
            text: 'Total Borrowed',
            logo: WalletIcon,
            value: formatValue(totalBorrow, 2),
        },
        {
            text: 'Market Cap',
            logo: PiehartIcon,
            value: '250K',
        },
        {
            text: 'ARC Price',
            logo: Piehart1Icon,
            value: arcPrice,
        },
    ];

    return (
        <div>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                }}
            >
                {datas.map((item, index) => (
                    <Box
                        key={index}
                        sx={{
                            bgcolor: '#FFF',
                            boxShadow: '0px 1px 4px #ccc',
                            borderRadius: '9999px',
                            padding: '30px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '200px',
                            height: '200px',
                            mx: 2,
                            mb: 2,
                        }}
                    >
                        <img src={item.logo} alt="logo" style={{ width: '32px', height: '32px' }} />
                        <Typography sx={{ fontSize: '24px', mt: 1, color: '#555' }}>$ {item.value}</Typography>
                        <Typography sx={{ color: '#666' }}>{item.text}</Typography>
                    </Box>
                ))}
            </Box>
        </div>
    );
}

export default DataBoard;
