module ezfinance::farming {
    
    use std::signer;
    use ezfinance::swap;
    use aptos_framework::coin;
    use ezfinance::swap_utils;

    use ezfinance::faucet_tokens::{Self, EZM, USDC, USDT, WETH, WBTC, CEUSDC, DAI};

    use aptos_framework::account;
    use aptos_framework::genesis;
    use aptos_framework::resource_account;
    use aptos_framework::managed_coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::timestamp;

    use aptos_std::math64::pow;

    use ezfinance::router;
    use ezfinance::math;

    use ezfinance::lending;
    use ezfinance::faucet_provider;


    const MAX_U64: u64 = 18446744073709551615;
    const MINIMUM_LIQUIDITY: u128 = 1000;

    const MODULE_ADMIN: address = @ezfinance;

    const NOT_ADMIN_PEM: u64 = 0;
    const AMOUNT_ZERO: u64 = 4;


    /// Create a Pair from 2 Coins
    /// Should revert if the pair is already created
    public entry fun create_pair<X, Y>(
        sender: &signer,
    ) {
        if (swap_utils::sort_token_type<X, Y>()) {
        //     swap::create_pair<X, Y>(sender);
        // } else {
        //     swap::create_pair<Y, X>(sender);
        }
    }

    /// Leverage Yield Farming, create pair if it's needed
    //X, Y: to be requidity
    //EZM, APT, LP: supply
    //amountSupplyEZM
    //amountSupplyAPT
    //amountSupplyLP
    //amountInWeiBorrowEZM
    //amountInWeiBorrowAPT
    //amountInWeiBorrowLP
    public entry fun leverage_yield_farming<X, Y>(
        sender: &signer, 
        amountInWeiSupplyEZM: u64,
        amountInWeiSupplyAPT: u64,
        amountInWeiSupplyLP: u64,
        amountInWeiBorrowEZM: u64,
        amountInWeiBorrowAPT: u64,
        amountInWeiBorrowLP: u64,
    ) {
        let amount = 1000000000000000000u64;
        let amount_pool = amount / 20;

        if (!(swap::is_pair_created<X, Y>() || swap::is_pair_created<Y, X>())) {
            create_pair<X, Y>(sender);
            router::add_liquidity<X, Y>(sender, amount_pool/4, amount_pool/4, 0, 0);
        };

        if (amountInWeiBorrowEZM > 0) {
            lending::borrow<EZM>(sender, amountInWeiBorrowEZM);
        };

        if (amountInWeiBorrowAPT > 0) {
            lending::borrow<AptosCoin>(sender, amountInWeiBorrowAPT);
        };

        if (amountInWeiBorrowLP > 0) {
            // lending::borrow<ezfinance::faucet_tokens::LP>(sender, amountInWeiBorrowLP);
        };

        if (!(swap::is_pair_created<EZM, X>() || swap::is_pair_created<X, EZM>())) {
            create_pair<EZM, X>(sender);
            router::add_liquidity<EZM, X>(sender, amount_pool/4, amount_pool/4, 0, 0);
        };

        if (!(swap::is_pair_created<EZM, Y>() || swap::is_pair_created<Y, EZM>())) {
            create_pair<EZM, Y>(sender);
            router::add_liquidity<EZM, Y>(sender, amount_pool/4, amount_pool/4, 0, 0);
        };

        if (!(swap::is_pair_created<AptosCoin, X>() || swap::is_pair_created<X, AptosCoin>())) {
            create_pair<AptosCoin, X>(sender);
            router::add_liquidity<AptosCoin, X>(sender, amount_pool/4, amount_pool/4, 0, 0);
        };

        if (!(swap::is_pair_created<AptosCoin, Y>() || swap::is_pair_created<Y, AptosCoin>())) {
            create_pair<AptosCoin, Y>(sender);
            router::add_liquidity<AptosCoin, Y>(sender, amount_pool/4, amount_pool/4, 0, 0);
        };

        router::swap_exact_input<EZM, X>(sender, (amountInWeiSupplyEZM + amountInWeiBorrowEZM)/2, 0);
        router::swap_exact_input<EZM, Y>(sender, (amountInWeiSupplyEZM + amountInWeiBorrowEZM)/2, 0);

        router::swap_exact_input<AptosCoin, X>(sender, (amountInWeiSupplyAPT + amountInWeiBorrowAPT)/2, 0);
        router::swap_exact_input<AptosCoin, Y>(sender, (amountInWeiSupplyAPT + amountInWeiBorrowAPT)/2, 0);

        let token_x_after_balance = coin::balance<X>(signer::address_of(sender));
        let token_y_after_balance = coin::balance<Y>(signer::address_of(sender));

        router::add_liquidity<X, Y>(sender, token_x_after_balance, token_y_after_balance, 0, 0);
    }
}

