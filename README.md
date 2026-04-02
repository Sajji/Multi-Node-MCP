# Collibra MCP Server

A [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) server for Collibra. Connect any MCP-compatible AI assistant (Claude Desktop, VS Code Copilot, etc.) to one or more Collibra instances to search, explore, and update your data catalog through natural language.

## Features

- **13 tools** covering discovery, governance, and write operations
- **Multi-instance** support — connect to production, dev, and UAT simultaneously
- **Full user name resolution** — responsibilities show real names and emails, not UUIDs
- **Inherited responsibilities** — see who is responsible at asset, domain, and community levels
- **Two-step safety for writes** — all update tools preview changes before applying them
- **REST + GraphQL** — uses whichever Collibra API is best for each operation

## Available Tools

### Discovery & Navigation

| Tool | Description |
|------|-------------|
| `get_asset_types` | List all asset type definitions (Data Set, Column, Table, etc.) |
| `get_communities` | List communities with automatic hierarchy building |
| `get_domains` | List domains, optionally filtered by community |

### Search & Retrieval

| Tool | Description |
|------|-------------|
| `search_assets_by_name` | Quick asset search by name with partial matching |
| `query_assets` | GraphQL-based asset query with automatic pagination |
| `get_asset_by_id` | Full asset details: attributes, responsibilities, relations |

### Relationships & Governance

| Tool | Description |
|------|-------------|
| `get_asset_relations` | All incoming/outgoing relationships for an asset |
| `get_asset_responsibilities` | Responsibility analysis with role/owner grouping and inheritance |

### Attribute Types

| Tool | Description |
|------|-------------|
| `get_attribute_types` | Discover attribute types and their IDs (filter by name or kind) |

### Write Operations

| Tool | Description |
|------|-------------|
| `update_asset_description` | Update a single asset's description (preview → confirm) |
| `bulk_update_asset_descriptions` | Update descriptions for multiple assets at once |
| `update_asset_attribute` | Update any attribute on an asset by type ID (preview → confirm) |
| `bulk_update_asset_attributes` | Update any attribute across multiple assets at once |

> All write tools use a **preview/confirm** pattern — call with `confirm=false` (default) to see what will change, then `confirm=true` to apply.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create your configuration
cp config.example.json config.json
# Edit config.json with your Collibra instance URL and credentials

# 3. Build
npm run build

# 4. Run
npm start
```

See [INSTALL.md](INSTALL.md) for detailed setup instructions and MCP client configuration.

## Configuration

Copy `config.example.json` to `config.json` and add your Collibra instances:

```json
{
  "instances": [
    {
      "name": "Production",
      "baseUrl": "https://your-instance.collibra.com",
      "username": "your-username",
      "password": "your-password"
    }
  ]
}
```

You can add multiple instances and reference them by name when calling any tool.

> **Security:** `config.json` is in `.gitignore` — never commit credentials to version control.

## Documentation

| Guide | Description |
|-------|-------------|
| [INSTALL.md](INSTALL.md) | Full installation and MCP client configuration |
| [docs/CLAUDE_DESKTOP_SETUP.md](docs/CLAUDE_DESKTOP_SETUP.md) | Claude Desktop integration step-by-step |
| [docs/TOOLS_REFERENCE.md](docs/TOOLS_REFERENCE.md) | Detailed reference for all 13 tools |
| [docs/INHERITED_RESPONSIBILITIES_GUIDE.md](docs/INHERITED_RESPONSIBILITIES_GUIDE.md) | How responsibility inheritance works |
| [docs/USER_NAME_RESOLUTION_GUIDE.md](docs/USER_NAME_RESOLUTION_GUIDE.md) | How user name resolution works |

## Project Structure

```
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── config.ts             # Configuration loader
│   ├── types.ts              # TypeScript type definitions
│   ├── tools/                # Tool definitions and executors
│   │   ├── index.ts          # Tool registry
│   │   ├── get-asset-types.ts
│   │   ├── get-communities.ts
│   │   ├── get-domains.ts
│   │   ├── search-assets-by-name.ts
│   │   ├── query-assets.ts
│   │   ├── get-asset-by-id.ts
│   │   ├── get-asset-relations.ts
│   │   ├── get-asset-responsibilities.ts
│   │   ├── get-attribute-types.ts
│   │   ├── update-asset-description.ts
│   │   ├── bulk-update-asset-descriptions.ts
│   │   ├── update-asset-attribute.ts
│   │   └── bulk-update-asset-attributes.ts
│   └── utils/
│       └── collibra-client.ts  # REST & GraphQL client
├── config.example.json       # Configuration template
├── package.json
└── tsconfig.json
```

## Prerequisites

- **Node.js** 18+
- Access to a Collibra instance with valid credentials
- An MCP-compatible AI client (Claude Desktop, VS Code with Copilot, etc.)

## License

MIT
