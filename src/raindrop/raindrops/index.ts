import { Base, ItemResponse } from "../base";
import { Raindrop, RaindropListResponse } from "./types";

const RESOURCE_NAME = "raindrop";
const RESOURCE_NAME_PLURAL = RESOURCE_NAME + 's';

const UNSORTED_COLLECTION = -1;
const ALL_RAINDROPS_COLLECTION = 0;
const DELETED_RAINDROPS_COLLECTION = -99;

export class Raindrops extends Base {
    getRaindropById (raindropId: number) {
        return this.request<ItemResponse<Raindrop>>(`${RESOURCE_NAME}/${raindropId}`);
    }

    getPermanentCopyOfRaindrop (raindropId: number) {
        return this.request<ItemResponse<Raindrop>>(`${RESOURCE_NAME}/${raindropId}/cache`);
    }

    getRaindropsFromCollection (collectionId: number) {
        return this.request<RaindropListResponse>(`${RESOURCE_NAME_PLURAL}/${collectionId}`)
    }

    getUnsortedRaindrops() {
        return this.getRaindropsFromCollection(UNSORTED_COLLECTION)
    }

    getAllRaindrops() {
        return this.getRaindropsFromCollection(ALL_RAINDROPS_COLLECTION)
    }

    getDeletedRaindrops() {
        return this.getRaindropsFromCollection(DELETED_RAINDROPS_COLLECTION);
    }

    async addTagToRaindrop (raindropId: number, tag: string) {
        let toUpdate = await this.getRaindropById(raindropId);
        if (! toUpdate || !toUpdate.item || toUpdate.result == false) {
            return null;
        }

        if (toUpdate.item.tags.indexOf(tag) >= 0) {
            return toUpdate;
        }

        let newTagArray = [...toUpdate.item.tags, tag];
        
        return this.request<ItemResponse<Raindrop>>(
            `${RESOURCE_NAME}/${raindropId}`,
            {
                method: 'PUT',
                body: JSON.stringify({tags: newTagArray})
            }
        )
    }
}