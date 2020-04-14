/**
 * net.js
 * This package provides a wrapper around the JS fetch function
 * to enable it to work easily with our node/express REST API
 *
 * @author mxc
 */

import localforage from "localforage";
import _ from "lodash";
import config from "./config.json";
const serverRoot = config.serverRoot;

const cacheUrls = [
  "/api/plans",
  "/api/courses",
  "/api/schedules",
  "/api/students"
]

const lf = localforage.createInstance({
  name: "net-cache"
});


const cache = async (method, url, data) => {

  if(method === "GET" && _.includes(cacheUrls, url)) {
    const item = {data: data, ts: new Date().getMilliseconds()}
    console.log("caching data", url, item);
    lf.setItem("url", item);
  }

}

const getFromCache = async (method, url) => {
  console.log("checking cache", url);
  if(method !== "GET") {
    return null;
  }

  let data = await lf.getItem(url);
  if (!data) {
    return null;
  }
  console.log("found cache data", data);
  return data;
}



/**
 * send a fetch request with all of the defaults
 * configured for our app
 */
const doFetch = async (method, url, data) => {

  url = serverRoot + url;
  // console.log("fetch url:", url);

  let headers = {
    "Content-Type": "application/json"
  };

  let token = await localStorage.getItem("jwt");
  if(token) {
    // console.log("loaded auth token");
    // headers["Access-Control-Allow-Headers"] = "Authorization";
    headers["Authorization"] = `Bearer ${token}`; //:
  }

  let params = {
    method: method,
    mode: "cors",
    // credentials: "include",
    cache: "no-cache",
    headers: headers,
    referrer: "no-referrer"
  }
  // console.log("net params:", params);

  if (data && method !== "GET") {
    params.body = makeFormBody(data);
  }

  const promiseToReadResponse = (resolve, reject)=> {
    const handleResponse = (r) => {
      const handleJson = (json)=> {
        const msg = {
          "data": json,
          "status": r.status
        }
        resolve(msg);
      }

      cache(method, url, r);
      r.json().then(handleJson);
    }

    const handleCache = (cache)=> {
      if (cache) {
        handleResponse(cache);
      }
      else {
        fetch(url, params).then(handleResponse, reject);
      }
    }

    getFromCache(method, url).then(handleCache);

  }

  return new Promise(promiseToReadResponse);
}

const makeFormBody = (data)=> {
  return JSON.stringify(data);
}


const get = async (url) => doFetch("GET", url, null);
const post = async (url, data) => doFetch("POST", url, data);
const put = async (url, data) => doFetch("PUT", url, data);
const remove = async (url, data) => doFetch("DELETE", url, data);

const net = {
  get: get,
  post: post,
  put: put,
  delete: remove
}

export default net;
