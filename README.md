# TLE4 Expo / React Native Project — Installation Guide

This README explains how to install, run and troubleshoot the TLE4 Expo/React Native project.

The project is built with:

* Expo
* React Native
* React Navigation
* NativeWind / Tailwind-style styling
* Expo Vector Icons
* AsyncStorage
* Expo Image Picker
* DateTimePicker
* API connection to the backend server

Backend server:

```txt
http://145.24.237.86:8000
```

---

## 1. Requirements

Make sure you have these installed:

```txt
Node.js
npm
Expo Go app on your phone
```

Recommended Node version:

```txt
Node 18 LTS
```

---

## 2. Install and use Node 18

Use Node 18 for this project.

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

## 3. Install project dependencies

If the project already has a `package.json`, first install all existing dependencies:

```bash
npm install
```

This installs all packages that are already listed in the project.

---

## 4. Start the project

Start Expo with:

```bash
npx expo start
```

If the app has cache problems, use:

```bash
npx expo start -c
```

Then choose one of the options:

```txt
a = Android emulator
i = iOS simulator
w = Web browser
```

You can also scan the QR code with Expo Go on your phone.

---

## 5. Basic Expo dependencies

If the base packages are missing, install them with:

```bash
npm install expo react react-native
```

---

## 6. Styling dependencies

This project uses Tailwind-style styling.

The project contains files like:

```txt
global.css
tailwind.config.js
```

and uses styling like:

```js
<View className="flex-1 bg-offWhite">
```

Install NativeWind and Tailwind if they are missing:

```bash
npm install nativewind tailwindcss
```

If `twrnc` is still used in some files, install it too:

```bash
npm install twrnc
```

Use this rule in the project:

```txt
Use className / NativeWind for normal styling.
Use style={{ ... }} for dynamic styling.
Avoid mixing twrnc everywhere unless needed.
```

---

## 7. Icons

This project uses Expo Vector Icons.

```bash
npx expo install @expo/vector-icons
```

Example:

```js
import { Ionicons } from "@expo/vector-icons";
```

---

## 8. Babel preset

Install the Expo Babel preset:

```bash
npm install --save-dev babel-preset-expo
```

Example `babel.config.js`:

```js
module.exports = function(api) {
    api.cache(true);

    return {
        presets: ["babel-preset-expo"],
        plugins: ["nativewind/babel"],
    };
};
```

If NativeWind is not used, remove:

```js
plugins: ["nativewind/babel"],
```

---

## 9. React Navigation

The app uses React Navigation for:

```txt
Stack navigation
Bottom tab navigation
Screen navigation
```

Install React Navigation:

```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
```

Install the required native dependencies:

```bash
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler
```

These packages are needed for navigation, safe areas and gestures.

---

## 10. AsyncStorage

AsyncStorage is used for local storage, such as:

```txt
Logged-in user data
Temporary profile image URL
Bookmarks / saved state
```

Install it with:

```bash
npx expo install @react-native-async-storage/async-storage
```

---

## 11. Expo Image Picker

The admin form uses image upload for creating a protest.

Install Expo Image Picker:

```bash
npx expo install expo-image-picker
```

Used in:

```txt
components/forms/ProtestForm.js
```

Example usage:

```js
import * as ImagePicker from "expo-image-picker";
```

---

## 12. DateTimePicker

The admin form uses a date and time picker for the protest start time.

Install DateTimePicker:

```bash
npx expo install @react-native-community/datetimepicker
```

Used in:

```txt
components/forms/ProtestForm.js
```

Example usage:

```js
import DateTimePicker from "@react-native-community/datetimepicker";
```

---

## 13. Expo Blur

Expo Blur can be used for blur effects behind modals or overlays.

```bash
npx expo install expo-blur
```

If the project does not use blur anymore, this package is optional.

---

## 14. React Native Maps

The map page can use `react-native-maps`.

Install it with:

```bash
npx expo install react-native-maps
```

Important:

```txt
react-native-maps does not work properly on Expo Web.
```

Use separate files for native and web:

```txt
screens/MapScreen.native.js
screens/MapScreen.web.js
```

The import can stay the same:

```js
import MapScreen from "../../screens/MapScreen";
```

Expo will automatically choose the correct file for each platform.

For web, use a fallback screen or a simple message instead of importing `react-native-maps`.

---

## 15. API server

The app connects to this backend server:

```txt
http://145.24.237.86:8000
```

Main endpoint example:

```txt
GET http://145.24.237.86:8000/protests
```

The API configuration is located in:

