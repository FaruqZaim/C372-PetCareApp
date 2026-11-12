# C372 W04 L08 Worksheet Answers

## Exercise 1 — Specification hunt

| ID | Answer | Specification reference |
|---|---|---|
| A | The app must use the price of the active service from the database. The browser cannot override it, even if it submits a different amount. | `service-booking.md`, sections 2 and 4; `service-booking-implementation.md`, section 6 |
| B | One `service_bookings` row and one related `payments` row are created. Both statuses start as `pending`. Payment is not complete and no money is collected. | `service-booking.md`, sections 6–7 |
| C | Clara may book only for pets she owns, such as Mira. She may view only bookings for pets belonging to her own signed-in account. | `service-booking.md`, sections 4 and 8 (AC4 and AC7) |
| D | If saving the payment fails, the transaction must be rolled back. The booking must not remain in the database and the app must not show success. | `service-booking.md`, sections 6 and 8 (AC6); `service-booking-implementation.md`, section 6 |

## Exercise 2 — Classify and defend the claims

| ID | Claim | Classification | Reason |
|---|---|---|---|
| A | Use the signed-in session to identify the owner. | Required | The owner ID must come from `req.session.user.id`, not client input. |
| B | Use a price supplied by the browser. | Forbidden | The database service price is trusted; a browser amount could be modified. |
| C | Reject duplicate pet/service/date bookings. | Deferred | Duplicate prevention is an open question and is not part of the baseline requirements. |
| D | Charge a customer’s bank card. | Forbidden | Real payment processing and payment credentials are outside this lesson’s scope. |
| E | Require login for all three booking routes. | Required | AC8 protects `/services`, `/services/book`, and `/bookings`. |
| F | Limit how far ahead a customer can book. | Deferred | A maximum advance-booking window needs later agreement. |
| G | Save a payment record together with the booking. | Required | The booking and related pending payment must be saved atomically in one transaction. |

## Exercise 3 — Predict the page and records

Assumptions: Today is 3 November 2026, Clara owns Mira, and Basic Bath is active at S$25.00.

| Case | Decision and redirect | Message | Database result | AC |
|---|---|---|---|---|
| 1 | Accept; redirect to `/bookings`. | `Booking created. Payment is pending; no payment has been processed.` | One pending booking at 25.00 and one related pending payment at 25.00. | AC1–AC2 |
| 2 | Reject past date; redirect to `/services`. | `Choose a pet, service, and valid booking date.` | No booking or payment created. | AC3 |
| 3 | Reject impossible date; redirect to `/services`. | `Choose a pet, service, and valid booking date.` | No booking or payment created. | AC3 |
| 4 | Reject pet not owned by Clara; redirect to `/services`. | `That pet or service is unavailable for booking.` | No booking or payment created. | AC4 |
| 5 | Reject inactive service; redirect to `/services`. | `That pet or service is unavailable for booking.` | No booking or payment created. | AC5 |
| 6 | Ignore `amount=1`; accept and redirect to `/bookings`. | `Booking created. Payment is pending; no payment has been processed.` | Booking and payment both use the trusted database price of 25.00. | AC1 |

## Exercise 4 — Schema discussion

1. **Ownership:** `pets.owner_id` links Mira to Clara’s `users.id`. The app reads Clara’s user ID from the signed-in session and verifies that the selected pet has that `owner_id`.
2. **Saved records:** A new `service_bookings` row is created with `booking_status = pending` and `booked_price = 25.00`. A related `payments` row is created with `payment_status = pending` and `amount = 25.00`. Existing user, pet and journal rows do not change.
3. **Meaning:** A pending payment means only that a payment record has been prepared. It does not mean money was collected, approved, or transferred.

## Exercise 5 — Implementation summary

- `routes/serviceRoutes.js` defines the three protected routes.
- `controllers/serviceController.js` validates inputs, handles flash messages and renders the pages.
- `models/serviceModel.js` loads active database services.
- `models/serviceBookingModel.js` creates the booking/payment transaction and loads owner-filtered history.
- `app.js` registers the service router.
- `views/services.ejs` and `views/bookings.ejs` provide the supplied pages.
- `views/partials/navbar.ejs` links signed-in users to Services and Bookings.

The implementation uses the signed-in session owner, parameterised SQL, database prices, real local-date validation, rollback on failure, and connection release on all transaction paths.

## Exercise 6 — Test evidence

| Check | Actual result and evidence | Pass / Fail |
|---|---|---|
| AC1 | Signed in as Clara and booked Mira for Basic Bath today while also submitting `amount=1`. The app redirected to Booking History and displayed the success message. Database evidence shows booking 1 and payment 1 at 25.00 with both statuses `pending`, proving the browser amount was ignored. | Pass |
| AC2 | Today's date (`2026-11-12`) and a future date (`2026-11-13`) were both accepted. Database evidence shows one linked booking/payment pair for each date. | Pass |
| AC3 | Impossible date `2026-02-30`, past date `2026-11-11`, and pet ID `0` each displayed the validation message. Only the two valid bookings exist, so invalid requests created no records. | Pass |
| AC4 | Clara submitted pet ID 1, which she does not own. The unavailable message was displayed and no additional booking/payment was created. | Pass |
| AC5 | Clara submitted unknown service ID 999. The unavailable message was displayed and no additional booking/payment was created. | Pass |
| AC6 | Code review confirms one acquired connection, rollback on failed writes/commit, callback-once protection, and release on all terminal paths. Destructive failure injection was not run against the development database. | Not assessed for failure injection |
| AC7 | Clara's history showed Mira's two pending bookings. Amy's separate session returned HTTP 200 without Mira or Clara's booking data. | Pass |
| AC8 | Signed-out checks: `GET /services`, `POST /services/book`, and `GET /bookings` each returned HTTP 302 with `Location: /login`. | Pass |
| Regression | Clara login succeeded and `/journals` returned HTTP 200 after the booking feature was added. | Pass |
