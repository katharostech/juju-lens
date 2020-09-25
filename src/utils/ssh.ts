const KEY_PAIR_LOCAL_STORAGE_KEY = 'jujuLensSshKeyPair';

export async function getSshKeypair(): Promise<{
  private: string;
  public: string;
  fingerprint: string;
}> {
  if (window.__TAURI__) {
    // Load keypair from local storage
    let keypair =
      (window.appLocalStorage.getItem(KEY_PAIR_LOCAL_STORAGE_KEY) as {
        private: string;
        public: string;
        fingerprint: string;
      }) || null;

    // If we don't have a keypair
    if (!keypair) {
      // create a keypair
      keypair = await window.tauriSshKeyGen();

      // Add comment to the SSH key
      keypair.public += ' Juju Lens';

      // Store the keypair in local storage
      window.appLocalStorage.setItem(KEY_PAIR_LOCAL_STORAGE_KEY, keypair);
    }

    return keypair;
  } else {
    // if this isn't a Tauri app
    throw 'getSshKeypair() can only be called in a Tauri app';
  }
}
