import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.DEV_URL": JSON.stringify("http://alfacrm.kg/api"),
  },
});
