# FixIt Mobile

A mobile application built with React Native, Expo, and TypeScript.

## Quick start

Requires [Git](https://git-scm.com/) and [Node.js](https://nodejs.org/) 22.13+ (see `.nvmrc`; with nvm: `nvm install && nvm use`).

```bash
git clone --branch develop https://github.com/FixIt-garage/fixit-mobile.git
cd fixit-mobile

# Windows (PowerShell)
powershell -ExecutionPolicy Bypass -File scripts\bootstrap.ps1

# macOS / Linux
./scripts/bootstrap.sh

npm start
```

The script checks the Node version, installs dependencies (`npm ci`) and creates `.env` with
`EXPO_PUBLIC_API_URL` set to this computer's local IP and port 8000, so Expo Go on a phone and the
Android emulator can reach the backend. Pass `-ApiUrl` (PowerShell) or `--api-url` (bash) to use another
address. It is safe to run again: an existing `.env` is kept.

The backend must be running: see the Quick start in
[fixit-backend](https://github.com/FixIt-garage/fixit-backend/tree/develop#quick-start).
Use the `develop` branch in both repos: it is where the bootstrap scripts live until they reach `main`.

### Troubleshooting

- **The app shows a backend error**: open `EXPO_PUBLIC_API_URL` from `.env` plus `/health` in the phone's
  browser. If it does not load, the phone and computer must be on the same Wi-Fi, and the firewall must
  allow incoming connections to port 8000. After changing `.env`, restart with `npx expo start -c`
  (`npx.cmd expo start -c` in Windows PowerShell).
- **`running scripts is disabled on this system`**: Windows blocks PowerShell scripts by default, and
  on recent Node versions `npm` itself is one. Start the bootstrap with
  `powershell -ExecutionPolicy Bypass -File ...` as shown above, and run npm as `npm.cmd start`.
  To allow local scripts for your Windows user once:
  `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
- **`EBADENGINE` warnings or Metro errors**: switch to the Node version from `.nvmrc`.
- **Expo Go says you must be signed in to Expo CLI**: sign in on the computer with the same account
  as in Expo Go: `npx expo login` (on Windows PowerShell: `npx.cmd expo login`). If the login crashes
  while opening the browser, create a token at https://expo.dev/settings/access-tokens and set it
  in the same terminal before starting: `$env:EXPO_TOKEN = "<token>"` (PowerShell) or
  `export EXPO_TOKEN=<token>` (bash). Never commit or share the token.
- **The QR code is cut off**: maximize the terminal or zoom out, then press `r` to redraw it. On
  iPhone you can also open `exp://<your-local-ip>:8081` in Safari.
- **"Could not connect to development server" on the first launch**: the first build can take
  longer than the phone waits. Tap **Try again** once the terminal shows `Bundled`.

## Requirements

- Node.js 22.13+ and npm (version pinned in `.nvmrc`)
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
| `npm run storybook`       | Starts the app in Storybook mode               |
| `npm run lint`            | Runs ESLint to check code quality              |
| `npm test -- --runInBand` | Runs the Jest test suite                       |
| `npm run format`          | Formats the project files using Prettier       |
| `npm run format:check`    | Checks code formatting without modifying files |

## Project Structure

```text
fixit-mobile/
├── .rnstorybook/     # Storybook config, preview decorators and entry point
├── api/              # API client and backend endpoints
├── assets/           # Images, fonts, and other static assets
├── components/       # Reusable UI components and their stories
├── hooks/            # Custom React hooks
├── navigation/       # Navigation configuration
├── screens/          # Application screens
├── src/theme/        # Design tokens, ThemeProvider and useTheme()
├── App.tsx           # Root component and navigation container
├── app.json          # Expo application configuration
├── metro.config.js   # Metro bundler config (Storybook toggle)
├── stories.test.tsx  # Renders every story as a Jest smoke test
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

## Design Tokens

All colors, fonts, spacing, radii and shadows live in `src/theme/` and come from the **«Основи»** frame on page _02 Дизайн-система_ in Figma. Screens and components must not use raw hex colors — ESLint reports an error for any hex color outside `src/theme/`.

| File            | What it contains                                                       |
| --------------- | ---------------------------------------------------------------------- |
| `colors.ts`     | Color variables, named as in Figma (`bg/screen` → `colors.bg.screen`)  |
| `gradients.ts`  | `Gradient/Client`, `Master`, `Center`, `Org`                           |
| `fonts.ts`      | Font names and the `useAppFonts()` loader                              |
| `typography.ts` | Text styles used by the `Text` component                               |
| `spacing.ts`    | Spacing scale and layout constants                                     |
| `radius.ts`     | Corner radii                                                           |
| `shadows.ts`    | `Shadow/Floating`                                                      |

Use tokens through `useTheme()` inside components, or import `theme` from `src/theme` in `StyleSheet.create`. For text, use `components/Text` with a `variant` prop. All tokens can be browsed in Storybook under **Foundations**.

### Updating tokens when the design changes

Tokens are copied from Figma by hand:

1. Open the «Основи» frame and select the changed element (Ctrl+click).
2. Copy the new value from the **Properties** panel into the matching file in `src/theme/`. Keep the Figma variable name.
3. Convert values that Figma and React Native measure differently:
   - **Letter spacing:** Figma uses %, React Native uses points — `fontSize × percent / 100` (e.g. 32px at -2% → `-0.64`).
   - **Shadow blur:** `shadowRadius = Blur / 2`.
   - **Hex with opacity:** use 8-digit hex (e.g. `#11182780`).
4. Run `npx tsc --noEmit` and `npm run lint`.

## Storybook

Shared components and design tokens are built and reviewed in isolation in [React Native Storybook](https://storybookjs.github.io/react-native/).

### Running Storybook

```bash
npm run storybook
```

Scan the QR code with Expo Go on your phone (or use `npm run storybook:ios` on a Mac with the iOS Simulator). Storybook replaces the app while it runs: `metro.config.js` swaps the entry point to `.rnstorybook/index.ts` when `EXPO_PUBLIC_STORYBOOK_ENABLED=true`. Without the flag, Storybook is stripped from the bundle and never ships to production.

Every story is rendered inside `ThemeProvider` with the app fonts loaded, on a 360 pt canvas (the Figma frame width). Use the **Backgrounds** tab to switch between `screen`, `surface` and `graphite`, **Controls** to change props, and **Actions** to see callbacks.

### Adding a story

1. Create `ComponentName.stories.tsx` next to the component (stories under `components/` and `src/` are picked up automatically).
2. Use one of the sections as the title prefix: `Foundations/`, `Icons/`, `Controls/`, `Navigation/`, `Display/`, `Cards/`.
3. Add the stories module to `storyFiles` in `stories.test.tsx` — each story then becomes a Jest smoke test.

```tsx
import type { Meta, StoryObj } from '@storybook/react-native';
import { Button } from './Button';

const meta = {
  title: 'Controls/Button',
  component: Button,
  args: { label: 'Надіслати заявку' },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary' } };
```

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