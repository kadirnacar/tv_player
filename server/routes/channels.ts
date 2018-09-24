import { Request, Response, Router } from 'express';
import * as fs from 'fs';
import * as lowdb from 'lowdb';
import * as FileAsync from "lowdb/adapters/FileAsync";

export class ChannelsRouter {

    router: Router
    adapter;
    db;
    constructor() {
        this.router = Router();
        this.init();
    }

    public async getList(res: Response) {
        // var channels1 = require("../../channels.json");
        // await this.db.set("Channels", channels1.list).write()
        const channels = await this.db.get('Channels').value();
        res.status(200).send(channels);
    }
    readFile = filePath => new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
    saveFile = (filePath, data) => new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, (err) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
    public async getJson(res: Response) {
        var data = await this.readFile("db.json");
        res.status(200).send(data);
    }

    public async saveJson(req: Request, res: Response) {
        console.log(req);
        await this.saveFile("db.json", JSON.stringify(req.body.data));
        await this.db.read();
        var data = await this.readFile("db.json");
        res.status(200).send(data);
    }

    public async refresh(res: Response) {
        await this.db.read()
        console.log('State has been updated')
        res.status(200).send("State has been updated");
    }

    public async videoFile(req: Request, res: Response) {
        const id = req.params.id;
        const dataFileInfo = await this.db.get('Files').filter({ id: id }).value();

        if (dataFileInfo == null || dataFileInfo.length == 0) {
            res.status(200).send("Video not found.");
            return;
        }

        const path = dataFileInfo[0].file;
        res.sendFile(path, {}, function (err) {
            if (err) {
                res.status(500).send(err)
            }
        })

    }


    async init() {
        this.adapter = new FileAsync("db.json");
        this.db = await lowdb(this.adapter);
        this.router.get('/list', this.getList.bind(this));
        this.router.get('/refresh', this.refresh.bind(this));
        this.router.get('/json', this.getJson.bind(this));
        this.router.post('/json', this.saveJson.bind(this));
        this.router.get('/video/:id', this.videoFile.bind(this));
    }

}

const channelsRoutes = new ChannelsRouter();

const router = channelsRoutes.router;
export default router;