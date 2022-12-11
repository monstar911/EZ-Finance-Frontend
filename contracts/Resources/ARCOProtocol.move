module TestAddr::arc_protocol {
    
    use std::signer;
    use TestAddr::arc_coin;
    use aptos_framework::managed_coin;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::timestamp;
    use aptos_std::table::{Self, Table};

    const ADMIN: address = @TestAddr;

    struct Ticket<phantom CoinType> has store {
        borrow_amount : u64,
        lend_amount: u64,
        ct: TypeInfo
    }

    struct UserInfo has key {
        data: vector<Ticket>
    }

    struct Rewards has key {
        claim_amount: u64,
        last_claim_at: u64
    }

    struct Pool<phantom CoinType> has store {
        borrowed_amount : u64,
        deposited_amount: u64,
        coin: coin::Coin<CoinType>,
        ct: TypeInfo
    }

    struct Pools has key, store {
        data: vector<Pool>
    }

    fun init_module(sender: &signer) acquires Pools {

        let dest_addr = signer::address_of(sender);
        move_to(sender, Pools {data: vector::empty()});
        let pools = borrow_global_mut<Pools>(ADMIN);

        managed_coin::register<arc_coin::ARC_Coin>(sender);
        managed_coin::mint<arc_coin::ARC_Coin>(sender, dest_addr, 100000000 * 1000000);

        let arc_lend_mining_rewards = coin::withdraw<arc_coin::ARC_Coin>(sender, 45000000 * 1000000); 
       
        let arc_pool = Pool {
            borrowed_amount: 0, 
            deposited_amount: 0, 
            coin: arc_lend_mining_rewards,
            ct: type_of<arc_coin::ARC_Coin>()
        };
        vector::push_back(&mut pools.data, arc_pool);

        let aptos_token = coin::withdraw<AptosCoin>(sender, 0);
        let aptos_pool = Pool {
            borrowed_amount: 0, 
            deposited_amount: 0, 
            ct: type_of<AptosCoin>(), 
            coin: aptos_token
        };
        vector::push_back(&mut pools.data, aptos_pool);        
    }

}