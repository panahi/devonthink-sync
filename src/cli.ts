import { example } from "./app";
example().then((output) => {
    console.log(output)
}).catch(error => {
    console.error(error);
});