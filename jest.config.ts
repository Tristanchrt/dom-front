import type { Config } from "jest";

const config: Config = {
  preset: "jest-expo", // Expo-specific preset
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "babel-jest",
      { configFile: "./babel.config.js" },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv: [
    "@testing-library/jest-native/extend-expect",
    "<rootDir>/jest.setup.ts",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@expo/vector-icons$": "<rootDir>/__mocks__/expo-vector-icons.tsx",
    "^@expo/vector-icons/(.*)$": "<rootDir>/__mocks__/expo-vector-icons.tsx",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo(nent)?|@expo(nent)?|unimodules|native-base|react-clone-referenced-element|@sentry|sentry-expo)",
  ],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}", "!src/**/*.d.ts"],
};

export default config;
