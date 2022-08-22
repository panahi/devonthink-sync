/**
 * Using https://github.com/ilyamkin/dev-to-js/blob/master/src/base.ts as a starting point
 */
 type Config = {
    apiKey?: string,
    basePath?: string,
}

enum ReferenceType {
    collections,
    users
}

export type Pagination = {
    page?: number,
    perpage?: number,
}

export type Reference = {
    $ref: ReferenceType,
    $id: number
}

export class ItemResponse<T> {
    public result: boolean
    public item: T

    constructor(result: boolean, item: T) {
        this.result = result;
        this.item = item;
    }
}

export class ListResponse<T> {
    public result: boolean
    public items: T[]

    constructor(result: boolean, items: T[]) {
        this.result = result;
        this.items = items;
    }
}

export abstract class Base {
    private apiKey?: string
    private basePath: string

    constructor(config?: Config) {
        this.apiKey = config?.apiKey || process.env.RAINDROP_TEST_TOKEN;
        this.basePath = config?.basePath || 'https://api.raindrop.io/rest/v1/';
    }
    
    protected async request<T> (endpoint: string, options?: RequestInit): Promise<T> {
        const url = this.basePath + endpoint
        const headers = {
            "Authorization": "Bearer " + this.apiKey,
            'Content-type': 'application/json'
        }

        const config = {
            ...options,
            headers,
        }

        return fetch(url, config).then(res => {
            if (res.ok) {
                return res.json();
            }
            throw new Error(res.statusText)
        })
    }
}