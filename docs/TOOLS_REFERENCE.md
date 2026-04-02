# Tools Reference

Complete reference for all 13 tools provided by the Collibra MCP Server.

---

## Discovery & Navigation

### get_asset_types

List all asset type definitions from a Collibra instance (Data Set, Column, Table, etc.).

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instance_name` | Yes | Collibra instance name from config.json |

**Tip:** Call this first to discover asset type names before querying assets.

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

## Search & Retrieval

### search_assets_by_name

Quick asset search by name with partial, case-insensitive matching. The fastest way to find assets.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instance_name` | Yes | Collibra instance name |
| `search_term` | Yes | Name to search for |
| `asset_type_id` | No | Filter by asset type UUID |
| `limit` | No | Max results (default: 100, max: 1000) |

---

### query_assets

Query assets using GraphQL with automatic pagination. Returns attributes and direct responsibilities.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instance_name` | Yes | Collibra instance name |
| `asset_type_name` | No | Filter by asset type name |
| `detail_level` | No | `"summary"` or `"full"` (default: full) |

> **Note:** GraphQL returns direct responsibilities only. Use `get_asset_by_id` or `get_asset_responsibilities` for inherited responsibilities.

---

### get_asset_by_id

Get complete details for a single asset: all attributes, all responsibilities (direct + inherited with full user names), and all relations.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instance_name` | Yes | Collibra instance name |
| `asset_id` | Yes | UUID of the asset |

This is the most comprehensive read tool — it makes parallel API calls to gather everything about an asset in one request.

---

## Relationships & Governance

### get_asset_relations

Get all incoming and outgoing relationships for an asset (lineage, dependencies, containment).

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

## Attribute Types

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

## Write Operations

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

Update any attribute on a single asset by specifying the attribute type ID. Works for all attribute kinds.

| Parameter | Required | Description |
|-----------|----------|-------------|
| `instance_name` | Yes | Collibra instance name |
| `asset_id` | Yes | UUID of the asset |
| `attribute_type_id` | Yes | UUID of the attribute type (use `get_attribute_types` to find) |
| `new_value` | Yes | New value as string (`"true"`/`"false"` for booleans, number string for numerics, etc.) |
| `confirm` | No | `true` to apply, `false` to preview (default) |

**Example — setting "Personally Identifiable Information" to true:**
1. Call `get_attribute_types` with `name: "Personally Identifiable Information"` to get the type ID
2. Call `update_asset_attribute` with that type ID, the asset ID, and `new_value: "true"`

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

### Governance Audit
```
get_asset_responsibilities (with include_inherited=true)
```

### Lineage Tracing
```
search_assets_by_name → get_asset_relations → follow upstream/downstream
```

### Bulk Attribute Update
```
get_attribute_types (find type ID) → bulk_update_asset_attributes (preview) → bulk_update_asset_attributes (confirm)
```

## 📝 Notes

- All tools support the `instance_name` parameter for multi-instance deployments
- Error handling is built-in - failed calls return structured error JSON
- All pagination is handled automatically where applicable
- Results are formatted as JSON for easy parsing
- Tools are designed to be composable - use outputs of one as inputs to another

---

Need help with any tool? Check the tool's `description` field or ask for examples!
