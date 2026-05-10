chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
    const tab = tabs[0];
    const url = tab.url;

    document.getElementById('current-url').innerText = url.length > 30
        ? url.substring(0, 30) + '...'
        : url;

    const highlightResult = await chrome.storage.local.get(url);
    const highlights = highlightResult[url] || [];
    document.getElementById('highlight-count').innerText = highlights.length;

    const noteResult = await chrome.storage.local.get(url + '_note');
    const notes = noteResult[url + '_note'] || {};
    document.getElementById('note-count').innerText = Object.keys(notes).length;


    document.getElementById('clear-highlights').addEventListener('click', async function () {
        await chrome.storage.local.remove(url);
        document.getElementById('highlight-count').innerText = '0';

        // tell content.js to remove highlights from the page visually
        chrome.tabs.sendMessage(tab.id, { action: 'clearHighlights' });
    });


    document.getElementById('clear-notes').addEventListener('click', async function () {
        await chrome.storage.local.remove(url + '_note');
        document.getElementById('note-count').innerText = '0';

        chrome.tabs.sendMessage(tab.id, { action: 'clearNotes' });
    });


    document.getElementById('clear-all').addEventListener('click', async function () {
        await chrome.storage.local.remove(url);
        await chrome.storage.local.remove(url + '_note');
        document.getElementById('highlight-count').innerText = '0';
        document.getElementById('note-count').innerText = '0';

        chrome.tabs.sendMessage(tab.id, { action: 'clearAll' });
    });

    // ── Toggle active state ───────────────────────────────────────────────────────
    const toggle = document.getElementById('toggle-active');

    // read current state and set toggle position
    const stateResult = await chrome.storage.local.get('webmark-active');
    // default to true if never set before
    const isActive = stateResult['webmark-active'] !== false;
    toggle.checked = isActive;

    // when user flips the toggle
    toggle.addEventListener('change', async function () {
        const newState = toggle.checked;
        await chrome.storage.local.set({ 'webmark-active': newState });

        // tell content.js about the change
        chrome.tabs.sendMessage(tab.id, {
            action: 'setActive',
            value: newState
        });
    });
});




