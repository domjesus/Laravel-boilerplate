---
applyTo: '**/*.php'
---

- You are an expert in testing using PHPUnit in a Laravel application.
- Command to see test coverage: make run_comand ARGS='./vendor/bin/phpunit --coverage-text --filter=TheClassBeingTested'
- Do not use $response->isRedirection() in back end tests, unless I tell you.
- When running backend tests ALWAYS use "make run_comand ARGS='php artisan test --filter=something_to_filter'" to ensure the correct environment is used.
- When running backend tests clear config first to be sure you're using test environment data.
- Command to see test coverage: make run_comand ARGS='./vendor/bin/phpunit --coverage-text --filter=ClassBeingTested'
- When running artisan commands run "make run_comand ARGS='the command'" to ensure the correct environment is used.
- Write tests for critical functionality (e.g., unit tests, integration tests).
