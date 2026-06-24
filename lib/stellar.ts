import { Address, Networks, Operation, Transaction, TransactionBuilder, xdr } from "@stellar/stellar-sdk";
import { Server } from "@stellar/stellar-sdk/rpc";
import { Buffer } from "buffer";
import freighterApi from "@stellar/freighter-api";

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const NETWORK_PASSPHRASE = Networks.TESTNET;
const CONTRACT_ID = process.env.NEXT_PUBLIC_SOROBAN_CONTRACT_ID || "CONTRACT_ID_PLACEHOLDER";
const server = new Server(HORIZON_URL);

export async function isFreighterConnected(): Promise<boolean> {
  const result = await freighterApi.isConnected();
  return result.isConnected;
}

export async function connectFreighter(): Promise<string> {
  const result = await freighterApi.requestAccess();
  if (!result.address) {
    throw new Error("Freighter access denied or unavailable.");
  }
  return result.address;
}

export async function getFreighterPublicKey(): Promise<string> {
  const result = await freighterApi.getAddress();
  if (!result.address) {
    throw new Error("Unable to read the Freighter public key.");
  }
  return result.address;
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function hexToBytes(hex: string): Uint8Array {
  return new Uint8Array(
    hex.match(/.{1,2}/g)?.map((segment) => parseInt(segment, 16)) ?? []
  );
}

export async function sha256Hash(value: string): Promise<Uint8Array> {
  const data = new TextEncoder().encode(value.trim());
  const digest = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(digest);
}

function ensureContractId(): string {
  if (!CONTRACT_ID || CONTRACT_ID === "CONTRACT_ID_PLACEHOLDER") {
    throw new Error(
      "Replace NEXT_PUBLIC_SOROBAN_CONTRACT_ID with your deployed contract ID."
    );
  }
  return CONTRACT_ID;
}

export async function buildRegisterIdTransaction(
  publicKey: string,
  documentValue: string
): Promise<Transaction> {
  const contractId = ensureContractId();
  const account = await server.getAccount(publicKey);
  const hash = await sha256Hash(documentValue);
  const operation = Operation.invokeContractFunction({
    contract: contractId,
    function: "register_id",
    args: [
      Address.fromString(publicKey).toScVal(),
      xdr.ScVal.scvBytes(Buffer.from(hash))
    ]
  });

  const tx = new TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: NETWORK_PASSPHRASE
  })
    .addOperation(operation)
    .setTimeout(30)
    .build();

  return server.prepareTransaction(tx);
}

export async function signAndSubmitTransaction(
  transaction: Transaction,
  publicKey: string
) {
  const signed = await freighterApi.signTransaction(transaction.toXDR(), {
    address: publicKey,
    networkPassphrase: NETWORK_PASSPHRASE
  });

  if (!signed.signedTxXdr) {
    throw new Error("Freighter did not return a signed transaction.");
  }

  const signedTx = new Transaction(signed.signedTxXdr, NETWORK_PASSPHRASE);
  return server.sendTransaction(signedTx);
}

export async function fetchStoredIdHash(publicKey: string): Promise<string | null> {
  const contractId = ensureContractId();
  const account = await server.getAccount(publicKey);
  const operation = Operation.invokeContractFunction({
    contract: contractId,
    function: "get_id",
    args: [Address.fromString(publicKey).toScVal()]
  });

  const tx = new TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: NETWORK_PASSPHRASE
  })
    .addOperation(operation)
    .setTimeout(30)
    .build();

  const simulation = await server.simulateTransaction(tx);
  const simResult = simulation as any;
  if (!simResult.result) {
    throw new Error("Soroban simulation failed or returned no result.");
  }

  const retval = simResult.result.retval as any;
  const raw = typeof retval?.value === "function" ? retval.value() : retval;

  if (!raw) {
    return null;
  }

  const bytes = raw instanceof Uint8Array ? raw : Array.isArray(raw) ? new Uint8Array(raw) : null;
  if (!bytes) {
    return null;
  }

  return bytesToHex(bytes);
}
