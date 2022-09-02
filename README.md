Run using
node app




---
Stripe webhook
https://dashboard.stripe.com/test/webhooks/create?endpoint_location=local
https://stripe.com/docs/stripe-cli

./stripe login

./stripe listen --forward-to localhost:3001/stripeCallback

---
Stripe payment / item  data
https://stripe.com/docs/api/products/object

---
Stripe branding
https://dashboard.stripe.com/settings/branding

---
https://stripe.com/docs/checkout/quickstart?lang=node

- I need 3 plain HTML sites
    - with the checkout button to buy the ticket

    - success page

    - error page

---


Stripe callback payload: {
"id": "evt_3LbOiwFItYEyplx106BOBhNr",
"object": "event",
"api_version": "2022-08-01",
"created": 1661605615,
"data": {
"object": {
"id": "pi_3LbOiwFItYEyplx10U6wyXfe",
"object": "payment_intent",
"amount": 10,
"amount_capturable": 0,
"amount_details": {
"tip": {
}
},
"amount_received": 0,
"application": null,
"application_fee_amount": null,
"automatic_payment_methods": null,
"canceled_at": null,
"cancellation_reason": null,
"capture_method": "automatic",
"charges": {
"object": "list",
"data": [

        ],
        "has_more": false,
        "total_count": 0,
        "url": "/v1/charges?payment_intent=pi_3LbOiwFItYEyplx10U6wyXfe"
      },
      "client_secret": "pi_3LbOiwFItYEyplx10U6wyXfe_secret_6wTPmGJz09UyFqVhK0z5WN3VE",
      "confirmation_method": "automatic",
      "created": 1661605614,
      "currency": "eur",
      "customer": null,
      "description": null,
      "invoice": null,
      "last_payment_error": null,
      "livemode": false,
      "metadata": {
      },
      "next_action": {
        "redirect_to_url": {
          "return_url": "https://checkout.stripe.com/pay/cs_test_a1B4p8vggQ8hK7HxJ8zJJmud18xHSQDcMGsdPZGSkzGpyx5qLdOvRmfjuo?redirect_pm_type=ideal\u0026lid=b0fd974b-0de2-4580-9534-d99b6a1df865#fidkdWxOYHwnPyd1blpxYHZxWjA0SWdIUXxDTHFcQHx1aX00UkBtZmFNd2dWdU5QVFxMUzRqaVdsQERWUUR0fTNUY0Y9Y0NXb2FAPUZXR1VNaE5Oc0BjYklzbl1dTlJVdzJPN2BSV1BRcX1hNTV2MkZXU1ZVNCcpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl",
          "url": "https://pm-redirects.stripe.com/authorize/acct_1LbMTyFItYEyplx1/pa_nonce_MK2obUQTxbFKl4JwH5l4NTkGDkmqQP8"
        },
        "type": "redirect_to_url"
      },
      "on_behalf_of": null,
      "payment_method": "pm_1LbOivFItYEyplx18XbQNrEW",
      "payment_method_options": {
        "ideal": {
        }
      },
      "payment_method_types": [
        "ideal"
      ],
      "processing": null,
      "receipt_email": null,
      "review": null,
      "setup_future_usage": null,
      "shipping": null,
      "source": null,
      "statement_descriptor": null,
      "statement_descriptor_suffix": null,
      "status": "requires_action",
      "transfer_data": null,
      "transfer_group": null
    }
},
"livemode": false,
"pending_webhooks": 2,
"request": {
"id": "req_IzQTZYYCwIdYwv",
"idempotency_key": "f5744479-7d7e-497b-b3e7-22dfd47a3496"
},
"type": "payment_intent.requires_action"
}  event:  {
id: 'evt_3LbOiwFItYEyplx106BOBhNr',
object: 'event',
api_version: '2022-08-01',
created: 1661605615,
data: {
object: {
id: 'pi_3LbOiwFItYEyplx10U6wyXfe',
object: 'payment_intent',
amount: 10,
amount_capturable: 0,
amount_details: [Object],
amount_received: 0,
application: null,
application_fee_amount: null,
automatic_payment_methods: null,
canceled_at: null,
cancellation_reason: null,
capture_method: 'automatic',
charges: [Object],
client_secret: 'pi_3LbOiwFItYEyplx10U6wyXfe_secret_6wTPmGJz09UyFqVhK0z5WN3VE',
confirmation_method: 'automatic',
created: 1661605614,
currency: 'eur',
customer: null,
description: null,
invoice: null,
last_payment_error: null,
livemode: false,
metadata: {},
next_action: [Object],
on_behalf_of: null,
payment_method: 'pm_1LbOivFItYEyplx18XbQNrEW',
payment_method_options: [Object],
payment_method_types: [Array],
processing: null,
receipt_email: null,
review: null,
setup_future_usage: null,
shipping: null,
source: null,
statement_descriptor: null,
statement_descriptor_suffix: null,
status: 'requires_action',
transfer_data: null,
transfer_group: null
}
},
livemode: false,
pending_webhooks: 2,
request: {
id: 'req_IzQTZYYCwIdYwv',
idempotency_key: 'f5744479-7d7e-497b-b3e7-22dfd47a3496'
},
type: 'payment_intent.requires_action'
}









