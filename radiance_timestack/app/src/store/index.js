import { createStore, compose } from 'redux';

import request from 'axios';
import ClientOAuth2 from 'client-oauth2';
import jwt_dec from 'jwt-decode';

const Reducers = {};

function reducer(currentState, action) {
  if (Reducers[action.type]) {
    return Object.assign({}, currentState, Reducers[action.type].call(currentState, ...action.args), {
      action,
    });
  }
  return currentState; // DO NOTHING IF NO MATCH
}

const store = createStore(
  reducer,
  {},
  compose(
    // applyMiddleware(createEpicMiddleware(combineEpics(mustRefresh, refreshPath))),
    window.devToolsExtension ? window.devToolsExtension() : f => f,
  ),
);

if (window.devToolsExtension) {
  window.devToolsExtension.updateStore(store);
}

const selectedConfig = {
  cliendId: process.env.REACT_APP_CLIENTID,
  redirect: process.env.REACT_APP_REDIRECT,
  baseUrl: process.env.REACT_APP_BASEURL,
  configuratorUrl: process.env.REACT_APP_CONFIGURATORURL,
};
const callbackUrl = selectedConfig.redirect;
const baseOauthURL = selectedConfig.baseUrl;

const LC_NAME = 'eobrowser_oauth';
let token = null;
let user = null;
const oauth = new ClientOAuth2({
  clientId: selectedConfig.cliendId,
  accessTokenUri: baseOauthURL + 'oauth/token',
  authorizationUri: baseOauthURL + 'oauth/auth',
  redirectUri: `${callbackUrl}oauthCallback.html`,
});

function getTokenFromLC(throwErrors = false) {
  let localToken = localStorage.getItem(LC_NAME);
  if (localToken) {
    localToken = JSON.parse(localToken);
    const now = new Date().valueOf();
    const expiration = parseInt(localToken['expires_in'], 10);
    const domain = localToken['domain'];
    if (expiration > now && domain === window.location.pathname) {
      token = localToken;
      user = jwt_dec(localToken['id_token']);
      return true;
    } else if (throwErrors) {
      throw new Error('Token expired');
    }
  } else if (throwErrors) {
    throw new Error('Token not found');
  }
}

function assureLoggedIn() {
  if (isTokenExpired()) {
    // must get new token, open OAuth callback and wait for resolution
    return new Promise((resolve, reject) => {
      window.authorizationCallback = { resolve, reject };
      window.open(oauth.token.getUri(), 'popupWindow', 'width=800,height=600');
    }).then(() => {
      getTokenFromLC(true);
      return { user, token };
    });
  } else {
    // token is fine, we are still logged in
    return Promise.resolve({ user, token });
  }
}

function logout() {
  return new Promise((resolve, reject) => {
    request
      .get(baseOauthURL + 'oauth/logout', {
        withCredentials: true,
      })
      .then(res => {
        localStorage.removeItem(LC_NAME);
        token = null;
        user = null;
        resolve();
      })
      .catch(e => reject());
  });
}

function isTokenExpired() {
  const now = new Date().valueOf();
  return now > (token ? token['expires_in'] : 0);
}

export default {
  get current() {
    return store.getState();
  },
  get Store() {
    return store;
  },
  get getConfig() {
    return selectedConfig;
  },

  doLogin() {
    return assureLoggedIn();
  },
  doLogout() {
    return logout();
  },
  getTokenFromLC() {
    return getTokenFromLC();
  },

};
