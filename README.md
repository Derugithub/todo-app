# NoirList

## Overview

NoirList is a single-screen task list. `app.json` names the app NoirList, slug `todo-app`, version `1.0.0`. It is an Expo app. `package.json` depends on `expo` `~57.0.22`; `package-lock.json` resolves `expo` `57.0.27`. The interface is portrait and dark (`userInterfaceStyle` is `dark`). iOS `supportsTablet` is true and the iOS bundle identifier is `com.deredo.todoapp`. The Android package is `com.deredo.todoapp`. `npm run web` starts the Expo web target.

Tasks live in React state in `App.tsx` and are saved on device with AsyncStorage (`@react-native-async-storage/async-storage` `2.2.0`, key `noir-list.todos.v1`). The top/bottom insert choice is saved beside that list under `noir-list.insert-edge.v1` (`top` or `bottom`; a missing value is top). The screen opens with two seed tasks on first launch, or when the saved value is missing or unreadable. A saved empty list stays empty. Order, done state, and the insert choice survive a restart. The source has no database server and no network client.

## Features

- Add a task from the “New task” field. The Add button and the keyboard submit action use the same handler. Blank or whitespace-only text is ignored. New tasks are inserted at the top or the bottom. One circular control sits after the Done chip. It shows T (add on top, the default) or B (add at the bottom); a tap flips it and does not reorder tasks already in the list. Its accessibility label is “New tasks are added on top” or “New tasks are added at the bottom”. The id and `createdAt` are `Date.now()`, and `done` is false.
- The field focuses on launch and again after a task is added.
- Press a row to mark a task done or open. A done task shows a check mark, strikethrough text, and lower opacity. The label wraps to three lines.
- Delete one task with the × control. Its accessibility label is “Delete task”.
- Filter the list with All, Open (`active`), and Done.
- The subtitle is “Nothing queued. Add a task.” when the list is empty, “All clear. Nice.” when every task is done, and otherwise `{open} open · {done} done`.
- A progress bar shows finished tasks divided by the list length, with that percentage at the end of the bar (for example `50%`). The fill and the label use the crimson accent. At `100%` both turn green (`#22C55E`). The bar is empty and the label is `0%` when there are no tasks.
- “Clear done” appears when at least one task is finished. On web it removes finished tasks immediately. On iOS and Android it shows “Clear finished?” with Cancel and Clear.
- When the visible list is empty, the title is “Empty lane”. The copy is “Start with a single, sharp task.” on All, “No open tasks. Add one above.” on Open, and “No finished tasks yet.” on Done.
- Seed tasks are “Sketch the crimson layout” (done, id `1`) and “Ship the first todo” (open, id `2`).
- The list is written after each change. Killing and reopening the app restores that list. Invalid saved entries are dropped. A non-empty save with nothing usable falls back to the seed tasks.
- `Todo.createdAt` is stored on each task and is not shown in the UI.
- Colors, spacing, and radius come from `src/theme.ts`. The screen background is `#070708`. The accent is `#E11D48`. Finished progress uses `#22C55E`. The status bar is light. `SafeAreaView` from `react-native-safe-area-context` keeps the header below the safe-area inset, then adds 12dp above the “NOIRLIST” kicker. On iOS, `KeyboardAvoidingView` uses `padding` so the composer stays above the keyboard.

## Requirements

- npm. This repository includes `package-lock.json` (lockfile version 3).
- Expo SDK 57. `package.json` depends on `expo` `~57.0.22`, `expo-status-bar` `~57.0.1`, and `expo-splash-screen` `~57.0.9`. The lockfile resolves `expo` `57.0.27`, `expo-status-bar` `57.0.1`, and `expo-splash-screen` `57.0.9`.
- React `19.2.3`, React Native `0.86.3`, and `react-native-web` `^0.21.2`, as declared in `package.json`. The lockfile resolves `react-native-web` `0.21.2`.
- `@react-native-async-storage/async-storage` `2.2.0` and `react-native-safe-area-context` `~5.7.0`, the versions Expo SDK 57 pins.
- TypeScript `~6.0.3` and `@types/react` `~19.2.2`. The lockfile resolves `typescript` `6.0.3` and `@types/react` `19.2.18`.

[TODO: minimum Node.js version]. `package.json` does not set `engines`. `.github/workflows/build.yml` uses Node.js `24.x`.

[TODO: minimum iOS and Android OS versions]. `app.json` does not set them.

## Installation

```bash
npm install
npx expo start
```

Scripts in `package.json`:

| Script | Command |
| --- | --- |
| `npm start` | `expo start` |
| `npm run ios` | `expo start --ios` |
| `npm run android` | `expo start --android` |
| `npm run web` | `expo start --web` |

