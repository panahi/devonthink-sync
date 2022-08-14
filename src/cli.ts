// import { devonthinkTest } from "./app";

// devonthinkTest().then((output) => {
//     console.log(output)
// }).catch(error => {
//     console.error(error);
// });

import { raindropTest } from "./raindrop/raindrop-client";
raindropTest().then((output) => {
    console.log(output)
}).catch(error => {
    console.error(error);
});