// Type definitions for request-promise-lite 0.8
// Project: https://github.com/laurisvan/request-promise-lite#readme
// Definitions by: Lauri Svan <https://github.com/laurisvan>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/*=================== USAGE ===================
  import * as request from "requext-promise-lite";

  request.get("https://httpbin.org/get", { json: true })
    .then((response) => {
      console.log(JSON.stringify(response));
    });

  ===============================================*/

/// <reference types="node" />

import http = require("http");
import https = require("https");
import stream = require("stream");

declare namespace RequestAPI {
  class RequestOptions {
    headers?: HTTPHeaders;
    maxRedirects?: number;
    json?: boolean;
    agent?: boolean | http.Agent | https.Agent;
    resolveWithFullResponse?: boolean;
    verbose?: boolean;
    compression?: Array<string>;
  }

  interface HTTPHeaders {}

  class Request {
    constructor(method: string, url: string, options?: RequestOptions);
    run(): Promise<any>;
  }

  class StreamReader extends stream.Writable {
    constructor(readable: stream.Readable);
    readAll(): Promise<Buffer>;
  }

  class RequestError extends Error {
    toString(): string;
  }

  class ConnectionError extends RequestError {
    constructor(message: string, rawMessage: string);
  }

  class HTTPError extends RequestError {
    constructor(message: string, statusCode: number, response: any);
  }

  class ParseError extends RequestError {
    constructor(message: string, rawMessage: string);
  }

  function trace(url: string, options?: RequestOptions): Promise<any>;
  function head(url: string, options?: RequestOptions): Promise<any>;
  function options(url: string, options?: RequestOptions): Promise<any>;
  function get(url: string, options?: RequestOptions): Promise<any>;
  function post(url: string, options?: RequestOptions): Promise<any>;
  function put(url: string, options?: RequestOptions): Promise<any>;
  function patch(url: string, options?: RequestOptions): Promise<any>;
  function del(url: string, options?: RequestOptions): Promise<any>;
}

export = RequestAPI;