import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  base: "/Momentum-Task-Studio/",
  server: {
    port: 5173,
  },
});
