export const isElectron = (): boolean => {
  // Renderer process
  if (window?.process?.["type"] === "renderer") {
    return true;
  }

  // Main process
  if (!!process?.versions?.electron) {
      return true;
  }

  // Detect the user agent when the `nodeIntegration` option is set to true
  if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
      return true;
  }

  return false;
}
