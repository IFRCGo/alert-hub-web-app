// vite.config.ts
import { defineConfig as defineConfig2 } from "file:///home/roshni/workspace/alert-hub-web-app/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///home/roshni/workspace/alert-hub-web-app/node_modules/vite-tsconfig-paths/dist/index.mjs";
import webfontDownload from "file:///home/roshni/workspace/alert-hub-web-app/node_modules/vite-plugin-webfont-dl/dist/index.mjs";
import reactSwc from "file:///home/roshni/workspace/alert-hub-web-app/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { execSync } from "child_process";
import { compression } from "file:///home/roshni/workspace/alert-hub-web-app/node_modules/vite-plugin-compression2/dist/index.mjs";
import checker from "file:///home/roshni/workspace/alert-hub-web-app/node_modules/vite-plugin-checker/dist/esm/main.js";
import { ValidateEnv as validateEnv } from "file:///home/roshni/workspace/alert-hub-web-app/node_modules/@julr/vite-plugin-validate-env/dist/index.mjs";

// env.ts
import { defineConfig, Schema } from "file:///home/roshni/workspace/alert-hub-web-app/node_modules/@julr/vite-plugin-validate-env/dist/index.mjs";
var env_default = defineConfig({
  APP_TITLE: Schema.string.optional()
});