Stripe callback payload: {
"id": "evt_3LbOiwFItYEyplx101ediOCe",
"object": "event",
"api_version": "2022-08-01",
"created": 1661605614,
"data": {
"object": {
"id": "pi_3LbOiwFItYEyplx10U6wyXfe",
"object": "payment_intent",
"amount": 10,
"amount_capturable": 0,
"amount_details": {
"tip": {
}
},
"amount_received": 0,
"application": null,
"application_fee_amount": null,
"automatic_payment_methods": null,
"canceled_at": null,
"cancellation_reason": null,
"capture_method": "automatic",
"charges": {
"object": "list",
"data": [

        ],
        "has_more": false,
        "total_count": 0,
        "url": "/v1/charges?payment_intent=pi_3LbOiwFItYEyplx10U6wyXfe"
      },
      "client_secret": "pi_3LbOiwFItYEyplx10U6wyXfe_secret_6wTPmGJz09UyFqVhK0z5WN3VE",
      "confirmation_method": "automatic",
      "created": 1661605614,
      "currency": "eur",
      "customer": null,
      "description": null,
      "invoice": null,
      "last_payment_error": null,
      "livemode": false,
      "metadata": {
      },
      "next_action": null,
      "on_behalf_of": null,
      "payment_method": null,
      "payment_method_options": {
        "ideal": {
        }
      },
      "payment_method_types": [
        "ideal"
      ],
      "processing": null,
      "receipt_email": null,
      "review": null,
      "setup_future_usage": null,
      "shipping": null,
      "source": null,
      "statement_descriptor": null,
      "statement_descriptor_suffix": null,
      "status": "requires_payment_method",
      "transfer_data": null,
      "transfer_group": null
    }
},
"livemode": false,
"pending_webhooks": 2,
"request": {
"id": "req_IzQTZYYCwIdYwv",
"idempotency_key": "f5744479-7d7e-497b-b3e7-22dfd47a3496"
},
"type": "payment_intent.created"
}  event:  {
id: 'evt_3LbOiwFItYEyplx101ediOCe',
object: 'event',
api_version: '2022-08-01',
created: 1661605614,
data: {
object: {
id: 'pi_3LbOiwFItYEyplx10U6wyXfe',
object: 'payment_intent',
amount: 10,
amount_capturable: 0,
amount_details: [Object],
amount_received: 0,
application: null,
application_fee_amount: null,
automatic_payment_methods: null,
canceled_at: null,
cancellation_reason: null,
capture_method: 'automatic',
charges: [Object],
client_secret: 'pi_3LbOiwFItYEyplx10U6wyXfe_secret_6wTPmGJz09UyFqVhK0z5WN3VE',
confirmation_method: 'automatic',
created: 1661605614,
currency: 'eur',
customer: null,
description: null,
invoice: null,
last_payment_error: null,
livemode: false,
metadata: {},
next_action: null,
on_behalf_of: null,
payment_method: null,
payment_method_options: [Object],
payment_method_types: [Array],
processing: null,
receipt_email: null,
review: null,
setup_future_usage: null,
shipping: null,
source: null,
statement_descriptor: null,
statement_descriptor_suffix: null,
status: 'requires_payment_method',
transfer_data: null,
transfer_group: null
}
},
livemode: false,
pending_webhooks: 2,
request: {
id: 'req_IzQTZYYCwIdYwv',
idempotency_key: 'f5744479-7d7e-497b-b3e7-22dfd47a3496'
},
type: 'payment_intent.created'
}














