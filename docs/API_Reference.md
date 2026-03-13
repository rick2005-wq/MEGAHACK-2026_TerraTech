# GrainOS API Reference

Base URL: `http://localhost:5000/api`

## Auth
- POST `/auth/register` — Register user
- POST `/auth/login` — Login with phone + OTP
- POST `/auth/verify-otp` — Verify OTP

## Farmer
- GET `/farmer/profile` — Get farmer profile
- PUT `/farmer/profile` — Update profile

## Produce
- GET `/produce` — List produce
- POST `/produce` — Create produce listing
- GET `/produce/:id` — Get produce detail
- DELETE `/produce/:id` — Delete listing

## Tenders
- GET `/tenders` — List open tenders
- POST `/tenders` — Create tender (Industry only)
- GET `/tenders/:id` — Tender detail
- POST `/tenders/:id/bid` — Place bid (Farmer only)

## Chat
- GET `/chat/rooms` — List chat rooms
- GET `/chat/:roomId/messages` — Message history

## Admin
- GET `/admin/users` — All users
- PUT `/admin/users/:id/ban` — Ban user
- GET `/admin/verifications` — Pending verifications
