# Recommended Future Tools

Ideas for extending the Collibra MCP Server beyond the current 13 tools.

## Already Implemented

The following tools from the original roadmap are now available:

- ~~search_assets_by_name~~ — `search_assets_by_name`
- ~~get_asset_by_id~~ — `get_asset_by_id`
- ~~get_asset_relations~~ — `get_asset_relations`
- ~~get_domains~~ — `get_domains`
- ~~get_communities~~ — `get_communities`
- ~~get_asset_responsibilities~~ — `get_asset_responsibilities`
- ~~get_attribute_types~~ — `get_attribute_types`
- ~~update_asset_attributes~~ — `update_asset_attribute` + `bulk_update_asset_attributes`

## Data Quality & Governance

### get_data_quality_rules
Monitor data quality metrics.
**API:** `GET /rest/2.0/dataQualityRules`

### get_certified_assets
Find trusted, approved data using GraphQL boolean attribute filters.

### search_by_tag
Find assets by business categorization.
**API:** `GET /rest/2.0/assets` with tag filter

## User & Access

### get_users
List available users for assignment or search.
**API:** `GET /rest/2.0/users`

### get_user_groups
List user groups.
**API:** `GET /rest/2.0/userGroups`

## Workflow & Tasks

### get_workflow_tasks
Track pending approvals and actions.
**API:** `GET /rest/2.0/workflowTasks`

### get_workflow_instances
Monitor active workflows.
**API:** `GET /rest/2.0/workflowInstances`

## Metadata

### get_relation_types
Discover available relationship types.
**API:** `GET /rest/2.0/relationTypes`

### get_statuses
List available workflow statuses.
**API:** `GET /rest/2.0/statuses`

## Analytics & Reporting

### get_activities
Audit trail and change history.
**API:** `GET /rest/2.0/activities`

### get_comments
View discussions about data assets.
**API:** `GET /rest/2.0/comments`

## Write Operations

### create_asset
Register new data assets programmatically.
**API:** `POST /rest/2.0/assets`

### add_relation
Create relationships between assets.
**API:** `POST /rest/2.0/relations`

### assign_responsibility
Assign data owners and stewards.
**API:** `POST /rest/2.0/responsibilities`

### bulk_update_status
Change multiple asset statuses at once.
**API:** `PATCH /rest/2.0/assets/bulk`

## Security Considerations

- Write operations require appropriate Collibra permissions
- All write tools should use the preview/confirm pattern
- Validate UUIDs before making API calls
- Rate limit bulk operations to avoid overwhelming the API
