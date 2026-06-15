# README — Installation Commands and Short Explanation

This README contains the main installation commands for the TLE4 Expo/React Native project.

Copy and paste the commands one by one into your terminal. Each section briefly explains what the command does.

---

## 1. Install and use Node

Use Node 18 LTS for this project.

```bash
nvm install 18
nvm use 18
```

Check if Node and npm are working:

```bash
node -v
npm -v
```

---

## 2. Install project dependencies

If the project already has a `package.json`, install all existing dependencies first:

```bash
npm install
```

This installs all packages already listed in the project.

---

## 3. Start Expo

Use the local Expo CLI with `npx`.

```bash
npx expo start
```

If you have cache problems, restart Expo with a clean cache:

```bash
npx expo start -c
```

---

## 4. Basic dependencies

If the basic packages are missing, install them with:

```bash
npm install expo react react-native
```

---

## 5. Styling and icons

This project uses `twrnc` for Tailwind-like styling and Expo Vector Icons for icons.

```bash
npm install twrnc
npx expo install @expo/vector-icons
```

---

## 6. Expo Babel preset

Install the Expo Babel preset as a development dependency.

```bash
npm install --save-dev babel-preset-expo
```

Example `babel.config.js`:

```js
module.exports = function(api) {
    api.cache(true);
    return {
        presets: ["babel-preset-expo"],
    };
};
```

---

## 7. React Navigation

The app uses React Navigation for screen navigation, stack navigation and bottom tabs.

```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
```

Install the required native dependencies through Expo:

```bash
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler
```

These packages are needed for navigation, safe areas and gestures.

---

## 8. AsyncStorage

AsyncStorage can be used for local storage, such as bookmarks, user settings or temporary data.

```bash
npx expo install @react-native-async-storage/async-storage
```

---

## 9. Expo Blur

Expo Blur can be used for blur effects, for example behind modals or overlays.

```bash
npx expo install expo-blur
```

---

## 10. React Native Maps

The map page uses `react-native-maps`.

```bash
npx expo install react-native-maps
```

Important: `react-native-maps` does not work properly on Expo Web. Use separate files for native and web:

```txt
screens/MapScreen.native.js
screens/MapScreen.web.js
```

The import stays the same:

```js
import MapScreen from "../../screens/MapScreen";
```

Expo will automatically choose the correct file for each platform.

---

## 11. Start the project on different platforms

Start Expo:

```bash
npx expo start
```

Then choose one of the options:

```txt
a = Android emulator
i = iOS simulator
w = Web browser
```

You can also scan the QR code with Expo Go on your phone.

---

## 12. Common issues and fixes

### Clear Expo cache

```bash
npx expo start -c
```

### Reinstall node modules

For macOS/Linux:

```bash
rm -rf node_modules
npm install
npx expo start -c
```

For Windows:

```bash
rmdir /s /q node_modules
npm install
npx expo start -c
```

### Fix dependency versions through Expo

```bash
npx expo install --fix
```

This tries to set package versions that match the installed Expo SDK.

---

## 13. Important project structure

The project uses roughly this structure:

```txt
assets/
components/
    actions/
    forms/
    layout/
    services/
screens/
App.js
global.css
package.json
```

Important files:

```txt
App.js
components/layout/AppNavigator.js
components/layout/AppHeader.js
components/actions/ActionCard.js
components/PreviewModal.js
components/services/ProtestApi.js
screens/ActionScreen.js
screens/HomeScreen.js
screens/AgendaScreen.js
screens/DetailScreen.js
screens/LoginScreen.js
screens/MapScreen.native.js
screens/MapScreen.web.js
```

---

## 14. API server

The app gets protest data from this server:

```txt
http://145.24.237.86:8000
```

Example endpoint:

```txt
GET http://145.24.237.86:8000/protests
```

The API configuration is located in:

```txt
components/services/ProtestApi.js
```

Important API configuration:

```js
const API_BASE_URL = "http://145.24.237.86:8000";

const API_PATHS = {
    protests: "/protests",
    userProjects: "/user-projects",
    saveUserProject: "/user-projects",
    deleteUserProject: (id) => `/user-projects/${id}`,
};
```

---

## 15. Install everything at once

Use this only if you are setting up the project again or if dependencies are missing:

```bash
npm install
npm install twrnc
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npx expo install @expo/vector-icons react-native-screens react-native-safe-area-context react-native-gesture-handler
npx expo install @react-native-async-storage/async-storage expo-blur react-native-maps
npm install --save-dev babel-preset-expo
npx expo start -c
```
