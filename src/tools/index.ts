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

// Export all tool definitions
export const tools = [
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
];

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
};

// Helper function to execute a tool by name
export async function executeTool(toolName: string, args: any): Promise<string> {
  const executor = toolExecutors[toolName];
  
  if (!executor) {
    throw new Error(`Unknown tool: ${toolName}`);
  }
  
  return await executor(args);
}
