# Token Swap & Liquidity Pool Project

This project implements a token creation, liquidity pool, and swapping system. Token metadata is stored on [Pinata](https://www.pinata.cloud/) for decentralized file storage, with a Constant Mean Market Maker (CMMM) algorithm used for the liquidity pool. Users can swap tokens if a liquidity pool is available.

## Features

1. **Token Creation**: Generates new tokens and stores their metadata on Pinata for secure and decentralized access.
2. **Liquidity Pool**: Implements a liquidity pool using the CMMM algorithm, allowing users to provide liquidity.
3. **Token Swapping**: Enables token swapping functionality if a liquidity pool exists.

## Screenshots

### 1. Creating New Token Catty
![Token Creation](https://github.com/Sagarshivalingappaathani/liquidity-pool/blob/main/screenshots/1.png)

### 2. Creating New Token Doggy
![Liquidity Pool](https://github.com/Sagarshivalingappaathani/liquidity-pool/blob/main/screenshots/2.png)

### 3. Creating Liquidity Pool
![Token Swapping](https://github.com/Sagarshivalingappaathani/liquidity-pool/blob/main/screenshots/3.png)

## CMMM Algorithm (Constant Mean Market Maker) Example

The **Constant Mean Market Maker (CMMM)** algorithm ensures that the liquidity pool remains balanced by maintaining a constant product of the quantities of two tokens. Let's walk through an example:

### Example:

Suppose you have a liquidity pool with **Token A** and **Token B**. Initially, the pool contains:
- 100 **Token A**
- 200 **Token B**

The constant product (CMMM) is calculated as:
Constant Product = Token A Quantity × Token B Quantity = 100 × 200 = 20,000


Now, if a user wants to swap 10 **Token A** for **Token B**, the pool state will adjust to maintain the constant product:

1. **New Quantity of Token A**: 100 - 10 = 90
2. To maintain the constant product, the new quantity of **Token B** will be:


Thus, the user will receive approximately **22.22 Token B** for their 10 **Token A**, and the pool will now have:
- 90 **Token A**
- 222.22 **Token B**

This ensures that the liquidity pool remains balanced and liquid for token swaps.


### 4. Tanssaction Confirmation
![Metadata Storage](https://github.com/Sagarshivalingappaathani/liquidity-pool/blob/main/screenshots/4.png)

### 5. Created Liquidity Pool Details
![CMMM Algorithm](https://github.com/Sagarshivalingappaathani/liquidity-pool/blob/main/screenshots/5.png)

### 6. Swaping Tokens
![Adding Liquidity](https://github.com/Sagarshivalingappaathani/liquidity-pool/blob/main/screenshots/6.png)

### 7. Tanssaction Confirmation
![Swapping Tokens](https://github.com/Sagarshivalingappaathani/liquidity-pool/blob/main/screenshots/7.png)

### 8. Wallet
![Swap Confirmation](https://github.com/Sagarshivalingappaathani/liquidity-pool/blob/main/screenshots/8.png)
