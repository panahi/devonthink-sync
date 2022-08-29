import { createLogger } from 'bunyan';
import Logger = require('bunyan');
import RaindropApi from '../raindrop';
import { UNSORTED_COLLECTION } from '../raindrop/collections/types';
import { Raindrop } from '../raindrop/raindrops/types';
import { CollectionStore } from '../raindrop/utilities/CollectionStore';

type RaindropOptions = {
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

    /**
     * Should items that are not "reviewed" be included in the results? Default false
     */
    includeUnreviewed?: boolean
}

const defaultOptions = {
    limit: 1,
    collectionName: undefined,
    includeUnsorted: false
};

export const ARCHIVED_TAG = "in_devonthink";
export const REVIEWED_TAG = "reviewed";
export const RAINDROP_TAG = "from_raindrop";
export const DEVONTHINK_LINK_PLACEHOLDER = "DEVONTHINK_LINK";
export const OBSIDIAN_LINK_PLACEHOLDER = "OBSIDIAN_LINK";
export const DESCRIPTION_PLACEHOLDER = "DESCRIPTION_PLACEHOLDER";

export abstract class RaindropCommandBase {
    protected options: RaindropOptions
    protected logger: Logger
    protected api: RaindropApi
    protected store: CollectionStore

    constructor(options?: RaindropOptions) {
        this.options = options || defaultOptions;
        this.logger = createLogger({ name: this.getName() });
        this.api = new RaindropApi();
        this.store = new CollectionStore(this.api);
    }

    protected async getRaindropsToProcess(additionalFilterFn?: (arg0: Raindrop) => boolean): Promise<Raindrop[]> {
        let collectionIdToMatch: number | undefined = undefined;

        if (this.options.collectionName) {
            collectionIdToMatch = await this.store.findCollectionIdByName(this.options.collectionName);
            this.logger.info(`found id ${collectionIdToMatch} for collection ${this.options.collectionName}`);
        }

        let allRaindrops = await this.store.getAllRaindrops();
        let toArchive = allRaindrops.filter((raindrop) => {
            let isCollectionMatch = false;
            if (collectionIdToMatch && raindrop.collection.$id === collectionIdToMatch) {
                isCollectionMatch = true;
            } else {
                isCollectionMatch = raindrop.collection.$id !== UNSORTED_COLLECTION || this.options.includeUnsorted === true;
            }

            let reviewed = false;
            let notArchived = true;
            if (raindrop.tags.length > 0) {
                notArchived = raindrop.tags.indexOf(ARCHIVED_TAG) < 0;
                reviewed = raindrop.tags.indexOf(REVIEWED_TAG) >= 0;
            }

            return isCollectionMatch && notArchived && (reviewed || this.options.includeUnreviewed === true);
        });

        if (additionalFilterFn) {
            this.logger.debug('applying additional filter function passed as a parameter');
            toArchive = toArchive.filter(additionalFilterFn);
        }

        this.logger.info(`Of ${allRaindrops.length} raindrops, ${toArchive.length} are eligible to be processed. The limit is ${this.options.limit}`);

        if (this.options.limit) {
            toArchive = toArchive.slice(0, this.options.limit);
        }
        return toArchive;
    }

    public setOptions(options: RaindropOptions) {
        this.options = options;
    }

    public abstract getName(): string;
    public abstract getDescription(): string;
    public abstract execute(): Promise<void>;
}