import BaseService from "@/lib/services/BaseService";
import {ProfileType} from "@/types";

export default class ProfileService extends BaseService<ProfileType>{
    constructor() {
        super("profiles");
    }
}