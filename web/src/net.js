/**
 * net.js
 * This package provides a wrapper around the JS fetch function
 * to enable it to work easily with our node/express REST API
 *
 * @author mxc
 */

/**
 * send a fetch request with all of the defaults
 * configured for our app
 */
const doFetch = async (method, url, data) => {


  let headers = {
    "Content-Type": "application/json"
  };


  let token = localStorage.getItem("token");
  const now = new Date().getTime();
  if(token && token.exp * 1000 > now) {
    headers["Authorization"] = `Bearer ${token.payload}`;
  }

  let params = {
    method: method,
    mode: "cors",
    cache: "no-cache",
    headers: headers,
    referrer: "no-referrer"
  }

  if (data && method !== "GET") {
    params.body = data;
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



const get = async (url) => doFetch("GET", url);
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
