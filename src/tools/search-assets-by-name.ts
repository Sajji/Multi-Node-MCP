import { getInstance } from '../config.js';
import { CollibraClient } from '../utils/collibra-client.js';

export const searchAssetsByNameTool = {
  name: 'search_assets_by_name',
  description: 'Search for assets by name across a Collibra instance. ' +
    'Supports partial matching and optional filtering by asset type. ' +
    'Returns basic asset information including type, domain, and status.',
  inputSchema: {
    type: 'object',
    properties: {
      instance_name: {
        type: 'string',
        description: 'The name of the Collibra instance to query (as defined in config.json)',
      },
      search_term: {
        type: 'string',
        description: 'The name or partial name to search for (case-insensitive)',
      },
      asset_type_id: {
        type: 'string',
        description: 'Optional: Filter results by asset type UUID',
      },
      limit: {
        type: 'number',
        description: 'Optional: Maximum number of results to return (default: 100, max: 1000)',
        default: 100,
      },
    },
    required: ['instance_name', 'search_term'],
  },
};

export async function executeSearchAssetsByName(args: any): Promise<string> {
  const { instance_name, search_term, asset_type_id, limit = 100 } = args;

  try {
    // Get the instance configuration
    const instance = getInstance(instance_name);

    // Create a client for this instance
    const client = new CollibraClient(instance);

    // Build the query parameters
    const params = new URLSearchParams({
      name: search_term,
      nameMatchMode: 'ANYWHERE',
      limit: Math.min(limit, 1000).toString(),
      sortField: 'NAME',
      sortOrder: 'ASC',
    });

    if (asset_type_id) {
      params.append('typeId', asset_type_id);
    }

    // Make the REST API call
    const endpoint = `/rest/2.0/assets?${params.toString()}`;
    const response = await client.restCall<any>(endpoint);

    // Return formatted response
    return JSON.stringify({
      instance: instance_name,
      searchTerm: search_term,
      assetTypeId: asset_type_id || 'All types',
      total: response.total || 0,
      returned: response.results?.length || 0,
      assets: response.results || [],
    });

  } catch (error) {
    return JSON.stringify({
      error: true,
      message: (error as Error).message,
      instance: instance_name,
      searchTerm: search_term,
    });
  }
}