Stripe callback payload: {
"id": "evt_1LbOjEFItYEyplx1clX5JYOG",
"object": "event",
"api_version": "2022-08-01",
"created": 1661605632,
"data": {
"object": {
"id": "cs_test_a1B4p8vggQ8hK7HxJ8zJJmud18xHSQDcMGsdPZGSkzGpyx5qLdOvRmfjuo",
"object": "checkout.session",
"after_expiration": null,
"allow_promotion_codes": null,
"amount_subtotal": 10,
"amount_total": 10,
"automatic_tax": {
"enabled": false,
"status": null
},
"billing_address_collection": null,
"cancel_url": "https://www.nomadicdays.org/paymentError",
"client_reference_id": null,
"consent": null,
"consent_collection": null,
"currency": "eur",
"customer": null,
"customer_creation": "if_required",
"customer_details": {
"address": {
"city": null,
"country": null,
"line1": null,
"line2": null,
"postal_code": null,
"state": null
},
"email": "bhblahla@asd.co.uk",
"name": "asda asd",
"phone": null,
"tax_exempt": "none",
"tax_ids": [

        ]
      },
      "customer_email": null,
      "expires_at": 1661691771,
      "livemode": false,
      "locale": null,
      "metadata": {
      },
      "mode": "payment",
      "payment_intent": "pi_3LbOiwFItYEyplx10U6wyXfe",
      "payment_link": null,
      "payment_method_collection": "always",
      "payment_method_options": {
      },
      "payment_method_types": [
        "ideal"
      ],
      "payment_status": "paid",
      "phone_number_collection": {
        "enabled": false
      },
      "recovered_from": null,
      "setup_intent": null,
      "shipping_address_collection": null,
      "shipping_cost": null,
      "shipping_details": null,
      "shipping_options": [

      ],
      "status": "complete",
      "submit_type": null,
      "subscription": null,
      "success_url": "https://www.nomadicdays.org/paymentSuccess",
      "total_details": {
        "amount_discount": 0,
        "amount_shipping": 0,
        "amount_tax": 0
      },
      "url": null
    }
},
"livemode": false,
"pending_webhooks": 2,
"request": {
"id": null,
"idempotency_key": null
},
"type": "checkout.session.completed"
}  event:  {
id: 'evt_1LbOjEFItYEyplx1clX5JYOG',
object: 'event',
api_version: '2022-08-01',
created: 1661605632,
data: {
object: {
id: 'cs_test_a1B4p8vggQ8hK7HxJ8zJJmud18xHSQDcMGsdPZGSkzGpyx5qLdOvRmfjuo',
object: 'checkout.session',
after_expiration: null,
allow_promotion_codes: null,
amount_subtotal: 10,
amount_total: 10,
automatic_tax: [Object],
billing_address_collection: null,
cancel_url: 'https://www.nomadicdays.org/paymentError',
client_reference_id: null,
consent: null,
consent_collection: null,
currency: 'eur',
customer: null,
customer_creation: 'if_required',
customer_details: [Object],
customer_email: null,
expires_at: 1661691771,
livemode: false,
locale: null,
metadata: {},
mode: 'payment',
payment_intent: 'pi_3LbOiwFItYEyplx10U6wyXfe',
payment_link: null,
payment_method_collection: 'always',
payment_method_options: {},
payment_method_types: [Array],
payment_status: 'paid',
phone_number_collection: [Object],
recovered_from: null,
setup_intent: null,
shipping_address_collection: null,
shipping_cost: null,
shipping_details: null,
shipping_options: [],
status: 'complete',
submit_type: null,
subscription: null,
success_url: 'https://www.nomadicdays.org/paymentSuccess',
total_details: [Object],
url: null
}
},
livemode: false,
pending_webhooks: 2,
request: { id: null, idempotency_key: null },
type: 'checkout.session.completed'
}










