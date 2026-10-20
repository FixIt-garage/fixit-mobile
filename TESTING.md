# Testing

We use [Jest](https://jestjs.io/) with the `jest-expo` preset and [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) (RNTL), written in TypeScript.

## Running tests

    npm test                 # run all tests once
    npm run test:coverage    # run all tests and print a coverage report

The coverage report is also written to the `coverage/` folder (git-ignored).
Only application code is counted: test helpers and config files are excluded (see `collectCoverageFrom` in `package.json`).

## Where things live

- Put a test next to the file it tests, named `<File>.test.ts` or `<File>.test.tsx` (for example `components/AppButton.test.tsx`).
- `jest.setup.ts` runs before every test file. Shared mocks and settings go here.
- `test-utils.tsx` exports a custom `render` that wraps components in the providers the app needs.
- `test-helpers/mockApi.ts` contains helpers to fake API responses.

## Writing a component test

Import `render`, `screen` and `fireEvent` from `test-utils`, not from the library directly. That way every test gets the providers automatically.

    import { render, screen, fireEvent } from "../test-utils";
    import { AppButton } from "./AppButton";

    test("calls onPress when pressed", async () => {
      const onPress = jest.fn();
      await render(<AppButton title="Sign in" onPress={onPress} />);
      await fireEvent.press(screen.getByText("Sign in"));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

In this version of RNTL, `render` and `fireEvent` are async, so always `await` them.
Use `getBy...` for things that are on screen immediately and `findBy...` for things that appear after async work (for example data loaded from the API).

## Mocking the API

Tests must never call the real backend. Use the helpers from `test-helpers/mockApi.ts`:

    mockApiSuccess(data)   // the server answers with `data`
    mockApiError(500)      // the server answers with an error status
    mockApiPending()       // the request never finishes (to test loading states)

Example (see `screens/UsersScreen.test.tsx`):

    test("shows users", async () => {
      mockApiSuccess([{ id: 1, name: "Olya" }]);
      await render(<UsersScreen />);
      expect(await screen.findByText("Olya")).toBeTruthy();
    });

The real `fetch` is restored automatically after every test.

## Built-in mocks

These are set up once in `jest.setup.ts`, so tests do not need to repeat them:
- **AsyncStorage**: an in-memory fake, nothing is written to disk.
- **Navigation**: `useNavigation()` returns `navigate` and `goBack` as `jest.fn()`. Mock call history is cleared between tests.
