/**
 * This command will query raindrop for items that don't have an x-devonthink-item link
 *  and will iterate through some number of them and attempt to add a PDF version into
 *  devonthink under the same hierarchy
 */
import { createPDFFromURL, CustomMetadata, getUUIDforItem } from "../devonthink/devonthink-client";
import { ItemSearchParameters } from "../devonthink/types/Application";
import { Type } from "../devonthink/types/file-types";
import { Raindrop, RaindropUpdateParameters } from "../raindrop/raindrops/types";
import { ARCHIVED_TAG, DEVONTHINK_LINK_PLACEHOLDER, RaindropCommandBase, RAINDROP_TAG } from "./raindropCommandBase";

export class ArchiveRaindropsCommand extends RaindropCommandBase {
    public async execute(): Promise<void> {
        let raindropsToArchive = await this.getRaindropsToProcess();
        if (raindropsToArchive.length == 0) {
            this.logger.warn("No raindrops found to archive - exiting");
            return;
        }
        raindropsToArchive.forEach(async (raindrop) => await this.archiveRaindrop(raindrop));
    }

    private async archiveRaindrop(raindrop: Raindrop): Promise<void> {
        this.logger.info(`Archiving URL ${raindrop.link}`);
        let collectionName = await this.store.findNameForCollection(raindrop.collection.$id);
        if (!collectionName) {
            this.logger.warn("Unable to locate a collection name, skipping archive of raindrop " + raindrop.link);
            return;
        }
        let devonthinkSearchParams: ItemSearchParameters = {
            name: collectionName,
            kind: Type.GROUP
        }
        let groupId = await getUUIDforItem(devonthinkSearchParams);
        if (!groupId) {
            this.logger.warn("unable to locate a devonthink group id for collection, skipping archive of raindrop " + raindrop.link);
            return;
        }

        if (raindrop.broken) {
            this.logger.warn("Raindrop is broken!!!!! returning");
            return;
        }

        let metadata: CustomMetadata = {
            mdraindroplink: `https://app.raindrop.io/my/${raindrop.collection.$id}/item/${raindrop._id}/preview`
        }
        let devonthinkTags = [...raindrop.tags, RAINDROP_TAG];
        this.logger.info(`Found devonthink group id ${groupId} for raindrop collection ${collectionName}. Creating PDF now.`);
        let devonthinkReference = await createPDFFromURL(raindrop.link, groupId, metadata, devonthinkTags);
        this.logger.info("PDF created in devonthink - reference is " + devonthinkReference);

        let raindropUpdate: RaindropUpdateParameters = {};
        raindropUpdate.tags = [ARCHIVED_TAG];

        if (raindrop.excerpt && raindrop.excerpt.indexOf(DEVONTHINK_LINK_PLACEHOLDER) >= 0) {
            raindropUpdate.excerpt = raindrop.excerpt.replace(DEVONTHINK_LINK_PLACEHOLDER, devonthinkReference);
        }
        await this.api.updateRaindrop(raindrop._id, raindropUpdate);
    }

    public getName(): string {
        return "archive_raindrops";
    }

    public getDescription(): string {
        return 'Find unarchived raindrop items and add them to devonthink';
    }
}