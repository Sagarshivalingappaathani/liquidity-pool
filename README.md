# Token Swap & Liquidity Pool Project

This project implements a token creation, liquidity pool, and swapping system. Token metadata is stored on [Pinata](https://www.pinata.cloud/) for decentralized file storage, with a Constant Mean Market Maker (CMMM) algorithm used for the liquidity pool. Users can swap tokens if a liquidity pool is available.

## Features

1. **Token Creation**: Generates new tokens and stores their metadata on Pinata for secure and decentralized access.
2. **Liquidity Pool**: Implements a liquidity pool using the CMMM algorithm, allowing users to provide liquidity.
3. **Token Swapping**: Enables token swapping functionality if a liquidity pool exists.


## Demo
**Creating Token1**

![Demo 1](https://github.com/Sagarshivalingappaathani/liquidity-pool/blob/main/screenshots/1.png)

**Creating Token2**

![Demo 2](https://github.com/Sagarshivalingappaathani/liquidity-pool/blob/main/screenshots/2.png)

**Creating liquidity pool of Token1 and Token2**

![Demo 3](https://github.com/Sagarshivalingappaathani/liquidity-pool/blob/main/screenshots/3.png)

**Signing the Transaction**

![Demo 4](https://github.com/Sagarshivalingappaathani/liquidity-pool/blob/main/screenshots/4.png)

**Liquidty Pool Deatils**

![Demo 5](https://github.com/Sagarshivalingappaathani/liquidity-pool/blob/main/screenshots/5.png)

## Swapping Token1 and Token2

When swapping tokens, the amount received is calculated using the Constant Product Market Maker (CPMM) algorithm.

### Example Calculation

Let's assume the initial reserves in the liquidity pool are as follows:

- **Token1**: 750
- **Token2**: 250

If you are selling 25 units of **Token2**, the amount of **Token1** received can be calculated using the formula:

\[
x * y = k
\]

Where:
- \( x \) = reserve of Token1
- \( y \) = reserve of Token2
- \( k \) = constant product of reserves

1. **Calculate the constant product**:
   \[
   k = 750 * 250 = 187500
   \]

2. **After selling 25 Token2**, the new reserve of Token2 becomes:
   \[
   y' = 250 + 25 = 275
   \]

3. **Using the constant product formula to find the new reserve of Token1 (\( x' \))**:
   \[
   x' = k/y' = 187500/275 ~ 681.82
   \]

4. **The amount of Token1 received from the swap is**:
   \[
   \text{Token1 received} = x - x' = 750 - 681.82 ~ 68.18
   \]

So By selling 25 units of **Token2**, you will receive approximately **68.18** units of **Token1**.



![Demo 6](https://github.com/Sagarshivalingappaathani/liquidity-pool/blob/main/screenshots/6.png)

**Swap Confirmation**

![Demo 7](https://github.com/Sagarshivalingappaathani/liquidity-pool/blob/main/screenshots/7.png)

**Toke1 and Token2 in Wallet**

![Demo 8](https://github.com/Sagarshivalingappaathani/liquidity-pool/blob/main/screenshots/8.png)

