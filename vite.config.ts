import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const base = process.env.BASE_URL || "/";

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 5174,
  },
});
