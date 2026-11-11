# C372 W03 L06 Worksheet Answers

## Exercise 1

Created `Week03/Lesson06/PetCareAppMVC` by copying the completed Lesson 5 application without `node_modules`. Lesson 5 remains unchanged as a reference. Dependencies were installed and the existing GET payment-preparation endpoint was retained.

## Exercise 2

Created a Postman workspace and a collection named `Week03`. The GET request to `/payments/prepare/2` should return HTTP 200:

```json
{
  "serviceId": 2,
  "serviceName": "Pet Grooming",
  "amount": 50,
  "currency": "sgd",
  "status": "READY_FOR_PAYMENT"
}
```

## Exercise 3

| Check | Request | HTTP status | Service name; amount |
|---|---|---:|---|
| AC1 | `GET /payments/prepare/1` | 200 | Vaccination; 35 |
| AC2 | `GET /payments/prepare/2` | 200 | Pet Grooming; 50 |
| AC3 | `GET /payments/prepare/3` | 200 | Boarding; 80 |
| AC4 | `GET /payments/prepare/999` | 404 | `Service not found`; no amount |
| Price | `GET /payments/prepare/1?amount=1` | 200 | Vaccination; 35 |

The Price check remains 35 because the server catalogue is trusted and the client-supplied query amount is ignored.

## Exercise 4

| Event | Sequence | Role |
|---|---:|---|
| Sends `POST /payments/mock/2` with `testStatus` PENDING. | 1 | Client |
| Reads the $50 catalogue price, then calls the local mock. | 2 | PetCare |
| Returns `providerPaymentId` and status PENDING. | 3 | Local mock |
| Maps the status and sends the HTTP JSON response. | 4 | PetCare |

## Exercise 5

The implementation makes these changes while preserving the existing GET endpoint:

- Creates `services/mockPaymentProvider.js` to simulate the provider.
- Adds `createMockPayment` to `controllers/paymentController.js`.
- Adds `POST /payments/mock/:serviceId` to `routes/paymentRoutes.js`.
- Adds `express.json()` before route registration in `app.js`.
- Uses server catalogue prices and does not add a real provider, database table, or EJS page.

## Exercise 6

**Trusted price:** PetCare must obtain the amount from the server-side service catalogue. It must not trust an amount sent by the client.

**Booking outcome:** If the mock provider returns PENDING, PetCare returns `bookingStatus: "AWAITING_PAYMENT"`.

**Unknown service:** PetCare returns HTTP 404 with:

```json
{"error":"Service not found"}
```

## Exercise 7

| Check | Request and body | Expected result |
|---|---|---|
| MC1 | `POST /payments/mock/2` + `{"testStatus":"APPROVED"}` | HTTP 200; `paymentStatus: "APPROVED"`; `bookingStatus: "CONFIRMED"` |
| MC2 | `POST /payments/mock/2` + `{"testStatus":"PENDING"}` | HTTP 200; `paymentStatus: "PENDING"`; `bookingStatus: "AWAITING_PAYMENT"` |
| MC3 | `POST /payments/mock/2` + `{"testStatus":"DECLINED"}` | HTTP 200; `paymentStatus: "DECLINED"`; `bookingStatus: "PAYMENT_FAILED"` |
| MC4 | `POST /payments/mock/999` + `{"testStatus":"PENDING"}` | HTTP 404; `{"error":"Service not found"}` |
| MC5 | `POST /payments/mock/2` + `{}` | HTTP 200; defaults to `paymentStatus: "PENDING"`; `bookingStatus: "AWAITING_PAYMENT"` |

Every successful POST response contains exactly these five fields: `serviceId`, `providerPaymentId`, `merchantReference`, `paymentStatus`, and `bookingStatus`.
