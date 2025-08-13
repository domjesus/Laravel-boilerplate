---
applyTo: '**'
---

# Project general coding standards

## Naming Conventions

- Use mobile first approach for responsivity
- User Repository pattern
- Use PascalCase for component names, interfaces, and type aliases
- Use camelCase for variables, functions, and methods
- Prefix private class members with underscore (\_)
- Use ALL_CAPS for constants
- Use consistent naming conventions (e.g., camelCase for variables and functions).
- Prioritize readability and maintainability over cleverness.
- Write tests for critical functionality (e.g., unit tests, integration tests).
- I'm using spatie-permission to manage roles and permissions in my Laravel application.
- NEVER call php artisan config:clear without using make command because it will not work in the docker container
- Use ESLint and Prettier for code linting and formatting.
- My backend stack includes Laravel, PHP, and MySQL or Sqlite.
- My frontend stack includes React, TypeScript, Inertia and Tailwind CSS.
- Stay up-to-date with relevant technologies and frameworks.
- Optimize for performance where necessary (e.g., avoid unnecessary computations).
- Keep security in mind (e.g., sanitize user input, use HTTPS).
- Include comments and documentation for complex logic.
- Write modular, reusable code with clear separation of concerns.
- When running php commands use "make run_comand ARGS='php artisan command'" to ensure the correct environment is used.
- We are using Laravel v12, so when you need look at documentation at https://laravel.com/docs/12.x/

## Error Handling

- Follow best practices for error handling and validation.
- Use try/catch blocks for async operations
- Implement proper error boundaries in React components
- Always log errors with contextual information
