import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.app",
  appName: "react-chat",
  webDir: "build",
  bundledWebRuntime: false,
  server: {
    url: "http://192.168.1.6:3000",
    cleartext: true,
  },
  plugins: {
    App: {
      urlSchemes: ["react-chat"],
    },
  },
};

export default config;
