# Tools Reference

Complete reference for all 20 tools provided by the Collibra MCP Server.

---

## Discovery & Navigation

### get_asset_types

List all asset type definitions from a Collibra instance (Data Set, Column, Table, etc.).

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instance_name` | Yes | Collibra instance name from config.json |

**Tip:** Call this first to discover asset type names and IDs before querying assets.

---

### get_communities

List communities with automatic hierarchy building.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instance_name` | Yes | Collibra instance name |
| `parent_id` | No | Get children of a specific community |
| `name` | No | Filter by community name |
| `show_hierarchy` | No | Organize hierarchically (default: true) |
| `limit` | No | Max results (default: 1000) |

---

### get_domains

List domains (organizational containers for assets), auto-grouped by community.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instance_name` | Yes | Collibra instance name |
| `community_id` | No | Filter to a specific community |
| `name` | No | Filter by domain name |
| `limit` | No | Max results (default: 1000) |

---

### get_relation_types

Discover available relationship types in the Collibra operating model. Helps understand how asset types relate to each other.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instance_name` | Yes | Collibra instance name |
| `source_type_name` | No | Filter by source asset type name |
| `target_type_name` | No | Filter by target asset type name |
| `role` | No | Filter by role name (partial match) |
| `limit` | No | Max results (default: 100) |

---

## Search & Retrieval

### search_assets_by_name

Advanced search using the POST `/rest/2.0/search` endpoint. Supports keyword matching with automatic wildcard wrapping, and filtering by resource type, community, domain, asset type, and status.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instance_name` | Yes | Collibra instance name |
| `search_term` | Yes | Keyword(s) to search for (wildcards auto-added) |
| `resource_types` | No | Filter by resource types: `Asset`, `Domain`, `Community`, `User`, `UserGroup` |
| `community_id` | No | Filter to a specific community UUID |
| `domain_id` | No | Filter to a specific domain UUID |
| `asset_type_id` | No | Filter by asset type UUID |
| `status_id` | No | Filter by status UUID |
| `limit` | No | Max results (default: 100, max: 1000) |
| `offset` | No | Skip results for pagination (default: 0) |

---

### query_assets

Query assets using GraphQL with automatic pagination. Returns attributes and direct responsibilities.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instance_name` | Yes | Collibra instance name |
| `asset_type_name` | No | Filter by asset type name |
| `detail_level` | No | `"summary"` or `"full"` (default: full) |

---

### get_asset_by_id

Get complete details for a single asset via a single GraphQL query. Returns all attribute types (string, boolean, numeric, date), incoming/outgoing relations with cursor-based pagination, and responsibilities (direct + inherited with full user names).

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instance_name` | Yes | Collibra instance name |
| `asset_id` | Yes | UUID of the asset |
| `include_inherited` | No | Include inherited responsibilities (default: true) |
| `outgoing_relations_cursor` | No | Cursor (relation ID) to fetch next page of outgoing relations |
| `incoming_relations_cursor` | No | Cursor (relation ID) to fetch next page of incoming relations |

**Pagination:** Relations return 50 per page. If `hasMoreOutgoing` or `hasMoreIncoming` is `true`, pass the `nextOutgoingCursor` or `nextIncomingCursor` from the response as the cursor parameter to get the next page.

**Responsibilities:** Fetched via REST in parallel with the GraphQL query. Categorized as:
- **Direct** — assigned directly to the asset
- **Inherited from Domain** — assigned at the domain level
- **Inherited from Community** — assigned at the community level

All user/group owners are resolved to full names, emails, and usernames via batch API calls.

---

## Relationships & Governance

### get_asset_relations

Get all incoming and outgoing relationships for an asset via GraphQL with cursor-based pagination.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instance_name` | Yes | Collibra instance name |
| `asset_id` | Yes | UUID of the asset |
| `relation_type_id` | No | Filter by relation type |
| `limit` | No | Max relations (default: 1000) |

---

### get_asset_responsibilities

Detailed responsibility analysis with grouping by role and owner, including inherited responsibilities.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instance_name` | Yes | Collibra instance name |
| `asset_id` | Yes | UUID of the asset |
| `include_inherited` | No | Include inherited responsibilities (default: true) |
| `role_name` | No | Filter by role name |

---

### get_attribute_types

Discover attribute types available in a Collibra instance. Use this to find the attribute type ID needed for `update_asset_attribute`.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instance_name` | Yes | Collibra instance name |
| `name` | No | Filter by name (partial match by default) |
| `name_match_mode` | No | `START`, `END`, `ANYWHERE` (default), `EXACT` |
| `kind` | No | `BOOLEAN`, `STRING`, `NUMERIC`, `DATE`, `SINGLE_VALUE_LIST`, `MULTI_VALUE_LIST`, `SCRIPT` |
| `limit` | No | Max results (default: 100, max: 1000) |

