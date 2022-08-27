import RaindropApi from ".."
import { Collection } from "../collections/types";
import { Raindrop, RaindropQueryParameters } from "../raindrops/types";

/**
 * Stores the user's collection locally so that it can be retrieved once when details will be needed consistently
 */
export class CollectionStore {
    private api: RaindropApi;
    private rootCollections: Collection[];
    private childCollections: Collection[];
    private raindrops: Raindrop[];

    constructor(api: RaindropApi) {
        this.api = api;
        this.rootCollections = [];
        this.childCollections = [];
        this.raindrops = [];
    }

    private async initializeCollections(): Promise<void> {
        console.log("CollectionStore: initializing collection data");
        let rootCollectionResponse = await this.api.getRootCollections();
        if (!rootCollectionResponse || rootCollectionResponse.result !== true) {
            console.error("Error retrieving raindrop collections (root)", rootCollectionResponse);
            throw new Error("Failed to initialize CollectionStore - root collections");
        }

        this.rootCollections = rootCollectionResponse.items;
        let childCollectionResponse = await this.api.getChildCollections();
        if (!childCollectionResponse || childCollectionResponse.result !== true) {
            console.error("Error retrieving raindrop collections (child)", childCollectionResponse);
            throw new Error("Failed to initialize CollectionStore - child collections");
        }
        this.childCollections = childCollectionResponse.items;

        console.log(`CollectionStore: Initalized ${this.rootCollections.length} root collections and ${this.childCollections.length} child collections`)
    }

    private async initializeRaindrops(): Promise<void> {
        console.log("CollectionStore: initializing raindrop data");
        let params: RaindropQueryParameters = {
            perpage: 50,
            page: 0
        };
        let firstPage = await this.api.getAllRaindrops(params);
        if (!firstPage || firstPage.result !== true) {
            console.error("CollectionStore: Error retrieving list of raindrops", firstPage);
            throw new Error("Failed to retrieve raindrops");
        }
        this.raindrops = firstPage.items;
        const totalRaindrops = firstPage.count;
        const totalPages = Math.ceil(totalRaindrops / (params.perpage || 50));
        for (let page = 1; page < totalPages; page++) {
            console.log(`CollectionStore: Loading page ${page} of raindrop results`);
            params.page = page;
            let currentPage = await this.api.getAllRaindrops(params);
            if (!currentPage || currentPage.result !== true) {
                console.error(`CollectionStore: Error retrieving list of raindrops for page ${page}`, currentPage);
                throw new Error("Failed to retrieve raindrops on page " + page);
            }
            console.log(`CollectionStore: fetched ${currentPage.items.length} items on page ${page}`);
            this.raindrops = [...this.raindrops, ...currentPage.items];
        }
        console.log(`CollectionStore: Loaded ${this.raindrops.length} total raindrops`);
    }

    public async findCollectionIdByName(name: string): Promise<number> {
        const findFunction = function (collection: Collection) {
            return collection.title.toLowerCase() === name.toLowerCase();
        }
        if (this.rootCollections.length === 0) {
            await this.initializeCollections();
        }

        let found = this.rootCollections.find(findFunction);
        if (!found) {
            found = this.childCollections.find(findFunction);
        }

        if (!found) {
            console.log("CollectionStore: findCollectionIdByName failed to find any collection id for name " + name);
        } else {
            console.log(`CollectionStore: found id ${found._id} for name ${name}`);
        }

        return found?._id || -1;
    }

    public async findNameForCollection(id: number): Promise<string | undefined> {
        const findFunction = function (collection: Collection) {
            return collection._id === id;
        }
        if (this.rootCollections.length === 0) {
            await this.initializeCollections();
        }

        let found = this.rootCollections.find(findFunction);
        if (!found) {
            found = this.childCollections.find(findFunction);
        }

        if (!found) {
            console.log("CollectionStore: findNameForCollection failed to find any name for id " + id);
        } else {
            console.log(`CollectionStore: found name ${found.title} for id ${id}`);
        }

        return found?.title;
    }

    public async getAllRaindrops(): Promise<Raindrop[]> {
        if (this.raindrops.length === 0) {
            await this.initializeRaindrops();
        }
        return this.raindrops;
    }
}