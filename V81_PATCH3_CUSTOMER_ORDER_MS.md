# V81 Patch 3 — Customer Order Callable

- Added callable `createCustomerOrder`; validates Auth UID, order ID, coordinates, addresses, vehicle, payment, distance and required fields.
- Server recalculates fare: RM5 first 5km, RM1/km thereafter, +RM10 car, +RM2 if rain flag true.
- Enforces 30-second rate limit and writes order/contact via Admin SDK.
- Customer page loads Functions SDK + bridge and submits via `MYRIDERKU_V81.createOrder()`.

## Limitations
- Rain flag is client-supplied; server does not independently verify Open-Meteo. Rain fee is not tamper-proof.
- Phone key is format-checked, not derived from phone server-side.
- Confirm `publicConfig/walletMinCash` matches actual config path.
- No Emulator, deployment, production Rules or billing changes.
