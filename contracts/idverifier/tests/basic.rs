use idverifier::{get_id, register_id};
use soroban_sdk::{testutils::Env as _, Address, BytesN, Env};

#[test]
fn register_and_retrieve_id() {
    let env = Env::default();
    let user_id = BytesN::from_array(&env, &[1u8; 32]);
    let user = Address::from_account_id(&env, &user_id);
    let id_hash = BytesN::from_array(&env, &[42u8; 32]);

    register_id(env.clone(), user.clone(), id_hash.clone());
    let stored = get_id(env, user).expect("expected registered hash");

    assert_eq!(stored, id_hash);
}
