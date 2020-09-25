const http = require('http');
const parse = require('./lib/url-to-regex');
const queryParse = require('./lib/query-params');
const createResponse = require('./lib/helper-functions');
const processMiddleware = require('./lib/middleware');
const defaultOptions = require('./defaultOptions.json');
const readBody = require('./lib/read-body');

class App {
  constructor(options){
    this.options = {
      // DefaultOptions
      ...defaultOptions,
      ...options
    };
    this._routeTable = {};
    this._applicationMiddlewares = [];
    this.server = http.createServer();

    this.server.on('request', async(req,res) => {
      const routes = Object.keys(this._routeTable);
      let match = false;
      for (let i=0; i < routes.length; i++){
        const route = routes[i];
        const parsedRoute = parse(route);
        // console.log(`Route: ${route}, Parsed: ${parsedRoute}`);
        // console.log(`First: ${new RegExp('^'+parsedRoute+'(/|\\?)').test(req.url)}, Second: ${new RegExp('^'+parsedRoute+'$').test(req.url)}`)
        if (
          ((new RegExp('^'+parsedRoute+'(/|\\?)').test(req.url)) || (new RegExp('^'+parsedRoute+'$').test(req.url))) &&
          this._routeTable[route][req.method.toLowerCase()]
        ) {
          const cb = this._routeTable[route][req.method.toLowerCase()];
          const middleware = this._routeTable[route][`${req.method.toLowerCase()}-middleware`];

          const m = req.url.match(new RegExp(parsedRoute));
          
          req.params = m.groups;
          req.query = queryParse(req.url);
          req.body = await readBody(req);
          res = createResponse(res);

          let result = true;
          let i = 0;
          while (result){
            if (!this._applicationMiddlewares[i]) break;
            result = await processMiddleware(this._applicationMiddlewares[i], req, res);
            i++;
          }

          result = await processMiddleware(middleware, req, res);

          if (result) cb(req, res);
          else break;

          match = true;
          break;
        }
      }
      if (!match){     
        res.statusCode = 404;
        res.end("Not Found");
      }
    });
  }

  _registerPath(path, cb, method, middleware) {
    if (path.charAt(path.length-1) === '/' && path.length > 1){
      path = path.slice(0,path.length-1);
      console.log('Path:',path);
    }
    if (!this._routeTable[path]) {
      this._routeTable[path] = {};  // To make distructuring below possible
    } 
    this._routeTable[path] = { ...this._routeTable[path], [method]: cb, [method + "-middleware"]: middleware };
  }


  use(middleware){
    this._applicationMiddlewares.push(middleware);
  }

  listen(port, cb =()=>null){
    this.server.listen(port, cb);
  }

  get(path, ...rest) {
    if(rest.length === 1) {
      this._registerPath(path, rest[0], "get");
    } else {
      this._registerPath(path, rest[0], "get", rest[1]);
    }
  }

  post(path, ...rest) {
    if(rest.length === 1) {
      this._registerPath(path, rest[0], "post");
    } else {
      this._registerPath(path, rest[0], "post", rest[1]);
    }
  }

  put(path, ...rest) {
    if(rest.length === 1) {
      this._registerPath(path, rest[0], "put");
    } else {
      this._registerPath(path, rest[0], "put", rest[1]);
    }
  }

  delete(path, ...rest) {
    if(rest.length === 1) {
      this._registerPath(path, rest[0], "delete");
    } else {
      this._registerPath(path, rest[0], "delete", rest[1]);
    }
  }

}


module.exports = {
  App: App,
};