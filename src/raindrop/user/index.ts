import { Base } from "../base";
import { AuthenticatedUser, PublicUser, UserResponse } from "./types";

const RESOURCE_NAME = "user";

export class Users extends Base {
    getCurrentUser () {
        return this.request<UserResponse<AuthenticatedUser>>(`${RESOURCE_NAME}`);
    }

    getPublicDataById (userId: number) {
        return this.request<UserResponse<PublicUser>>(`${RESOURCE_NAME}/${userId}`)
    }
}