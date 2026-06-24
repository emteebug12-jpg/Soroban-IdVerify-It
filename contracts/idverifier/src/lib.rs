#![no_std]

use soroban_sdk::{contractimpl, Address, BytesN, Env};

#[contractimpl]
pub fn register_id(env: Env, user: Address, id_hash: BytesN<32>) {
    env.storage().set(&user, &id_hash);
}

#[contractimpl]
pub fn get_id(env: Env, user: Address) -> Option<BytesN<32>> {
    env.storage().get(&user)
}
