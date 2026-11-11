# C372 W02 L03 Worksheet Answers

## Exercise 1 — Responsibilities in the original `app.js`

The original file handled several concerns:

- Application setup: Express, EJS, URL parsing, static files, sessions and flash messages.
- Database access: MySQL connection details and every SQL query.
- Authentication and authorization: sign-up, login, logout, `isLoggedIn` and `isAdmin`.
- File uploads: multer storage and uploaded pet-image filenames.
- Request handling: reading form/query/route values and choosing responses or redirects.
- Presentation: choosing EJS views and the variables passed to them.
- Server startup: listening on port 3000.

For example, `POST /pets` originally configured the upload middleware, read the pet form, ran an `INSERT`, handled errors and redirected the user—all in `app.js`.

## Exercise 2 — Add a New Pet using MVC

| Component | Responsibility |
|---|---|
| Model | `petModel.create` runs the existing `INSERT INTO pets` query. |
| View | `views/newPet.ejs` displays the existing form for name, species, breed, age and image. |
| Controller | `petController` renders the form, reads submitted data, gets the current owner's ID, calls the model, handles errors and redirects to `/journals`. |
| Routes | `GET /pets/new` uses `isLoggedIn`; `POST /pets` uses `upload.single('pet_image')`, then `isLoggedIn`, then the controller. |

## Exercise 3 — Specification review

**Purpose:** Perform a structural refactor. The same application is reorganised by responsibility without changing what users observe.

**Four behaviours that must stay unchanged:**

1. HTTP methods, URLs and redirects.
2. Login/logout, sessions and flash messages.
3. Admin access checks and access-denied responses.
4. Image-upload and MySQL behaviour.

Preserving them avoids breaking links, forms, permissions, stored data and expected user workflows.

**Add a New Pet responsibilities:** Routes are in `routes/petRoutes.js`; request/response logic is in `controllers/petController.js`; SQL is in `models/petModel.js`; the form stays in `views/newPet.ejs`.

**Two prohibited changes:** Do not change the database schema and do not replace SHA-256. Adding validation, redesigning pages or applying unrelated security improvements would also be outside the structural-refactor scope.

**Evidence of success:** Compare the old and new route inventories; confirm SQL occurs only in Models; run the app and test login/logout, admin access, pets, journals, search and uploads against the same database.

**Question/concern:** A live MySQL service and an imported `db.sql` database are required for end-to-end testing.

## Exercises 6–9 — Analysis and decision evidence

### Prompt used

Analyse the existing PetCareApp and explain the Add a New Pet feature. Identify the exact route methods and URLs, middleware order, form fields, controller behaviour, SQL, redirect, error response and files involved. Cite the relevant files and do not edit anything.

### Key findings checked against the code

- `GET /pets/new` requires `isLoggedIn` and renders `newPet` with `session`.
- `POST /pets` keeps the original middleware order: `upload.single('pet_image')` before `isLoggedIn`.
- The insert keeps the same table, columns and values.
- Success redirects to `/journals`; failure sends `Failed to add pet.`

### Proposed structure and file mapping

- `config/`: MySQL and multer setup.
- `middleware/auth.js`: login/admin checks.
- `helpers/hash.js`: SHA-256 helper.
- `models/`: all SQL/database operations.
- `controllers/`: request and response handling.
- `routes/`: methods, URLs, middleware and controller mappings only.
- `views/` and `public/`: unchanged presentation/static assets.
- `app.js`: setup, middleware registration, router mounting and server startup.

### Staged migration plan

1. Record the original route/middleware inventory.
2. Extract configuration, hashing and authentication middleware.
3. Extract SQL into Models.
4. Extract request handlers into Controllers.
5. Replace inline routes with thin Routers.
6. Check syntax, routes, SQL placement and then run the full verification checklist.

### Decision

Approve. The plan retains all 19 active routes, middleware order, redirects, messages, render variable names and SQL behaviour. No new feature or schema change is included.

## Exercise 10 — Verification record

- JavaScript syntax check: passed for all `.js` files.
- Dependencies: `npm install` completed (100 packages installed).
- Route inventory: all 19 original active routes are present.
- Responsibility check: SQL/database operations occur only in `models/`; routes are thin.
- Views and `db.sql`: copied unchanged from the starter app.
- Startup: Express reached `App running on http://localhost:3000`.
- End-to-end database checks: pending because MySQL was not running on local port 3306 during verification.
- Dependency audit reported four moderate vulnerabilities. They were not automatically changed because unrelated dependency/security changes are outside this structural refactor.

## Exercise 11 — Sample logins from `db.sql`

| Role | Username | Password |
|---|---|---|
| Admin | `admin1` | `admin123` |
| User | `amy` | `user123` |

The AI Interaction Journal should contain the student's actual prompts, screenshots/checks and decisions rather than fabricated records.
