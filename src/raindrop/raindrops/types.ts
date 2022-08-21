import { ListResponse, Reference } from "../base"

export class RaindropListResponse extends ListResponse<Raindrop> {
    public count: number
    public collectionId: number

    constructor(result: boolean, items: Raindrop[], count: number, collectionId: number) {
        super(result, items)
        this.count = count
        this.collectionId = collectionId
    }
}

export interface Link {
    /**
     * The URL that this link points to
     */
    link: string
}

export interface Raindrop extends Link {
    /**
     * Unique identifier
     */
    _id: number

    /**
     * The collection containing this raindrop
     */
    collection: Reference

    /**
     * The Raindrop cover URL
     */
    cover: string

    /**
     * Creation date
     */
    created: string

    /**
     * Hostname of a link. Files always have raindrop.io as hostname
     */
    domain: string

    /**
     * Description, max length 10000
     */
    excerpt: string

    /**
     * Update date
     */
    lastUpdate: string

    /**
     * A list of cover URLs
     */
    media: Link[]

    /**
     * A list of tags
     */
    tags: string[]

    /**
     * The raindrop title. Max length 1000
     */
    title: string

    /**
     * The type of the raindrop
     */
    type: RaindropType

    /**
     * A reference to the user who owns the raindrop
     */
    user: Reference

    /**
     * Is the original link broken/not reachable?
     */
    broken: boolean

    /**
     * Details about the permanent copy
     */
    cache: Cache

    /**
     * If the raindrop was created by someone else, a link to that user
     */
    creatorRef: {
        _id: number
        name: string
    }

    /**
     * The file uploaded by the user
     */
    file: File

    /**
     * Is this raindrop marked as a favorite?
     */
    important: boolean

    /**
     * The highlights that have been made to the raindrop
     */
    highlights: Highlight[]

}

export enum RaindropType {
    link,
    article,
    image,
    video,
    document,
    audio
}

export enum HighlightColor {
    blue,
    brown,
    cyan,
    gray,
    green,
    indigo,
    orange,
    pink,
    purple,
    red,
    teal,
    yellow
}

export enum CacheStatus {
    ready,
    retry,
    failed,
    "invalid-origin",
    "invalid-timeout",
    "invalid-size"
}

export type Cache = {
    /**
     * Status of the cache
     */
    status: CacheStatus

    /**
     * Full size in bytes
     */
    size: number

    /**
     * Date when copy is successfully made
     */
    created: string
}

export type File = {
    /**
     * File name
     */
    name: string

    /**
     * File size in bytes
     */
    size: number

    /**
     * Mime type
     */
    type: string
}

export type Highlight = {
    /**
     * Unique id of the highlight
     */
    _id: string

    /**
     * Text of highlight (required)
     */
    text: string

    /**
     * Highlight color
     */
    color: HighlightColor

    /**
     * Optional note for the highlight
     */
    note?: string

    /**
     * Creation date of the highlight
     */
    created: string
}