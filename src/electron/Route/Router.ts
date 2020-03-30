import RouteParser from 'route-parser';

export class Router {
    constructor() {
        this.routers = {};
    }
    routers: { [path: string]: { parser: RouteParser } };

    callback(){}

    get(path: string, callback) {

    }
}