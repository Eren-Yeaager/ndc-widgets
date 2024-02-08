# MDAO smart-contract

## Overview

The smart contract responsible for .

## Getting Started

### Prerequisites

Before starting, make sure you have the following installed:

1. [NEAR CLI RS](https://github.com/near/near-cli-rs), to deploy and interact with the contract.
2. [cargo-near](https://github.com/near/cargo-near), to easily create testnet accounts.

## Building

From the root directory, run:

```cmd
cd contracts
./build.sh
```

## Running Tests

From the root directory, run:

```cmd
cargo test
```
## Deploying

Using [NEAR CLI RS](https://github.com/near/near-cli-rs), run the following command. Be sure to set your own account id and corresponding network.

```cmd
cd contracts
near contract deploy mdao-owner.testnet use-file ./res/mdao.wasm with-init-call new json-args {} prepaid-gas '1 TGas' attached-deposit '0 NEAR' network-config testnet sign-with-keychain send
```