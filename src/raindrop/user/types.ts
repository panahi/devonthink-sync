import { ViewStyle } from "../collections/types"

export interface AuthenticatedUser extends PublicUser {
    /**
     * Configuration, not publicly visible
     */
    config: Configuration

    /**
     * Only visible for you
     */
    email: string

    /**
     * Data about usage
     */
    files: FileData

    /**
     * What groups does the user interact with
     */
    groups: Group[]

    /**
     * Does the user have a password
     */
    password: boolean

    /**
     * When will PRO subscription expire
     */
    proExpire: string

    /**
     * Is facebook account linked?
     */
     facebook: { enabled: boolean }

     /**
      * Is twitter account linked?
      */
     twitter: { enabled: boolean }

     /**
      * Is Vkontakte account linked?
      */
     vkontakte: { enabled: boolean }

     /**
      * Is google account linked?
      */
     google: { enabled: boolean }

     /**
      * Is dropbox backup enabled?
      */
     dropbox: { enabled: boolean }

     /**
      * Is google drive backup enabled?
      */
     gdrive: { enabled: boolean }
}

export class UserResponse<T> {
    public result: boolean
    public user: T

    constructor(result: boolean, user: T) {
        this.result = result
        this.user = user;
    }
}

export type FileData = {
    /**
     * How much space used for files this month
     */
    used: number

    /**
     * Total space for file uploads
     */
    size: number

    /**
     * When space for file uploads is reset last
     */
    lastCheckPoint: string
}

export enum BrokenLinksConfig {
    basic,
    default,
    strict,
    off
}

export enum BookmarkPreviewStyle {
    sunset,
    night
}

export enum RaindropSort {
    title,
    "-title",
    domain,
    "-domain",
    "+lastUpdate",
    "-lastUpdate"
}

export type Configuration = {
    /**
     * Broken links finder configuration
     */
    broken_level: BrokenLinksConfig

    /**
     * bookmark preview style
     */
    font_color?: BookmarkPreviewStyle

    /**
     * Bookmark preview font size, from 0 to 9
     */
    font_size: number

    /**
     * UI language in 2 char code
     */
    lang: string

    /**
     * last viewed collection id
     */
    last_collection: number

    /**
     * Default bookmark sort
     */
    raindrops_sort: RaindropSort

    /**
     * Default bookmark view
     */
    raindrops_view: ViewStyle
}

export type Group = {
    /**
     * Name of group
     */
    title: string

    /**
     * Is group collapsed?
     */
    hidden: boolean

    /**
     * Ascending order position
     */
    sort: number

    /**
     * Collection IDs in order
     */
    collections: number[]
}

export interface PublicUser {
    /**
     * Unique user ID
     */
     _id: number

    /**
     * MD5 hash of email. Useful for using with Gravatar for example
     */
    email_MD5: string

    /**
     * Full name, max 1000 characters
     */
    fullName: string

    /**
     * Is the user a PRO subscriber
     */
    pro: boolean

    /**
     * Registration date
     */
    registered: string
}