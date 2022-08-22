/**
 * This command will query raindrop for items that don't have an x-devonthink-item link
 *  and will iterate through some number of them and attempt to add a PDF version into
 *  devonthink under the same hierarchy
 */

import RaindropApi from "../raindrop"
type ArchiveOptions = {
    /**
     * Limit the number of raindrops that will be processed.
     * Defaults to 1
     */
    limit?: number

    /**
     * Restrict the search to a specific collection name.
     * By default unrestricted
     */
    collectionName?: string

    /**
     * Process "Unsorted" collection as well (putting the PDFs in the inbox)
     */
    includeUnsorted?: boolean
}

export const archiveRaindrops = async (options: ArchiveOptions) => {
    const raindropClient = new RaindropApi();
    console.log(options);
    await raindropClient.getAllRaindrops();
    return 0;
}