[TODO: store or binary install steps are not documented in this repository.]

## Configuration

No source file reads environment variables. `.gitignore` ignores `.env*.local`. The repository has no `.env` example.

Settings in `app.json`:

- Name `NoirList`, slug `todo-app`, version `1.0.0`.
- Orientation `portrait`. `userInterfaceStyle` `dark`.
- Icon `./assets/icon.png`. Web favicon `./assets/favicon.png`.
- iOS `supportsTablet` is true. The iOS bundle identifier is `com.deredo.todoapp`.
- Android package `com.deredo.todoapp`. `predictiveBackGestureEnabled` is false.
- Android adaptive icon foreground `./assets/android-icon-foreground.png`, background image `./assets/android-icon-background.png`, monochrome image `./assets/android-icon-monochrome.png`, and `backgroundColor` `#FFFFFF`.
- `extra.eas.projectId` is `7d992577-6e53-40bf-b5bc-e329989817d8`.
- Plugin `expo-splash-screen` uses `./assets/splash-icon.png`, `backgroundColor` `#FFFFFF`, and `imageWidth` `200`. No URL scheme is set. There is no dark splash block.

`eas.json` sets `cli.version` to `>= 24.3.0` and `appVersionSource` to `remote`.

| Profile | Settings |
| --- | --- |
| `development` | `developmentClient` true, `distribution` `internal` |
| `preview` | `distribution` `internal`, Android `buildType` `apk` |
| `production` | `autoIncrement` true |

`submit.production` is an empty object.

`.github/workflows/build.yml` runs on `workflow_dispatch`. The `profile` input is `preview` (the default), `development`, or `production`. The job checks out the repository, sets up Node.js `24.x`, uses `expo/expo-github-action@v8` with `secrets.EXPO_TOKEN`, and runs:

```bash
eas build --profile <profile> --platform android --non-interactive --no-wait
```

[TODO: release signing beyond EAS remote app versions is not described in this repository.]

## Usage

```bash
npm install
npx expo start
```

Open the result with `npm run ios`, `npm run android`, or `npm run web`.

1. The list starts with the two seed tasks.
2. Type in “New task” and press Add, or submit from the keyboard. An empty field does nothing. The circle after Done shows T or B. T inserts the task at the top. B inserts it at the bottom. A tap flips the letter. The saved list keeps that order, and the letter is restored on the next launch.
3. Press a row to toggle done. Press × to delete that task.
4. Use All, Open, or Done to filter the list.
5. Press “Clear done” to remove finished tasks. On iOS and Android, confirm Clear. On web, finished tasks are removed without a dialog.

The list is stored on the device. Killing and reopening the app restores the saved tasks, including done state and order. The two seed tasks appear on first launch, or when the saved value is missing or unreadable.

## Project structure

```text
app.json                      Expo config
eas.json                      EAS build profiles
package.json                  scripts and dependencies
package-lock.json             npm lockfile
tsconfig.json                 extends expo/tsconfig.base; strict
index.ts                      registers App with Expo
App.tsx                       list, composer, filters, progress
LICENSE                       MIT license
README.md
assets/                       app, adaptive, splash, and web icons
src/components/FilterBar.tsx  All / Open / Done
src/components/TodoItem.tsx   one task row
src/theme.ts                  colors, spacing, radius
src/todos.ts                  seed list and saved-list parsing
src/todoStorage.ts            AsyncStorage load and save
src/types.ts                  Todo and Filter
.github/workflows/build.yml   manual Android EAS build
.gitignore
```

### Icons

| Path | Use |
| --- | --- |
| `assets/icon.png` | App icon (1024×1024 RGB) |
| `assets/favicon.png` | Web favicon (48×48 RGB) |
| `assets/splash-icon.png` | Splash image (512×512 RGBA) |
| `assets/android-icon-foreground.png` | Android adaptive foreground (512×512 RGBA) |
| `assets/android-icon-background.png` | Android adaptive background (512×512 RGB) |
| `assets/android-icon-monochrome.png` | Android themed icon (432×432 RGBA) |

## Development

`tsconfig.json` extends `expo/tsconfig.base` and sets `strict` to true. It does not set path aliases.

`package.json` does not define a test script or a lint script.

[TODO: automated tests, a lint script, and a format script are not in this repository.]

The only GitHub workflow is the manual Android EAS build in `.github/workflows/build.yml`.

## Contributing

[TODO: contribution guidelines]. The repository has no `CONTRIBUTING` file, code of conduct, issue template, or pull request template.

`package.json` sets `"private": true`.

## License

MIT. See [LICENSE](LICENSE). Copyright (c) 2026 Dereje G.
