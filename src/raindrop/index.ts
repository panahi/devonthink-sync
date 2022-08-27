import { Collections } from "./collections";

import { applyMixins } from "./utilities/applyMixins";
import { Base } from "./base";
import { Users } from "./user";
import { Raindrops } from "./raindrops";

class RaindropApi extends Base {}
interface RaindropApi extends Collections, Users, Raindrops {}
applyMixins(RaindropApi, [Collections, Users, Raindrops]);

export default RaindropApi;