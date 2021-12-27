---
layout: project.njk
title: Split Finance
description: A protocol for splitting tokens into fungible yield, governance and capital components
date: 2020-10-00
tags: project
iconImageName: split-icon.png
githubUrl: https://github.com/split-fi/split
twitterUrl: https://twitter.com/splitprotocol
genericUrl: https://showcase.ethglobal.com/ethonline/split
---

Split is a decentralized finance protocol built on Ethereum that came out of conversations with [James Simpson](https://twitter.com/0xApricity), [Richard Galvin](https://twitter.com/richwgalvin), and Alex Erikstrup. These conversations eventually became a whitepaper and a usable protocol and product. An MVP of the protocol and corresponding application was built during the 3 week [ETHGlobal](https://showcase.ethglobal.com/ethonline) hackathon in collaboration with [Fabio Berger](https://fabioberger.com/) and David Sun, where it won the [Compound](https://compound.finance/) sponsor prize.

Around the time Split was being ideated on (September 2020), decentralized finance yields were astronomical, and it felt like new yield bearing assets were being created every day. At the same time, governance tokens were also hitting their stride, with tokens like [UNI](https://uniswap.org/blog/uni) and [COMP](https://compound.finance/governance/comp) being released only weeks prior. Some tokens even provided yield and governance rights simultaneously.

From the whitepaper:

> Split Protocol facilitates the disaggregation of existing [ERC20](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/) tokens into various
components representing different, valuable properties of the asset. The core
Split smart contracts are responsible for receiving and custodying ERC20 tokens
and minting their constituent components, which may include some or all of:
governance, yield and capital. The new components represented as individual
ERC20 tokens provide investors with a broader range of risk and return profiles
allowing them to more efficiently allocate capital and make assets more
productive.

The idea behind Split is to allow holders of these new exotic tokens to speculate on specific aspects of their tokens, instead of all aspects at the same time. The protocol allows this by minting constituent (yield, governance and capital) tokens in exchange for the "full" tokens mentioned above. For example, if you deposit a yielding token (such as [cDAI](https://compound.finance/docs/ctokens)) into Split, it will mint you a capital and yield token. The yield token gives perpetual rights to the accumulated yield, and the capital token to the underlying capital.

Fittingly, the [protocol](https://github.com/split-fi/split/tree/main/protocol/contracts) method that allows you to create these constituent tokens is the `split(uint256 amount, address tokenAddress)` method.

```js
  /// @dev Allows a holder of a whitelisted Compound token to split it into it's corresponding Yield and Capital tokens
  /// @param amount of tokens to split
  /// @param tokenAddress the address of token to split
  /// @return amountMintedForEach amount of component tokens minted (each)
  function split(uint256 amount, address tokenAddress) public returns (uint256 amountMintedForEach) {
    ComponentSet memory componentSet = tokensToComponents[tokenAddress];
    if (componentSet.yieldToken == address(0) || componentSet.capitalToken == address(0)) {
      revert("Attempted to split unsupported token");
    }
    // Don't mint tokens if the transferFrom was not successful
    require(
      IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount),
      "Failed to transfer tokens to SplitVault."
    );
    CapitalComponentToken(componentSet.capitalToken).mintFromFull(msg.sender, amount);
    uint256 yieldComponentTokenAmount = YieldComponentToken(componentSet.yieldToken).mintFromFull(msg.sender, amount);
    emit Split(tokenAddress, amount);
    return yieldComponentTokenAmount;
  }

```

These tokens can then be traded and recombined to regain access to the underlying deposit.

Ultimately, everyone ended up working on something else, and Split does not have significant usage today. [Other protocols](https://www.element.fi/) sprang up to capture the opportunity instead.
