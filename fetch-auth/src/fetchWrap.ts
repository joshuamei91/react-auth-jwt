import fetchWrapper from 'fetch-wrap';
import middleware from 'fetch-wrap/middleware';

let authTokenName = 'token';
let isSessionStorage = true;

export const fetchConfig = (options?: ConfigOptions): void => {
  if (options?.authTokenName !== undefined) {
    authTokenName = options.authTokenName;
  }
  if (options?.sessionStorage !== undefined) {
    if (typeof options.sessionStorage !== 'boolean') {
      throw new Error('sessionStorage value should be a boolean value');
    }
    isSessionStorage = options.sessionStorage;
  }
};

export const fetchAuth = fetchWrapper(fetch, [
  function (url: string, options: RequestInit | undefined, fetch: Fetch) {
    let token = null;
    if (isSessionStorage) {
      // console.log('token from session');
      token = sessionStorage.getItem(authTokenName);
    } else {
      // console.log('token from local');
      token = localStorage.getItem(authTokenName);
    }
    // add headers
    return fetch(
      url,
      fetchWrapper.merge({}, options, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    );
  },
  middleware.sendJSON(),
  middleware.receiveJSON(),
]);

// TODO: include option to disable json parsing

interface ConfigOptions {
  sessionStorage?: boolean;
  authTokenName?: string;
}

interface Fetch {
  (input: RequestInfo, init?: RequestInit | undefined): Promise<Response>;
}
