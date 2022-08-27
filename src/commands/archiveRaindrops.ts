/**
 * This command will query raindrop for items that don't have an x-devonthink-item link
 *  and will iterate through some number of them and attempt to add a PDF version into
 *  devonthink under the same hierarchy
 */
import { createPDFFromURL, CustomMetadata, getUUIDforItem } from "../devonthink/devonthink-client";
import { ItemSearchParameters } from "../devonthink/types/Application";
import { Type } from "../devonthink/types/file-types";
import RaindropApi from "../raindrop"
import { UNSORTED_COLLECTION } from "../raindrop/collections/types"
import { Raindrop, RaindropUpdateParameters } from "../raindrop/raindrops/types";
import { CollectionStore } from "../raindrop/utilities/CollectionStore"

const ARCHIVED_TAG = "in_devonthink";
const REVIEWED_TAG = "reviewed";
const RAINDROP_TAG = "from_raindrop";
const DEVONTHINK_LINK_PLACEHOLDER = "DEVONTHINK_LINK";

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
    console.log("Running archive_raindrops with options", options);
    const raindropClient = new RaindropApi();
    const store = new CollectionStore(raindropClient);

    let raindropsToArchive = await getRaindropsToArchive(options, store);

    if (raindropsToArchive.length == 0) {
        console.log("archive_raindrops: No raindrops found to archive - exiting");
        return;
    }

    raindropsToArchive.forEach(async (raindrop) => await archiveRaindrop(raindrop, raindropClient, store));
}

const getRaindropsToArchive = async (options: ArchiveOptions, store: CollectionStore): Promise<Raindrop[]> => {
    let collectionIdToMatch: number | undefined = undefined;

    if (options.collectionName) {
        collectionIdToMatch = await store.findCollectionIdByName(options.collectionName);
        console.log(`archive_raindrops: found id ${collectionIdToMatch} for collection ${options.collectionName}`);
    }

    let allRaindrops = await store.getAllRaindrops();
    let toArchive = allRaindrops.filter((raindrop) => {
        let isCollectionMatch = false;
        if (collectionIdToMatch && raindrop.collection.$id === collectionIdToMatch) {
            isCollectionMatch = true;
        } else {
            isCollectionMatch = raindrop.collection.$id !== UNSORTED_COLLECTION || options.includeUnsorted === true;
        }

        let reviewed = false;
        let notArchived = true;
        if (raindrop.tags.length > 0) {
            notArchived = raindrop.tags.indexOf(ARCHIVED_TAG) < 0;
            reviewed = raindrop.tags.indexOf(REVIEWED_TAG) >= 0;
        }

        return isCollectionMatch && notArchived && reviewed;
    });

    console.log(`archive_raindrops: Of ${allRaindrops.length} raindrops, ${toArchive.length} need to be archived. The limit is ${options.limit}`);

    if (options.limit) {
        toArchive = toArchive.slice(0, options.limit);
    }
    return toArchive;
}

//@ts-ignore
const archiveRaindrop = async (raindrop: Raindrop, api: RaindropApi, store: CollectionStore): Promise<void> => {
    console.log(`archive_raindrops: Archiving URL ${raindrop.link}`);
    let collectionName = await store.findNameForCollection(raindrop.collection.$id);
    if (!collectionName) {
        console.log("Unable to locate a collection name, skipping archive of raindrop " + raindrop.link);
        return;
    }
    let devonthinkSearchParams: ItemSearchParameters = {
        name: collectionName,
        kind: Type.GROUP
    }
    let groupId = await getUUIDforItem(devonthinkSearchParams);
    if (!groupId) {
        console.log("unable to locate a devonthink group id for collection, skipping archive of raindrop " + raindrop.link);
        return;
    }

    if (raindrop.broken) {
        console.log("Raindrop is broken!!!!! returning");
        return;
    }

    let metadata: CustomMetadata = {
        mdraindroplink: `https://app.raindrop.io/my/${raindrop.collection.$id}/item/${raindrop._id}/preview`
    }
    let devonthinkTags = [...raindrop.tags, RAINDROP_TAG];
    console.log(`archive_raindrops: Found devonthink group id ${groupId} for raindrop collection ${collectionName}. Creating PDF now.`);
    let devonthinkReference = await createPDFFromURL(raindrop.link, groupId, metadata, devonthinkTags);
    console.log("archive_raindrops: PDF created in devonthink - reference is " + devonthinkReference);

    let raindropUpdate: RaindropUpdateParameters = {};
    raindropUpdate.tags = [ARCHIVED_TAG];

    if (raindrop.excerpt && raindrop.excerpt.indexOf(DEVONTHINK_LINK_PLACEHOLDER) >= 0) {
        raindropUpdate.excerpt = raindrop.excerpt.replace(DEVONTHINK_LINK_PLACEHOLDER, devonthinkReference);
    }
    await api.updateRaindrop(raindrop._id, raindropUpdate);
}