import "@jxa/global-type";
import RaindropApi from '../raindrop';
import { getUUIDforItem, setCustomMetadata } from "../devonthink/devonthink-client";
import { ItemSearchParameters } from "../devonthink/types/Application";
import { Type } from "../devonthink/types/file-types";


// This main is just a Node.js code
export const devonthinkTest = async () => {
    let searchParameters: ItemSearchParameters = {
        name: "21 People",
        kind: Type.GROUP
    };
    let groupId = await getUUIDforItem(searchParameters);
    console.log("Group ID: " + groupId);

    let updated = await setCustomMetadata('2DD36E18-E762-440C-BE62-1FB20A2601D6', {
        mdraindroplink: "updated3"
    });
    console.log(updated);
};

export const raindropTest = async () => {
    const RaindropClient = new RaindropApi();
    let rootCollectionResponse = await RaindropClient.getRootCollections();
    console.log("-----------ROOT COLLECTIONS---------------");
    rootCollectionResponse.items.forEach(item => console.log(item.title));

    let childCollectionResponse = await RaindropClient.getChildCollections();
    console.log("-----------CHILD COLLECTIONS---------------");
    console.log(childCollectionResponse.items[0])

    console.log("------------BEGIN GET SPECIFIC Collection--------------");
    let singleCollection = await RaindropClient.getCollection(26335610);
    console.log(singleCollection.item);

    console.log("-----------BEGIN ALL RAINDROPS---------------");
    let allRaindropsList = await RaindropClient.getAllRaindrops();
    for (const drop of allRaindropsList.items) {
        if (drop.tags.length > 0) {
            console.log(`Raindrop ${drop.title} has tags ${drop.tags.join()}`)
            console.log(drop)
        }
    }

    console.log("------------BEGIN GET SPECIFIC RAINDROP--------------");
    let raindrop = await RaindropClient.getRaindropById(424617969);
    console.log(raindrop);
    console.log("Contains devonthink tag? " + raindrop.item.tags.find(tag => tag.indexOf("x-devonthink-item") >= 0))

    console.log("------------BEGIN ADD TAG TO SPECIFIC RAINDROP------------");
    let updated = await RaindropClient.updateRaindrop(424617969, { tags: ["testing"] });
    console.log(updated)

    console.log("------------BEGIN TO IDENTIFY COLLECTION FOR RAINDROP--------------");
    let raindropCollection = await RaindropClient.getCollection(raindrop.item.collection.$id);
    console.log(raindropCollection);

    if (raindropCollection.item.parent && raindropCollection.item.parent.$id) {
        let raindropCollectionParent = await RaindropClient.getCollection(raindropCollection.item.parent.$id);
        console.log(raindropCollectionParent);

        console.log(`${raindropCollectionParent.item.title}/${raindropCollection.item.title}`)
    }
}