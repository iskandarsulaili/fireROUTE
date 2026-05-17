# Solana JSON RPC

## Provider metadata
- Category: `Cryptocurrency`
- Provider slug: `solana-json-rpc`
- Official pages manually reviewed in this pass:
  - `https://solana.com/docs/rpc`
  - `https://solana.com/docs/rpc/json-structures`
  - `https://solana.com/docs/rpc/websocket`
  - `https://solana.com/docs/rpc/http/getblock`
  - `https://solana.com/docs/rpc/http/getsignaturesforaddress`
  - `https://solana.com/docs/rpc/http/requestairdrop`
  - `https://solana.com/docs/rpc/http/sendtransaction`
  - `https://solana.com/docs/rpc/http/simulatetransaction`
- Confirmed public HTTP RPC endpoints from the official overview:
  - `https://api.mainnet.solana.com`
  - `https://api.devnet.solana.com`
  - `https://api.testnet.solana.com`
- Confirmed local defaults from the official overview:
  - HTTP RPC: `http://localhost:8899`
  - WebSocket PubSub: `ws://localhost:8900`
- Confirmed WebSocket transport pattern from the official WebSocket docs: `ws://<ADDRESS>/` or `wss://<ADDRESS>/`
- Primary transport formats: JSON-RPC 2.0 over HTTP `POST /` and JSON-RPC 2.0 over persistent WebSocket connections
- Authentication model surfaced in the reviewed official docs: none for the public shared endpoints shown on the overview page
- Manually confirmed method count in this pass: `70` (`52` HTTP request/response RPC methods + `18` WebSocket subscribe/unsubscribe methods)

## Manual review result
The prior repo file materially undercounted Solana. The current official Solana docs expose a large, explicit RPC surface with a browsable sidebar inventory, separate HTTP and WebSocket sections, shared JSON-structure reference pages, and route-level method pages with parameter and response details.

For fireROUTE purposes, Solana should be modeled as a JSON-RPC provider rather than a REST provider with many resource paths. The path is effectively the RPC root, and the method name inside the JSON-RPC envelope is the real operation selector.

## Common request / transport model
From the reviewed official pages:
- HTTP request-response methods are sent to the cluster RPC root with `POST /`.
- WebSocket methods use JSON-RPC 2.0 over a persistent socket connection.
- The WebSocket docs explicitly define these shared request fields:
  - `jsonrpc` - JSON-RPC version, set to `"2.0"`
  - `id` - client-supplied request identifier
  - `method` - RPC or PubSub method name
  - `params` - ordered parameter array; can be empty when a method takes no parameters
- The reviewed HTTP examples for `getBlock`, `getSignaturesForAddress`, `requestAirdrop`, `sendTransaction`, and `simulateTransaction` all use the same top-level JSON-RPC request shape.
- Shared response style is JSON with either a `result` member or an error object according to JSON-RPC semantics.
- The official `json-structures` page documents shared nested response objects such as confirmed blocks and other reusable result structures.

## Confirmed network / endpoint notes
### HTTP RPC clusters
The official overview explicitly lists these shared public RPC endpoints:
- Mainnet: `https://api.mainnet.solana.com`
- Devnet: `https://api.devnet.solana.com`
- Testnet: `https://api.testnet.solana.com`

### WebSocket / PubSub
The official WebSocket page documents the generic PubSub connection pattern as:
- `ws://<ADDRESS>/`
- `wss://<ADDRESS>/`

The overview page separately confirms the default local development WebSocket endpoint:
- `ws://localhost:8900`

### Commitment levels
The official overview documents these commitment values:
- `processed`
- `confirmed`
- `finalized`

The WebSocket docs additionally state that subscriptions which accept `commitment` default to `finalized` when omitted.

## Authentication
- No API key, OAuth flow, session cookie, or signature scheme is documented for the shared public endpoints shown on the official overview page.
- The reviewed docs instead describe those public endpoints as shared infrastructure and recommend dedicated/private RPC infrastructure for production use.
- Any provider-specific auth used by third-party dedicated Solana RPC vendors is out of scope for this first-party Solana Foundation reference.

## Manually confirmed HTTP RPC method inventory (`52`)
All HTTP methods below are invoked as JSON-RPC method names against the cluster root path via `POST /`.

### Account / state reads
- `getAccountInfo`
- `getBalance`
- `getMinimumBalanceForRentExemption`
- `getMultipleAccounts`
- `getProgramAccounts`

### Block / ledger / blockhash / slot history
- `getBlock`
- `getBlockCommitment`
- `getBlockHeight`
- `getBlockProduction`
- `getBlocks`
- `getBlocksWithLimit`
- `getBlockTime`
- `getFirstAvailableBlock`
- `getLatestBlockhash`
- `getSlot`
- `getSlotLeader`
- `getSlotLeaders`
- `isBlockhashValid`
- `minimumLedgerSlot`

### Cluster / node / version / health
- `getClusterNodes`
- `getGenesisHash`
- `getHealth`
- `getHighestSnapshotSlot`
- `getIdentity`
- `getVersion`

### Epoch / leader / performance / prioritization
- `getEpochInfo`
- `getEpochSchedule`
- `getLeaderSchedule`
- `getRecentPerformanceSamples`
- `getRecentPrioritizationFees`
- `getMaxRetransmitSlot`
- `getMaxShredInsertSlot`

### Inflation / supply / stake / vote data
- `getInflationGovernor`
- `getInflationRate`
- `getInflationReward`
- `getLargestAccounts`
- `getStakeMinimumDelegation`
- `getSupply`
- `getVoteAccounts`

