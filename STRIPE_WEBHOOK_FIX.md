# Stripe Webhook Subscription Fix - Summary

Webhook should be started like this: stripe listen --forward-to localhost:8002/stripe/webhook

# Stripe response

2025-08-12 20:08:28 --> customer.subscription.created [evt_1RvSEyDD7zjTTjtR0os2L1tX]
2025-08-12 20:08:28 --> customer.subscription.updated [evt_1RvSEyDD7zjTTjtRpc3U1v0v]
2025-08-12 20:08:28 <-- [200] POST http://localhost:8002/stripe/webhook [evt_1RvSEyDD7zjTTjtR0os2L1tX]
2025-08-12 20:08:28 <-- [200] POST http://localhost:8002/stripe/webhook [evt_1RvSEyDD7zjTTjtRpc3U1v0v]
2025-08-12 20:08:28 --> payment_intent.succeeded [evt_3RvSEvDD7zjTTjtR0lEKbrdR]
2025-08-12 20:08:29 <-- [200] POST http://localhost:8002/stripe/webhook [evt_3RvSEvDD7zjTTjtR0lEKbrdR]
2025-08-12 20:08:29 --> payment_intent.created [evt_3RvSEvDD7zjTTjtR0PnKjsye]
2025-08-12 20:08:29 <-- [200] POST http://localhost:8002/stripe/webhook [evt_1RvSEyDD7zjTTjtReCqQ7wC2]
2025-08-12 20:08:29 <-- [200] POST http://localhost:8002/stripe/webhook [evt_1RvSEyDD7zjTTjtRugUrPXDq]
2025-08-12 20:08:29 <-- [200] POST http://localhost:8002/stripe/webhook [evt_3RvSEvDD7zjTTjtR0PnKjsye]
2025-08-12 20:08:29 --> invoice.created [evt_1RvSEzDD7zjTTjtRQBbQdOc4]
2025-08-12 20:08:29 <-- [200] POST http://localhost:8002/stripe/webhook [evt_1RvSEzDD7zjTTjtRQBbQdOc4]
2025-08-12 20:08:29 --> invoice.finalized [evt_1RvSEzDD7zjTTjtRLUerwIPb]
2025-08-12 20:08:29 <-- [200] POST http://localhost:8002/stripe/webhook [evt_1RvSEzDD7zjTTjtRLUerwIPb]
2025-08-12 20:08:29 --> invoice.updated [evt_1RvSEzDD7zjTTjtRI14v61Sc]
2025-08-12 20:08:29 <-- [200] POST http://localhost:8002/stripe/webhook [evt_1RvSEzDD7zjTTjtRI14v61Sc]
2025-08-12 20:08:29 --> invoice.paid [evt_1RvSEzDD7zjTTjtRf6UtMy1V]
2025-08-12 20:08:29 <-- [200] POST http://localhost:8002/stripe/webhook [evt_1RvSEzDD7zjTTjtRf6UtMy1V]
2025-08-12 20:08:29 --> invoice.payment_succeeded [evt_1RvSEzDD7zjTTjtRjHZS1DZS]
2025-08-12 20:08:29 <-- [200] POST http://localhost:8002/stripe/webhook [evt_1RvSEzDD7zjTTjtRjHZS1DZS]
