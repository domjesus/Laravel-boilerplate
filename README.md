This is a boilerplate of a Laravel project read to go. It's already installed permission with spatie/permission and comes with integration with stripe.

#Install composer

composer install

# Install modules

npm install OR npm install --legacy-peer-deps

# Docker

If you are using Docker:

make migrate OR docker compose exec app php artisan migrate
make up OR docker compose up -d

# Migrating and Seeding

make migrate-fresh OR docker compose exec app php artisan migrate OR php artisan migrate:fresh --seed

# Database

The connection being used is Sqlite.

# Run npm

UI auth is already scaffolded
npm run dev

Access http://localhost:8000

# Stripe integration

STRIPE*KEY=pk_test_zLU001za4WMI9
STRIPE_SECRET=sk_test_43owyA00P9kXgnRJ
STRIPE_WEBHOOK_SECRET=whsec*

stripe login
stripe listen --forward-to localhost:8000/stripe/webhook

# Stack:

Laravel 12.22.1
Php 4
React: "^18.2.0",
