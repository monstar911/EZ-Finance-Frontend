module ezfinance::faucet_tokens {
    
    use aptos_framework::managed_coin;
    struct EZM {}
    struct USDC {}
    struct USDT {}
    struct WETH {}
    struct WBTC {}
    struct CEUSDC {}
    struct DAI {}
    
    fun init_module(sender: &signer) {
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
    }
}
