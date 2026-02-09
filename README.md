
# Stevenson Space App

Welcome to **Stevenson Space**, a student companion app designed for Stevenson High School. Built for speed, elegance, and utility, Stevenson Space aims to keep you organized and informed throughout the school day.

> [!WARNING]
> **Current Status: Alpha Stage**
> The app is currently in active development. You will likely encounter bugs and unfinished features.

---

## 📱 Features

- **Today**: View current period countdown, your daily schedule, the lunch menu, and the PWC schedule at a glance.
- **Events**: Stay updated with school events synced directly from the district calendar.
- **Resources**: Quick access to essential school links and PWC schedules.
- **Settings**: Customize your app experience, such as notification settings.

---

## 🛠 Tech Stack

- **Framework**: [Expo 54](https://expo.dev/)
- **Runtime**: [React Native 0.81](https://reactnative.dev/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (Native Tabs via `expo-router/unstable-native-tabs`)
- **Icons**: [Lucide React Native](https://lucide.dev/) & SF Symbols
- **Styling**: Native CSS styling with a focus on premium aesthetics.
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest) & `ical.js`

---

## 🗺 Roadmap

## Version 1.0  
- [x] Add an option to sync with the default Calendar  
- [x] Make settings functional  
    - [x] Notifications when class starts  
    - [x] Notifications when the period ends  
- [x] Change icons on quick links  
- [ ] Change icons in Calendar Sync  
- [ ] Improve the look of the Lunch Menu  
- [ ] Make sure notifications actually work  
  
---

## Version 1.1  
- [ ] Add the ability to customize notifications. Add the option:  
    - [ ] Notifications “**x”** mins before period ends  
- [ ] Add analytics tracking via PostHog  
- [ ] Add feedback board support  
  
---

## Version 2.0  
- [ ] Update the design of the “Today” tab to look more like [stevenson.space](https://stevenson.space/) mobile version  
- [ ] Add the ability to add a personal schedule (rename classes)  
- [ ] Add more in-built themes  
- [ ] Add “Coming this week” events on the Today tab  
  
---

## Version 2.1  
- [ ] Add ability for custom themes (change colors)  
- [ ] Give people an option to customize what they want on the “Today” tab  
    - [ ] Ex: Lunch menu, PWC Schedule, Today’s events, or events for the week  
  
---

## Version 2.1.1  
- [ ] Add the option to customize notifications to account for the traveller bell for certain periods  
  
---

## Version 2.1.2  
- [ ] Add the ability to add gradient-like themes  
  
---

## Version 2.2  
- [ ] Add widgets on iOS and Android  
- [ ] Add live activities  
- [ ] Add Dynamic Island support  
  
---

## Version 2.3  
- [ ] Add a simple onboarding flow  
    - [ ] Explanation of the app  
    - [ ] Option to customize schedule (add class names)  
    - [ ] Customize notification behavior  
    - [ ] Prompt on Widgets, Live activities, and Dynamic Island

---

## 💻 Getting Started

To run the project locally, ensure you have [Node.js](https://nodejs.org/) installed and follow these steps:

### 1. Clone the Repository

```sh
git clone https://github.com/TechNerd2009/Stevenson-Space-App.git
cd Stevenson-Space-App
```

### 2. Install Dependencies:

```sh
npm install
```

### 3. Start the Development Server:

```sh
npx expo start
```

### 4. Open the App:

- **iOS**: Press `i` to open in the simulator (requires Xcode) or scan the QR code with your camera/Expo Go.
- **Android**: Press `a` to open in the simulator (requires Android Studio) or scan the QR code with your camera/Expo Go.

---

## 🤝 Contribution & Bug Reports

As we are in **Alpha**, your feedback is critical. If you find a bug or have a feature request, please reach out to the development team.