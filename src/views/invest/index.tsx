import React, { useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import Container from '../../components/container';
import Part1 from './components/part1';
import Part2 from './components/part2';
import Part3 from './components/part3';
import Part4 from './components/part4';

import BTCIcon from '../../asset/icons/crypto-btc.png';
import EthIcon from '../../asset/icons/crypto-ethereum.png';
import USDCIcon from '../../asset/icons/crypto-usdc.png';
import USDTIcon from '../../asset/icons/crypto-usdt.png';
import DaiIcon from '../../asset/icons/crypto-dai.svg';

const useStyles = makeStyles((theme: any) => ({
    root: {
        color: 'white',
        '& h6': {
            fontSize: '18px',
            fontWeight: 500,
            opacity: '.6',
        },
        '& .header': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            '@media(max-width: 960px)': {
                flexDirection: 'column',
                gap: 20,
                textAlign: 'center',
            },
        },
        '& .content': {
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            marginTop: '20px',
            flexWrap: 'wrap',
            gap: '20px',
            // '& .MuiSwitch-thumb': {
            //     background: 'linear-gradient(93.41deg, #6452DE 0.68%, #F76CC5 53.61%, #FF6F6F 103.74%)',
            // },
            // '& .MuiSlider-thumbColorPrimary': {
            //     display: 'none',
            // },
            '& .modal4': {
                // padding: '40px',
                // background: '#342D55',
                // borderRadius: '15px',
            },
        },
    },
    devideLine: {
        background: 'white',
        height: '1px',
        opacity: '.5',
        margin: '20px 0',
    },
}));

