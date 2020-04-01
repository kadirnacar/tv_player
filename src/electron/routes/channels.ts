import * as fs from 'fs';
import { JSDOM } from 'jsdom';
import * as path from 'path';
import { Router } from '../Route';
import lowdb from 'lowdb';
import FileAsync from "lowdb/adapters/FileAsync";
import { ICallback } from '../Route/Router';
import { createStream } from '@tools';

export class ChannelsRouter {

    router: Router;
    adapter;
    db;
    filePath;
    constructor() {
        this.router = new Router();
        this.filePath = path.resolve(__dirname, "db.json");
        this.init();
    }
    public async getList(ev: ICallback) {
        const channels = await this.db.get('Channels').value();
        ev.cb({ statusCode: 200, data: createStream(JSON.stringify(channels)) });
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
    public async getJson(ev) {
        var data = await this.readFile(this.filePath);
        ev.cb({ statusCode: 200, data: createStream(JSON.stringify(data)) });
    }

    public async saveJson(ev: ICallback) {
        await this.saveFile(this.filePath, JSON.stringify(ev.data));
        await this.db.read();
        var data = await this.readFile(this.filePath);
        ev.cb({ statusCode: 200, data: createStream(JSON.stringify(data)) });
    }

    public async refresh(ev: ICallback) {
        await this.db.read()
        console.log('State has been updated')
        ev.cb({ statusCode: 200, data: createStream("State has been updated") });
    }

    public async videoFile(ev: ICallback) {
        const id = ev.params.id;
        const dataFileInfo = await this.db.get('Files').filter({
            id: id
        }).value();

        if (dataFileInfo == null || dataFileInfo.length == 0) {
            ev.cb({ statusCode: 200, data: createStream("Video not found") });
            return;
        }

        const path = dataFileInfo[0].file;
        ev.cb({ statusCode: 200, data: createStream("Video not found") });

        // res.sendFile(path, {}, function (err) {
        //     if (err) {
        //         res.status(500).send(err)
        //     }
        // })

    }
    public async getUrlContent(url) {
        return JSDOM.fromURL(url, {
            resources: "usable",
            runScripts: "dangerously"
        })
    }
    public async getUrl(element) {
        try {
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
        } catch (ex) {
            console.log(ex)
        }

    }
    public async read(ev: ICallback) {
        try {
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
            await this.saveFile(this.filePath, JSON.stringify({
                Channels: data
            }));

            const channels = await this.db.get('Channels').value();
            ev.cb({ statusCode: 200, data: createStream(JSON.stringify(channels)) });

        } catch (ex) {
            ev.cb({
                statusCode: 500, data: createStream(JSON.stringify({
                    err: ex
                }))
            });
        }
    }
    public async readUrl(ev: ICallback) {
        try {
            const name = ev.params["name"];
            const data = await this.db.get('Channels').value();
            await new Promise(async (resolve, reject) => {
                try {
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
                } catch {
                    reject();
                }
            })
            try {
                await this.saveFile(this.filePath, JSON.stringify({
                    Channels: data
                }));
            } catch (err) {
                console.log(err)
            }
            const channels = await this.db.get('Channels').value();
            ev.cb({ statusCode: 200, data: createStream(JSON.stringify(channels)) });
            // const data2 = await this.readFile(this.filePath);
            // ev.cb({
            //     statusCode: 200, data: createStream(JSON.stringify({
            //         Channels: data
            //     }))
            // });
        } catch (ex) {
            ev.cb({
                statusCode: 500, data: createStream(JSON.stringify({
                    err: ex
                }))
            });
        }
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