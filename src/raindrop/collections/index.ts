import { Base, ItemResponse, ListResponse } from "../base";
import { Collection } from "./types";

const RESOURCE_NAME = "collection";
const RESOURCE_NAME_PLURAL = RESOURCE_NAME + 's';

export class Collections extends Base {
    getRootCollections () {
        return this.request<ListResponse<Collection>>(`${RESOURCE_NAME_PLURAL}`);
    }

    getChildCollections () {
        return this.request<ListResponse<Collection>>(`${RESOURCE_NAME_PLURAL}/childrens`);
    }

    getCollection (collectionId: number) {
        return this.request<ItemResponse<Collection>>(`${RESOURCE_NAME}/${collectionId}`)
    }
}