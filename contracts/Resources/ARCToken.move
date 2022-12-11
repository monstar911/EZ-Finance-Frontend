module JimmyAddr::arc_coin {
    
    use aptos_framework::managed_coin;
    struct ARC_Coin {}

    fun init_module(sender: &signer) {
        managed_coin::initialize<ARC_Coin>(
            sender,
            b"ARC Coin",
            b"ARC",
            8,
            false,
        );
    }

    public fun init_coin(sender: &signer) {
        managed_coin::initialize<ARC_Coin>(
            sender,
            b"ARC Coin",
            b"ARC",
            8,
            false,
        );
    }
}