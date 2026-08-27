# Repository instructions

- Use pnpm and Node.js 20 or newer.
- Keep each plugin under `src/plugins/<plugin-id>`.
- Plugin manifests and configuration validation live with the plugin.
- Never return secret values from `redactConfiguration`.
- Do not add executable code, arbitrary routes, or remote module URLs to manifests.
- Keep Paws-specific Expo, database, Socket.IO, and storage integration in host Adapters.
- Run `pnpm check` before committing.
