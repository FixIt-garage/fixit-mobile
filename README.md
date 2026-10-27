# FixIt Mobile

A mobile application built with React Native, Expo, and TypeScript.

## Requirements

- Node.js and npm
- Expo Go for testing on a compatible physical device
- An Android emulator or a physical Android device for Android testing
- macOS and Xcode for running the iOS Simulator

## Getting Started

### 1. Install dependencies

Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/FixIt-garage/fixit-mobile.git
cd fixit-mobile
```

Install the required dependencies:

```bash
npm install
```

### 2. Configure the backend API

The application uses the `EXPO_PUBLIC_API_URL` environment variable to configure the backend base URL.

Create a local `.env` file in the project root based on `.env.example`:

```env
EXPO_PUBLIC_API_URL=http://YOUR_BACKEND_HOST:8000
```

Replace `YOUR_BACKEND_HOST` with the actual address of the backend server.

Do not commit your local `.env` file or private credentials to the repository.

The application checks the backend health endpoint at:

```text
/health
```

The complete request URL is constructed by combining the configured base URL with the endpoint path.

### 3. Start the application

Start the Expo development server:

```bash
npm start
```

To test on a physical device, open Expo Go and scan the QR code displayed in the terminal. Make sure the device and computer can communicate over the network.

To run the application on Android, use an Android emulator or a compatible physical device.

To launch the iOS Simulator, use a Mac with Xcode installed:

```bash
npm run ios
```

**Note:** The iOS Simulator requires macOS and Xcode. On Windows, you can use Expo Go on a compatible physical device or an Android emulator.

## Available Scripts

| Command                   | Description                                    |
| ------------------------- | ---------------------------------------------- |
| `npm start`               | Starts the Expo development server             |
| `npm run android`         | Starts the application on Android              |
| `npm run ios`             | Starts the application on the iOS Simulator    |
| `npm run web`             | Starts the web version                         |
| `npm run lint`            | Runs ESLint to check code quality              |
| `npm test -- --runInBand` | Runs the Jest test suite                       |
| `npm run format`          | Formats the project files using Prettier       |
| `npm run format:check`    | Checks code formatting without modifying files |

## Project Structure

## Project Structure

```text
fixit-mobile/
├── api/              # API client and backend endpoints
├── assets/           # Images, fonts, and other static assets
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── navigation/       # Navigation configuration
├── screens/          # Application screens
├── App.tsx           # Root component and navigation container
├── app.json          # Expo application configuration
├── package.json      # Dependencies and npm scripts
├── tsconfig.json     # TypeScript configuration
└── README.md         # Project documentation
```

## Backend Health Check

The home screen displays the backend connection status by calling the `/health` endpoint.

- A successful response displays the status returned by the backend.
- If the API URL is not configured or the request fails, the application displays an error message.
- The user can retry the health check using the button on the home screen.

The backend must be running and reachable from the device or emulator for a successful connection.

## Code Quality and Testing

Run ESLint:

```bash
npm run lint
```

Run the tests:

```bash
npm test -- --runInBand
```

Check formatting:

```bash
npm run format:check
```

Format files when needed:

```bash
npm run format
```

Check TypeScript types:

```bash
npx tsc --noEmit
```

## CI/CD Configuration

If the GitHub Actions workflow uses Expo Application Services (EAS), configure the required secrets in the repository:

**Settings → Secrets and variables → Actions**

| Secret       | Purpose                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------ |
| `EXPO_TOKEN` | Authentication for Expo/EAS builds and submissions, if these operations are used by the CI/CD workflow |

Only configure secrets required by the actual workflow.
