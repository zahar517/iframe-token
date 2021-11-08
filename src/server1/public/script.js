'use strict';

console.log('Script from server1');

const auth = "http://auth:4001";
const server2 = "http://server2:3402";

let accessToken;
let refreshToken;
let hasIframeLoaded = false;

window.addEventListener('message', receiveMessage);

pollingIframeForLoad();

function pollingIframeForLoad(count = 1) {
    if (!hasIframeLoaded) {
        const next = count + 1;
        setTimeout(() => pollingIframeForLoad(next), next * 500);
        sendMessage({ type: 'ping' });
    }
}

function receiveMessage(event) {
    const { origin, source, data: message } = event;

    if (origin !== server2) return;

    if (message.type === 'pong') {
        hasIframeLoaded = true;
        onIframeLoad();
    } else if (message.type === 'refresh token') {
        onRefreshTokenRequest();
    }
}

async function onIframeLoad() {
    await populateTokens();
    sendMessage({ type: 'accessToken', payload: accessToken })
}

async function onRefreshTokenRequest() {
    await updateAccessToken();
    sendMessage({ type: 'accessToken', payload: accessToken });
}

function sendMessage(message) {
    window.frames.server2.postMessage(message, server2);
}

async function populateTokens() {
    const response = await fetch(auth + '/login', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ email: 'user@mail.ru' }),
    });

    if (response.ok) {
        const token = await response.json();
        accessToken = token.accessToken;
        refreshToken = token.refreshToken;
    }
}

async function updateAccessToken() {
    const response = await fetch(auth + '/token', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({ token: refreshToken }),
    });

    if (response.ok) {
        accessToken = (await response.json()).accessToken;
    }
}
