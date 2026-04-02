import { getInstance } from '../config.js';
import { CollibraClient } from '../utils/collibra-client.js';

export const getAssetByIdTool = {
  name: 'get_asset_by_id',
  description: 'Retrieve complete details about a specific asset by its UUID. ' +
    'Returns the asset with all its attributes, relations, and responsibilities (including inherited). ' +
    'Responsibilities are categorized by direct assignment vs inherited from community/domain. ' +
    'User names are fully resolved for all responsibilities. ' +
    'This is the most comprehensive view of a single asset.',
  inputSchema: {
    type: 'object',
    properties: {
      instance_name: {
        type: 'string',
        description: 'The name of the Collibra instance to query (as defined in config.json)',
      },
      asset_id: {
        type: 'string',
        description: 'The UUID of the asset to retrieve',
      },
      include_inherited: {
        type: 'boolean',
        description: 'Include inherited responsibilities from domain/community (default: true)',
        default: true,
      },
    },
    required: ['instance_name', 'asset_id'],
  },
};

export async function executeGetAssetById(args: any): Promise<string> {
  const { instance_name, asset_id, include_inherited = true } = args;

  try {
    // Get the instance configuration
    const instance = getInstance(instance_name);

    // Create a client for this instance
    const client = new CollibraClient(instance);

    // Make the REST API call to get the asset
    const asset = await client.restCall<any>(`/rest/2.0/assets/${asset_id}`);

    // Get additional details in parallel
    const [attributes, responsibilitiesResponse, relations] = await Promise.all([
      // Get attributes
      client.restCall<any>(`/rest/2.0/attributes?assetId=${asset_id}&limit=1000`)
        .catch(() => ({ results: [] })),
      // Get responsibilities (with inheritance support)
      client.restCall<any>(
        `/rest/2.0/responsibilities?resourceIds=${asset_id}&includeInherited=${include_inherited}&limit=1000`
      ).catch(() => ({ results: [] })),
      // Get relations
      client.restCall<any>(`/rest/2.0/assets/${asset_id}/relations?limit=1000`)
        .catch(() => ({ results: [] })),
    ]);

    // Process responsibilities
    let allResponsibilities = responsibilitiesResponse.results || [];

    // Extract unique user and user group IDs from responsibilities
    const userIds = new Set<string>();
    const userGroupIds = new Set<string>();

    allResponsibilities.forEach((r: any) => {
      if (r.owner?.id) {
        if (r.owner.resourceType === 'User') {
          userIds.add(r.owner.id);
        } else if (r.owner.resourceType === 'UserGroup') {
          userGroupIds.add(r.owner.id);
        }
      }
    });

    // Fetch full user details in batch if we have any user IDs
    const usersMap = new Map<string, any>();
    if (userIds.size > 0) {
      try {
        const userIdsArray = Array.from(userIds);
        // Build query string with multiple userId parameters
        const userParams = userIdsArray.map(id => `userId=${id}`).join('&');
        const usersResponse = await client.restCall<any>(
          `/rest/2.0/users?${userParams}&limit=1000`
        );
        
        // Create a map of userId -> user details
        (usersResponse.results || []).forEach((user: any) => {
          usersMap.set(user.id, user);
        });
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    }

    // Fetch full user group details in batch if we have any
    const userGroupsMap = new Map<string, any>();
    if (userGroupIds.size > 0) {
      try {
        const groupIdsArray = Array.from(userGroupIds);
        // Build query string with multiple userGroupId parameters
        const groupParams = groupIdsArray.map(id => `userGroupId=${id}`).join('&');
        const groupsResponse = await client.restCall<any>(
          `/rest/2.0/userGroups?${groupParams}&limit=1000`
        );
        
        // Create a map of groupId -> group details
        (groupsResponse.results || []).forEach((group: any) => {
          userGroupsMap.set(group.id, group);
        });
      } catch (error) {
        console.error('Failed to fetch user group details:', error);
      }
    }

    // Enrich responsibilities with full user/group details
    allResponsibilities = allResponsibilities.map((r: any) => {
      const enriched = { ...r };
      
      if (r.owner?.id) {
        if (r.owner.resourceType === 'User') {
          const userDetails = usersMap.get(r.owner.id);
          if (userDetails) {
            enriched.owner = {
              ...r.owner,
              userName: userDetails.userName,
              firstName: userDetails.firstName,
              lastName: userDetails.lastName,
              fullName: `${userDetails.firstName || ''} ${userDetails.lastName || ''}`.trim() || userDetails.userName,
              emailAddress: userDetails.emailAddress,
            };
          }
        } else if (r.owner.resourceType === 'UserGroup') {
          const groupDetails = userGroupsMap.get(r.owner.id);
          if (groupDetails) {
            enriched.owner = {
              ...r.owner,
              name: groupDetails.name,
              description: groupDetails.description,
            };
          }
        }
      }
      
      return enriched;
    });

    // Categorize responsibilities by inheritance
    const directResponsibilities = allResponsibilities.filter((r: any) => 
      r.baseResource?.id === asset_id
    );

    const inheritedResponsibilities = allResponsibilities.filter((r: any) => 
      r.baseResource?.id !== asset_id
    );

    // Further categorize inherited by level
    const inheritedByCommunity = inheritedResponsibilities.filter((r: any) =>
      r.baseResource?.resourceType === 'Community'
    );
    
    const inheritedByDomain = inheritedResponsibilities.filter((r: any) =>
      r.baseResource?.resourceType === 'Domain'
    );

    // Build comprehensive response with categorized responsibilities
    const completeAsset = {
      ...asset,
      attributes: attributes.results || [],
      responsibilities: {
        summary: {
          total: allResponsibilities.length,
          direct: directResponsibilities.length,
          inherited: inheritedResponsibilities.length,
          inheritedFromCommunity: inheritedByCommunity.length,
          inheritedFromDomain: inheritedByDomain.length,
        },
        direct: directResponsibilities,
        inherited: include_inherited ? {
          all: inheritedResponsibilities,
          fromCommunity: inheritedByCommunity,
          fromDomain: inheritedByDomain,
        } : null,
      },
      relations: relations.results || [],
    };

    // Return formatted response
    return JSON.stringify({
      instance: instance_name,
      assetId: asset_id,
      includeInherited: include_inherited,
      asset: completeAsset,
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
