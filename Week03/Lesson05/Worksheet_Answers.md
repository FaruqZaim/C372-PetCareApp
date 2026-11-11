# C372 W03 L05 Worksheet Answers

## Exercise 1 — Trace adding a new pet

- **ROUTE:** `POST /pets` in `routes/petRoutes.js`.
- **MIDDLEWARE:** `upload.single('pet_image')` processes the uploaded image, followed by `isLoggedIn`, which checks for a logged-in user.
- **CONTROLLER:** `petController.createPet` reads the submitted pet details and image filename, gets the owner's ID from `req.session.user.id`, and calls the Model.
- **MODEL:** `petModel.createPet` runs `INSERT INTO pets (owner_id, name, species, breed, age, image) VALUES (?, ?, ?, ?, ?, ?)`.
- **RESPONSE:** On success, redirect to `/journals`. On failure, send `Failed to add pet.`

`app.js` registers `petRoutes`, allowing Express to receive the route.

## Exercise 2 — Clarification questions

| Clarification question | Possible response/assumption |
|---|---|
| What service data is available, including IDs, names and prices? | Use a mock catalogue: 1 Vaccination $35, 2 Pet Grooming $50, and 3 Boarding $80. |
| What should a successful request return? | HTTP 200 JSON with exactly `serviceId`, `serviceName`, `amount`, `currency`, and `status`. Currency is `sgd`; status is `READY_FOR_PAYMENT`. |
| What should happen if the service does not exist? | Return HTTP 404 with `{"error":"Service not found"}`. |
| Must the pet owner be logged in? | No. This classroom mock endpoint does not require login. |
| Does the feature charge money or connect to a gateway? | No. It only prepares payment details. It does not process a payment. |
| Can the client submit or modify the price? | No. The server must always use the price from the mock catalogue. |
| Are database tables or EJS pages required? | No new tables or pages are included. The endpoint returns JSON only. |

## Exercise 3

The approved specification is in `specs/prepare-payment.md`.

## Exercise 4

The implementation is in:

- `data/mockServices.js`
- `routes/paymentRoutes.js`
- `controllers/paymentController.js`
- `app.js`

## Exercise 5

| Scenario | HTTP status code | Why? |
|---|---:|---|
| A. Router exists but is not registered in `app.js`. | 404 | Express has no registered route matching the URL. |
| B. Route uses `:id`, but the Controller reads `serviceId`. | 404 | `req.params.serviceId` is undefined, so no catalogue service is found. The parameter names must match. |
| C. Service 1 costs $35, but the client requests `/1?amount=1`. | 200 | The Controller ignores the client query amount and uses the server catalogue price, so the response amount remains 35. |

## Exercise 6 — Expected outputs

### `http://localhost:3000/payments/prepare/1`

HTTP 200:

```json
{"serviceId":1,"serviceName":"Vaccination","amount":35,"currency":"sgd","status":"READY_FOR_PAYMENT"}
```

### `http://localhost:3000/payments/prepare/2`

HTTP 200:

```json
{"serviceId":2,"serviceName":"Pet Grooming","amount":50,"currency":"sgd","status":"READY_FOR_PAYMENT"}
```

### `http://localhost:3000/payments/prepare/3`

HTTP 200:

```json
{"serviceId":3,"serviceName":"Boarding","amount":80,"currency":"sgd","status":"READY_FOR_PAYMENT"}
```

### `http://localhost:3000/payments/prepare/999`

HTTP 404:

```json
{"error":"Service not found"}
```
