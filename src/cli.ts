import 'dotenv/config';
import RaindropApi from './raindrop';

// import { devonthinkTest } from "./app";

// devonthinkTest().then((output) => {
//     console.log(output)
// }).catch(error => {
//     console.error(error);
// });

// import { raindropTest } from "./raindrop/raindrop-client";
// raindropTest().then((output) => {
//     console.log(output)
// }).catch(error => {
//     console.error(error);
// });
raindropTest().then((success) => {
    console.log(success)
}).catch((error) => {
    console.log("!!!!!!!!!!!!!ERROR!!!!!!!!!!!!!!");
    console.log(error);
})

async function raindropTest() {
    const RaindropClient = new RaindropApi({ apiKey: process.env.RAINDROP_TEST_TOKEN || "" });
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
    let updated = await RaindropClient.addTagToRaindrop(424617969, "testing");
    console.log(updated)

    console.log("------------BEGIN TO IDENTIFY COLLECTION FOR RAINDROP--------------");
    let raindropCollection = await RaindropClient.getCollection(raindrop.item.collection.$id);
    console.log(raindropCollection);

    if (raindropCollection.item.parent && raindropCollection.item.parent.$id) {
        let raindropCollectionParent = await RaindropClient.getCollection(raindropCollection.item.parent.$id);
        console.log(raindropCollectionParent);

        console.log(`${raindropCollectionParent.item.title}/${raindropCollection.item.title}`)
    }

    return "done"; 
}