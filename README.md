Job Browser Task
=======
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# 🚀 Job Browser - NestJS

This project is a **NestJS-based Job API** that fetches job offers from two external APIs, transforms the data into a unified structure, stores it in a PostgreSQL database, and provides an API endpoint to retrieve and filter the transformed job listings.

---

## 🛠 Running the Project with Docker

To run the project using **Docker**, follow these steps:

### 1️⃣ Build and Start the Docker Container
Run the following command to **build and start** the application:

```sh
docker-compose up --build
```

### 2️⃣ Stop the Application
To stop the running container, use:

```sh
docker-compose down
```

---

## Implementation and Models
- **Database Model**: The Job entity model is located in `src/job/entity` and it's based on schemas of given apis with additional fields
to consider scalability
- **Api adaptors**: For each given api an adaptor has been implemented (located in `src/job/adaptor`) with an override method called fetch jobs that tries to fetch jobs
and convert the result to a specific Job DTO which will be used later to convert to entity.
- **Cron job:** The written cron job calls fetch jobs on each adaptor and saves the jobs that have not been stored in
database by checking their job id uniqueness.

## 📖 API & Configuration

- **Swagger Documentation**: The API documentation is available at [`/api-docs/`](http://localhost:3000/api-docs/).
- **API Endpoint**: The job offers can be retrieved via the following endpoint:
  - `GET /api/job-offers`
  - Supports filtering by job title, location, salary range, etc.
  - Implements pagination and error handling.
- **Cron Job Execution**: The application periodically fetches job data from external APIs using a scheduled cron job.
  - The scheduling frequency is **configurable** via environment variables.
  - The cron job ensures job listings stay updated without duplicates.
- **Environment Variables**: The project requires an `.env` file for configuration.
  - Copy `.env.example` to `.env` and update it with the necessary values before running the application.

---

## ✅ Testing

This project includes **tests** for **services, mappers, and adapters**, along with **E2E tests**.

### **1️⃣ Unit Tests**
Unit tests are located in **their respective folders**:
- **Service** → `/src/job/`
- **Mappers** → `/src/job/mapper/`
- **Adapters** → `/src/job/adapters/`

To run unit tests, use:

```sh
yarn test
```

### **2️⃣ End-to-End (E2E) Tests**
E2E tests are located in:

```
/test/
```

To run E2E tests, use:

```sh
yarn test:e2e
```