Stripe callback payload: {
"id": "evt_3LbOiwFItYEyplx10M0bcFZb",
"object": "event",
"api_version": "2022-08-01",
"created": 1661605632,
"data": {
"object": {
"id": "pi_3LbOiwFItYEyplx10U6wyXfe",
"object": "payment_intent",
"amount": 10,
"amount_capturable": 0,
"amount_details": {
"tip": {
}
},
"amount_received": 10,
"application": null,
"application_fee_amount": null,
"automatic_payment_methods": null,
"canceled_at": null,
"cancellation_reason": null,
"capture_method": "automatic",
"charges": {
"object": "list",
"data": [
{
"id": "py_3LbOiwFItYEyplx10lgnPsPr",
"object": "charge",
"amount": 10,
"amount_captured": 10,
"amount_refunded": 0,
"application": null,
"application_fee": null,
"application_fee_amount": null,
"balance_transaction": "txn_3LbOiwFItYEyplx10sQnWDUv",
"billing_details": {
"address": {
"city": null,
"country": null,
"line1": null,
"line2": null,
"postal_code": null,
"state": null
},
"email": "bhblahla@asd.co.uk",
"name": "asda asd",
"phone": null
},
"calculated_statement_descriptor": null,
"captured": true,
"created": 1661605632,
"currency": "eur",
"customer": null,
"description": null,
"destination": null,
"dispute": null,
"disputed": false,
"failure_balance_transaction": null,
"failure_code": null,
"failure_message": null,
"fraud_details": {
},
"invoice": null,
"livemode": false,
"metadata": {
},
"on_behalf_of": null,
"order": null,
"outcome": {
"network_status": "approved_by_network",
"reason": null,
"risk_level": "not_assessed",
"seller_message": "Payment complete.",
"type": "authorized"
},
"paid": true,
"payment_intent": "pi_3LbOiwFItYEyplx10U6wyXfe",
"payment_method": "pm_1LbOivFItYEyplx18XbQNrEW",
"payment_method_details": {
"ideal": {
"bank": "rabobank",
"bic": "RABONL2U",
"generated_sepa_debit": null,
"generated_sepa_debit_mandate": null,
"iban_last4": "5264",
"verified_name": "Jenny Rosen"
},
"type": "ideal"
},
"receipt_email": null,
"receipt_number": null,
"receipt_url": "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTGJNVHlGSXRZRXlwbHgxKICuqJgGMgb7hTYKrgU6LBZW6D3HQcDS03EnQQkfyAlzIuBWgnKXwzOK-oGoWHjw_QpzNYdA3XRaFuXt",
"refunded": false,
"refunds": {
"object": "list",
"data": [

              ],
              "has_more": false,
              "total_count": 0,
              "url": "/v1/charges/py_3LbOiwFItYEyplx10lgnPsPr/refunds"
            },
            "review": null,
            "shipping": null,
            "source": null,
            "source_transfer": null,
            "statement_descriptor": null,
            "statement_descriptor_suffix": null,
            "status": "succeeded",
            "transfer_data": null,
            "transfer_group": null
          }
        ],
        "has_more": false,
        "total_count": 1,
        "url": "/v1/charges?payment_intent=pi_3LbOiwFItYEyplx10U6wyXfe"
      },
      "client_secret": "pi_3LbOiwFItYEyplx10U6wyXfe_secret_6wTPmGJz09UyFqVhK0z5WN3VE",
      "confirmation_method": "automatic",
      "created": 1661605614,
      "currency": "eur",
      "customer": null,
      "description": null,
      "invoice": null,
      "last_payment_error": null,
      "livemode": false,
      "metadata": {
      },
      "next_action": null,
      "on_behalf_of": null,
      "payment_method": "pm_1LbOivFItYEyplx18XbQNrEW",
      "payment_method_options": {
        "ideal": {
        }
      },
      "payment_method_types": [
        "ideal"
      ],
      "processing": null,
      "receipt_email": null,
      "review": null,
      "setup_future_usage": null,
      "shipping": null,
      "source": null,
      "statement_descriptor": null,
      "statement_descriptor_suffix": null,
      "status": "succeeded",
      "transfer_data": null,
      "transfer_group": null
    }
},
"livemode": false,
"pending_webhooks": 2,
"request": {
"id": null,
"idempotency_key": "15794c7d-642f-4883-85d3-daf7852964de"
},
"type": "payment_intent.succeeded"
}  event:  {
id: 'evt_3LbOiwFItYEyplx10M0bcFZb',
object: 'event',
api_version: '2022-08-01',
created: 1661605632,
data: {
object: {
id: 'pi_3LbOiwFItYEyplx10U6wyXfe',
object: 'payment_intent',
amount: 10,
amount_capturable: 0,
amount_details: [Object],
amount_received: 10,
application: null,
application_fee_amount: null,
automatic_payment_methods: null,
canceled_at: null,
cancellation_reason: null,
capture_method: 'automatic',
charges: [Object],
client_secret: 'pi_3LbOiwFItYEyplx10U6wyXfe_secret_6wTPmGJz09UyFqVhK0z5WN3VE',
confirmation_method: 'automatic',
created: 1661605614,
currency: 'eur',
customer: null,
description: null,
invoice: null,
last_payment_error: null,
livemode: false,
metadata: {},
next_action: null,
on_behalf_of: null,
payment_method: 'pm_1LbOivFItYEyplx18XbQNrEW',
payment_method_options: [Object],
payment_method_types: [Array],
processing: null,
receipt_email: null,
review: null,
setup_future_usage: null,
shipping: null,
source: null,
statement_descriptor: null,
statement_descriptor_suffix: null,
status: 'succeeded',
transfer_data: null,
transfer_group: null
}
},
livemode: false,
pending_webhooks: 2,
request: { id: null, idempotency_key: '15794c7d-642f-4883-85d3-daf7852964de' },
type: 'payment_intent.succeeded'
}





