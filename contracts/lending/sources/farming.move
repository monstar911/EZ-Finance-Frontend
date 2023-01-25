module ezfinance::farming {
    
    use std::signer;
    use std::string;
    
    use aptos_std::math64::pow;

    use aptos_framework::coin;
    use aptos_framework::account;
    use aptos_framework::genesis;
    use aptos_framework::timestamp;
    use aptos_framework::managed_coin;
    use aptos_framework::resource_account;
    use aptos_framework::account::SignerCapability;
    use aptos_framework::aptos_coin::AptosCoin;

    use pancake::swap as swap_pan;
    use pancake::router as router_pan;

    use liquid::swap as swap_liq;
    use liquid::router as router_liq;

    use auxexchange::swap as swap_aux;
    use auxexchange::router as router_aux;
    
    use ezfinance::lending;
    use ezfinance::faucet_provider;
    use ezfinance::faucet_tokens::{Self, EZM, WBTC, WETH, USDT, USDC, SOL, BNB};


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


    struct PositionInfo<phantom X, phantom Y> has key {
        position_count: u64,
    }

    // This struct stores an NFT collection's relevant information
    struct ModuleData has key {
        // Storing the signer capability here, so the module can programmatically sign for transactions
        signer_cap: SignerCapability,
        
        position_count_pan: u64,
        position_count_liq: u64,
        position_count_aux: u64,

        fee_to_pan: address,
        fee_to_liq: address,
        fee_to_aux: address,
        
        supply_amount_x_pan: u64,
        supply_amount_y_pan: u64,
        supply_amount_z_pan: u64,
        supply_amount_x_liq: u64,
        supply_amount_y_liq: u64,
        supply_amount_z_liq: u64,
        supply_amount_x_aux: u64,
        supply_amount_y_aux: u64,
        supply_amount_z_aux: u64,

        borrow_amount_x_pan : u64,
        borrow_amount_y_pan : u64,
        borrow_amount_z_pan : u64,
        borrow_amount_x_liq : u64,
        borrow_amount_y_liq : u64,
        borrow_amount_z_liq : u64,
        borrow_amount_x_aux : u64,
        borrow_amount_y_aux : u64,
        borrow_amount_z_aux : u64,
        
        swap_amount_x_y_pan: u64,
        swap_amount_y_x_pan: u64,
        swap_amount_z_xy_pan: u64,
        swap_amount_x_y_liq: u64,
        swap_amount_y_x_liq: u64,
        swap_amount_z_xy_liq: u64,
        swap_amount_x_y_aux: u64,
        swap_amount_y_x_aux: u64,
        swap_amount_z_xy_aux: u64,

        add_liquidity_amount_x_pan: u64,
        add_liquidity_amount_y_pan: u64,
        add_liquidity_amount_x_liq: u64,
        add_liquidity_amount_y_liq: u64,
        add_liquidity_amount_x_aux: u64,
        add_liquidity_amount_y_aux: u64,

        block_timestamp_last_pan: u64,
        block_timestamp_last_liq: u64,
        block_timestamp_last_aux: u64,
    }

    fun init_module(sender: &signer) {
        let signer_cap = resource_account::retrieve_resource_account_cap(sender, DEV);
        let resource_signer = account::create_signer_with_capability(&signer_cap);
        move_to(&resource_signer, ModuleData {
            signer_cap,
            
            position_count_pan: 0,
            position_count_liq: 0,
            position_count_aux: 0,

            fee_to_pan: ZERO_ACCOUNT,
            fee_to_liq: ZERO_ACCOUNT,
            fee_to_aux: ZERO_ACCOUNT,
            
            supply_amount_x_pan: 0,
            supply_amount_y_pan: 0,
            supply_amount_z_pan: 0,
            supply_amount_x_liq: 0,
            supply_amount_y_liq: 0,
            supply_amount_z_liq: 0,
            supply_amount_x_aux: 0,
            supply_amount_y_aux: 0,
            supply_amount_z_aux: 0,

            borrow_amount_x_pan : 0,
            borrow_amount_y_pan : 0,
            borrow_amount_z_pan : 0,
            borrow_amount_x_liq : 0,
            borrow_amount_y_liq : 0,
            borrow_amount_z_liq : 0,
            borrow_amount_x_aux : 0,
            borrow_amount_y_aux : 0,
            borrow_amount_z_aux : 0,
            
            swap_amount_x_y_pan: 0,
            swap_amount_y_x_pan: 0,
            swap_amount_z_xy_pan: 0,
            swap_amount_x_y_liq: 0,
            swap_amount_y_x_liq: 0,
            swap_amount_z_xy_liq: 0,
            swap_amount_x_y_aux: 0,
            swap_amount_y_x_aux: 0,
            swap_amount_z_xy_aux: 0,

            add_liquidity_amount_x_pan: 0,
            add_liquidity_amount_y_pan: 0,
            add_liquidity_amount_x_liq: 0,
            add_liquidity_amount_y_liq: 0,
            add_liquidity_amount_x_aux: 0,
            add_liquidity_amount_y_aux: 0,

            block_timestamp_last_pan: 0,
            block_timestamp_last_liq: 0,
            block_timestamp_last_aux: 0,
        });


        // create pair in pancake-swap
        // 1. APT/USDC
        // 2. WETH/USDC
        // 3. Cake/APT
        // 4. BNB/USDC
        // 5. USDC/USDT
        router_pan::create_pair<AptosCoin, USDC>(sender);
        router_pan::create_pair<WETH, USDC>(sender);
        // router_pan::create_pair<CAKE, AptosCoin>(sender);
        router_pan::create_pair<BNB, USDC>(sender);
        router_pan::create_pair<USDC, USDT>(sender);

        // create pair in liquid-swap
        // 1. APT/USDC
        // 2. Weth/USDC
        // 3. Weth/apt
        // 4. Wbtc/apt
        router_liq::create_pair<AptosCoin, USDC>(sender);
        router_liq::create_pair<WETH, USDC>(sender);
        router_liq::create_pair<WETH, AptosCoin>(sender);
        router_liq::create_pair<WBTC, AptosCoin>(sender);

        // create pair in aux-exchange
        // 1. APT/USDC 
        // 2. Sol/USDC
        // 3. Weth/USDC
        // 4. Wbtc/USDC
        // 5. USDC/USDT
        router_aux::create_pair<AptosCoin, USDC>(sender);
        router_aux::create_pair<SOL, USDC>(sender);
        router_aux::create_pair<WETH, USDC>(sender);
        router_aux::create_pair<WBTC, USDC>(sender);
        router_aux::create_pair<USDC, USDT>(sender);
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
        dex: u64,
        amountSupplyPairX: u64,
        amountSupplyPairY: u64,
        amountSupplyEZM: u64,
        amountBorrowPairX: u64,
        amountBorrowPairY: u64,
        amountBorrowEZM: u64,
    ) acquires ModuleData {

        if (dex == 0) { //pancake
            assert!(swap_pan::is_pair_created<X, Y>() || swap_pan::is_pair_created<Y, X>(), ERROR_NOT_CREATED_PAIR);
            assert!(swap_pan::is_pair_created<EZM, X>() || swap_pan::is_pair_created<X, EZM>(), ERROR_NOT_CREATED_PAIR);              
            assert!(swap_pan::is_pair_created<EZM, Y>() || swap_pan::is_pair_created<Y, EZM>(), ERROR_NOT_CREATED_PAIR);
        } else if (dex == 1) { //liquid
            assert!(swap_liq::is_pair_created<X, Y>() || swap_liq::is_pair_created<Y, X>(), ERROR_NOT_CREATED_PAIR);
            assert!(swap_liq::is_pair_created<EZM, X>() || swap_liq::is_pair_created<X, EZM>(), ERROR_NOT_CREATED_PAIR);              
            assert!(swap_liq::is_pair_created<EZM, Y>() || swap_liq::is_pair_created<Y, EZM>(), ERROR_NOT_CREATED_PAIR);
        } else if (dex == 2) { //aux
            assert!(swap_aux::is_pair_created<X, Y>() || swap_aux::is_pair_created<Y, X>(), ERROR_NOT_CREATED_PAIR);
            assert!(swap_aux::is_pair_created<EZM, X>() || swap_aux::is_pair_created<X, EZM>(), ERROR_NOT_CREATED_PAIR);              
            assert!(swap_aux::is_pair_created<EZM, Y>() || swap_aux::is_pair_created<Y, EZM>(), ERROR_NOT_CREATED_PAIR);
        };
        
        let moduleData = borrow_global_mut<ModuleData>(RESOURCE_ACCOUNT);
        let resource_signer = account::create_signer_with_capability(&moduleData.signer_cap);
        let resource_account_addr = signer::address_of(&resource_signer);


        //Withdraw from sender
        if (amountSupplyPairX > 0) {
            let balance_x = coin::balance<X>(signer::address_of(sender));
            assert!(balance_x > amountSupplyPairX, ERROR_INSUFFICIENT_ASSET);
            let input_x_coin = coin::withdraw<X>(sender, amountSupplyPairX);
            coin::deposit<X>(RESOURCE_ACCOUNT, input_x_coin);

            moduleData.supply_amount_x_pan = moduleData.supply_amount_x_pan + amountSupplyPairX;
        };

        if (amountSupplyPairY > 0) {
            let balance_y = coin::balance<Y>(signer::address_of(sender));
            assert!(balance_y > amountSupplyPairY, ERROR_INSUFFICIENT_ASSET);
            let input_y_coin = coin::withdraw<Y>(sender, amountSupplyPairY);
            coin::deposit<Y>(RESOURCE_ACCOUNT, input_y_coin);

            moduleData.supply_amount_y_pan = moduleData.supply_amount_y_pan + amountSupplyPairY;
        };

        if (amountSupplyEZM > 0) {
            let balance_ezm = coin::balance<EZM>(signer::address_of(sender));
            assert!(balance_ezm > amountSupplyEZM, ERROR_INSUFFICIENT_ASSET);
            let input_ezm_coin = coin::withdraw<EZM>(sender, amountSupplyEZM);
            coin::deposit<EZM>(RESOURCE_ACCOUNT, input_ezm_coin);

            moduleData.supply_amount_z_pan = moduleData.supply_amount_z_pan + amountSupplyEZM;
        };


        // //Borrow
        if (amountBorrowPairX > 0) {
            lending::borrow<X>(&resource_signer, amountBorrowPairX);

            moduleData.borrow_amount_x_pan = moduleData.borrow_amount_x_pan + amountBorrowPairX;
        };

        if (amountBorrowPairY > 0) {
            lending::borrow<Y>(&resource_signer, amountBorrowPairY);

            moduleData.borrow_amount_y_pan = moduleData.borrow_amount_y_pan + amountBorrowPairY;
        };

        if (amountBorrowEZM > 0) {
            lending::borrow<EZM>(&resource_signer, amountBorrowEZM);

            moduleData.borrow_amount_z_pan = moduleData.borrow_amount_z_pan + amountBorrowEZM;
        };


        let token_x_before_balance = coin::balance<X>(RESOURCE_ACCOUNT);
        let token_y_before_balance = coin::balance<Y>(RESOURCE_ACCOUNT);


        // //Balanced swap: X/2 -> Y
        if ((amountSupplyPairX + amountBorrowPairX)/2 > 0) {
            if (dex == 0) {
                router_pan::swap_exact_input<X, Y>(&resource_signer, (amountSupplyPairX + amountBorrowPairX)/2, 0);
            } else if (dex == 1) {
                router_liq::swap_exact_input<X, Y>(&resource_signer, (amountSupplyPairX + amountBorrowPairX)/2, 0);
            } else if (dex == 2) {
                router_aux::swap_exact_input<X, Y>(&resource_signer, (amountSupplyPairX + amountBorrowPairX)/2, 0);
            };

            moduleData.swap_amount_x_y_pan = moduleData.swap_amount_x_y_pan + (amountSupplyPairX + amountBorrowPairX)/2;
        };


        // //Balanced swap: Y/2 -> X
        if ((amountSupplyPairY + amountBorrowPairY)/2 > 0) {
            if (dex == 0) {
                router_pan::swap_exact_input<Y, X>(&resource_signer, (amountSupplyPairY + amountBorrowPairY)/2, 0);
            } else if (dex == 1) {
                router_liq::swap_exact_input<Y, X>(&resource_signer, (amountSupplyPairY + amountBorrowPairY)/2, 0);
            } else if (dex == 2) {
                router_aux::swap_exact_input<Y, X>(&resource_signer, (amountSupplyPairY + amountBorrowPairY)/2, 0);
            };

            moduleData.swap_amount_y_x_pan = moduleData.swap_amount_y_x_pan + (amountSupplyPairY + amountBorrowPairY)/2;
        };


        // //swap EZM
        if ((amountSupplyEZM + amountBorrowEZM)/2 > 0) {
            if (dex == 0) {
                router_pan::swap_exact_input<EZM, X>(&resource_signer, (amountSupplyEZM + amountBorrowEZM)/2, 0);
                router_pan::swap_exact_input<EZM, Y>(&resource_signer, (amountSupplyEZM + amountBorrowEZM)/2, 0);
            } else if (dex == 1) {
                router_liq::swap_exact_input<EZM, X>(&resource_signer, (amountSupplyEZM + amountBorrowEZM)/2, 0);
                router_liq::swap_exact_input<EZM, Y>(&resource_signer, (amountSupplyEZM + amountBorrowEZM)/2, 0);
            } else if (dex == 2) {
                router_aux::swap_exact_input<EZM, X>(&resource_signer, (amountSupplyEZM + amountBorrowEZM)/2, 0);
                router_aux::swap_exact_input<EZM, Y>(&resource_signer, (amountSupplyEZM + amountBorrowEZM)/2, 0);
            };

            moduleData.swap_amount_z_xy_pan = moduleData.swap_amount_z_xy_pan + (amountSupplyEZM + amountBorrowEZM)/2;
        };


        // //add liquidity
        let token_x_after_balance = coin::balance<X>(RESOURCE_ACCOUNT);
        let token_y_after_balance = coin::balance<Y>(RESOURCE_ACCOUNT);

        let amountAddX = amountSupplyPairX + token_x_after_balance - token_x_before_balance;
        let amountAddY = amountSupplyPairY + token_y_after_balance - token_y_before_balance;
        if (amountAddX > 0 && amountAddY > 0) {
            if (dex == 0) {
                router_pan::add_liquidity<X, Y>(&resource_signer, amountAddX, amountAddY, 0, 0);
            } else if (dex == 1) {
                router_liq::add_liquidity<X, Y>(&resource_signer, amountAddX, amountAddY, 0, 0);
            } else if (dex == 2) {
                router_aux::add_liquidity<X, Y>(&resource_signer, amountAddX, amountAddY, 0, 0);
            };

            moduleData.add_liquidity_amount_x_pan = moduleData.add_liquidity_amount_x_pan + amountAddX;
            moduleData.add_liquidity_amount_y_pan = moduleData.add_liquidity_amount_y_pan + amountAddY;

            moduleData.block_timestamp_last_pan = timestamp::now_seconds();


            //set position for wallet and position count
            let signer_addr = signer::address_of(sender);
            if (!exists<PositionInfo<X, Y>>(signer_addr)) {                
                move_to<PositionInfo<X, Y>>(
                    sender, 
                    PositionInfo {
                       position_count : 1, 
                    }
                );

                moduleData.position_count_pan = moduleData.position_count_pan + 1;
            };
        };
    }
}
