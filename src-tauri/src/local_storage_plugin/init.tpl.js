// Local storage init script template
//
// this whole file will be evaluated as a rust format string which means that
// curly braces are escaped by doubling them.

// Get the data ( substituted from Rust )
const localData = {data};

// Clear any previous data ( prevents picking up data from other apps )
window.localStorage.clear();

// Add the data to the local storage
for (const key in Object.keys(localData)) {{
  window.localStorage.setItem(key, localData[key]);
}}

// Add event listener to persit localStorage on exit
window.addEventListener(
  'unload',
  () => window.__TAURI_INVOKE_HANDLER__({{cmd: 'localStoreSetAll', data: window.localStorage}})
);