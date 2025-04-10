# Degen Dreams

A web application that lets you calculate potential returns on cryptocurrency investments. Ever wondered how much your crypto investment would be worth today? Select a coin, pick a date, enter your investment amount, and see what could have been.

## Features

- Calculate potential returns on cryptocurrency investments
- View detailed statistics including:
  - Current value
  - Profit/loss percentage
  - Maximum value achieved
  - Highest and lowest points
- Share your results with others
- Dark/Light theme support
- Mobile-responsive design

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- React Query
- Turborepo (monorepo setup)

## Project Structure

```
degen-dreams/
├── apps/
│   └── web/                 # Main web application
│       ├── app/            # Next.js app directory
│       │   ├── api/        # API routes
│       │   ├── components/ # React components
│       │   ├── data/       # Static data
│       │   ├── services/   # Service layer
│       │   └── theme/      # Theme configuration
│       └── ...
├── packages/               # Shared packages
└── ...
```

## Getting Started

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

The project uses Turborepo for monorepo management. The main application is in the `apps/web` directory.

### Running Tests

```bash
npm run test
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
