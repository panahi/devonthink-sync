/**
 * https://developer.raindrop.io/v1/collections
 */

import { Reference } from "../base"

export const UNSORTED_COLLECTION = -1;
export const ALL_RAINDROPS_COLLECTION = 0;
export const DELETED_RAINDROPS_COLLECTION = -99;

export type Collection = {
    /**
     * The id of the collection.
     */
    _id: number,

    /**
     * Details about the level of access to the collection
     */
    access: Access,
    
    /**
     * When this object is present, means that collections is shared. Content of this object is private and not very useful.
     * All sharing API methods described here https://developer.raindrop.io/v1/collections/sharing
     */
    collaborators: any,

    /**
     * Primary color of collection cover as HEX
     */
    color: string,

    /**
     * Count of raindrops in collection
     */
    count: number,

    /**
     * Collection cover URL.
     * This array always have one item due to legacy reasons
     */
    cover: string[],

    /**
     * When collection is created
     */
    created: string

    /**
     * Whether the collection’s sub-collections are expanded
     */
    expanded: boolean,

    /**
     * When collection is updated
     */
    lastUpdate: string,

    /**
     * The parent collection. Not specified for root collections
     */
    parent: Reference

    /**
     * Collection and raindrops that it contains will be accessible without authentication by public link
     */
    public: boolean,

    /**
     * The order of collection (descending). Defines the position of the collection among all the collections with the same parent.$id
     */
    sort: number,

    /**
     * Name of the collection
     */
    title: string,

    /**
     * The owner of the collection
     */
    user: Reference

    /**
     * View style of collection, can be:
     * list (default)
     * simple
     * grid
     * masonry Pinterest like grid
     */
    view: ViewStyle
}

export type Access = {
    /**
     * 1. read only access (equal to public=true)
     * 2. collaborator with read only access
     * 3. collaborator with write only access
     * 4. owner
     */
    level: number,

    /**
     * Does it possible to change parent of this collection?
     */
    draggable: boolean

}

export enum ViewStyle {
    list,
    simple,
    grid,
    masonry
}