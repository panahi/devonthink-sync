import 'dotenv/config';

const USER_API = 'https://api.raindrop.io/rest/v1/user';
const COLLECTIONS_API = 'https://api.raindrop.io/rest/v1/collections';
const ITEM_API = 'https://api.raindrop.io/rest/v1/raindrops/';
const AUTH_HEADERS = {
    "Authorization": "Bearer " + process.env.RAINDROP_TEST_TOKEN
}

export const raindropTest = async () => {
    const userResponse = await fetch(USER_API, {
        'method': 'get',
        'headers': AUTH_HEADERS
    });
    const userData = await userResponse.json();
    console.log(userData);
    for (const obj of userData.user.groups) {
        console.log(obj);
    }

    const rootCollections = await fetch(COLLECTIONS_API, {
        'method': 'get',
        'headers': AUTH_HEADERS
    });
    const rootCollectionList = await rootCollections.json();
    console.log(rootCollectionList);

    const childCollections = await fetch(COLLECTIONS_API + "/childrens", {
        'method': 'get',
        'headers': AUTH_HEADERS
    });
    const childCollectionsList = await childCollections.json();
    console.log(childCollectionsList);

    const raindropResponse = await fetch(ITEM_API + '/26470230', {
        'method': 'get',
        'headers': AUTH_HEADERS
    });
    const raindropList = await raindropResponse.json();
    console.log(raindropList);
}