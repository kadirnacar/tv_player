import config from '@config';
import { BaseModel, IChannel, Result } from '@models';
import { ServiceBase } from "./ServiceBase";

export class ChannelService extends ServiceBase {

    public static async getList(): Promise<Result<IChannel[]>> {
        var result = await this.requestJson<IChannel[]>({
            url: `${config.restUrl}/api/channels/list`,
            method: "GET"
        }, false);
        return result;
    }
}