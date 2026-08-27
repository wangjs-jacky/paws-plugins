# Paws Plugins

[中文说明](README_CN.md)

First-party plugin packages for [Paws](https://github.com/wangjs-jacky/happy). This repository owns plugin manifests, configuration security policies, and reusable domain logic. The Paws repository owns the plugin registry, encrypted installation storage, marketplace UI, and host-specific adapters.

## Included plugins

| Plugin | ID | Capability |
|---|---|---|
| Relationship Advisor | `relationship-advisor` | Analyzes conversations through a user-configured OpenAI-compatible provider |
| Generated Images Gallery | `generated-images-gallery` | Collects and presents generated images from Paws sessions |

## Trust model

Paws currently integrates this repository at build time using a commit-pinned Git dependency. Installing a plugin enables reviewed code already included in that Paws build; it does not download or execute arbitrary remote JavaScript.

The package exposes a small Interface:

- `@paws/plugins/catalog`
- `@paws/plugins/relationship-advisor/server`
- `@paws/plugins/relationship-advisor/chat`
- `@paws/plugins/relationship-advisor/streaming-markdown`
- `@paws/plugins/generated-images-gallery/model`

Expo pages, Socket.IO handlers, Paws storage access, and encrypted configuration remain host Adapters in the Paws repository.

## Development

```bash
pnpm install
pnpm check
```

Plugin IDs are permanent kebab-case identifiers. Plugin versions follow SemVer intent, while the Paws host currently enforces an exact installed version. Secret configuration must be validated on the server and represented only by irreversible hints in public status responses.

## Releases

Versioned packages are published through GitHub Releases with a catalog, machine-readable release metadata, SHA-256 checksums, and build provenance. See [RELEASING.md](RELEASING.md).

See the Paws [plugin development standard](https://github.com/wangjs-jacky/happy/blob/main/docs/plugin-development.md) for the complete lifecycle and security contract.

## License

MIT
