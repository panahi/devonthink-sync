import { stringify } from 'querystringify';
import { Base, ItemResponse } from "../base";
import { UNSORTED_COLLECTION, ALL_RAINDROPS_COLLECTION, DELETED_RAINDROPS_COLLECTION } from "../collections/types";
import { Raindrop, RaindropListResponse, RaindropQueryParameters, RaindropUpdateParameters } from "./types";

const RESOURCE_NAME = "raindrop";
const RESOURCE_NAME_PLURAL = RESOURCE_NAME + 's';

export class Raindrops extends Base {
    async getRaindropById(raindropId: number) {
        return this.request<ItemResponse<Raindrop>>(`${RESOURCE_NAME}/${raindropId}`);
    }

    async getPermanentCopyOfRaindrop(raindropId: number) {
        return this.request<ItemResponse<Raindrop>>(`${RESOURCE_NAME}/${raindropId}/cache`);
    }

    async getRaindropsFromCollection(collectionId: number, params?: RaindropQueryParameters) {
        let path = `${RESOURCE_NAME_PLURAL}/${collectionId}`;
        if (params) {
            path += stringify(params, '?');
        }
        return this.request<RaindropListResponse>(path)
    }

    async getUnsortedRaindrops(params?: RaindropQueryParameters) {
        return this.getRaindropsFromCollection(UNSORTED_COLLECTION, params)
    }

    async getAllRaindrops(params?: RaindropQueryParameters) {
        return this.getRaindropsFromCollection(ALL_RAINDROPS_COLLECTION, params)
    }

    async getDeletedRaindrops(params?: RaindropQueryParameters) {
        return this.getRaindropsFromCollection(DELETED_RAINDROPS_COLLECTION, params);
    }

    async updateRaindrop(raindropId: number, params: RaindropUpdateParameters) {
        console.log(`Raindrop API: updateing raindrop ${raindropId}`, params)
        let toUpdate = await this.getRaindropById(raindropId);
        if (!toUpdate || !toUpdate.item || toUpdate.result == false) {
            return null;
        }

        let updateObj: RaindropUpdateParameters = {};

        if (params.tags) {
            let mergedTags = params.tags;
            if (toUpdate.item.tags.length > 0) {
                for (const tag of toUpdate.item.tags) {
                    if (params.tags.indexOf(tag) < 0) {
                        mergedTags.push(tag);
                    }
                }
            }
            updateObj.tags = mergedTags;
        }

        if (params.excerpt) {
            updateObj.excerpt = params.excerpt;
        }

        return this.request<ItemResponse<Raindrop>>(
            `${RESOURCE_NAME}/${raindropId}`,
            {
                method: 'PUT',
                body: JSON.stringify(updateObj)
            }
        )
    }
}