import { getInstance } from '../config.js';
import { CollibraClient } from '../utils/collibra-client.js';

const LINEAGE_BASE = '/technical_lineage_resource/rest/lineageGraphRead/v1';

export const getLineageDownstreamTool = {
  name: 'get_lineage_downstream',
  description: 'Retrieve downstream lineage for a technical lineage entity (e.g., a column or table). ' +
    'Shows what data flows OUT of the specified entity — where this data is consumed, transformed, or landed. ' +
    'Requires the technical lineage entity ID (not the DGC asset ID). ' +
    'Use search_lineage_entities to find the entity ID from a DGC asset UUID.',
  inputSchema: {
    type: 'object',
    properties: {
      instance_name: {
        type: 'string',
        description: 'The name of the Collibra instance to query (as defined in config.json)',
      },
      entity_id: {
        type: 'string',
        description: 'The technical lineage entity ID to get downstream lineage for',
      },
      cursor: {
        type: 'string',
        description: 'Optional: Pagination cursor from a previous response to fetch the next page',
      },
    },
    required: ['instance_name', 'entity_id'],
  },
};

export async function executeGetLineageDownstream(args: any): Promise<string> {
  const { instance_name, entity_id, cursor } = args;

  try {
    const instance = getInstance(instance_name);
    const client = new CollibraClient(instance);

    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);

    const endpoint = `${LINEAGE_BASE}/entities/${encodeURIComponent(entity_id)}/downstream${params.toString() ? '?' + params.toString() : ''}`;
    const response = await client.restCall<any>(endpoint);

    return JSON.stringify({
      instance: instance_name,
      entityId: entity_id,
      direction: 'downstream',
      ...response,
    });

  } catch (error) {
    return JSON.stringify({
      error: true,
      message: (error as Error).message,
      instance: instance_name,
      entityId: entity_id,
    });
  }
}
