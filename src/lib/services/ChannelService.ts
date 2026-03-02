import BaseService from "@/lib/services/BaseService";
import {ChannelType} from "@/types";

export default class ChannelService extends BaseService<ChannelType>{
    constructor() {
        super("channels");
    }
}