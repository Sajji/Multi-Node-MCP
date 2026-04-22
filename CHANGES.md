# Changelog

## 6.0.0 — Asset Creation, Data Classification, Data Contracts & More

### Added

#### Asset & Business Term Creation
- **`prepare_create_asset`** — pre-flight check before creating an asset: resolves asset type and domain by name or UUID, detects duplicates, returns a `ready` / `incomplete` / `needs_clarification` / `duplicate_found` status
- **`create_asset`** *(write)* — create any Collibra asset with optional attribute values; returns the new asset URL
- **`prepare_add_business_term`** — pre-flight check before adding a business term: resolves the glossary domain, detects duplicates, hydrates the attribute schema
- **`add_business_term`** *(write)* — create a Business Term in any Glossary domain with optional definition and extra attributes

#### Data Classification
- **`search_data_class`** — search Collibra data classes from the Classification service (filter by name, description, rule presence)
- **`add_data_classification_match`** *(write)* — associate a data class with a Collibra asset
- **`search_data_classification_match`** — search classification matches by asset ID, status (`ACCEPTED` / `REJECTED` / `SUGGESTED`), classification ID, or asset type
- **`remove_data_classification_match`** *(write)* — remove a classification match with two-step preview/confirm safety

#### Data Contracts
- **`list_data_contract`** — list data contracts with cursor-based pagination and optional manifest ID filter
- **`pull_data_contract_manifest`** — download the active YAML manifest for a data contract
- **`push_data_contract_manifest`** *(write)* — upload a new manifest version (multipart form upload; auto-parses ODCS manifests for manifest ID and version)

#### Semantic Traversal
- **`get_column_semantics`** — trace Column → Data Attributes → Business Terms / Measures
- **`get_measure_data`** — trace Measure → Data Attributes → Columns → Tables

#### Technical Lineage
- **`get_lineage_transformation`** — retrieve the SQL or script body for a technical lineage transformation by ID
- **`search_lineage_transformations`** — search lineage transformations by name with cursor pagination

### Changed
- **`search_assets_by_name`** — added `community_ids` (array), `domain_ids` (array), `domain_type_filter` (array), and `created_by_filter` (array) parameters; existing single-value `community_id` and `domain_id` remain for backwards compatibility
- **`get_lineage_upstream`** — added `entity_type` filter and `limit` parameter (default 20, max 100)
- **`get_lineage_downstream`** — added `entity_type` filter and `limit` parameter (default 20, max 100)
- **`search_lineage_entities`** — added explicit `limit` parameter (default 20, max 100)
- Tool count increased from 20 to **35**; write tool count increased from 4 to **9**

---

## 5.0.0 — Read-Only Safety Switch

### Added
- **`readOnly` config flag** — set `"readOnly": true` in `config.json` to run the server in read-only mode
- In read-only mode, all four write tools (`update_asset_description`, `bulk_update_asset_descriptions`, `update_asset_attribute`, `bulk_update_asset_attributes`) are **excluded from the MCP tool list entirely** — the AI cannot see or call them
- A secondary guard in `executeTool` returns a clear error if a write tool is somehow invoked while read-only mode is active
- `config.example.json` now defaults to `"readOnly": true` as the safe out-of-the-box configuration

### Why
When an MCP server is active, AI assistants can autonomously decide to call write tools without explicit instruction. Removing the tools from the MCP `ListTools` response is the strongest enforcement — a tool that doesn't exist cannot be misused.

---

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
