import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: '/StronaGrzesia/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ["sweph-wasm"] // potrzebne do WASM
  },
  assetsInclude: ["**/*.wasm"] // aby Vite widział pliki WASM
});
