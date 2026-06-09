### README — Installatiecommando’s en korte uitleg

Kopieer en plak de onderstaande commando’s één voor één in je terminal. Elk blok heeft een korte uitleg wat het doet.

---

#### Node (via nvm) — installeer en activeer Node 18
Installeert **Node 18 (LTS)** en schakelt er direct naar over.
```bash
nvm install 18 && nvm use 18
```

---

#### Expo CLI (globaal, optioneel) — handige CLI voor Expo
Installeert de Expo CLI zodat je `expo` commando’s globaal kunt gebruiken.
```bash
npm install -g expo-cli
```

---

#### Basis dependencies — Expo, React, React Native, twrnc en iconen
Installeert de kernpakketten van de app en **twrnc** voor Tailwind‑achtige styling plus Expo‑iconen.
```bash
npm install expo react react-native twrnc @expo/vector-icons
```

---

#### Babel preset (dev) — Babel preset voor Expo
Voegt de **Expo Babel preset** toe als devDependency zodat Metro/Babel correct werkt.
```bash
npm install --save-dev babel-preset-expo
```

---

#### React Navigation (core + stack) — schermnavigatie
Installeert de navigatiebibliotheek en de stack‑navigator.
```bash
npm install @react-navigation/native @react-navigation/stack
```

---

#### Native modules voor React Navigation — compatibele native dependencies
Installeert native modules die React Navigation nodig heeft, met versies afgestemd op je Expo SDK.
```bash
expo install react-native-screens react-native-safe-area-context react-native-gesture-handler
```

---

#### AsyncStorage — persistente opslag (bookmarks)
Voegt lokale opslag toe voor bookmarks of andere persistente data.
```bash
npm install @react-native-async-storage/async-storage
```

---

#### Expo Blur — blur‑achtergrond voor preview modal
Installeert de Blur‑component die gebruikt wordt voor de preview‑achtergrond.
```bash
expo install expo-blur
```

