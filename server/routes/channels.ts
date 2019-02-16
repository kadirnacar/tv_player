import { Request, Response, Router } from 'express';
import * as fs from 'fs';
import { JSDOM } from 'jsdom';
import * as path from 'path';
import * as lowdb from 'lowdb';
import * as FileAsync from "lowdb/adapters/FileAsync";

export class ChannelsRouter {

    router: Router
    adapter;
    db;
    filePath;
    constructor() {
        this.router = Router();
        this.filePath = path.resolve(__dirname, "../db.json");
        this.init();
    }

    public async getList(req, res, next) {
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
    public async getJson(req, res, next) {
        var data = await this.readFile(this.filePath);
        res.status(200).send(data);
    }

    public async saveJson(req, res, next) {
        await this.saveFile(this.filePath, JSON.stringify(req.body.data));
        await this.db.read();
        var data = await this.readFile(this.filePath);
        res.status(200).send(data);
    }

    public async refresh(req, res, next) {
        await this.db.read()
        console.log('State has been updated')
        res.status(200).send("State has been updated");
    }

    public async videoFile(req, res, next) {
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
    public async getUrlContent(url) {
        return JSDOM.fromURL(url, {
            resources: "usable",
            runScripts: "dangerously"
        })
    }
    public async getUrl(element) {
        var url;
        return new Promise(async (resolve, reject) => {
            var result = JSDOM.fromURL(element.pageUrl, {
                resources: "usable"
            });
            result.then(data => {
                var c = false;
                if (element.iframe == true) {
                    const iframe = data["window"].document.querySelector("iframe");
                    iframe.addEventListener('load', (a) => {
                        var re = new RegExp(element.urlRegex, "gi");
                        var frameContent = a.target["contentDocument"].body.innerHTML;
                        url = frameContent.match(re);
                        if (url)
                            element.url = url[0];
                        c = true;
                        resolve();
                    })
                } else {
                    var content = data["window"].document.body.innerHTML;
                    var re = new RegExp(element.urlRegex, "gi");
                    url = content.match(re);
                    if (url)
                        element.url = url[0];
                    resolve();
                }
            })
        });
        // return JSDOM.fromURL(element.pageUrl, {
        //     resources: "usable"
        // }).then(data => {
        //     var c = false;
        //     if (element.iframe == true) {
        //         const iframe = data["window"].document.querySelector("iframe");
        //         iframe.addEventListener('load', (a) => {
        //             var frameContent = a.target["contentDocument"].body.innerHTML;
        //             url = frameContent.match(re);
        //             element.url = url;
        //             c = true;
        //         })
        //     } else {
        //         var content = data["window"].document.body.innerHTML;
        //         var re = new RegExp(element.urlRegex, "gi");
        //         url = content.match(re);
        //         element.url = url;
        //     }
        // })
    }
    public async read(req, res, next) {
        const data = await this.db.get('Channels').value();
        await new Promise(async (resolve) => {
            for (var i = 0; i < data.length; i++) {
                var element = data[i];
                if (element.type == 3) {
                    var d = await this.getUrl(element);
                    console.log(d);
                }
            }

            resolve();
        })
        await this.saveFile(this.filePath, JSON.stringify({ Channels: data }));

        const data2 = await this.readFile(this.filePath);
        res.status(200).send(JSON.stringify({ Channels: data }));
    }
    public async readUrl(req, res, next) {
        const name = req.params["name"];
        const data = await this.db.get('Channels').value();
        await new Promise(async (resolve) => {
            for (var i = 0; i < data.length; i++) {
                var element = data[i];
                if (element.name == name) {
                    if (element.type == 3) {
                        var d = await this.getUrl(element);
                        console.log(d);
                    }
                }
            }

            resolve();
        })
        await this.saveFile(this.filePath, JSON.stringify({ Channels: data }));

        const data2 = await this.readFile(this.filePath);
        res.status(200).send(JSON.stringify({ Channels: data }));
    }

    async init() {

        this.adapter = new FileAsync(this.filePath);
        this.db = await lowdb(this.adapter);
        this.router.get('/list', this.getList.bind(this));
        this.router.get('/refresh', this.refresh.bind(this));
        this.router.get('/json', this.getJson.bind(this));
        this.router.get('/read', this.read.bind(this));
        this.router.get('/readurl/:name', this.readUrl.bind(this));
        this.router.post('/json', this.saveJson.bind(this));
        this.router.get('/video/:id', this.videoFile.bind(this));
    }

}

const channelsRoutes = new ChannelsRouter();

const router = channelsRoutes.router;
export default router;