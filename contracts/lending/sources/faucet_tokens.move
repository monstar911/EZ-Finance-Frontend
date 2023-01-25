module ezfinance::faucet_tokens {
    
    use aptos_framework::account;
    use aptos_framework::managed_coin;
    use std::signer;

    struct EZM {}
    struct WBTC {}
    struct WETH {}
    struct USDT {}
    struct USDC {}
    struct SOL {}
    struct BNB {}
    
    fun init_module(sender: &signer) {
        // let account = account::create_account_for_test(@test_coin);

        // init coins
        init_coins(sender);
    }

    fun init_coins(sender: &signer) {
        managed_coin::initialize<EZM>(
            sender,
            b"EZM Coin",
            b"EZM",
            8,
            false,
        );
        
        managed_coin::initialize<WBTC>(
            sender,
            b"WBTC Coin",
            b"WBTC",
            8,
            false,
        );

        managed_coin::initialize<WETH>(
            sender,
            b"WETH Coin",
            b"WETH",
            8,
            false,
        );

        managed_coin::initialize<USDT>(
            sender,
            b"USDT Coin",
            b"USDT",
            8,
            false,
        );
        
        managed_coin::initialize<USDC>(
            sender,
            b"USDC Coin",
            b"USDC",
            8,
            false,
        );

        managed_coin::initialize<SOL>(
            sender,
            b"SOL Coin",
            b"SOL",
            8,
            false,
        );

        managed_coin::initialize<BNB>(
            sender,
            b"BNB Coin",
            b"BNB",
            8,
            false,
        );

        // account
    }

    public entry fun register_and_mint<CoinType>(account: &signer, to: &signer, amount: u64) {
        managed_coin::register<CoinType>(to);
        managed_coin::mint<CoinType>(account, signer::address_of(to), amount)
    }

    public entry fun mint<CoinType>(account: &signer, to: &signer, amount: u64) {
        managed_coin::mint<CoinType>(account, signer::address_of(to), amount)
    }
}
