fetch-auth
====
A convenience package that implements the `fetch-wrap` module with custom middleware to transparently make authenticated HTTP requests via the `fetch` API.

Features
-------
- Retrieves authentication token (eg. jwt) automatically from browser session storage (default) or local storage
- Adds the bearer token to HTTP request header

Install
-------
``` sh
npm install fetch-auth --save
```

Usage
-----
The library supports retrieving the token from browser session storage and local storage. By default, it will retrieve the authentication token from session storage and the default key for retrieving the token is `token`. 

If you want to retrieve the token from local storage or your key has a different name, use the `fetchConfig` to configure the options for retrieving the authentication token. A suitable location to call `fetchConfig` would be in a configuration file.

``` js
import { fetchConfig } from 'fetch-auth';

// Eg. To retrieve a token with key 'authTokenName' from local storage
fetchConfig({
    sessionStorage: false, // default: true
    authTokenName: 'auth-key-name'
});
```
Subsequently, you can make HTTP requests as per the `fetch` API (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) in other parts of your application. The `Authorization: Bearer {token value}` will be automatically added to the header of the HTTP request.

```js
import { fetchAuth } from 'fetch-auth';

// Modified example POST method implementation from the fetch API website
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const options = {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });

  // This will do a POST request with the header 'Authorization: Bearer {token value}' added automatically to the request
  const results = await fetchAuth(url, options);

  // Note: the results have been automatically parsed to JSON object (the native fetch API returns a Response object instead)
  return results
}

const results = postData('http://app.mydomain.com/foobar', { foobar: 42 });
```