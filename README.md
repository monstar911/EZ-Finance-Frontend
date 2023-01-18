# EZ Dapp

https://docs.alphaventuredao.io/homora-v2/additional-information/how-to-calculate-estimated-apr-debt-ratio-and-liquidation-price

How to calculate estimated APR, Debt ratio, and Liquidation price


https://github.com/ClaudeF4491/defi_leveraged_yield_farming_sim/blob/main/farming_simulator.ipynb

Equations:

Rough equation to calculate leveraged Yield Farming returns without factoring in compounding, rewards, fees, etc:

E = L*P*(1 + r_e/n)^(n*t) - (L-1)*P*(1 + r_b/n)^(n*t)
where:

E: final equity
L: Leverage amount (1, or >2)
P: Initial principal
r_e: earning interest rate (such that 0.5=50%)
r_b: borrow interest rate (such that 0.5=50%)
n: number of times compounded a year, can assume daily (365.25).
t: number of years
This can be used as a comparison to this sim if you set all rates/fees to zero except trading fees, and no variation.


https://phemex.com/fees-conditions

Trading Parameters


https://www.omnicalculator.com/finance/apy


https://www.bybithelp.com/bybitHC_Article?language=en_US&id=000001850#d


https://learn.bybit.com/investing/apr-vs-apy-crypto/
Some of the current offers on Bybit Savings