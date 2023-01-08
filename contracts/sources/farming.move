module ezfinance::farming {
    
    use std::signer;

    use ezfinance::faucet_tokens::{Self, EZM, USDC, USDT, WETH, WBTC, CEUSDC, DAI};

    use aptos_framework::account;
    use aptos_framework::coin;
    use aptos_framework::genesis;
    use aptos_framework::resource_account;
    use aptos_framework::managed_coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::timestamp;

    use aptos_std::math64::pow;

    use ezfinance::swap::{Self, LPToken};
    use ezfinance::router;
    use ezfinance::math;
    use ezfinance::swap_utils;

    use ezfinance::lending;
    use ezfinance::faucet_provider;


    const MAX_U64: u64 = 18446744073709551615;
    const MINIMUM_LIQUIDITY: u128 = 1000;

    const MODULE_ADMIN: address = @ezfinance;

    const NOT_ADMIN_PEM: u64 = 0;
    const AMOUNT_ZERO: u64 = 4;


    // fun init_module(sender: &signer) {

    //     let account_addr = signer::address_of(sender);
    //     let amount = 1000000000000000000u64;
    //     let per_request = 1000000000u64;
    //     let period = 3000u64;
    //     //Deposite Pool Token 8000 at the startup
    //     managed_coin::register<faucet_tokens::EZM>(sender);
    //     managed_coin::mint<faucet_tokens::EZM>(sender,account_addr,amount);
    //     faucet_provider::create_faucet<faucet_tokens::EZM>(sender,amount/2,per_request,period);
    //     let coin1 = coin::withdraw<faucet_tokens::EZM>(sender, 0);        
    //     let pool1 = Pool<faucet_tokens::EZM> {borrowed_amount: 0, deposited_amount: 0, token: coin1};
    //     move_to(sender, pool1);
    // }

    //Z: supply
    //X, Y: to be requidity
    //valLeverage
    //amount_z: amount of Z
    public entry fun leverage_yield_farming<X, Y, Z>(
        sender: &signer, 
        amount_z: u64
    ) {

        // assert!(exists<Pool<X>>(MODULE_ADMIN), COIN_NOT_EXIST);
        // assert!(exists<Pool<Y>>(MODULE_ADMIN), COIN_NOT_EXIST);
        // assert!(exists<Pool<Z>>(MODULE_ADMIN), COIN_NOT_EXIST);

        assert!(amount_z > 0, AMOUNT_ZERO);

        let amount_x = amount_z;
        let amount_y = amount_z;

        // if (type_of(Z) == type_of(X)) {
        //     let coin_x = coin::withdraw<X>(sender, amount_z);
        //     amount_x = coin_x - amount_z;
        //     lending::borrow<X>(sender, amount_x);
        // } else if (type_of(Z) == type_of(Y)) {
        //     let coin_y = coin::withdraw<X>(sender, amount_z);
        //     amount_y = coin_y - amount_z;
        //     lending::borrow<Y>(sender, amount_y);
        // } else {
        //     lending::borrow<Z>(sender, 2*amount_z);
        // };
        
        // swap::swap<X, Y>(amount_x, amount_y);
        // router::add_liquidity<X, Y>(sender, amount_x, amount_y, 0, 0);
    }
}

