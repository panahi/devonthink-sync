import "@jxa/global-type";
import { getUUIDforItem } from "./devonthink/devonthink-client";
import { ItemSearchParameters } from "./devonthink/types/Application";
import { Type } from "./devonthink/types/file-types";


// This main is just a Node.js code
export const devonthinkTest = async () => {
    let searchParameters: ItemSearchParameters = {
        name: "21 People",
        kind: Type.GROUP
    };
    let groupId = await getUUIDforItem(searchParameters);
    // let reference = await createPDFFromURL(
    //     "https://discourse.devontechnologies.com/t/trying-to-add-move-to-convert-urls-to-pdf-script/21013/2",
    //     groupId
    // );
    return groupId;
};