```txt
components/services/ProtestApi.js
```

Example configuration:

```js
const API_BASE_URL = "http://145.24.237.86:8000";

const API_PATHS = {
    protests: "/protests",
    userProjects: ["/user_projects", "/user-projects"],
    saveUserProject: "/user_projects",
    deleteUserProject: (id) => `/user_projects/${id}`,
};
```

Important API tables/endpoints based on the ERD:

```txt
users
user_data
topics
user_topics
pronouns
user_pronouns
protests
protest_details
projects
protest_projects
protest_project_details
user_projects
```

Some endpoints may not be finished yet in the backend. The app should not crash if optional endpoints are missing.

---

## 16. Important project structure

The project roughly uses this structure:

```txt
assets/
components/
    actions/
    filters/
    forms/
    layout/
    services/
context/
data/
screens/
App.js
global.css
package.json
tailwind.config.js
babel.config.js
```

Important files:

```txt
App.js
context/AuthContext.js

components/layout/AppNavigator.js
components/layout/AppHeader.js

components/actions/ActionCard.js
components/forms/LoginForm.js
components/forms/RegistryForm.js
components/forms/DonationForm.js
components/forms/ProtestForm.js
components/PreviewModal.js
components/filters/FilterModal.js
components/services/ProtestApi.js

screens/ActionScreen.js
screens/HomeScreen.js
screens/AgendaScreen.js
screens/DetailScreen.js
screens/LoginScreen.js
screens/RegistryScreen.js
screens/ProfileScreen.js
screens/AdminScreen.js
screens/MapScreen.native.js
screens/MapScreen.web.js
```

---

## 17. Authentication

The app uses `AuthContext` for login state.

Location:

```txt
context/AuthContext.js
```

It stores the logged-in user with AsyncStorage.

The login form must call:

```js
login(userData);
```

The profile page uses this stored user data to show the correct profile.

---

## 18. Admin page

The admin page is used to create a new protest.

Files:

```txt
screens/AdminScreen.js
components/forms/ProtestForm.js
```

The protest form sends a `POST` request to:

```txt
POST http://145.24.237.86:8000/protests
```

The form can send:

```txt
name
description
location
predicted_members
link
start_time
latitude
longitude
card_img
```

Image upload uses `FormData`.

Do not manually set the `Content-Type` header for multipart image upload. Let React Native set it automatically.

---

## 19. Common issues and fixes

### Clear Expo cache

```bash
npx expo start -c
```

---

### Reinstall node modules on macOS/Linux

```bash
rm -rf node_modules
npm install
npx expo start -c
```

---

### Reinstall node modules on Windows

```bash
rmdir /s /q node_modules
npm install
npx expo start -c
```

---

### Fix Expo dependency versions

```bash
npx expo install --fix
```

This tries to align package versions with the installed Expo SDK.

---

### Web bundling error with react-native-maps

If you see an error like:

```txt
Importing react-native internals is not supported on web
```

it is probably caused by importing `react-native-maps` on web.

Fix:

```txt
Use MapScreen.native.js for mobile.
Use MapScreen.web.js for web.
Do not import react-native-maps in the web file.
```

---

### API data not showing

Check the backend in Postman:

```txt
GET http://145.24.237.86:8000/protests
GET http://145.24.237.86:8000/users
GET http://145.24.237.86:8000/user_projects
```

If the endpoint gives `404`, the backend route is not available yet.

---

### Registration error: unknown database column

If registration gives an error like:

```txt
Unknown column 'profile_pfp' in 'field list'
```

then the backend is trying to write to a database column that does not exist.

The ERD uses:

```txt
user_data.profile_img
```

Not:

```txt
profile_pfp
```

The backend registration route should only create a user with fields like:

```txt
username
email
password
is_admin
```

Profile image should be handled later through `user_data`.

---

## 20. Install everything at once

Use this if you are setting up the project again or if dependencies are missing.

```bash
npm install
npm install expo react react-native
npm install nativewind tailwindcss
npm install twrnc
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npx expo install @expo/vector-icons
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler
npx expo install @react-native-async-storage/async-storage
npx expo install expo-image-picker
npx expo install @react-native-community/datetimepicker
npx expo install expo-blur
npx expo install react-native-maps
npm install --save-dev babel-preset-expo
npx expo start -c
```

---

## 21. Recommended normal setup flow

For a fresh setup, usually this is enough:

```bash
npm install
npx expo install --fix
npx expo start -c
```

Only install extra packages manually if the terminal says a package is missing.
