// vite.config.ts
import * as dotenv from "file:///Users/michaelweaver/Websites/triple-whale-public-apis/examples/node/node_modules/dotenv/lib/main.js";
import { defineConfig } from "file:///Users/michaelweaver/Websites/triple-whale-public-apis/examples/node/node_modules/vite/dist/node/index.js";
import react from "file:///Users/michaelweaver/Websites/triple-whale-public-apis/examples/node/node_modules/@vitejs/plugin-react/dist/index.mjs";
import checker from "file:///Users/michaelweaver/Websites/triple-whale-public-apis/examples/node/node_modules/vite-plugin-checker/dist/esm/main.js";
import eslint from "file:///Users/michaelweaver/Websites/triple-whale-public-apis/examples/node/node_modules/vite-plugin-eslint/dist/index.mjs";
dotenv.config();
var { NODE_ENV } = process.env;
var vite_config_default = defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true
    }),
    eslint({
      include: ["./server.ts", "src/**/*.{ts,tsx}"],
      exclude: ["vite.config.ts"],
      fix: NODE_ENV === "production" ? false : true,
      lintOnStart: NODE_ENV === "production" ? false : true
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWljaGFlbHdlYXZlci9XZWJzaXRlcy90cmlwbGUtd2hhbGUtcHVibGljLWFwaXMvZXhhbXBsZXMvbm9kZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL21pY2hhZWx3ZWF2ZXIvV2Vic2l0ZXMvdHJpcGxlLXdoYWxlLXB1YmxpYy1hcGlzL2V4YW1wbGVzL25vZGUvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL21pY2hhZWx3ZWF2ZXIvV2Vic2l0ZXMvdHJpcGxlLXdoYWxlLXB1YmxpYy1hcGlzL2V4YW1wbGVzL25vZGUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgKiBhcyBkb3RlbnYgZnJvbSAnZG90ZW52J1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBjaGVja2VyIGZyb20gJ3ZpdGUtcGx1Z2luLWNoZWNrZXInXG5pbXBvcnQgZXNsaW50IGZyb20gJ3ZpdGUtcGx1Z2luLWVzbGludCdcblxuZG90ZW52LmNvbmZpZygpXG5jb25zdCB7IE5PREVfRU5WIH0gPSBwcm9jZXNzLmVudlxuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgY2hlY2tlcih7XG4gICAgICB0eXBlc2NyaXB0OiB0cnVlLFxuICAgIH0pLFxuICAgIGVzbGludCh7XG4gICAgICBpbmNsdWRlOiBbJy4vc2VydmVyLnRzJywgJ3NyYy8qKi8qLnt0cyx0c3h9J10sXG4gICAgICBleGNsdWRlOiBbJ3ZpdGUuY29uZmlnLnRzJ10sXG4gICAgICBmaXg6IE5PREVfRU5WID09PSAncHJvZHVjdGlvbicgPyBmYWxzZSA6IHRydWUsXG4gICAgICBsaW50T25TdGFydDogTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJyA/IGZhbHNlIDogdHJ1ZSxcbiAgICB9KSxcbiAgXSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThYLFlBQVksWUFBWTtBQUN0WixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFDbEIsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sWUFBWTtBQUVaLGNBQU87QUFDZCxJQUFNLEVBQUUsU0FBUyxJQUFJLFFBQVE7QUFHN0IsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sUUFBUTtBQUFBLE1BQ04sWUFBWTtBQUFBLElBQ2QsQ0FBQztBQUFBLElBQ0QsT0FBTztBQUFBLE1BQ0wsU0FBUyxDQUFDLGVBQWUsbUJBQW1CO0FBQUEsTUFDNUMsU0FBUyxDQUFDLGdCQUFnQjtBQUFBLE1BQzFCLEtBQUssYUFBYSxlQUFlLFFBQVE7QUFBQSxNQUN6QyxhQUFhLGFBQWEsZUFBZSxRQUFRO0FBQUEsSUFDbkQsQ0FBQztBQUFBLEVBQ0g7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
