module ezfinance::faucet_tokens {
    
    use aptos_framework::account;
    use aptos_framework::managed_coin;
    use std::signer;

    struct EZM {}
    struct USDC {}
    struct USDT {}
    struct WETH {}
    struct WBTC {}
    struct CEUSDC {}
    struct DAI {}
    
    fun init_module(sender: &signer) {
        let account = account::create_account_for_test(@test_coin);

        // init coins
        managed_coin::initialize<EZM>(
            sender,
            b"EZM",
            b"EZM",
            8,
            false,
        );
         managed_coin::initialize<USDC>(
            sender,
            b"USDC",
            b"USDC",
            8,
            false,
        );
         managed_coin::initialize<USDT>(
            sender,
            b"USDT",
            b"USDT",
            8,
            false,
        );
         managed_coin::initialize<WETH>(
            sender,
            b"WETH",
            b"WETH",
            8,
            false,
        );
         managed_coin::initialize<WBTC>(
            sender,
            b"WBTC",
            b"WBTC",
            8,
            false,
        );
        managed_coin::initialize<CEUSDC>(
            sender,
            b"ceUSDC",
            b"ceUSDC",
            8,
            false,
        );

        managed_coin::initialize<DAI>(
            sender,
            b"DAI",
            b"DAI",
            8,
            false,
        );

        account
    }

    public entry fun register_and_mint<CoinType>(account: &signer, to: &signer, amount: u64) {
        managed_coin::register<CoinType>(to);
        managed_coin::mint<CoinType>(account, signer::address_of(to), amount)
    }

    public entry fun mint<CoinType>(account: &signer, to: &signer, amount: u64) {
        managed_coin::mint<CoinType>(account, signer::address_of(to), amount)
    }
}
