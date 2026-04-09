# Changelog

## 4.0.0 — GraphQL, Semantic Traversal & Lineage

### Added
- **`get_relation_types`** — discover relationship types, filterable by source/target type and role
- **`get_table_semantics`** — traverse Table → Columns → Data Attributes → Measures using well-known relation types
- **`get_business_term_data`** — traverse Business Term → Data Attributes → Columns → Tables (reverse semantic trace)
- **`get_lineage_upstream`** — upstream data flow for a technical lineage entity
- **`get_lineage_downstream`** — downstream data flow for a technical lineage entity
- **`get_lineage_entity`** — details about a single technical lineage entity
- **`search_lineage_entities`** — find lineage entities by name, type, or DGC asset UUID
- Clickable URLs in all tool responses — direct links to assets, domains, and communities in Collibra

### Changed
- **`get_asset_by_id`** — rewritten to use a single GraphQL query fetching all attribute types (string, boolean, numeric, date) and relations with cursor-based pagination. Responsibilities still fetched via REST in parallel.
- **`search_assets_by_name`** — upgraded from `GET /rest/2.0/assets` to `POST /rest/2.0/search` with wildcard keyword matching and filters for resource type, community, domain, asset type, and status
- **`get_asset_relations`** — rewritten to use GraphQL with cursor-based pagination
- Tool count increased from 14 to 20

## 3.0.0 — Attribute Updates & Generic Write Operations

### Added
- **`get_attribute_types`** — discover attribute types by name or kind (BOOLEAN, STRING, NUMERIC, etc.)
- **`update_asset_attribute`** — update any attribute on a single asset by attribute type ID, with preview/confirm safety
- **`bulk_update_asset_attributes`** — update any attribute across multiple assets in one bulk operation

## 2.0.0 — Write Operations

### Added
- **`update_asset_description`** — update a single asset's Description attribute with preview/confirm safety
- **`bulk_update_asset_descriptions`** — bulk update descriptions for multiple assets
- Two-step safety pattern: all write tools preview changes before applying them
- `CollibraClient` gained `restCallWithBody()` for POST/PATCH/PUT requests

## 1.0.0 — Initial Release

### Features
- 8 read-only tools for Collibra data discovery and governance
- Multi-instance configuration support
- Full user name resolution (UUIDs → names, emails, usernames)
- Inherited responsibility support (asset, domain, community levels)
- Hierarchical community organization
- REST and GraphQL API support with automatic pagination

### Tools
- `get_asset_types`, `query_assets`, `search_assets_by_name`, `get_asset_by_id`
- `get_asset_relations`, `get_domains`, `get_communities`, `get_asset_responsibilities`
