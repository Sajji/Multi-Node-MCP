import { isReadOnly } from '../config.js';
import { getAssetTypesTool, executeGetAssetTypes } from './get-asset-types.js';
import { queryAssetsTool, executeQueryAssets } from './query-assets.js';
import { searchAssetsByNameTool, executeSearchAssetsByName } from './search-assets-by-name.js';
import { getAssetByIdTool, executeGetAssetById } from './get-asset-by-id.js';
import { getAssetRelationsTool, executeGetAssetRelations } from './get-asset-relations.js';
import { getDomainsTool, executeGetDomains } from './get-domains.js';
import { getCommunitiesTool, executeGetCommunities } from './get-communities.js';
import { getAssetResponsibilitiesTool, executeGetAssetResponsibilities } from './get-asset-responsibilities.js';
import { updateAssetDescriptionTool, executeUpdateAssetDescription } from './update-asset-description.js';
import { bulkUpdateAssetDescriptionsTool, executeBulkUpdateAssetDescriptions } from './bulk-update-asset-descriptions.js';
import { getAttributeTypesTool, executeGetAttributeTypes } from './get-attribute-types.js';
import { updateAssetAttributeTool, executeUpdateAssetAttribute } from './update-asset-attribute.js';
import { bulkUpdateAssetAttributesTool, executeBulkUpdateAssetAttributes } from './bulk-update-asset-attributes.js';
import { getRelationTypesTool, executeGetRelationTypes } from './get-relation-types.js';
import { getTableSemanticsTool, executeGetTableSemantics } from './get-table-semantics.js';
import { getBusinessTermDataTool, executeGetBusinessTermData } from './get-business-term-data.js';
import { getLineageUpstreamTool, executeGetLineageUpstream } from './get-lineage-upstream.js';
import { getLineageDownstreamTool, executeGetLineageDownstream } from './get-lineage-downstream.js';
import { getLineageEntityTool, executeGetLineageEntity } from './get-lineage-entity.js';
import { searchLineageEntitiesTool, executeSearchLineageEntities } from './search-lineage-entities.js';

// Write tools that are disabled when readOnly mode is enabled
const WRITE_TOOL_NAMES = [
  'update_asset_description',
  'bulk_update_asset_descriptions',
  'update_asset_attribute',
  'bulk_update_asset_attributes',
];

const allTools = [
  getAssetTypesTool,
  queryAssetsTool,
  searchAssetsByNameTool,
  getAssetByIdTool,
  getAssetRelationsTool,
  getDomainsTool,
  getCommunitiesTool,
  getAssetResponsibilitiesTool,
  updateAssetDescriptionTool,
  bulkUpdateAssetDescriptionsTool,
  getAttributeTypesTool,
  updateAssetAttributeTool,
  bulkUpdateAssetAttributesTool,
  getRelationTypesTool,
  getTableSemanticsTool,
  getBusinessTermDataTool,
  getLineageUpstreamTool,
  getLineageDownstreamTool,
  getLineageEntityTool,
  searchLineageEntitiesTool,
];

export const tools = isReadOnly()
  ? allTools.filter(t => !WRITE_TOOL_NAMES.includes(t.name))
  : allTools;

// Tool executor map
export const toolExecutors: Record<string, (args: any) => Promise<string>> = {
  get_asset_types: executeGetAssetTypes,
  query_assets: executeQueryAssets,
  search_assets_by_name: executeSearchAssetsByName,
  get_asset_by_id: executeGetAssetById,
  get_asset_relations: executeGetAssetRelations,
  get_domains: executeGetDomains,
  get_communities: executeGetCommunities,
  get_asset_responsibilities: executeGetAssetResponsibilities,
  update_asset_description: executeUpdateAssetDescription,
  bulk_update_asset_descriptions: executeBulkUpdateAssetDescriptions,
  get_attribute_types: executeGetAttributeTypes,
  update_asset_attribute: executeUpdateAssetAttribute,
  bulk_update_asset_attributes: executeBulkUpdateAssetAttributes,
  get_relation_types: executeGetRelationTypes,
  get_table_semantics: executeGetTableSemantics,
  get_business_term_data: executeGetBusinessTermData,
  get_lineage_upstream: executeGetLineageUpstream,
  get_lineage_downstream: executeGetLineageDownstream,
  get_lineage_entity: executeGetLineageEntity,
  search_lineage_entities: executeSearchLineageEntities,
};

// Helper function to execute a tool by name
export async function executeTool(toolName: string, args: any): Promise<string> {
  if (isReadOnly() && WRITE_TOOL_NAMES.includes(toolName)) {
    throw new Error(
      `Tool "${toolName}" is disabled: this server is running in read-only mode. ` +
      `Set "readOnly": false in config.json to enable write operations.`
    );
  }

  const executor = toolExecutors[toolName];
  
  if (!executor) {
    throw new Error(`Unknown tool: ${toolName}`);
  }
  
  return await executor(args);
}
