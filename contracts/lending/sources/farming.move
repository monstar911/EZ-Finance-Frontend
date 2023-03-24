module ezfinance::farming {
    
    use std::signer;
    use std::vector;

    use aptos_std::math64::pow;
    use std::string::{Self, String, utf8};
    use aptos_std::simple_map::{Self, SimpleMap};

    use aptos_framework::coin;
    use aptos_framework::account;
    use aptos_framework::genesis;
    use aptos_framework::timestamp;
    use aptos_framework::managed_coin;
    use aptos_framework::resource_account;
    use aptos_framework::account::SignerCapability;
    use aptos_framework::aptos_coin::AptosCoin;

    use pancake::math as math_pan;
    use pancake::swap as swap_pan;
    use pancake::router as router_pan;

    use liquid::math as math_liq;
    use liquid::swap as swap_liq;
    use liquid::router as router_liq;

    use auxexchange::math as math_aux;
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
    const ERROR_INVALID_PARAM_DEX: u64 = 3;
    const ERROR_UNKNOWN: u64 = 4;

    // for TVL via EZ, positions
    struct PositionInfo<phantom X, phantom Y> has key, copy, store, drop {
        dex_name: String, //PancakeSwap, LiquidSwap, AUX Exchange
        signer_addr: address,
        created_at: u64,

        status: bool, // add_liquidity: true, remove_liquidity: false

        leverage: u64,
        supplyAmount_x: u64,
        supplyAmount_y: u64,
        supplyAmount_z: u64,
        borrowAmount_x: u64,
        borrowAmount_y: u64,
        borrowAmount_z: u64,

        amountAdd_x: u64,
        amountAdd_y: u64,
    }

    struct PositionInfoDex<phantom X, phantom Y> has key, copy, store {
        positionInfo_pan: vector<PositionInfo<X, Y>>,
        positionInfo_liq: vector<PositionInfo<X, Y>>,
        positionInfo_aux: vector<PositionInfo<X, Y>>,
    }

    // This struct stores an NFT collection's relevant information
    struct ModuleData has key {
        // Storing the signer capability here, so the module can programmatically sign for transactions
        signer_cap: SignerCapability,
    }

    fun init_module(sender: &signer) {
        let signer_cap = resource_account::retrieve_resource_account_cap(sender, DEV);
        let resource_signer = account::create_signer_with_capability(&signer_cap);
        move_to(&resource_signer, ModuleData {
            signer_cap,
        });
    }

    public entry fun withdraw<X, Y>(
        sender: &signer,
        dex: u64, // protocol: number,
        created_at: u64,
        leverage: u64,
        supplyAmount_x: u64,
        supplyAmount_y: u64,
        supplyAmount_z: u64,
        borrowAmount_x: u64,
        borrowAmount_y: u64,
        borrowAmount_z: u64,
        amountAdd_x: u64,
        amountAdd_y: u64,
    ) acquires ModuleData, PositionInfoDex {
        
        let dex_name: string::String = string::utf8(b"PancakeSwap");

        if (dex == 0) { //pancake
            dex_name = string::utf8(b"PancakeSwap");

            assert!(swap_pan::is_pair_created<X, Y>() || swap_pan::is_pair_created<Y, X>(), ERROR_NOT_CREATED_PAIR);
            assert!(swap_pan::is_pair_created<EZM, X>() || swap_pan::is_pair_created<X, EZM>(), ERROR_NOT_CREATED_PAIR);              
            assert!(swap_pan::is_pair_created<EZM, Y>() || swap_pan::is_pair_created<Y, EZM>(), ERROR_NOT_CREATED_PAIR);
        } else if (dex == 1) { //liquid
            dex_name = string::utf8(b"LiquidSwap");

            assert!(swap_liq::is_pair_created<X, Y>() || swap_liq::is_pair_created<Y, X>(), ERROR_NOT_CREATED_PAIR);
            assert!(swap_liq::is_pair_created<EZM, X>() || swap_liq::is_pair_created<X, EZM>(), ERROR_NOT_CREATED_PAIR);              
            assert!(swap_liq::is_pair_created<EZM, Y>() || swap_liq::is_pair_created<Y, EZM>(), ERROR_NOT_CREATED_PAIR);
        } else if (dex == 2) { //aux
            dex_name = string::utf8(b"AUX Exchange");

            assert!(swap_aux::is_pair_created<X, Y>() || swap_aux::is_pair_created<Y, X>(), ERROR_NOT_CREATED_PAIR);
            assert!(swap_aux::is_pair_created<EZM, X>() || swap_aux::is_pair_created<X, EZM>(), ERROR_NOT_CREATED_PAIR);              
            assert!(swap_aux::is_pair_created<EZM, Y>() || swap_aux::is_pair_created<Y, EZM>(), ERROR_NOT_CREATED_PAIR);
        } else {
            abort ERROR_INVALID_PARAM_DEX
        };
        
        let moduleData = borrow_global_mut<ModuleData>(RESOURCE_ACCOUNT);
        let resource_signer = account::create_signer_with_capability(&moduleData.signer_cap);
        let resource_account_addr = signer::address_of(&resource_signer);


        //set position for wallet and position count
        let signer_addr = signer::address_of(sender);
        
        assert!(exists<PositionInfoDex<X, Y>>(resource_account_addr), ERROR_UNKNOWN);

        let len = 0;
        let positionInfoDex = borrow_global_mut<PositionInfoDex<X, Y>>(resource_account_addr);
        if (dex == 0) {
            let i = 0;
            let max_len = vector::length(&positionInfoDex.positionInfo_pan);
            while (i < max_len) {
                let positionInfo = vector::borrow_mut(&mut positionInfoDex.positionInfo_pan, i);
                if (positionInfo.created_at == created_at) {
                    if (amountAdd_x > 0 && amountAdd_y > 0) {
                        let suppose_lp_balance = math_pan::sqrt(((amountAdd_x as u128) * (amountAdd_y as u128))) - MINIMUM_LIQUIDITY;

                        router_pan::remove_liquidity<X, Y>(&resource_signer, (suppose_lp_balance as u64), 0, 0);

                        positionInfo.status = false;

                        let balance_x = coin::balance<X>(signer::address_of(&resource_signer));
                        assert!(balance_x > supplyAmount_x, ERROR_INSUFFICIENT_ASSET);
                        let input_x_coin = coin::withdraw<X>(&resource_signer, supplyAmount_x);
                        coin::deposit<X>(signer_addr, input_x_coin);

                        let balance_y = coin::balance<Y>(signer::address_of(&resource_signer));
                        assert!(balance_y > supplyAmount_y, ERROR_INSUFFICIENT_ASSET);
                        let input_y_coin = coin::withdraw<Y>(&resource_signer, supplyAmount_x);
                        coin::deposit<Y>(signer_addr, input_y_coin);
                    };
                };

                i = i + 1;
            };
        } else if (dex == 1) {
        } else if (dex == 2) {
        };
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
        leverage: u64,
        amountSupplyPairX: u64,
        amountSupplyPairY: u64,
        amountSupplyEZM: u64,
        amountBorrowPairX: u64,
        amountBorrowPairY: u64,
        amountBorrowEZM: u64,
    ) acquires ModuleData, PositionInfoDex {

        let dex_name: string::String = string::utf8(b"PancakeSwap");

        if (dex == 0) { //pancake
            dex_name = string::utf8(b"PancakeSwap");

            assert!(swap_pan::is_pair_created<X, Y>() || swap_pan::is_pair_created<Y, X>(), ERROR_NOT_CREATED_PAIR);
            assert!(swap_pan::is_pair_created<EZM, X>() || swap_pan::is_pair_created<X, EZM>(), ERROR_NOT_CREATED_PAIR);              
            assert!(swap_pan::is_pair_created<EZM, Y>() || swap_pan::is_pair_created<Y, EZM>(), ERROR_NOT_CREATED_PAIR);
        } else if (dex == 1) { //liquid
            dex_name = string::utf8(b"LiquidSwap");

            assert!(swap_liq::is_pair_created<X, Y>() || swap_liq::is_pair_created<Y, X>(), ERROR_NOT_CREATED_PAIR);
            assert!(swap_liq::is_pair_created<EZM, X>() || swap_liq::is_pair_created<X, EZM>(), ERROR_NOT_CREATED_PAIR);              
            assert!(swap_liq::is_pair_created<EZM, Y>() || swap_liq::is_pair_created<Y, EZM>(), ERROR_NOT_CREATED_PAIR);
        } else if (dex == 2) { //aux
            dex_name = string::utf8(b"AUX Exchange");

            assert!(swap_aux::is_pair_created<X, Y>() || swap_aux::is_pair_created<Y, X>(), ERROR_NOT_CREATED_PAIR);
            assert!(swap_aux::is_pair_created<EZM, X>() || swap_aux::is_pair_created<X, EZM>(), ERROR_NOT_CREATED_PAIR);              
            assert!(swap_aux::is_pair_created<EZM, Y>() || swap_aux::is_pair_created<Y, EZM>(), ERROR_NOT_CREATED_PAIR);
        } else {
            abort ERROR_INVALID_PARAM_DEX
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
        };

        if (amountSupplyPairY > 0) {
            let balance_y = coin::balance<Y>(signer::address_of(sender));
            assert!(balance_y > amountSupplyPairY, ERROR_INSUFFICIENT_ASSET);
            let input_y_coin = coin::withdraw<Y>(sender, amountSupplyPairY);
            coin::deposit<Y>(RESOURCE_ACCOUNT, input_y_coin);
        };

        if (amountSupplyEZM > 0) {
            let balance_ezm = coin::balance<EZM>(signer::address_of(sender));
            assert!(balance_ezm > amountSupplyEZM, ERROR_INSUFFICIENT_ASSET);
            let input_ezm_coin = coin::withdraw<EZM>(sender, amountSupplyEZM);
            coin::deposit<EZM>(RESOURCE_ACCOUNT, input_ezm_coin);
        };


        // //Borrow
        if (amountBorrowPairX > 0) {
            lending::borrow<X>(&resource_signer, amountBorrowPairX);
        };

        if (amountBorrowPairY > 0) {
            lending::borrow<Y>(&resource_signer, amountBorrowPairY);
        };

        if (amountBorrowEZM > 0) {
            // lending::borrow<EZM>(&resource_signer, amountBorrowEZM);
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


            //set position for wallet and position count
            let signer_addr = signer::address_of(sender);
            // if (!exists<PositionInfo<X, Y>>(signer_addr)) {
            //     let positionInfo1 = PositionInfo<X, Y> {
            //         dex_name, //PancakeSwap, LiquidSwap, AUX Exchange
            //         signer_addr,
            //         created_at: timestamp::now_seconds(),
            //         status: true, // add_liquidity: true, remove_liquidity: false
            //         leverage,
            //         supplyAmount_x: amountSupplyPairX,
            //         supplyAmount_y: amountSupplyPairY,
            //         supplyAmount_z: amountSupplyEZM,
            //         borrowAmount_x: amountBorrowPairX,
            //         borrowAmount_y: amountBorrowPairY,
            //         borrowAmount_z: amountBorrowEZM,
            //     };
                
            //     move_to<PositionInfo<X, Y>>(
            //         sender, 
            //         positionInfo1,
            //     );
            // };            

            
            if (!exists<PositionInfoDex<X, Y>>(resource_account_addr)) {
                let positionInfo = PositionInfo<X, Y> {
                    dex_name, //PancakeSwap, LiquidSwap, AUX Exchange
                    signer_addr,
                    created_at: timestamp::now_seconds(),
                    status: true, // add_liquidity: true, remove_liquidity: false
                    leverage,
                    supplyAmount_x: amountSupplyPairX,
                    supplyAmount_y: amountSupplyPairY,
                    supplyAmount_z: amountSupplyEZM,
                    borrowAmount_x: amountBorrowPairX,
                    borrowAmount_y: amountBorrowPairY,
                    borrowAmount_z: amountBorrowEZM,
                    amountAdd_x: amountAddX,
                    amountAdd_y: amountAddY,
                };

                let ret = vector::empty<PositionInfo<X, Y>>();
                let positionInfoDex = PositionInfoDex<X, Y> {
                    positionInfo_pan : vector::empty<PositionInfo<X, Y>>(),
                    positionInfo_liq : vector::empty<PositionInfo<X, Y>>(),
                    positionInfo_aux : vector::empty<PositionInfo<X, Y>>(),
                };

                if (dex == 0) {
                    vector::push_back(&mut positionInfoDex.positionInfo_pan, positionInfo);
                } else if (dex == 1) {
                    vector::push_back(&mut positionInfoDex.positionInfo_liq, positionInfo);                    
                } else if (dex == 2) {
                    vector::push_back(&mut positionInfoDex.positionInfo_aux, positionInfo);
                };
                
                move_to(&resource_signer, positionInfoDex);
            } else {
                let positionInfoDex = borrow_global_mut<PositionInfoDex<X, Y>>(resource_account_addr);
                let positionInfo = PositionInfo<X, Y> {
                    dex_name, //PancakeSwap, LiquidSwap, AUX Exchange
                    signer_addr,
                    created_at: timestamp::now_seconds(),
                    status: true, // add_liquidity: true, remove_liquidity: false
                    leverage,
                    supplyAmount_x: amountSupplyPairX,
                    supplyAmount_y: amountSupplyPairY,
                    supplyAmount_z: amountSupplyEZM,
                    borrowAmount_x: amountBorrowPairX,
                    borrowAmount_y: amountBorrowPairY,
                    borrowAmount_z: amountBorrowEZM,
                    amountAdd_x: amountAddX,
                    amountAdd_y: amountAddY,
                };

                if (dex == 0) {
                    vector::push_back(&mut positionInfoDex.positionInfo_pan, positionInfo);
                } else if (dex == 1) {
                    vector::push_back(&mut positionInfoDex.positionInfo_liq, positionInfo);                    
                } else if (dex == 2) {
                    vector::push_back(&mut positionInfoDex.positionInfo_aux, positionInfo);
                };
            };
        };
    }
}
