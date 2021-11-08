'use strict';

console.log('Script from server2');

const server1 = "http://server1:3401";
const server2 = "http://server2:3402";

const userDiv = document.querySelector('.user');

let parent;
let token;
let user;

window.addEventListener("message", receiveMessage);

function receiveMessage(event) {
    const { origin, source, data: message } = event;

    if (origin !== server1) return;

    if (message.type === 'ping') {
        parent = source;
        sendMessage({ type: 'pong' });
    } else if (message.type === 'accessToken') {
        !token && onFirstLoad(message.payload);
        token = message.payload;
    }
}

function sendMessage(message) {
    parent.postMessage(message, server1);
}

async function onFirstLoad(token) {
    user = await getUser(token);

    userDiv.textContent = `User email = ${user.email}`;
    const element = document.createElement('script');
    element.src = 'lazy.js';
    document.body.appendChild(element);
}

async function getUser(accessToken) {
    const response = await fetch(server2 + '/getUser', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    });
    return response.ok ? await response.json() : null;
}
