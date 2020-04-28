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

const maxStale = 1000 * 60;
const cacheUrls = [
  serverRoot + "/api/plans",
  serverRoot + "/api/courses",
  serverRoot + "/api/schedules",
  serverRoot + "/api/students"
];

const lf = localforage.createInstance({
  name: "net-cache"
});


const cache = async (method, url, response, data) => {
  if(method === "GET" && response.ok && _.includes(cacheUrls, url)) {
    const item = {data: data, ts: new Date().getTime()}
    // console.log("caching data", url, item);
    lf.setItem(url, item);
  }

}

const getFromCache = async (method, url) => {

  // console.log("cache check:", url, method );
  if(method !== "GET") {
    return null;
  }

  let item = await lf.getItem(url);
  if (!item) {
    return null;
  }
  // console.log("loaded cached item", url, item);
  const now = new Date().getTime();
  const delta = now - Number(item.ts);
  if (delta > maxStale) {
    lf.removeItem(item.url);
    return null;
  }
  // console.log("found cache data", item);
  return item.data;
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

  // don't change to localforage until tests
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
        if (method !== "GET") {
          json = json.data;
        }
        const msg = {
          "data": json,
          "status": r.status
        }
        cache(method, url, r, json);
        resolve(msg);
      }
      r.json().then(handleJson);
    }

    const handleCache = (cachedData)=> {
      if (cachedData) {
        // console.log("cachedData", cachedData);
        resolve({data:cachedData, status:304});
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
