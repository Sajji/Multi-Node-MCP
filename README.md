# Collibra MCP Server

A [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) server for Collibra. Connect any MCP-compatible AI assistant (Claude Desktop, VS Code Copilot, etc.) to one or more Collibra instances to search, explore, and update your data catalog through natural language.

## Features

- **20 tools** covering discovery, governance, semantic traversal, lineage, and write operations
- **Multi-instance** support — connect to production, dev, and UAT simultaneously
- **REST + GraphQL** — uses whichever Collibra API is best for each operation
- **Full user name resolution** — responsibilities show real names and emails, not UUIDs
- **Inherited responsibilities** — see who is responsible at asset, domain, and community levels
- **Semantic traversal** — trace Table → Column → Data Attribute → Business Term and back
- **Technical lineage** — upstream/downstream data flow analysis
- **Two-step safety for writes** — all update tools preview changes before applying them
- **Clickable URLs** — all responses include direct links to assets, domains, and communities in Collibra

## Available Tools

### Discovery & Navigation

| Tool | Description |
|------|-------------|
| `get_asset_types` | List all asset type definitions (Data Set, Column, Table, etc.) |
| `get_communities` | List communities with automatic hierarchy building |
| `get_domains` | List domains, optionally filtered by community |
| `get_relation_types` | Discover relationship types (filter by source/target type, role) |

### Search & Retrieval

| Tool | Description |
|------|-------------|
| `search_assets_by_name` | Advanced POST search with keyword matching and filters (resource type, community, domain, status) |
| `query_assets` | GraphQL-based asset query with automatic pagination |
| `get_asset_by_id` | Full asset details via GraphQL: all attributes, relations (cursor-paginated), and responsibilities |

### Relationships & Governance

| Tool | Description |
|------|-------------|
| `get_asset_relations` | All incoming/outgoing relationships via GraphQL with cursor pagination |
| `get_asset_responsibilities` | Responsibility analysis with role/owner grouping and inheritance |
| `get_attribute_types` | Discover attribute types and their IDs (filter by name or kind) |

### Semantic Traversal

| Tool | Description |
|------|-------------|
| `get_table_semantics` | Trace Table → Columns → Data Attributes → Measures (business meaning of physical data) |
| `get_business_term_data` | Trace Business Term → Data Attributes → Columns → Tables (where a concept lives in data) |

### Technical Lineage

| Tool | Description |
|------|-------------|
| `search_lineage_entities` | Find lineage entities by name, type, or DGC asset UUID |
| `get_lineage_entity` | Get details about a single lineage entity |
| `get_lineage_upstream` | Upstream data flow — what feeds into an entity |
| `get_lineage_downstream` | Downstream data flow — where an entity's data goes |

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
| [docs/TOOLS_REFERENCE.md](docs/TOOLS_REFERENCE.md) | Detailed parameter reference for all 20 tools |

## Project Structure

```
├── src/
│   ├── index.ts                          # MCP server entry point
│   ├── config.ts                         # Configuration loader
│   ├── types.ts                          # TypeScript type definitions
│   ├── tools/
│   │   ├── index.ts                      # Tool registry (20 tools)
│   │   ├── get-asset-types.ts            # Asset type definitions
│   │   ├── get-communities.ts            # Community hierarchy
│   │   ├── get-domains.ts                # Domain listing
│   │   ├── get-relation-types.ts         # Relationship type discovery
│   │   ├── search-assets-by-name.ts      # POST search with filters
│   │   ├── query-assets.ts               # GraphQL asset query
│   │   ├── get-asset-by-id.ts            # Full asset details (GraphQL)
│   │   ├── get-asset-relations.ts        # Asset relations (GraphQL)
│   │   ├── get-asset-responsibilities.ts # Responsibilities with inheritance
│   │   ├── get-attribute-types.ts        # Attribute type discovery
│   │   ├── get-table-semantics.ts        # Table → Column → DA → Measure
│   │   ├── get-business-term-data.ts     # Term → DA → Column → Table
│   │   ├── get-lineage-upstream.ts       # Upstream lineage
│   │   ├── get-lineage-downstream.ts     # Downstream lineage
│   │   ├── get-lineage-entity.ts         # Lineage entity details
│   │   ├── search-lineage-entities.ts    # Lineage entity search
│   │   ├── update-asset-description.ts   # Single description update
│   │   ├── bulk-update-asset-descriptions.ts
│   │   ├── update-asset-attribute.ts     # Single attribute update
│   │   └── bulk-update-asset-attributes.ts
│   └── utils/
│       └── collibra-client.ts            # REST + GraphQL client with URL helpers
├── config.example.json                   # Configuration template
├── package.json
└── tsconfig.json
```

## Prerequisites

- **Node.js** 18+
- Access to a Collibra instance with valid credentials
- An MCP-compatible AI client (Claude Desktop, VS Code with Copilot, etc.)

## License

MIT
