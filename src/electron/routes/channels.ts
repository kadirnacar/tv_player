import { Router } from '../Route';

export class ChannelsRouter {

    router: Router
    constructor() {
        this.router = new Router();
        this.init();
    }

    public async getList(req, res, next) {
       
    }
   
    public async getJson(req, res, next) {
    }

    public async saveJson(req, res, next) {
    }

    public async refresh(req, res, next) {
    }

    public async videoFile(req, res, next) {
    }
    public async getUrlContent(url) {
    }
    public async getUrl(element) {
    }
    public async read(req, res, next) {
    }
    public async readUrl(req, res, next) {
    }

    async init() {
        // this.router.get('/list', this.getList.bind(this));
        // this.router.get('/refresh', this.refresh.bind(this));
        // this.router.get('/json', this.getJson.bind(this));
        // this.router.get('/read', this.read.bind(this));
        // this.router.get('/readurl/:name', this.readUrl.bind(this));
        // this.router.post('/json', this.saveJson.bind(this));
        // this.router.get('/video/:id', this.videoFile.bind(this));
    }

}

const channelsRoutes = new ChannelsRouter();

const router = channelsRoutes.router;
export default router;