### Token data
- `getTokenAccountBalance`
- `getTokenAccountsByDelegate`
- `getTokenAccountsByOwner`
- `getTokenLargestAccounts`
- `getTokenSupply`

### Transaction / signature / fee / simulation / submission
- `getFeeForMessage`
- `getSignaturesForAddress`
- `getSignatureStatuses`
- `getTransaction`
- `getTransactionCount`
- `requestAirdrop`
- `sendTransaction`
- `simulateTransaction`

## Manually confirmed WebSocket method inventory (`18`)
The official WebSocket docs page exposes these PubSub methods:

### Account / program subscriptions
- `accountSubscribe`
- `accountUnsubscribe`
- `programSubscribe`
- `programUnsubscribe`

### Block / log / root subscriptions
- `blockSubscribe`
- `blockUnsubscribe`
- `logsSubscribe`
- `logsUnsubscribe`
- `rootSubscribe`
- `rootUnsubscribe`

### Signature / slot / vote subscriptions
- `signatureSubscribe`
- `signatureUnsubscribe`
- `slotSubscribe`
- `slotUnsubscribe`
- `slotsUpdatesSubscribe`
- `slotsUpdatesUnsubscribe`
- `voteSubscribe`
- `voteUnsubscribe`

## Parameters and request notes confirmed from reviewed method pages
### Shared method behavior
- Many reviewed methods accept an optional configuration object as a later positional parameter.
- `commitment` is repeatedly documented across the overview and method pages as a common configuration field.
- JSON encoding options are method-specific; for example, `getBlock`, `sendTransaction`, and `simulateTransaction` all document `encoding` controls.

### `getBlock`
The reviewed official method page confirms:
- required first param: slot number (`u64`)
- optional config fields:
  - `commitment`
  - `encoding`
  - `transactionDetails`
  - `maxSupportedTransactionVersion`
  - `rewards`
- result may be `null` when the specified block is not confirmed
- otherwise the response uses the shared confirmed-block structure documented on the JSON structures page

### `getSignaturesForAddress`
The reviewed official method page confirms:
- required first param: account address as base-58 string
- optional config fields:
  - `commitment`
  - `minContextSlot`
  - `limit`
  - `before`
  - `until`
- result is an array ordered from newest to oldest
- each result object includes:
  - `signature`
  - `slot`
  - `err`
  - `memo`
  - `blockTime`
  - `confirmationStatus`

### `requestAirdrop`
The reviewed official method page confirms:
- required params:
  - recipient pubkey as base-58 string
  - lamport amount (`u64`)
- optional config fields:
  - `commitment`
  - `recentBlockhash`
- result is the transaction signature as a base-58 string

### `sendTransaction`
The reviewed official method page confirms:
- required first param: fully signed transaction as encoded string
- optional config fields:
  - `encoding`
  - `skipPreflight`
  - `preflightCommitment`
  - `maxRetries`
  - `minContextSlot`
- the RPC node relays the transaction as-is
- a successful immediate RPC response does **not** guarantee cluster confirmation
- the docs explicitly recommend checking `getSignatureStatuses` after submission
- preflight checks verify signatures and simulate execution unless disabled

### `simulateTransaction`
The reviewed official method page confirms:
- required first param: transaction as encoded string
- optional config fields:
  - `commitment`
  - `encoding`
  - `replaceRecentBlockhash`
  - `sigVerify`
  - `minContextSlot`
  - `innerInstructions`
  - `accounts`
- the transaction is not broadcast
- the docs explicitly note that the transaction need not be signed unless `sigVerify=true`
- when `replaceRecentBlockhash=true`, the RPC node replaces the recent blockhash before simulation

## Pagination / traversal notes
Solana does not use REST page numbers at the transport level; pagination is method-specific inside JSON-RPC params.

Directly confirmed from the reviewed official docs:
- `getSignaturesForAddress` supports history traversal with `before`, `until`, and `limit`
- `getSignaturesForAddress` returns items newest first
- `getSignaturesForAddress` also supports `minContextSlot` for state-floor control

## Rate limits and access notes
From the official overview page:
- the public Solana Foundation RPC endpoints are shared infrastructure
- those shared public endpoints are **not intended for production applications**
- shared public endpoints may return `429` when rate limits are exceeded
- shared public endpoints may return `403` when traffic is blocked

The reviewed first-party docs do **not** publish a numeric request-per-second quota for the shared public endpoints.

## Error / response-format notes
- Transport format is JSON-RPC 2.0 rather than REST JSON resources.
- Method examples consistently show `Content-Type: application/json` request bodies.
- The shared JSON structures reference page documents reusable nested result types rather than a single provider-wide REST schema.
- `sendTransaction` explicitly documents that preflight simulation failures return error data using the same simulation-results structure documented for `simulateTransaction`.
- `getBlock` explicitly documents that the `result` can be `null` when the requested block is not confirmed.

## Important usage notes
- fireROUTE should normalize Solana as a method-based JSON-RPC provider, not as dozens of distinct URL paths.
- The cluster endpoint determines which network you are querying and where transactions are sent.
- Public shared endpoints are fine for exploration and manual review, but the official docs explicitly warn against treating them as production infrastructure.
- WebSocket PubSub is a first-class part of the official API surface and should not be omitted from the provider model.
- Because Solana reuses shared nested JSON structures across many methods, adapter implementations should expect method-specific response shapes under a common JSON-RPC envelope rather than one flat schema.

## Verification notes
This file was manually rebuilt from the current official Solana Foundation RPC docs, including the overview page, the shared JSON structures page, the WebSocket methods page, and sampled method pages for `getBlock`, `getSignaturesForAddress`, `requestAirdrop`, `sendTransaction`, and `simulateTransaction`.