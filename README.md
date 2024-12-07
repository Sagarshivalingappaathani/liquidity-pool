# Token Swap & Liquidity Pool Project

This project implements a token creation, liquidity pool, and swapping system. Token metadata is stored on [Pinata](https://www.pinata.cloud/) for decentralized file storage, with a Constant Product Market Maker (CPMM) algorithm used for the liquidity pool. Users can swap tokens if a liquidity pool is available.

## Features

1. **Token Creation**: Generates new tokens and stores their metadata on Pinata for secure and decentralized access.
2. **Liquidity Pool**: Implements a liquidity pool using the CMMM algorithm, allowing users to provide liquidity.
3. **Token Swapping**: Enables token swapping functionality if a liquidity pool exists.

## Screenshots

### 1. Creating New Token Catty
![Token Creation](https://github.com/Sagarshivalingappaathani/liquidity-pool/blob/main/screenshots/1.png)

### 2. Creating New Token Doggy
![Liquidity Pool](https://github.com/Sagarshivalingappaathani/liquidity-pool/blob/main/screenshots/2.png)

### 3. Creating Liquidity Pool of Catty and Doggy
![Token Swapping](https://github.com/Sagarshivalingappaathani/liquidity-pool/blob/main/screenshots/3.png)

## Liquidity Pool Creation with CPMM Algorithm

### Initial Token Amounts:
- **Catty Tokens**: 1000
- **Doggy Tokens**: 500

### Tokens Contributed to the Liquidity Pool:
- You contribute **750 Catty Tokens** and **250 Doggy Tokens** to the liquidity pool.

### CPMM Algorithm (Constant Product Market Maker):
The CPMM algorithm ensures that the product of the quantities of the two tokens in the liquidity pool remains constant. The constant product formula is:

Constant Product = Catty Quantity × Doggy Quantity

Initially, the liquidity pool will have:
Constant Product = 750 (Catty) × 250 (Doggy) = 187,500

### How the CPMM Works:
Let’s walk through an example where you want to **add 25 Doogy Tokens** to the pool and receive **Catty Tokens** in return.

#### Initial Pool State:
- **Catty Tokens**: 750
- **Doggy Tokens**: 250

The constant product is:

Constant Product = 750 (Catty) × 250 (Doggy) = 187,500


#### Step 1: Adding 25 Doggy Tokens
You want to **add 25 Doggy Tokens** to the pool. After adding, the new Doogy Token quantity will be:
- **New Doggy Token Quantity**: 250+25 = 275

Now, we calculate the new quantity of Doggy tokens to maintain the constant product:

New Catty Quantity = Constant Product / New Doggy Quantity = 187,500 / 275 = 681.81


#### Step 2: Catty Tokens to be Received
- **Catty Tokens to be received**: 750 (original) - 681.81 (new) = **68.18 Catty Tokens**

#### Final Pool State:
- **Catty Tokens**: 681.81
- **Doggy Tokens**: 275

By adding 25 Doggy Tokens, you receive approximately **68.18 Catty Tokens**, and the pool remains balanced with the constant product maintained at 187,500.


### 4. Tanssaction Confirmation
![Metadata Storage](https://github.com/Sagarshivalingappaathani/liquidity-pool/blob/main/screenshots/4.png)

### 5. Created Liquidity Pool Details
![CMMM Algorithm](https://github.com/Sagarshivalingappaathani/liquidity-pool/blob/main/screenshots/5.png)

### 6. Swaping Tokens Catty and Doggy
![Adding Liquidity](https://github.com/Sagarshivalingappaathani/liquidity-pool/blob/main/screenshots/6.png)

### 7. Tanssaction Confirmation
![Swapping Tokens](https://github.com/Sagarshivalingappaathani/liquidity-pool/blob/main/screenshots/7.png)

