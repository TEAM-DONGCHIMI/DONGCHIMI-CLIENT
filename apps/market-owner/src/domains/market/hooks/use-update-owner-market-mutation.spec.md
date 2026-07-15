# Owner Market Update Mutation Spec

## Contract

- Endpoint: `PUT /v1/owners/markets/{marketId}`
- Input: `marketId` and generated `MarketUpdateRequest`
- Output: `{ success, code, message }`, validated at the API boundary
- Cache: invalidate the matching owner market detail query after success

## States And Side Effects

- Pending: disable submit and show `수정 중...`
- Success: reset dirty state and show the server success message
- Error: expose `INVALID_INPUT`, `MARKET_ACCESS_DENIED`, `MARKET_NOT_FOUND`, and `MARKET_ALREADY_EXISTS` messages through the form Toast
