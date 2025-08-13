# Laravel Boilerplate

A robust Laravel v12 boilerplate for rapid application development, featuring best practices, Docker support, and modern frontend tooling.

## Features

- Laravel v12 (PHP, MySQL/SQLite)
- Dockerized development environment
- Spatie Permission for roles & permissions
- React + TypeScript + Inertia.js + Tailwind CSS
- Repository pattern for data access
- Stripe integration (see `StripeService.php`)
- ESLint & Prettier for code quality
- Unit & integration tests (PHPUnit)
- Modular, maintainable codebase

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Make (for command shortcuts)
- Node.js & npm

### Installation

```bash
# Clone the repository
git clone https://github.com/domjesus/laravel-boilerplate.git
cd laravel-boilerplate

# Start containers
make up

# Install PHP dependencies
make composer_install

# Install JS dependencies
npm install

# Build frontend assets
npm run build

# Run migrations & seeders
make run_command ARGS='php artisan migrate --seed'
```

### Development

- Backend: Laravel (`app/`, `routes/`)
- Frontend: React/TypeScript (`resources/js/`)
- Tests: PHPUnit (`tests/`)
- Docker configs: `docker-compose.yml`, `infra/`

### Useful Commands

- Start server: `make run_command ARGS='php artisan serve'`
- Run tests: `make run_command ARGS='php artisan test'`
- Lint JS: `npm run lint`
- Format JS: `npm run format`

## Configuration

- Environment variables: Copy `.env.example` to `.env` and update as needed.
- Stripe: Configure keys in `.env` and `config/services.php`.

## Documentation

- [Laravel Docs](https://laravel.com/docs/12.x/)
- [Spatie Permission](https://spatie.be/docs/laravel-permission/v6/introduction)
- [Inertia.js](https://inertiajs.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## Contributing

Pull requests and issues are welcome! Please follow coding standards and write tests for new features.

## GitHub Copilot & Coding Standards

This project uses GitHub Copilot for AI-powered code suggestions and automation. If you want you can follow the coding standards and instructions provided in the `.github/instructions/` directory or create your own instructions:

- **General Coding Standards:** See `.github/instructions/general-coding.instructions.md` for naming conventions, error handling, and best practices.
- **Backend:** See `.github/instructions/backend-test.instructions.md` for PHP/Laravel backend guidelines.
- **Frontend:** See `.github/instructions/frontend-test.instructions.md` for React/TypeScript/Tailwind frontend guidelines.
- **TypeScript/React:** See `.github/instructions/typescript-react.instructions.md` for TypeScript and React-specific rules.

These instructions help ensure code quality, maintainability, and consistency across the project. All contributors should review and follow these guidelines when submitting code or pull requests.

## License

MIT
