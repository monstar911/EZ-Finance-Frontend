import React from 'react';
import Bill from './components/Bill';
import DataBoard from './components/DataBoard';
import Market from './components/Market';
import OverView from './components/OverView';

function Lend() {
    return (
        <div>
            <DataBoard />
            <OverView />
            <Bill />
            <Market />
        </div>
    )
}

export default Lend;
