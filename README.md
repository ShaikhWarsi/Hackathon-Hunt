# Open Hackathons API Master

This project is a platform for managing and participating in hackathons. It includes a Next.js frontend application.

## Getting Started

To set up and run the project locally, follow these steps:

### Prerequisites

Make sure you have the following installed:
- Node.js (LTS version recommended)
- npm or Yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ShaikhWarsi/HackathonHunt
   cd HackathonHunt
   ```

2. Navigate to the frontend directory and install dependencies:
   ```bash
   cd frontend
   npm install # or yarn install
   ```

### Running the Development Server

1. Create a `.env.local` file in the `frontend` directory based on `.env.example` (if available) and configure your environment variables.

2. Start the development server:
   ```bash
   npm run dev # or yarn dev
   ```

   The application will be accessible at `http://localhost:3000`.

## Project Structure

- `frontend/`: Contains the Next.js frontend application.
- `.github/`: GitHub Actions workflows for CI/CD.

## Available Scripts (Frontend)

In the `frontend` directory, you can run:

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the application for production.
- `npm run start`: Runs the built application in production mode.
- `npm run lint`: Lints and fixes code.

## Contributing

Contributions are welcome! Please refer to our contributing guidelines (if available) for more information.

## License

This project is licensed under the [License Name] - see the `LICENSE` file for details.
