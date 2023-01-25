module ezfinance::lending {
    
    use std::signer;
    use ezfinance::faucet_tokens;
    use ezfinance::faucet_provider;
    
    use aptos_framework::managed_coin;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::timestamp;

    use aptos_framework::account;
    use aptos_framework::resource_account;
    use aptos_framework::account::SignerCapability;


    const ZERO_ACCOUNT: address = @zero;
    // const DEFAULT_ADMIN: address = @default_admin;
    const RESOURCE_ACCOUNT: address = @ezfinance;
    const DEV: address = @default_account;

    const MODULE_ADMIN: address = @ezfinance;

    const NOT_ADMIN_PEM: u64 = 0;
    const COIN_NOT_EXIST: u64 = 1;
    const TICKET_NOT_EXIST: u64 = 2;
    const INSUFFICIENT_TOKEN_SUPPLY: u64 = 3;
    const AMOUNT_ZERO: u64 = 4;
    const NO_CLAIMABLE_REWARD: u64 = 5;
    const TIME_ERROR_FOR_CLAIM: u64 = 6;
    const EXCEED_AMOUNT: u64 = 7;
    const REWARDS_NOT_EXIST:u64 = 8;
    const ROI: u64 = 100;
    const INCENTIVE_REWARD: u64 = 50;


    struct Ticket<phantom CoinType> has key {
        borrow_amount : u64,
        lend_amount: u64,
    }

    struct Rewards has key {
        claim_amount: u64,
        last_claim_at: u64
    }

    struct Pool<phantom CoinType> has key {
        borrowed_amount : u64,
        deposited_amount: u64,
        token: coin::Coin<CoinType>,
    }

    fun init_module(sender: &signer) {
        let account_addr = signer::address_of(sender);
        let amount = 1000000000000000000u64;
        let deposit_amount = 1000000000000u64;
        let per_request = 10000000000u64;
        let period = 3000u64;

     
        //Deposite Pool Token 8000 at the startup        
        // faucet_provider::create_faucet<AptosCoin>(sender,amount/2,per_request,period);
        let native_coin = coin::withdraw<AptosCoin>(sender, 0);
        let pool8 = Pool<AptosCoin> {borrowed_amount: 0, deposited_amount: 0, token: native_coin};
        move_to(sender, pool8);

        managed_coin::register<faucet_tokens::EZM>(sender);
        managed_coin::mint<faucet_tokens::EZM>(sender,account_addr,amount);
        faucet_provider::create_faucet<faucet_tokens::EZM>(sender,amount/2,per_request,period);
        let coin1 = coin::withdraw<faucet_tokens::EZM>(sender, deposit_amount);        
        let pool1 = Pool<faucet_tokens::EZM> {borrowed_amount: 0, deposited_amount: deposit_amount, token: coin1};
        move_to(sender, pool1);

        managed_coin::register<faucet_tokens::WBTC>(sender);
        managed_coin::mint<faucet_tokens::WBTC>(sender,account_addr,amount);
        faucet_provider::create_faucet<faucet_tokens::WBTC>(sender,amount/2,10000000u64,period);
        let coin5 = coin::withdraw<faucet_tokens::WBTC>(sender, deposit_amount);        
        let pool5 = Pool<faucet_tokens::WBTC> {borrowed_amount: 0, deposited_amount: deposit_amount, token: coin5};
        move_to(sender, pool5);

        managed_coin::register<faucet_tokens::WETH>(sender);
        managed_coin::mint<faucet_tokens::WETH>(sender,account_addr,amount);
        faucet_provider::create_faucet<faucet_tokens::WETH>(sender,amount/2,100000000u64,period);
        let coin4 = coin::withdraw<faucet_tokens::WETH>(sender, deposit_amount);        
        let pool4 = Pool<faucet_tokens::WETH> {borrowed_amount: 0, deposited_amount: deposit_amount, token: coin4};
        move_to(sender, pool4);

        managed_coin::register<faucet_tokens::USDT>(sender);
        managed_coin::mint<faucet_tokens::USDT>(sender,account_addr,amount);
        faucet_provider::create_faucet<faucet_tokens::USDT>(sender,amount/2,per_request,period);
        let coin3 = coin::withdraw<faucet_tokens::USDT>(sender, deposit_amount);        
        let pool3 = Pool<faucet_tokens::USDT> {borrowed_amount: 0, deposited_amount: deposit_amount, token: coin3};
        move_to(sender, pool3);

        managed_coin::register<faucet_tokens::USDC>(sender);
        managed_coin::mint<faucet_tokens::USDC>(sender,account_addr,amount);
        faucet_provider::create_faucet<faucet_tokens::USDC>(sender,amount/2,per_request,period);
        let coin2 = coin::withdraw<faucet_tokens::USDC>(sender, deposit_amount);        
        let pool2 = Pool<faucet_tokens::USDC> {borrowed_amount: 0, deposited_amount: deposit_amount, token: coin2};
        move_to(sender, pool2);

        managed_coin::register<faucet_tokens::SOL>(sender);
        managed_coin::mint<faucet_tokens::SOL>(sender,account_addr,amount);
        faucet_provider::create_faucet<faucet_tokens::SOL>(sender,amount/2,per_request,period);
        let coin7 = coin::withdraw<faucet_tokens::SOL>(sender, deposit_amount);        
        let pool7 = Pool<faucet_tokens::SOL> {borrowed_amount: 0, deposited_amount: deposit_amount, token: coin7};
        move_to(sender, pool7);

        managed_coin::register<faucet_tokens::BNB>(sender);
        managed_coin::mint<faucet_tokens::BNB>(sender,account_addr,amount);
        faucet_provider::create_faucet<faucet_tokens::BNB>(sender,amount/2,per_request,period);
        let coin8 = coin::withdraw<faucet_tokens::BNB>(sender, deposit_amount);        
        let pool8 = Pool<faucet_tokens::BNB> {borrowed_amount: 0, deposited_amount: deposit_amount, token: coin8};
        move_to(sender, pool8);
    }

    public entry fun manage_pool<CoinType> (
        admin: &signer,
        _amount: u64
    ) acquires Pool {

        let signer_addr = signer::address_of(admin);
        let coin = coin::withdraw<CoinType>(admin, _amount);

        assert!(MODULE_ADMIN == signer_addr, NOT_ADMIN_PEM); // only admin could manage pool

        if(!exists<Pool<CoinType>>(signer_addr)){
            let pool = Pool<CoinType> {borrowed_amount: 0, deposited_amount: 0, token: coin};
            move_to(admin, pool);
        }
        else{
            let pool_data = borrow_global_mut<Pool<CoinType>>(signer_addr);
            let origin_coin = &mut pool_data.token;
            coin::merge(origin_coin, coin);
        }
    }

    public entry fun lend<CoinType> (
        admin: &signer,
        _amount: u64
    ) acquires Pool, Ticket {
        let signer_addr = signer::address_of(admin);


        let coin = coin::withdraw<CoinType>(admin, _amount);                

        assert!(exists<Pool<CoinType>>(RESOURCE_ACCOUNT), COIN_NOT_EXIST);
        assert!(_amount > 0, AMOUNT_ZERO);

        let pool_data = borrow_global_mut<Pool<CoinType>>(RESOURCE_ACCOUNT);        
        let origin_deposit = pool_data.deposited_amount;
        let origin_coin = &mut pool_data.token;
        coin::merge(origin_coin, coin);
        pool_data.deposited_amount = origin_deposit + _amount;

        if(!exists<Rewards>(signer_addr)) {
            let rewards = Rewards {
                claim_amount : 0,
                last_claim_at: timestamp::now_seconds()
            };
            move_to(admin, rewards);
        };


        if(!exists<Ticket<AptosCoin>>(signer_addr)){
            let ticket = Ticket<AptosCoin> {
                borrow_amount: 0,
                lend_amount: 0,               
            };
            move_to(admin, ticket);  
        };

        if(!exists<Ticket<faucet_tokens::EZM>>(signer_addr)){
            let ticket = Ticket<faucet_tokens::EZM> {
                borrow_amount: 0,
                lend_amount: 0,               
            };
            move_to(admin, ticket);  
        };

        if(!exists<Ticket<faucet_tokens::WBTC>>(signer_addr)){
            let ticket = Ticket<faucet_tokens::WBTC> {
                borrow_amount: 0,
                lend_amount: 0,               
            };
            move_to(admin, ticket);  
        };

        if(!exists<Ticket<faucet_tokens::WETH>>(signer_addr)){
            let ticket = Ticket<faucet_tokens::WETH> {
                borrow_amount: 0,
                lend_amount: 0,               
            };
            move_to(admin, ticket);  
        };

        if(!exists<Ticket<faucet_tokens::USDT>>(signer_addr)){
            let ticket = Ticket<faucet_tokens::USDT> {
                borrow_amount: 0,
                lend_amount: 0,               
            };
            move_to(admin, ticket);  
        };

        if(!exists<Ticket<faucet_tokens::USDC>>(signer_addr)){
            let ticket = Ticket<faucet_tokens::USDC> {
                borrow_amount: 0,
                lend_amount: 0,               
            };
            move_to(admin, ticket);  
        };

        if(!exists<Ticket<faucet_tokens::SOL>>(signer_addr)){
            let ticket = Ticket<faucet_tokens::SOL> {
                borrow_amount: 0,
                lend_amount: 0,               
            };
            move_to(admin, ticket);  
        };

        if(!exists<Ticket<faucet_tokens::BNB>>(signer_addr)){
            let ticket = Ticket<faucet_tokens::BNB> {
                borrow_amount: 0,
                lend_amount: 0,               
            };
            move_to(admin, ticket);  
        };


        let ticket_data = borrow_global_mut<Ticket<CoinType>>(signer_addr);
        let origin = ticket_data.lend_amount;
        ticket_data.lend_amount = origin + _amount;
    }

    public entry fun borrow<CoinType> (
        admin: &signer,
        _amount: u64
    ) acquires Pool, Ticket {
        let signer_addr = signer::address_of(admin);

        assert!(exists<Pool<CoinType>>(RESOURCE_ACCOUNT), COIN_NOT_EXIST);
        assert!(_amount > 0, AMOUNT_ZERO);      


        if(!exists<Ticket<AptosCoin>>(signer_addr)){
            let ticket = Ticket<AptosCoin> {
                borrow_amount: 0,
                lend_amount: 0,               
            };
            move_to(admin, ticket);  
        };

        if(!exists<Ticket<faucet_tokens::EZM>>(signer_addr)){
            let ticket = Ticket<faucet_tokens::EZM> {
                borrow_amount: 0,
                lend_amount: 0,               
            };
            move_to(admin, ticket);  
        };

        if(!exists<Ticket<faucet_tokens::WBTC>>(signer_addr)){
            let ticket = Ticket<faucet_tokens::WBTC> {
                borrow_amount: 0,
                lend_amount: 0,               
            };
            move_to(admin, ticket);  
        };

        if(!exists<Ticket<faucet_tokens::WETH>>(signer_addr)){
            let ticket = Ticket<faucet_tokens::WETH> {
                borrow_amount: 0,
                lend_amount: 0,               
            };
            move_to(admin, ticket);  
        };

        if(!exists<Ticket<faucet_tokens::USDT>>(signer_addr)){
            let ticket = Ticket<faucet_tokens::USDT> {
                borrow_amount: 0,
                lend_amount: 0,               
            };
            move_to(admin, ticket);  
        };

        if(!exists<Ticket<faucet_tokens::USDC>>(signer_addr)){
            let ticket = Ticket<faucet_tokens::USDC> {
                borrow_amount: 0,
                lend_amount: 0,               
            };
            move_to(admin, ticket);  
        };

        if(!exists<Ticket<faucet_tokens::SOL>>(signer_addr)){
            let ticket = Ticket<faucet_tokens::SOL> {
                borrow_amount: 0,
                lend_amount: 0,               
            };
            move_to(admin, ticket);  
        };

        if(!exists<Ticket<faucet_tokens::BNB>>(signer_addr)){
            let ticket = Ticket<faucet_tokens::BNB> {
                borrow_amount: 0,
                lend_amount: 0,               
            };
            move_to(admin, ticket);  
        };


        let ticket_data = borrow_global_mut<Ticket<CoinType>>(signer_addr);
                 
        ticket_data.borrow_amount = ticket_data.borrow_amount + _amount + _amount * 25 / 1000;

        let pool_data = borrow_global_mut<Pool<CoinType>>(RESOURCE_ACCOUNT);                        
        let origin_coin = &mut pool_data.token;        
        let extract_coin = coin::extract(origin_coin, _amount);

        pool_data.borrowed_amount = pool_data.borrowed_amount + _amount + _amount * 25 / 1000;


        if (!coin::is_account_registered<CoinType>(signer_addr)) {
            coin::register<CoinType>(admin);
        };

        coin::deposit(signer_addr, extract_coin);
    }

    public entry fun claim(
        admin: &signer
    ) acquires Ticket, Pool, Rewards {

        let signer_addr = signer::address_of(admin);
        assert!(exists<Rewards>(MODULE_ADMIN), REWARDS_NOT_EXIST);
        let rewards_data = borrow_global_mut<Rewards>(signer_addr);

        let aptos_ticket_data = borrow_global<Ticket<AptosCoin>>(signer_addr);
        let ezm_ticket_data = borrow_global<Ticket<faucet_tokens::EZM>>(signer_addr);

        let aptos_pool_data = borrow_global<Pool<AptosCoin>>(MODULE_ADMIN);
        let ezm_pool_data = borrow_global<Pool<faucet_tokens::EZM>>(MODULE_ADMIN);


        let reward_amount = 7000000 * (aptos_ticket_data.lend_amount + aptos_ticket_data.borrow_amount + ezm_ticket_data.lend_amount + ezm_ticket_data.borrow_amount ) 
        / (aptos_pool_data.borrowed_amount + aptos_pool_data.deposited_amount + ezm_pool_data.borrowed_amount + ezm_pool_data.deposited_amount) * (timestamp::now_seconds() - rewards_data.last_claim_at) ;
       
        
        *&mut rewards_data.last_claim_at = timestamp::now_seconds();
        *&mut rewards_data.claim_amount = rewards_data.claim_amount + reward_amount;

        let pool_data = borrow_global_mut<Pool<faucet_tokens::EZM>>(MODULE_ADMIN);                        
        let origin_coin = &mut pool_data.token;
        let extract_coin = coin::extract(origin_coin, reward_amount);

        if(!coin::is_account_registered<faucet_tokens::EZM>(signer_addr))
            coin::register<faucet_tokens::EZM>(admin);
        coin::deposit(signer_addr, extract_coin);
    }
  
    public entry fun withdraw<CoinType>(
        admin: &signer, 
        amount: u64
    ) acquires Pool, Ticket {
        let signer_addr = signer::address_of(admin);
        assert!(exists<Pool<CoinType>>(RESOURCE_ACCOUNT), COIN_NOT_EXIST);
        assert!(exists<Ticket<CoinType>>(signer_addr), TICKET_NOT_EXIST);

        let ticket_data = borrow_global_mut<Ticket<CoinType>>(signer_addr);
        assert!((ticket_data.lend_amount - ticket_data.borrow_amount) >= amount, INSUFFICIENT_TOKEN_SUPPLY);

        ticket_data.lend_amount = ticket_data.lend_amount - amount;
        let pool_data = borrow_global_mut<Pool<CoinType>>(RESOURCE_ACCOUNT);                        
        let origin_coin = &mut pool_data.token;        
        let extract_coin = coin::extract(origin_coin, amount);

        pool_data.deposited_amount = pool_data.deposited_amount - amount;
        if (!coin::is_account_registered<CoinType>(signer_addr)) {
            coin::register<CoinType>(admin);
        };

        coin::deposit(signer_addr, extract_coin);
    }

    public entry fun repay<CoinType>(admin: &signer, amount: u64) acquires Pool, Ticket {
        let signer_addr = signer::address_of(admin);
        let coin = coin::withdraw<CoinType>(admin, amount);   
        assert!(exists<Pool<CoinType>>(MODULE_ADMIN), COIN_NOT_EXIST);
        assert!(exists<Ticket<CoinType>>(signer_addr), TICKET_NOT_EXIST);

        let ticket_data = borrow_global_mut<Ticket<CoinType>>(signer_addr);
        assert!( ticket_data.borrow_amount  >= amount, EXCEED_AMOUNT);

        ticket_data.borrow_amount = ticket_data.borrow_amount - amount;
        let pool_data = borrow_global_mut<Pool<CoinType>>(MODULE_ADMIN);                        
        let origin_coin = &mut pool_data.token;        
        pool_data.borrowed_amount = pool_data.borrowed_amount - amount;
        coin::merge(origin_coin, coin);           
    }
}