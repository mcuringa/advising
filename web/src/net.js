/**
 * net.js
 * This package provides a wrapper around the JS fetch function
 * to enable it to work easily with our node/express REST API
 *
 * @author mxc
 */
import config from "./config.json";
const serverRoot = config.serverRoot;

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
      r.json().then(handleJson);
    }

    fetch(url, params).then(handleResponse, reject);
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
