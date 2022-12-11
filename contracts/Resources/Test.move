module TestAddr::arc_protocol {
    
    use std::signer;
    use TestAddr::arc_coin;
    use aptos_framework::managed_coin;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::timestamp;

    const MODULE_ADMIN: address = @TestAddr;

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
        //Deposite Pool Token 8000 at the startup
        managed_coin::register<arc_coin::ARC_Coin>(sender);
        managed_coin::mint<arc_coin::ARC_Coin>(sender,account_addr,100000000 * 100000000);
        let coin1 = coin::withdraw<arc_coin::ARC_Coin>(sender, 40000000 * 100000000);        
        let pool_1 = Pool<arc_coin::ARC_Coin> {borrowed_amount: 0, deposited_amount: 0, token: coin1};
        move_to(sender, pool_1);

        let native_coin = coin::withdraw<AptosCoin>(sender, 10000000);
        let pool_3 = Pool<AptosCoin> {borrowed_amount: 0, deposited_amount: 0, token: native_coin};
        move_to(sender, pool_3);
        
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
    ) acquires Pool, Ticket{

        let signer_addr = signer::address_of(admin);
        let coin = coin::withdraw<CoinType>(admin, _amount);                

        assert!(exists<Pool<CoinType>>(MODULE_ADMIN), COIN_NOT_EXIST);
        assert!(_amount > 0, AMOUNT_ZERO);

        let pool_data = borrow_global_mut<Pool<CoinType>>(MODULE_ADMIN);        
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

        if(!exists<Ticket<arc_coin::ARC_Coin>>(signer_addr)){
            let ticket = Ticket<arc_coin::ARC_Coin> {
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

        assert!(exists<Pool<CoinType>>(MODULE_ADMIN), COIN_NOT_EXIST);
        assert!(_amount > 0, AMOUNT_ZERO);      

         let aptos_ticket_data = borrow_global<Ticket<AptosCoin>>(signer_addr);
        let arc_ticket_data = borrow_global<Ticket<arc_coin::ARC_Coin>>(signer_addr);
       
        //When Supplying Multiple Tokens should sum up ticket_data's lend_amount
        assert!((aptos_ticket_data.lend_amount + arc_ticket_data.lend_amount) * 80 / 100 >= 
            (_amount + (aptos_ticket_data.borrow_amount + arc_ticket_data.borrow_amount)) , INSUFFICIENT_TOKEN_SUPPLY);
          

        let pool_data = borrow_global_mut<Pool<CoinType>>(MODULE_ADMIN);                        
        let origin_coin = &mut pool_data.token;        
        let extract_coin = coin::extract(origin_coin, _amount);
        pool_data.borrowed_amount = pool_data.borrowed_amount + _amount + _amount * 25 / 1000;

       let ticket_data = borrow_global_mut<Ticket<CoinType>>(signer_addr);
       ticket_data.borrow_amount = ticket_data.borrow_amount + _amount + _amount * 25 / 1000  ;

        if(!coin::is_account_registered<CoinType>(signer_addr))
            coin::register<CoinType>(admin);
        coin::deposit(signer_addr, extract_coin);
    }

    public entry fun claim(
        admin: &signer
    ) acquires Ticket, Pool, Rewards {

        let signer_addr = signer::address_of(admin);
        assert!(exists<Rewards>(MODULE_ADMIN), REWARDS_NOT_EXIST);
        let rewards_data = borrow_global_mut<Rewards>(signer_addr);

        let aptos_ticket_data = borrow_global<Ticket<AptosCoin>>(signer_addr);
        let arc_ticket_data = borrow_global<Ticket<arc_coin::ARC_Coin>>(signer_addr);

        let aptos_pool_data = borrow_global<Pool<AptosCoin>>(MODULE_ADMIN);
        let arc_pool_data = borrow_global<Pool<arc_coin::ARC_Coin>>(MODULE_ADMIN);


        let reward_amount = 7000000 * (aptos_ticket_data.lend_amount + aptos_ticket_data.borrow_amount + arc_ticket_data.lend_amount + arc_ticket_data.borrow_amount ) 
        / (aptos_pool_data.borrowed_amount + aptos_pool_data.deposited_amount + arc_pool_data.borrowed_amount + arc_pool_data.deposited_amount) * (timestamp::now_seconds() - rewards_data.last_claim_at) ;
       
        
        *&mut rewards_data.last_claim_at = timestamp::now_seconds();
        *&mut rewards_data.claim_amount = rewards_data.claim_amount + reward_amount;

        let pool_data = borrow_global_mut<Pool<arc_coin::ARC_Coin>>(MODULE_ADMIN);                        
        let origin_coin = &mut pool_data.token;
        let extract_coin = coin::extract(origin_coin, reward_amount);

        if(!coin::is_account_registered<arc_coin::ARC_Coin>(signer_addr))
            coin::register<arc_coin::ARC_Coin>(admin);
        coin::deposit(signer_addr, extract_coin);
    }

  
    public entry fun withdraw<CoinType>(admin: &signer, amount: u64) acquires Pool, Ticket {

        let signer_addr = signer::address_of(admin);
        assert!(exists<Pool<CoinType>>(MODULE_ADMIN), COIN_NOT_EXIST);
        assert!(exists<Ticket<CoinType>>(signer_addr), TICKET_NOT_EXIST);

        let ticket_data = borrow_global_mut<Ticket<CoinType>>(signer_addr);
        assert!((ticket_data.lend_amount - ticket_data.borrow_amount) >= amount, INSUFFICIENT_TOKEN_SUPPLY);

        ticket_data.lend_amount = ticket_data.lend_amount - amount;
        let pool_data = borrow_global_mut<Pool<CoinType>>(MODULE_ADMIN);                        
        let origin_coin = &mut pool_data.token;        
        let extract_coin = coin::extract(origin_coin, amount);

        pool_data.deposited_amount = pool_data.deposited_amount - amount;
        if(!coin::is_account_registered<CoinType>(signer_addr))
            coin::register<CoinType>(admin);
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