---

## Semantic Traversal

These tools traverse the Collibra operating model using well-known relationship types to connect physical data to business meaning.

### get_table_semantics

Discover the business meaning of a database Table by following: **Table → Columns → Data Attributes → Measures**.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instance_name` | Yes | Collibra instance name |
| `table_asset_id` | Yes | UUID of the Table asset to analyze |

**Returns:** Each column with its linked data attributes and associated measures, all with clickable Collibra URLs.

---

### get_business_term_data

Trace a Business Term or Measure back to physical data by following: **Term → Data Attributes → Columns → Tables**.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instance_name` | Yes | Collibra instance name |
| `term_asset_id` | Yes | UUID of the Business Term or Measure to trace |

**Returns:** Each linked data attribute with its columns and parent tables, answering "Where does this business concept live in the actual data?"

---

## Technical Lineage

These tools work with Collibra's Technical Lineage module to trace data flow. Lineage entities have their own IDs separate from DGC asset UUIDs — use `search_lineage_entities` to bridge between them.

### search_lineage_entities

Search for technical lineage entities by name, type, or DGC asset UUID.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instance_name` | Yes | Collibra instance name |
| `name_contains` | No | Search by partial name |
| `entity_type` | No | Filter by type: `Column`, `Table`, `Database`, `Schema`, `Process` |
| `dgc_asset_id` | No | Find the lineage entity linked to a Collibra asset UUID |
| `cursor` | No | Pagination cursor from previous response |

---

### get_lineage_entity

Get details about a single technical lineage entity.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instance_name` | Yes | Collibra instance name |
| `entity_id` | Yes | Technical lineage entity ID |

---

### get_lineage_upstream

Get upstream lineage — what data flows INTO an entity.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instance_name` | Yes | Collibra instance name |
| `entity_id` | Yes | Technical lineage entity ID |
| `cursor` | No | Pagination cursor from previous response |

---

### get_lineage_downstream

Get downstream lineage — where an entity's data flows TO.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instance_name` | Yes | Collibra instance name |
| `entity_id` | Yes | Technical lineage entity ID |
| `cursor` | No | Pagination cursor from previous response |

---

## Write Operations

> **Read-Only Mode:** If `"readOnly": true` is set in `config.json`, none of the tools in this section will appear in the AI's tool list. They are hidden at the protocol level and cannot be called. Set `"readOnly": false` to enable them.

All write tools use a **two-step preview/confirm** pattern:
1. Call with `confirm=false` (default) to see current vs. proposed values
2. Call again with `confirm=true` to apply

### update_asset_description

Update the Description attribute of a single asset.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instance_name` | Yes | Collibra instance name |
| `asset_id` | Yes | UUID of the asset |
| `new_description` | Yes | New description text |
| `confirm` | No | `true` to apply, `false` to preview (default) |

---

### bulk_update_asset_descriptions

Update descriptions for multiple assets in a single bulk operation.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instance_name` | Yes | Collibra instance name |
| `updates` | Yes | Array of `{ asset_id, new_description }` objects |
| `confirm` | No | `true` to apply, `false` to preview (default) |

---

### update_asset_attribute

Update any attribute on a single asset by specifying the attribute type ID.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instance_name` | Yes | Collibra instance name |
| `asset_id` | Yes | UUID of the asset |
| `attribute_type_id` | Yes | UUID of the attribute type (use `get_attribute_types` to find) |
| `new_value` | Yes | New value as string (`"true"`/`"false"` for booleans, etc.) |
| `confirm` | No | `true` to apply, `false` to preview (default) |

---

### bulk_update_asset_attributes

Update the same attribute type across multiple assets in one bulk operation.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instance_name` | Yes | Collibra instance name |
| `attribute_type_id` | Yes | UUID of the attribute type |
| `updates` | Yes | Array of `{ asset_id, new_value }` objects |
| `confirm` | No | `true` to apply, `false` to preview (default) |

---

## Common Workflows

### Data Discovery
```
get_communities → get_domains → search_assets_by_name → get_asset_by_id
```

### Understand a Table's Business Meaning
```
search_assets_by_name (find the table) → get_table_semantics
```

### Find Where a Business Term Lives in Data
```
search_assets_by_name (find the term) → get_business_term_data
```

### Trace Data Lineage
```
search_lineage_entities (find entity ID) → get_lineage_upstream / get_lineage_downstream
```

### Governance Audit
```
get_asset_by_id (includes responsibilities) or get_asset_responsibilities (with include_inherited=true)
```

### Bulk Attribute Update
```
get_attribute_types (find type ID) → bulk_update_asset_attributes (preview) → bulk_update_asset_attributes (confirm)
```
