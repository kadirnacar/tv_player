import { createStream } from '@tools';
import { Router } from '../Route';
import { ICallback } from '../Route/Router';

export class ChannelsRouter {

    router: Router
    constructor() {
        this.router = new Router();
        this.init();
    }

    public async getList(ev: ICallback) {
        ev.cb({ data: createStream(JSON.stringify(ev.params)), statusCode: 200});
    }

    public async refresh(ev: ICallback) {
    }

    async init() {
        this.router.post('/me/:den', this.getList.bind(this));
        this.router.post('/refresh', this.refresh.bind(this));
    }

}

const channelsRoutes = new ChannelsRouter();

const router = channelsRoutes.router;
export default router;