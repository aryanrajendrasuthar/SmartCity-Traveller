# SmartCity Traveller

A full-stack travel booking platform with flights, hotels, and tours — powered by Spring Boot 3 and React 18.

**Built by Aryan Suthar**

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Backend | Java 17, Spring Boot 3.2, Spring Security, Spring Data JPA |
| Auth | JWT (JJWT 0.12.3) + Google OAuth2 |
| Database | PostgreSQL 15 |
| Caching | Redis 7 |
| Payments | Stripe (test mode) |
| Email | Spring Mail / SMTP |
| Frontend | React 18, TypeScript, Vite, TailwindCSS 3 |
| UI | Framer Motion, React Query v5, Zustand, React Icons |

---

## Features

- **Search & Filter** — full-text search across listings with filters for type, price, rating, and availability
- **Listing Detail** — image gallery (CSS scroll-snap), amenities chips, guest selector
- **Booking Engine** — multi-step booking with Stripe Elements card payment
- **JWT Auth** — access + refresh token rotation, Google OAuth2 single sign-on
- **Redis Cache** — listings cached at 5-min TTL with targeted eviction on admin writes
- **Async Email** — HTML booking confirmation and cancellation emails
- **RBAC** — USER and ADMIN roles; admin panel restricted via `@PreAuthorize`
- **Admin Panel** — listing CRUD, bookings data table with status filters
- **My Trips** — booking history with status badges and cancel functionality

---

## Quick Start (Local Dev)

### Prerequisites
- Java 17+
- Node.js 20+
- PostgreSQL 15
- Redis 7

### 1. Clone and configure

```bash
cp .env.example .env
# Edit .env with your credentials (see Configuration below)
```

### 2. Start the backend

```bash
cd backend
./mvnw spring-boot:run
# API starts on http://localhost:8080
```

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
# App starts on http://localhost:3000
```

---

## Docker (All-in-One)

```bash
cp .env.example .env
# Fill in .env values

docker-compose up --build
```

Services:
- Frontend → http://localhost:3000
- Backend API → http://localhost:8080
- PostgreSQL → localhost:5432
- Redis → localhost:6379

---

## Configuration

Copy `.env.example` to `.env` and fill in the following:

### Stripe (required for payments)

1. Create a free account at [stripe.com](https://stripe.com)
2. Go to **Developers → API Keys** (test mode)
3. Copy your `pk_test_...` key to `VITE_STRIPE_PUBLISHABLE_KEY`
4. Copy your `sk_test_...` key to `STRIPE_SECRET_KEY`

**Test card:** `4242 4242 4242 4242` · any future expiry · any CVC

### Google OAuth2 (optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services → Credentials**
2. Create an OAuth 2.0 Client ID (Web application type)
3. Add authorized redirect URI: `http://localhost:8080/login/oauth2/code/google`
4. Copy client ID and secret to `.env`

### Email (optional)

Using Gmail:
1. Enable 2-Step Verification on your Google account
2. Generate an App Password at **myaccount.google.com/security → App passwords**
3. Set `MAIL_USERNAME` and `MAIL_PASSWORD` in `.env`

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@smartcitytraveller.com | admin123 |
| User | john@example.com | password123 |

The database is seeded automatically on first run with 12 sample listings (4 hotels, 3 flights, 5 tours).

---

## Project Structure

```
SmartCityTraveller/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/smartcity/traveller/
│   │   ├── config/             # Security, Redis, DataSeeder
│   │   ├── controller/         # REST controllers
│   │   ├── entity/             # JPA entities
│   │   ├── repository/         # Spring Data repositories
│   │   ├── security/           # JWT, OAuth2, filters
│   │   ├── service/            # Business logic
│   │   └── exception/          # Global exception handler
│   └── src/main/resources/application.yml
├── frontend/                   # React + Vite application
│   └── src/
│       ├── components/         # Reusable UI components
│       │   ├── auth/           # ProtectedRoute, AdminRoute
│       │   ├── booking/        # BookingModal (Stripe)
│       │   ├── layout/         # Navbar, Footer
│       │   └── listing/        # ListingCard, SearchFilters
│       ├── context/            # AuthContext
│       ├── pages/              # Route-level page components
│       ├── services/           # Axios API wrappers
│       └── types/              # TypeScript interfaces
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register |
| POST | `/api/auth/login` | — | Login, returns JWT pair |
| POST | `/api/auth/refresh` | — | Refresh access token |
| GET | `/api/auth/me` | User | Current user info |
| GET | `/api/listings` | — | Search with filters |
| GET | `/api/listings/{id}` | — | Listing detail |
| GET | `/api/listings/featured` | — | Top listings |
| POST | `/api/bookings` | User | Create booking + Stripe intent |
| POST | `/api/bookings/{id}/confirm` | User | Confirm after payment |
| POST | `/api/bookings/{id}/cancel` | User | Cancel booking |
| GET | `/api/bookings` | User | My bookings |
| POST | `/api/admin/listings` | Admin | Create listing |
| PUT | `/api/admin/listings/{id}` | Admin | Update listing |
| DELETE | `/api/admin/listings/{id}` | Admin | Delete listing |
| GET | `/api/admin/bookings` | Admin | All bookings |
| GET | `/api/admin/users` | Admin | All users |
