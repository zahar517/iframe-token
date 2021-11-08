'use strict';

const actionButton = document.querySelector('.action');
const actionList = document.querySelector('.actions');

actionButton.addEventListener('click', onActionButtonClick);

async function onActionButtonClick() {
    const action = await getAction(token);
    action
        ? drawAction(action.value)
        : sendMessage({ type: 'refresh token' }, server1);
}

async function getAction(accessToken) {
    const response = await fetch(server2 + '/action', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    });
    return response.ok ? await response.json() : null;
}

function drawAction(action) {
    const element = document.createElement('li');
    element.textContent = action;
    actionList.appendChild(element);
}
