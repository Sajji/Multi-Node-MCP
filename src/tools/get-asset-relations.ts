import { getInstance } from '../config.js';
import { CollibraClient } from '../utils/collibra-client.js';

export const getAssetRelationsTool = {
  name: 'get_asset_relations',
  description: 'Retrieve all relations (relationships) for a specific asset. ' +
    'Returns both incoming and outgoing relations, showing how this asset connects to other assets. ' +
    'Useful for understanding data lineage, dependencies, and asset hierarchies. ' +
    'Optionally filter by relation type.',
  inputSchema: {
    type: 'object',
    properties: {
      instance_name: {
        type: 'string',
        description: 'The name of the Collibra instance to query (as defined in config.json)',
      },
      asset_id: {
        type: 'string',
        description: 'The UUID of the asset to retrieve relations for',
      },
      relation_type_id: {
        type: 'string',
        description: 'Optional: Filter by specific relation type UUID (e.g., "contains", "is part of")',
      },
      limit: {
        type: 'number',
        description: 'Optional: Maximum number of relations to return (default: 1000)',
        default: 1000,
      },
    },
    required: ['instance_name', 'asset_id'],
  },
};

export async function executeGetAssetRelations(args: any): Promise<string> {
  const { instance_name, asset_id, relation_type_id, limit = 1000 } = args;

  try {
    // Get the instance configuration
    const instance = getInstance(instance_name);

    // Create a client for this instance
    const client = new CollibraClient(instance);

    // Build query parameters
    const params = new URLSearchParams({
      limit: limit.toString(),
    });

    if (relation_type_id) {
      params.append('relationTypeId', relation_type_id);
    }

    // Make the REST API call
    const endpoint = `/rest/2.0/assets/${asset_id}/relations?${params.toString()}`;
    const response = await client.restCall<any>(endpoint);

    // Organize relations by direction
    const outgoingRelations = (response.results || []).filter((r: any) => r.source?.id === asset_id);
    const incomingRelations = (response.results || []).filter((r: any) => r.target?.id === asset_id);

    // Return formatted response
    return JSON.stringify({
      instance: instance_name,
      assetId: asset_id,
      relationTypeId: relation_type_id || 'All types',
      summary: {
        total: response.results?.length || 0,
        outgoing: outgoingRelations.length,
        incoming: incomingRelations.length,
      },
      relations: {
        outgoing: outgoingRelations,
        incoming: incomingRelations,
      },
      allRelations: response.results || [],
    });

  } catch (error) {
    return JSON.stringify({
      error: true,
      message: (error as Error).message,
      instance: instance_name,
      assetId: asset_id,
    });
  }
}