// vite.config.ts
var commitHash = execSync("git rev-parse --short HEAD").toString();
var vite_config_default = defineConfig2(({ mode }) => {
  const isProd = mode === "production";
  return {
    define: {
      APP_COMMIT_HASH: JSON.stringify(commitHash)
    },
    plugins: [
      isProd ? checker({
        typescript: true,
        eslint: {
          lintCommand: "eslint ./src"
        },
        stylelint: {
          lintCommand: 'stylelint "./src/**/*.css"'
        }
      }) : void 0,
      reactSwc(),
      tsconfigPaths(),
      webfontDownload(),
      validateEnv(env_default),
      isProd ? compression() : void 0
    ],
    css: {
      devSourcemap: isProd,
      modules: {
        scopeBehaviour: "local",
        localsConvention: "camelCaseOnly"
      }
    },
    envPrefix: "APP_",
    server: {
      port: 3e3,
      strictPort: true
    },
    build: {
      outDir: "build",
      sourcemap: isProd
    },
    test: {
      environment: "happy-dom"
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAiZW52LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvcm9zaG5pL3dvcmtzcGFjZS9hbGVydC1odWItd2ViLWFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvcm9zaG5pL3dvcmtzcGFjZS9hbGVydC1odWItd2ViLWFwcC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9yb3Nobmkvd29ya3NwYWNlL2FsZXJ0LWh1Yi13ZWItYXBwL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJztcbmltcG9ydCB3ZWJmb250RG93bmxvYWQgZnJvbSAndml0ZS1wbHVnaW4td2ViZm9udC1kbCc7XG5pbXBvcnQgcmVhY3RTd2MgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJztcbmltcG9ydCB7IGV4ZWNTeW5jIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgeyBjb21wcmVzc2lvbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uMic7XG5pbXBvcnQgY2hlY2tlciBmcm9tICd2aXRlLXBsdWdpbi1jaGVja2VyJztcbmltcG9ydCB7IFZhbGlkYXRlRW52IGFzIHZhbGlkYXRlRW52IH0gZnJvbSAnQGp1bHIvdml0ZS1wbHVnaW4tdmFsaWRhdGUtZW52JztcblxuaW1wb3J0IGVudkNvbmZpZyBmcm9tICcuL2Vudic7XG5cbi8qIEdldCBjb21taXQgaGFzaCAqL1xuY29uc3QgY29tbWl0SGFzaCA9IGV4ZWNTeW5jKCdnaXQgcmV2LXBhcnNlIC0tc2hvcnQgSEVBRCcpLnRvU3RyaW5nKCk7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgICBjb25zdCBpc1Byb2QgPSBtb2RlID09PSAncHJvZHVjdGlvbic7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZGVmaW5lOiB7XG4gICAgICAgICAgICBBUFBfQ09NTUlUX0hBU0g6IEpTT04uc3RyaW5naWZ5KGNvbW1pdEhhc2gpLFxuICAgICAgICB9LFxuICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgICBpc1Byb2QgPyBjaGVja2VyKHtcbiAgICAgICAgICAgICAgICB0eXBlc2NyaXB0OiB0cnVlLFxuICAgICAgICAgICAgICAgIGVzbGludDoge1xuICAgICAgICAgICAgICAgICAgICBsaW50Q29tbWFuZDogJ2VzbGludCAuL3NyYycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdHlsZWxpbnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgbGludENvbW1hbmQ6ICdzdHlsZWxpbnQgXCIuL3NyYy8qKi8qLmNzc1wiJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSkgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICByZWFjdFN3YygpLFxuICAgICAgICAgICAgdHNjb25maWdQYXRocygpLFxuICAgICAgICAgICAgd2ViZm9udERvd25sb2FkKCksXG4gICAgICAgICAgICB2YWxpZGF0ZUVudihlbnZDb25maWcpLFxuICAgICAgICAgICAgaXNQcm9kID8gY29tcHJlc3Npb24oKSA6IHVuZGVmaW5lZCxcbiAgICAgICAgXSxcbiAgICAgICAgY3NzOiB7XG4gICAgICAgICAgICBkZXZTb3VyY2VtYXA6IGlzUHJvZCxcbiAgICAgICAgICAgIG1vZHVsZXM6IHtcbiAgICAgICAgICAgICAgICBzY29wZUJlaGF2aW91cjogJ2xvY2FsJyxcbiAgICAgICAgICAgICAgICBsb2NhbHNDb252ZW50aW9uOiAnY2FtZWxDYXNlT25seScsXG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBlbnZQcmVmaXg6ICdBUFBfJyxcbiAgICAgICAgc2VydmVyOiB7XG4gICAgICAgICAgICBwb3J0OiAzMDAwLFxuICAgICAgICAgICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgIG91dERpcjogJ2J1aWxkJyxcbiAgICAgICAgICAgIHNvdXJjZW1hcDogaXNQcm9kLFxuICAgICAgICB9LFxuICAgICAgICB0ZXN0OiB7XG4gICAgICAgICAgICBlbnZpcm9ubWVudDogJ2hhcHB5LWRvbScsXG4gICAgICAgIH0sXG4gICAgfTtcbn0pO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9yb3Nobmkvd29ya3NwYWNlL2FsZXJ0LWh1Yi13ZWItYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9yb3Nobmkvd29ya3NwYWNlL2FsZXJ0LWh1Yi13ZWItYXBwL2Vudi50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9yb3Nobmkvd29ya3NwYWNlL2FsZXJ0LWh1Yi13ZWItYXBwL2Vudi50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZywgU2NoZW1hIH0gZnJvbSAnQGp1bHIvdml0ZS1wbHVnaW4tdmFsaWRhdGUtZW52JztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICBBUFBfVElUTEU6IFNjaGVtYS5zdHJpbmcub3B0aW9uYWwoKSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTBTLFNBQVMsZ0JBQUFBLHFCQUFvQjtBQUN2VSxPQUFPLG1CQUFtQjtBQUMxQixPQUFPLHFCQUFxQjtBQUM1QixPQUFPLGNBQWM7QUFDckIsU0FBUyxnQkFBZ0I7QUFDekIsU0FBUyxtQkFBbUI7QUFDNUIsT0FBTyxhQUFhO0FBQ3BCLFNBQVMsZUFBZSxtQkFBbUI7OztBQ1ArTyxTQUFTLGNBQWMsY0FBYztBQUUvVCxJQUFPLGNBQVEsYUFBYTtBQUFBLEVBQ3hCLFdBQVcsT0FBTyxPQUFPLFNBQVM7QUFDdEMsQ0FBQzs7O0FEUUQsSUFBTSxhQUFhLFNBQVMsNEJBQTRCLEVBQUUsU0FBUztBQUVuRSxJQUFPLHNCQUFRQyxjQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDdEMsUUFBTSxTQUFTLFNBQVM7QUFDeEIsU0FBTztBQUFBLElBQ0gsUUFBUTtBQUFBLE1BQ0osaUJBQWlCLEtBQUssVUFBVSxVQUFVO0FBQUEsSUFDOUM7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNMLFNBQVMsUUFBUTtBQUFBLFFBQ2IsWUFBWTtBQUFBLFFBQ1osUUFBUTtBQUFBLFVBQ0osYUFBYTtBQUFBLFFBQ2pCO0FBQUEsUUFDQSxXQUFXO0FBQUEsVUFDUCxhQUFhO0FBQUEsUUFDakI7QUFBQSxNQUNKLENBQUMsSUFBSTtBQUFBLE1BQ0wsU0FBUztBQUFBLE1BQ1QsY0FBYztBQUFBLE1BQ2QsZ0JBQWdCO0FBQUEsTUFDaEIsWUFBWSxXQUFTO0FBQUEsTUFDckIsU0FBUyxZQUFZLElBQUk7QUFBQSxJQUM3QjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0QsY0FBYztBQUFBLE1BQ2QsU0FBUztBQUFBLFFBQ0wsZ0JBQWdCO0FBQUEsUUFDaEIsa0JBQWtCO0FBQUEsTUFDdEI7QUFBQSxJQUNKO0FBQUEsSUFDQSxXQUFXO0FBQUEsSUFDWCxRQUFRO0FBQUEsTUFDSixNQUFNO0FBQUEsTUFDTixZQUFZO0FBQUEsSUFDaEI7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNILFFBQVE7QUFBQSxNQUNSLFdBQVc7QUFBQSxJQUNmO0FBQUEsSUFDQSxNQUFNO0FBQUEsTUFDRixhQUFhO0FBQUEsSUFDakI7QUFBQSxFQUNKO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFsiZGVmaW5lQ29uZmlnIiwgImRlZmluZUNvbmZpZyJdCn0K
