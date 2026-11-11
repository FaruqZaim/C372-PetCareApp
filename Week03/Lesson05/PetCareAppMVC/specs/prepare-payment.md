# Feature: Prepare payment details

## 1. User goal

Pet owners need to review the selected pet service and the correct amount before proceeding to payment.

## 2. Scope

The feature returns mock payment-preparation details for one service from a fixed server-side catalogue. It does not charge money, connect to a payment gateway, create database tables, or add EJS pages. No login is required for this classroom mock endpoint.

## 3. Request

- Method: `GET`
- URL: `/payments/prepare/:serviceId`
- Input: `serviceId` is supplied as a URL path parameter.
- The server must use the catalogue price and must not accept a client-supplied payment amount.

## 4. Service catalogue

| Service ID | Service name | Price |
|---|---|---:|
| 1 | Vaccination | 35 |
| 2 | Pet Grooming | 50 |
| 3 | Boarding | 80 |

## 5. Successful response

The server returns HTTP `200` and a JSON object containing exactly five fields:

```json
{
  "serviceId": 1,
  "serviceName": "Vaccination",
  "amount": 35,
  "currency": "sgd",
  "status": "READY_FOR_PAYMENT"
}
```

- `serviceId` and `amount` are JSON numbers.
- `serviceName`, `currency`, and `status` are strings.
- `currency` must be exactly `sgd`.
- `status` must be exactly `READY_FOR_PAYMENT`.

## 6. Unsuccessful response

If the service does not exist, the server returns HTTP `404` and exactly:

```json
{"error":"Service not found"}
```

## 7. Acceptance criteria

- AC1: Requesting service ID 1 returns HTTP 200, Vaccination, and amount 35.
- AC2: Requesting service ID 2 returns HTTP 200, Pet Grooming, and amount 50.
- AC3: Requesting service ID 3 returns HTTP 200, Boarding, and amount 80.
- AC4: Requesting service ID 999 returns HTTP 404 and `{"error":"Service not found"}`.
- AC5: Every successful response has exactly five fields, correct JSON types, currency `sgd`, and status `READY_FOR_PAYMENT`.

## 8. Open questions

Handling malformed service IDs has not been agreed. No additional validation rule is included in this lesson.