Stripe callback payload: {
"id": "evt_3LbOiwFItYEyplx101Cbb4Sb",
"object": "event",
"api_version": "2022-08-01",
"created": 1661605632,
"data": {
"object": {
"id": "py_3LbOiwFItYEyplx10lgnPsPr",
"object": "charge",
"amount": 10,
"amount_captured": 10,
"amount_refunded": 0,
"application": null,
"application_fee": null,
"application_fee_amount": null,
"balance_transaction": "txn_3LbOiwFItYEyplx10sQnWDUv",
"billing_details": {
"address": {
"city": null,
"country": null,
"line1": null,
"line2": null,
"postal_code": null,
"state": null
},
"email": "bhblahla@asd.co.uk",
"name": "asda asd",
"phone": null
},
"calculated_statement_descriptor": null,
"captured": true,
"created": 1661605632,
"currency": "eur",
"customer": null,
"description": null,
"destination": null,
"dispute": null,
"disputed": false,
"failure_balance_transaction": null,
"failure_code": null,
"failure_message": null,
"fraud_details": {
},
"invoice": null,
"livemode": false,
"metadata": {
},
"on_behalf_of": null,
"order": null,
"outcome": {
"network_status": "approved_by_network",
"reason": null,
"risk_level": "not_assessed",
"seller_message": "Payment complete.",
"type": "authorized"
},
"paid": true,
"payment_intent": "pi_3LbOiwFItYEyplx10U6wyXfe",
"payment_method": "pm_1LbOivFItYEyplx18XbQNrEW",
"payment_method_details": {
"ideal": {
"bank": "rabobank",
"bic": "RABONL2U",
"generated_sepa_debit": null,
"generated_sepa_debit_mandate": null,
"iban_last4": "5264",
"verified_name": "Jenny Rosen"
},
"type": "ideal"
},
"receipt_email": null,
"receipt_number": null,
"receipt_url": "https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTGJNVHlGSXRZRXlwbHgxKICuqJgGMgZPuVcG2vM6LBZ0pfVVylH8bCDj77MdN5D85HgRLBkWV5hzX2uRv3ER0sIopGhhlbk-G0Yq",
"refunded": false,
"refunds": {
"object": "list",
"data": [

        ],
        "has_more": false,
        "total_count": 0,
        "url": "/v1/charges/py_3LbOiwFItYEyplx10lgnPsPr/refunds"
      },
      "review": null,
      "shipping": null,
      "source": null,
      "source_transfer": null,
      "statement_descriptor": null,
      "statement_descriptor_suffix": null,
      "status": "succeeded",
      "transfer_data": null,
      "transfer_group": null
    }
},
"livemode": false,
"pending_webhooks": 2,
"request": {
"id": null,
"idempotency_key": "15794c7d-642f-4883-85d3-daf7852964de"
},
"type": "charge.succeeded"
}  event:  {
id: 'evt_3LbOiwFItYEyplx101Cbb4Sb',
object: 'event',
api_version: '2022-08-01',
created: 1661605632,
data: {
object: {
id: 'py_3LbOiwFItYEyplx10lgnPsPr',
object: 'charge',
amount: 10,
amount_captured: 10,
amount_refunded: 0,
application: null,
application_fee: null,
application_fee_amount: null,
balance_transaction: 'txn_3LbOiwFItYEyplx10sQnWDUv',
billing_details: [Object],
calculated_statement_descriptor: null,
captured: true,
created: 1661605632,
currency: 'eur',
customer: null,
description: null,
destination: null,
dispute: null,
disputed: false,
failure_balance_transaction: null,
failure_code: null,
failure_message: null,
fraud_details: {},
invoice: null,
livemode: false,
metadata: {},
on_behalf_of: null,
order: null,
outcome: [Object],
paid: true,
payment_intent: 'pi_3LbOiwFItYEyplx10U6wyXfe',
payment_method: 'pm_1LbOivFItYEyplx18XbQNrEW',
payment_method_details: [Object],
receipt_email: null,
receipt_number: null,
receipt_url: 'https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTGJNVHlGSXRZRXlwbHgxKICuqJgGMgZPuVcG2vM6LBZ0pfVVylH8bCDj77MdN5D85HgRLBkWV5hzX2uRv3ER0sIopGhhlbk-G0Yq',
refunded: false,
refunds: [Object],
review: null,
shipping: null,
source: null,
source_transfer: null,
statement_descriptor: null,
statement_descriptor_suffix: null,
status: 'succeeded',
transfer_data: null,
transfer_group: null
}
},
livemode: false,
pending_webhooks: 2,
request: { id: null, idempotency_key: '15794c7d-642f-4883-85d3-daf7852964de' },
type: 'charge.succeeded'
}

