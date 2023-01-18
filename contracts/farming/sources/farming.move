module ezfinance::farming {
    
    use std::signer;
    
    use aptos_std::math64::pow;

    use aptos_framework::coin;
    use aptos_framework::account;
    use aptos_framework::genesis;
    use aptos_framework::timestamp;
    use aptos_framework::managed_coin;
    use aptos_framework::resource_account;
    use aptos_framework::account::SignerCapability;
    use aptos_framework::aptos_coin::AptosCoin;

    use pancake::math;
    use pancake::swap;
    use pancake::router;
    use pancake::swap_utils;

    use ezfinance::lending;
    use ezfinance::faucet_provider;
    use ezfinance::faucet_tokens::{Self, EZM, WBTC, WETH, USDT, USDC, DAI};


    const ZERO_ACCOUNT: address = @zero;
    // const DEFAULT_ADMIN: address = @default_admin;
    const RESOURCE_ACCOUNT: address = @ezfinance; //MODULE_ADMIN
    const DEV: address = @default_account;


    const MAX_U64: u64 = 18446744073709551615;
    const MINIMUM_LIQUIDITY: u128 = 1000;

    const NOT_ADMIN_PEM: u64 = 0;
    const AMOUNT_ZERO: u64 = 4;

    const ERROR_NOT_CREATED_PAIR: u64 = 1;
    const ERROR_INSUFFICIENT_ASSET: u64 = 2;


    // This struct stores an NFT collection's relevant information
    struct ModuleData has key {
        // Storing the signer capability here, so the module can programmatically sign for transactions
        signer_cap: SignerCapability,
        
        fee_to: address,
        
        supply_amount_x: u64,
        supply_amount_y: u64,
        supply_amount_z: u64,

        borrow_amount_x : u64,
        borrow_amount_y : u64,
        borrow_amount_z : u64,
        
        swap_amount_x_y: u64,
        swap_amount_z_xy: u64,

        add_liquidity_amount_x: u64,
        add_liquidity_amount_y: u64,

        block_timestamp_last: u64,
    }

    fun init_module(sender: &signer) {
        let signer_cap = resource_account::retrieve_resource_account_cap(sender, DEV);
        let resource_signer = account::create_signer_with_capability(&signer_cap);
        move_to(&resource_signer, ModuleData {
            signer_cap,

            fee_to: ZERO_ACCOUNT,

            supply_amount_x: 0,
            supply_amount_y: 0,
            supply_amount_z: 0,

            borrow_amount_x : 0,
            borrow_amount_y : 0,
            borrow_amount_z : 0,
            
            swap_amount_x_y: 0,
            swap_amount_z_xy: 0,

            add_liquidity_amount_x: 0,
            add_liquidity_amount_y: 0,

            block_timestamp_last: 0,
        });


        // create pair in pancake-swap
        // <(WBTC, WETH, USDT, USDC, DAI), AptosCoin>
        router::create_pair<WBTC, AptosCoin>(sender);
        router::create_pair<WETH, AptosCoin>(sender);
        router::create_pair<USDT, AptosCoin>(sender);
        router::create_pair<USDC, AptosCoin>(sender);
        router::create_pair<DAI, AptosCoin>(sender);
    }

    /// Leverage Yield Farming, create pair if it's needed
    //X, Y=APT: to be requidity
    //X, Y=APT, EZM: supply
    //amountSupplyPairX
    //amountSupplyPairY
    //amountSupplyEZM
    //amountBorrowPairX
    //amountBorrowPairY
    //amountBorrowEZM
    public entry fun leverage_yield_farming<X, Y>(
        sender: &signer, 
        amountSupplyPairX: u64,
        amountSupplyPairY: u64,
        amountSupplyEZM: u64,
        amountBorrowPairX: u64,
        amountBorrowPairY: u64,
        amountBorrowEZM: u64,
    ) acquires ModuleData {

        assert!(swap::is_pair_created<X, Y>() || swap::is_pair_created<Y, X>(), ERROR_NOT_CREATED_PAIR);
        assert!(swap::is_pair_created<EZM, X>() || swap::is_pair_created<X, EZM>(), ERROR_NOT_CREATED_PAIR);              
        assert!(swap::is_pair_created<EZM, Y>() || swap::is_pair_created<Y, EZM>(), ERROR_NOT_CREATED_PAIR);
        
        let moduleData = borrow_global_mut<ModuleData>(RESOURCE_ACCOUNT);
        let resource_signer = account::create_signer_with_capability(&moduleData.signer_cap);
        let resource_account_addr = signer::address_of(&resource_signer);


        //Widraw from resource_account
        if (amountSupplyPairX > 0) {
            let balance_x = coin::balance<X>(signer::address_of(sender));
            assert!(balance_x > amountSupplyPairX, ERROR_INSUFFICIENT_ASSET);
            let input_x_coin = coin::withdraw<X>(sender, amountSupplyPairX);
            coin::deposit<X>(RESOURCE_ACCOUNT, input_x_coin);

            moduleData.supply_amount_x = amountSupplyPairX;
        };

        if (amountSupplyPairY > 0) {
            let balance_y = coin::balance<Y>(signer::address_of(sender));
            assert!(balance_y > amountSupplyPairY, ERROR_INSUFFICIENT_ASSET);
            let input_y_coin = coin::withdraw<Y>(sender, amountSupplyPairY);
            coin::deposit<Y>(RESOURCE_ACCOUNT, input_y_coin);

            moduleData.supply_amount_y = amountSupplyPairY;
        };

        if (amountSupplyEZM > 0) {
            let balance_ezm = coin::balance<EZM>(signer::address_of(sender));
            assert!(balance_ezm > amountSupplyEZM, ERROR_INSUFFICIENT_ASSET);
            let input_ezm_coin = coin::withdraw<EZM>(sender, amountSupplyEZM);
            coin::deposit<EZM>(RESOURCE_ACCOUNT, input_ezm_coin);

            moduleData.supply_amount_z = amountSupplyEZM;
        };


        // //Borrow
        if (amountBorrowPairX > 0) {
            lending::borrow<X>(&resource_signer, amountBorrowPairX);

            moduleData.borrow_amount_x = amountBorrowPairX;
        };

        if (amountBorrowPairY > 0) {
            lending::borrow<Y>(&resource_signer, amountBorrowPairY);

            moduleData.borrow_amount_y = amountBorrowPairY;
        };

        if (amountBorrowEZM > 0) {
            lending::borrow<EZM>(&resource_signer, amountBorrowEZM);

            moduleData.borrow_amount_z = amountBorrowEZM;
        };


        let token_x_before_balance = coin::balance<X>(RESOURCE_ACCOUNT);
        let token_y_before_balance = coin::balance<Y>(RESOURCE_ACCOUNT);


        // //Balanced swap: X/2 -> Y, Y/2 -> X
        if ((amountSupplyPairX + amountBorrowPairX)/2 > 0) {
            router::swap_exact_input<X, Y>(&resource_signer, (amountSupplyPairX + amountBorrowPairX)/2, 0);
            router::swap_exact_input<Y, X>(&resource_signer, (amountSupplyPairY + amountBorrowPairY)/2, 0);

            moduleData.swap_amount_x_y = (amountSupplyPairX + amountBorrowPairX)/2;
        };


        // //swap EZM
        if ((amountSupplyEZM + amountBorrowEZM)/2 > 0) {
            router::swap_exact_input<EZM, X>(&resource_signer, (amountSupplyEZM + amountBorrowEZM)/2, 0);
            router::swap_exact_input<EZM, Y>(&resource_signer, (amountSupplyEZM + amountBorrowEZM)/2, 0);

            moduleData.swap_amount_z_xy = (amountSupplyEZM + amountBorrowEZM)/2;
        };


        // //add liquidity
        let token_x_after_balance = coin::balance<X>(RESOURCE_ACCOUNT);
        let token_y_after_balance = coin::balance<Y>(RESOURCE_ACCOUNT);

        let amountAddX = amountSupplyPairX + token_x_after_balance - token_x_before_balance;
        let amountAddY = amountSupplyPairY + token_y_after_balance - token_y_before_balance;
        if (amountAddX > 0 && amountAddY > 0) {
            router::add_liquidity<X, Y>(&resource_signer, amountAddX, amountAddY, 0, 0);

            moduleData.add_liquidity_amount_x = amountAddX;
            moduleData.add_liquidity_amount_y = amountAddY;

            moduleData.block_timestamp_last = timestamp::now_seconds();
        };
    }
}