export default function Invest() {
    const { poolid } = useParams();
    const classes = useStyles();

    const [selectValue, setSelectValue] = useState('dai');

    const [index, setIndex] = useState(0);
    const [token, setToken] = useState('dai');
    const [valueEZM, setValueEZM] = useState('0');
    const [valueAPT, setValueAPT] = useState('0');
    const [valueLP, setValueLP] = useState('0');
    const [valueDolarEZM, setValueDolarEZM] = useState(0);
    const [valueDolarAPT, setValueDolarAPT] = useState(0);
    const [valueDolarLP, setValueDolarLP] = useState(0);

    const [valueBorrowEZM, setValueBorrowEZM] = useState(0);
    const [valueBorrowAPT, setValueBorrowAPT] = useState(0);
    const [valueBorrowLP, setValueBorrowLP] = useState(0);
    const [valueBorrowDolarEZM, setValueBorrowDolarEZM] = useState(0);
    const [valueBorrowDolarAPT, setValueBorrowDolarAPT] = useState(0);
    const [valueBorrowDolarLP, setValueBorrowDolarLP] = useState(0);

    const [valueSupplyEZM, setValueSupplyEZM] = useState(0);
    const [valueSupplyAPT, setValueSupplyAPT] = useState(0);
    const [valueSupplyLP, setValueSupplyLP] = useState(0);
    const [valueTotalSupply, setValueTotalSupply] = useState(0);
    const [valueDebtA, setValueDebtA] = useState(0.056432);
    const [valueDebtB, setValueDebtB] = useState(0.056432);
    const [valueDolarDebtA, setValueDolarDebtA] = useState(0);
    const [valueDolarDebtB, setValueDolarDebtB] = useState(0);
    const [valueTotalDebt, setValueTotalDebt] = useState(0);

    const [amount, setAmount] = useState(0);
    const [valueLeverage, setValueLeverage] = useState<number | string | Array<number | string>>(1);
    const [debt, setDebt] = useState<number | string | Array<number | string>>(0);
    const [estimatiedAPR, setAPR] = useState(0)

    const coins = {
        0: { img: BTCIcon, name: 'WBTC', symbol: 'wbtc' },
        1: { img: EthIcon, name: 'WETH', symbol: 'weth' },
        2: { img: DaiIcon, name: 'DAI', symbol: 'dai' },
        3: { img: USDCIcon, name: 'USDC', symbol: 'usdc' },
        4: { img: USDTIcon, name: 'USDT', symbol: 'usdt' },
        5: { img: USDCIcon, name: 'ceUSDC', symbol: 'ceusdc' },
    };

    const strArr: any = React.useMemo(() => {
        return poolid?.split('-');
    }, [poolid]);

    return (
        <Container>
            <Box className={classes.root}>
                <Box className={'header'}>
                    <Stack direction={'column'} justifyContent="center" gap={1}>
                        <Stack direction={'row'} alignItems="center" gap={2}>
                            <Stack
                                direction={'row'}
                                alignItems={'center'}
                                sx={{ '& img': { width: '40px', height: '40px', borderRadius: '50%' } }}
                            >
                                <img src={coins[Number(strArr[0])].img} alt="" />
                                <img src={coins[Number(strArr[1])].img} alt="" style={{ marginLeft: '-15px' }} />
                            </Stack>
                            <Typography variant="h4">
                                {coins[Number(strArr[0])].name}/{coins[Number(strArr[1])].name}
                            </Typography>
                        </Stack>
                        <Typography variant="subtitle1">Yield farming on LiquidSwap</Typography>
                    </Stack>

                    <Stack
                        direction={'row'}
                        alignItems="center"
                        gap={6}
                        sx={{
                            '@media(max-width: 650px)': {
                                flexDirection: 'column',
                                gap: 1,
                                textAlign: 'center',
                            },
                        }}
                    >
                        <Box>
                            <Typography variant="subtitle1">Positions</Typography>
                            <Typography variant="h5">9</Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle1">TVL via EZ</Typography>
                            <Typography variant="h5">$5,435.43</Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle1">TVL on Sushiswap</Typography>
                            <Typography variant="h5">$12,422,434.54</Typography>
                        </Box>
                    </Stack>
                </Box>

                <Box className={'content'}>
                    <Box
                        sx={{
                            flex: '3',
                            minWidth: '540px',
                            '@media(max-width: 600px)': {
                                minWidth: 'unset',
                                width: '100%',
                            },
                        }}
                    >
                        <Part1
                            imga={coins[Number(strArr[0])].img}
                            imgb={coins[Number(strArr[1])].img}
                            namea={coins[Number(strArr[0])].symb}
                            nameb={coins[Number(strArr[1])].name}
                            selectValue={selectValue}
                            setSelectValue={setSelectValue}
                            valueLeverage={valueLeverage}
                            setValueLeverage={setValueLeverage}
                            token={token}
                            setToken={setToken}
                            amount={amount}
                            setAmount={setAmount}

                            valueEZM={valueEZM}
                            setValueEZM={setValueEZM}
                            valueAPT={valueAPT}
                            setValueAPT={setValueAPT}
                            valueLP={valueLP}
                            setValueLP={setValueLP}

                            valueDolarEZM={valueDolarEZM}
                            setValueDolarEZM={setValueDolarEZM}
                            valueDolarAPT={valueDolarAPT}
                            setValueDolarAPT={setValueDolarAPT}
                            valueDolarLP={valueDolarLP}
                            setValueDolarLP={setValueDolarLP}

                            valueTotalSupply={valueTotalSupply}
                            setValueTotalSupply={setValueTotalSupply}
                        />
                        <Part2
                            selectValue={selectValue}
                            setSelectValue={setSelectValue}
                            valueLeverage={valueLeverage}
                            setValueLeverage={setValueLeverage}
                            token={token}
                            amount={amount}
                            setToken={setToken}
                            setAmount={setAmount}
                            debt={debt}
                            setDebt={setDebt}
                            estimatiedAPR={estimatiedAPR}
                            setAPR={setAPR}

                            valueBorrowEZM={valueBorrowEZM}
                            setValueBorrowEZM={setValueBorrowEZM}
                            valueBorrowAPT={valueBorrowAPT}
                            setValueBorrowAPT={setValueBorrowAPT}
                            valueBorrowLP={valueBorrowLP}
                            setValueBorrowLP={setValueBorrowLP}

                            valueBorrowDolarEZM={valueBorrowDolarEZM}
                            setValueBorrowDolarEZM={setValueBorrowDolarEZM}
                            valueBorrowDolarAPT={valueBorrowDolarAPT}
                            setValueBorrowDolarAPT={setValueBorrowDolarAPT}
                            valueBorrowDolarLP={valueBorrowDolarLP}
                            setValueBorrowDolarLP={setValueBorrowDolarLP}

                            valueEZM={valueEZM}
                            setValueEZM={setValueEZM}
                            valueAPT={valueAPT}
                            setValueAPT={setValueAPT}
                            valueLP={valueLP}
                            setValueLP={setValueLP}

                            valueDolarEZM={valueDolarEZM}
                            setValueDolarEZM={setValueDolarEZM}
                            valueDolarAPT={valueDolarAPT}
                            setValueDolarAPT={setValueDolarAPT}
                            valueDolarLP={valueDolarLP}
                            setValueDolarLP={setValueDolarLP}

                            valueSupplyEZM={valueSupplyEZM}
                            setValueSupplyEZM={setValueSupplyEZM}
                            valueSupplyAPT={valueSupplyAPT}
                            setValueSupplyAPT={setValueSupplyAPT}
                            valueSupplyLP={valueSupplyLP}
                            setValueSupplyLP={setValueSupplyLP}
                            valueTotalSupply={valueTotalSupply}
                            setValueTotalSupply={setValueTotalSupply}

                            valueDebtA={valueDebtA}
                            setValueDebtA={setValueDebtA}
                            valueDebtB={valueDebtB}
                            setValueDebtB={setValueDebtB}
                            valueDolarDebtA={valueDolarDebtA}
                            setValueDolarDebtA={setValueDolarDebtA}
                            valueDolarDebtB={valueDolarDebtB}
                            setValueDolarDebtB={setValueDolarDebtB}
                            valueTotalDebt={valueTotalDebt}
                            setValueTotalDebt={setValueTotalDebt}
                        />
                        <Part3
                            imga={coins[Number(strArr[0])].img}
                            imgb={coins[Number(strArr[1])].img}
                            namea={coins[Number(strArr[0])].name}
                            nameb={coins[Number(strArr[1])].name}
                            index={index}
                            setIndex={setIndex}
                            amount={amount}
                            valueLeverage={valueLeverage}
                            setValueLeverage={setValueLeverage}
                            debt={debt}
                            setDebt={setDebt}

                            valueBorrowEZM={valueBorrowEZM}
                            setValueBorrowEZM={setValueBorrowEZM}
                            valueBorrowAPT={valueBorrowAPT}
                            setValueBorrowAPT={setValueBorrowAPT}
                            valueBorrowLP={valueBorrowLP}
                            setValueBorrowLP={setValueBorrowLP}

                            valueBorrowDolarEZM={valueBorrowDolarEZM}
                            setValueBorrowDolarEZM={setValueBorrowDolarEZM}
                            valueBorrowDolarAPT={valueBorrowDolarAPT}
                            setValueBorrowDolarAPT={setValueBorrowDolarAPT}
                            valueBorrowDolarLP={valueBorrowDolarLP}
                            setValueBorrowDolarLP={setValueBorrowDolarLP}

                            valueEZM={valueEZM}
                            setValueEZM={setValueEZM}
                            valueAPT={valueAPT}
                            setValueAPT={setValueAPT}
                            valueLP={valueLP}
                            setValueLP={setValueLP}

                            valueDolarEZM={valueDolarEZM}
                            setValueDolarEZM={setValueDolarEZM}
                            valueDolarAPT={valueDolarAPT}
                            setValueDolarAPT={setValueDolarAPT}
                            valueDolarLP={valueDolarLP}
                            setValueDolarLP={setValueDolarLP}
                        />
                    </Box>

                    <Box
                        sx={{
                            flex: '2',
                            minWidth: '450px',
                            '@media(max-width: 600px)': {
                                minWidth: 'unset',
                                width: '100%',
                            },
                        }}
                    >
                        <Part4
                            imga={coins[Number(strArr[0])].img}
                            imgb={coins[Number(strArr[1])].img}
                            namea={coins[Number(strArr[0])].symbol}
                            nameb={coins[Number(strArr[1])].symbol}
                            index={index}
                            setIndex={setIndex}
                            token={token}
                            amount={amount}
                            valueLeverage={valueLeverage}
                            setValueLeverage={setValueLeverage}
                            debt={debt}
                            setDebt={setDebt}
                            estimatiedAPR={estimatiedAPR}
                            setAPR={setAPR}

                            valueEZM={valueEZM}
                            setValueEZM={setValueEZM}
                            valueAPT={valueAPT}
                            setValueAPT={setValueAPT}
                            valueLP={valueLP}
                            setValueLP={setValueLP}

                            valueDolarEZM={valueDolarEZM}
                            setValueDolarEZM={setValueDolarEZM}
                            valueDolarAPT={valueDolarAPT}
                            setValueDolarAPT={setValueDolarAPT}
                            valueDolarLP={valueDolarLP}
                            setValueDolarLP={setValueDolarLP}

                            valueSupplyEZM={valueSupplyEZM}
                            setValueSupplyEZM={setValueSupplyEZM}
                            valueSupplyAPT={valueSupplyAPT}
                            setValueSupplyAPT={setValueSupplyAPT}
                            valueSupplyLP={valueSupplyLP}
                            setValueSupplyLP={setValueSupplyLP}
                            valueTotalSupply={valueTotalSupply}
                            setValueTotalSupply={setValueTotalSupply}

                            valueDebtA={valueDebtA}
                            setValueDebtA={setValueDebtA}
                            valueDebtB={valueDebtB}
                            setValueDebtB={setValueDebtB}
                            valueDolarDebtA={valueDolarDebtA}
                            setValueDolarDebtA={setValueDolarDebtA}
                            valueDolarDebtB={valueDolarDebtB}
                            setValueDolarDebtB={setValueDolarDebtB}
                            valueTotalDebt={valueTotalDebt}
                            setValueTotalDebt={setValueTotalDebt}
                        />
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
