---
layout: project.njk
title: Phantom
description: A crypto wallet you'll love. Phantom makes it safe & easy for you to store, send, receive, stake, and swap tokens on the Solana blockchain
date: 2021-05-00
tags: project
iconImageName: phantom-icon-purple.svg
websiteUrl: https://phantom.app/
githubUrl: https://github.com/phantom-labs
twitterUrl: https://twitter.com/phantom
genericUrl: https://techcrunch.com/2021/07/14/crypto-startup-phantom-banks-funding-from-andreessen-horowitz-to-scale-its-multi-chain-wallet/
---

This is in progress and hopefully a post I never finish.

<!-- ![0x API Graphic](/assets/img/0x-api-big.png) -->

https://www.youtube.com/watch?v=dl5Zy3tVkzE

0x API is an HTTP API that gives external developers access to all of [0x](https://0x.org/) liquidity and tooling. More importantly, it goes beyond 0x and is the best way to access liquidity in all of [Decentralized Finance](https://blog.coinbase.com/a-beginners-guide-to-decentralized-finance-defi-574c68ff43c4), as it aggregates liquidity from all available sources, giving the end-user the best possible deal.

Implementing [Ethereum](https://ethereum.org/) token purchasing is extremely developer friendly, and requires less than ten lines of code.

```js
// Get a quote to sell 1 ETH to buy DAI
const response = await fetch(
  'https://api.0x.org/swap/v0/quote?sellToken=ETH&buyToken=DAI&sellAmount=1000000000000000000'
)
const quote = await response.json()
// Send to ethereum with your favorite Web3 Library
window.web3.eth.sendTransaction(quote, (err, txId) => {
  console.log('Success!', txId)
})
```

The API averages millions of dollars per day in crypto trading volume, and handles hundreds of requests per second without a hiccup. It provides the swapping functionality behind many popular [Decentralized Finance](https://blog.coinbase.com/a-beginners-guide-to-decentralized-finance-defi-574c68ff43c4) apps such as [Zerion](https://zerion.io/), [Relay](https://relay.radar.tech/), and [Matcha](https://matcha.xyz/). It also represents the first public-facing service with an SLA, on-call rotation, and [status page](https://status.0x.org/) run by 0x engineering.
