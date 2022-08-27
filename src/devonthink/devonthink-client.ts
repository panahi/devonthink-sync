import { run } from "@jxa/run"
import { Application, ItemSearchParameters } from "./types/Application";
import { Database } from "./types/Database";
import { Content, Parent, Record, SmartGroup, TagGroup } from "./types/Record";

export type CustomMetadata = {
    mdraindroplink: string
    mdobsidianlink?: string
}

export const createPDFFromURL = (sourceURL: string, parentID?: string, metadata?: CustomMetadata, tags?: string[]): Promise<string> => {
    return run<string>((url: string, parentId?: string, metadata?: CustomMetadata, tags?: string[]) => {
        //@ts-ignore
        const dt: Application = Application("Devonthink 3");
        dt.includeStandardAdditions = true;

        let pdfOptions: any = {
            pagination: false,
            readability: true
        }

        if (parentId !== undefined) {
            let parent = dt.getRecordWithUuid(parentId);
            if (parent !== undefined) {
                pdfOptions['in'] = parent;
            }
        }

        console.log(`Devonthink: Creating PDF from URL: ${url}`);
        let createdRecord = dt.createPDFDocumentFrom(url, pdfOptions);
        console.log(`Devonthink: Setting metadata of new PDF to ${JSON.stringify(metadata)}`)
        if (metadata) {
            //@ts-ignore
            createdRecord.customMetaData = metadata;
        }
        if (tags && tags.length > 0) {
            let updatedTags = tags;
            if (createdRecord.tags().length > 0) {
                //@ts-ignore
                updatedTags.push(...createdRecord.tags());
            }
            //@ts-ignore
            createdRecord.tags = updatedTags;
        }
        return createdRecord.referenceURL();
    }, sourceURL, parentID, metadata, tags)
}

export const setCustomMetadata = (uuid: string, data: CustomMetadata): Promise<string | undefined> => {
    return run<string>((uuid: string, data: CustomMetadata) => {
        //@ts-ignore
        const dt: Application = Application("Devonthink 3");
        dt.includeStandardAdditions = true;

        let target = dt.getRecordWithUuid(uuid);
        if (!target) {
            console.log("No item found in devonthink for UUID " + uuid);
            return;
        }

        //@ts-ignore
        let currentMetadata: CustomMetadata = target.customMetaData();
        //@ts-ignore
        target.customMetaData = data;
        return target.referenceURL();
    }, uuid, data)
}

export const getUUIDforItem = (parameters: ItemSearchParameters): Promise<string | undefined> => {
    return run<string>((parameters: ItemSearchParameters) => {
        //@ts-ignore
        const dt: Application = Application("Devonthink 3");
        dt.includeStandardAdditions = true;

        let isGroup = parameters.kind !== undefined && ['group', 'smart group'].includes(parameters.kind);
        console.log(`Searching for items matching:\n\tName: ${parameters.name}
            \tDatabase: ${parameters.database}
            \tParent ID:${parameters.parentUuid}
            \tKind:${parameters.kind}
            \tURL:${parameters.url}
            \tReference URL:${parameters.referenceUrl}
            \tIs Group:${isGroup}`
        );
        if (parameters.name === undefined && parameters.url === undefined && parameters.referenceUrl === undefined) {
            console.log("Missing search parameters required to find an exact match");
            return undefined;
        }

        let databases: Database[] = dt.databases().filter((db: Database) => parameters.database === undefined || db.name() === parameters.database);
        let results: Record[] = [];

        for (const db of databases) {
            let searchArray: Record[] = db.parents();
            if (parameters.kind === undefined || !isGroup) {
                searchArray.push(...db.contents());
            }
            let foundItems: Record[] = searchArray.filter((record: Record) => {
                let nameMatch = parameters.name === undefined || record.name() === parameters.name;
                let parentUuidMatch = parameters.parentUuid === undefined ||
                    (record.parents().find((parent: Parent) => parent.uuid() === parameters.parentUuid) !== undefined);
                let kindMatch = parameters.kind === undefined || record.type() === parameters.kind;
                let urlMatch = parameters.url === undefined || record.url() === parameters.url;
                let referenceUrlMatch = parameters.referenceUrl === undefined || record.referenceURL() === parameters.referenceUrl;

                return nameMatch && parentUuidMatch && kindMatch && urlMatch && referenceUrlMatch;
            });

            results.push(...foundItems);
        }

        if (results.length === 0) {
            console.log("No matches found for search");
            return undefined;
        } else if (results.length > 1) {
            console.log("Found more than one matching item, returning the first. See below for list:");
            results.forEach(result => {
                console.log(`--------------\n\t\tName: ${result.name()}
                    Database: ${result.database().name()}
                    Parent IDs:${result.parents().map(p => p.uuid())}
                    Kind:${result.kind()}
                    URL:${result.url()}
                    Reference URL:${result.referenceURL()}`
                );
            })
            return results[0].uuid();
        } else {
            let result = results[0];
            console.log("Found an exact match:");
            console.log(`--------------\n\t\tName: ${result.name()}
                Database: ${result.database().name()}
                Parent IDs:${result.parents().map(p => p.uuid())}
                Kind:${result.kind()}
                URL:${result.url()}
                Reference URL:${result.referenceURL()}`
            );
            return result.uuid();
        }

    }, parameters);
}

// export const setMetadataOnRecord = (recordUuid: string, metadataField: string, metadataValue: string) : Promise<string|undefined> => {
//     return run<string>((recordUuid: string, metadataField: string, metadataValue: string) => {

//     }, recordUuid, metadataField, metadataValue);
// }

export const databasePropertyDump = () => {
    return run(() => {
        //@ts-ignore
        const dT: Application = Application("Devonthink 3");
        dT.includeStandardAdditions = true;

        dT.databases().forEach((db: Database) => {
            console.log("\n----------------------------------------------\n")
            console.log('\tDatabase name: ' + db.name());
            console.log(`\tAnnotations group: ${db.annotationsGroup().name()}`);
            console.log(`\tComment: ${db.comment()}`);
            console.log('\tcurrentGroup: ' + db.currentGroup().name());
            console.log('\tid: ' + db.id());
            console.log('\tincoming group: ' + db.incomingGroup().name());
            console.log('\tpath: ' + db.path());
            console.log('\treadonly: ' + db.readOnly());
            console.log('\troot:' + db.root().name());
            console.log('\tSync group:' + db.syncGroup()?.name());
            console.log('\tTrash group: ' + db.trashGroup().name());
            console.log('\tTags group: ' + db.tagsGroup().name());
            console.log('\tuuid: ' + db.uuid());

            console.log("\tContents:");

            db.contents().forEach((content: Content) => {
                console.log("\t\t" + content.name());
            })

            console.log("Parents:");
            db.parents().forEach((parent: Parent) => {
                console.log("\t\t" + parent.name());
            })

            console.log("Records:");
            db.records().forEach((record: Record) => {
                console.log("\t\t" + record.name());
            })

            console.log("Smart Groups:");
            db.smartGroups().forEach((smartGroup: SmartGroup) => {
                console.log("\t\t" + smartGroup.name());
            })

            console.log("Tag Groups:");
            db.tagGroups().forEach((tagGroup: TagGroup) => {
                console.log("\t\t" + tagGroup.name());
            })

            console.log("\n----------------------------------------------\n")
        });
    });
}