# Changelog

## 3.0.0 — Attribute Updates & Generic Write Operations

### Added
- **`get_attribute_types`** — discover attribute types by name or kind (BOOLEAN, STRING, NUMERIC, etc.)
- **`update_asset_attribute`** — update any attribute on a single asset by attribute type ID, with preview/confirm safety
- **`bulk_update_asset_attributes`** — update any attribute across multiple assets in one bulk operation
- Support for all attribute kinds: Boolean, String, Numeric, Date, Single/Multi Value List, Script

### Changed
- Tool count increased from 10 to 13

## 2.0.0 — Write Operations

### Added
- **`update_asset_description`** — update a single asset's Description attribute with preview/confirm safety
- **`bulk_update_asset_descriptions`** — bulk update descriptions for multiple assets via `/attributes/bulk`
- Two-step safety pattern: all write tools preview changes before applying them

### Changed
- Tool count increased from 8 to 10
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
- `get_asset_types` — list asset type definitions
- `query_assets` — GraphQL asset query with pagination
- `search_assets_by_name` — quick name-based asset search
- `get_asset_by_id` — comprehensive single-asset details
- `get_asset_relations` — incoming/outgoing relationships
- `get_domains` — domain listing grouped by community
- `get_communities` — community hierarchy
- `get_asset_responsibilities` — responsibility analysis with role/owner grouping

---

## Version 1.0 (Initial Release)

### Features
- 7 basic tools
- GraphQL and REST support
- Multi-instance configuration
- Basic documentation

### Tools in v1.0
1. get_asset_types
2. query_assets
3. search_assets_by_name
4. get_asset_by_id (basic)
5. get_asset_relations
6. get_domains
7. get_communities (basic)

### Limitations in v1.0
- ❌ No user name resolution (UUIDs only)
- ❌ No inherited responsibilities
- ❌ Basic community structure
- ❌ Limited documentation
- ❌ No specialized governance tools

---

## Migration from v1.0 to v2.0

### Breaking Changes
**None!** Version 2.0 is 100% backward compatible.

### What You Get
All existing tools work the same, but:
- Better data quality (full names)
- More comprehensive results (inheritance)
- Additional tools (get_asset_responsibilities)
- Better documentation

### How to Upgrade
1. Extract v2.0 package
2. Copy your config.json from v1.0
3. Run npm install
4. Run npm run build
5. Restart server

Your existing queries will work immediately with enhanced data!

---

## Feedback & Contributions

Want more features? See `docs/RECOMMENDED_TOOLS.md` for ideas and patterns.

Have questions? Check the comprehensive documentation in `docs/`.

Found an issue? The codebase includes extensive error handling and logging.
