import { app, protocol } from 'electron';
import { Router } from './Router';
import RouteParser from 'route-parser';
import url from 'url';
export { Router } from './Router';

export class Route {
    constructor(scheme: string = "electron") {
        this.routers = {};
        protocol.registerSchemesAsPrivileged([{ scheme: scheme, privileges: { supportFetchAPI: true, allowServiceWorkers: true, standard: true, bypassCSP: true, corsEnabled: true } }])
        app.on("ready", () => {
            protocol.registerStringProtocol(scheme, (req, cb) => {
                const urlParser = url.parse(req.url);
                const routes = Object.keys(this.routers);
                let match: any;
                for (var i = 0; i < routes.length; i++) {
                    match = this.routers[routes[i]].parser.match(urlParser.path);
                    console.log(routes[i], match, urlParser.query, req)
                    if (match) {

                        break;
                    }
                }
                // const parser = new Route("deneme(/*a)");
                // const parser2 = new Route("/deneme(/*a)");
                // const urlParser = url.parse(req.url);
                // const d = parser.match(urlParser.path);
                // const d2 = parser2.match(urlParser.path);
                // console.log(d, d2, urlParser);
                cb("ddds");
            })
        });
    }

    routers: { [path: string]: { router: Router, parser: RouteParser } };

    use(path: string, router: Router) {
        this.routers[path] = { router, parser: new RouteParser(`${path}(/*others)`) };
    }
}