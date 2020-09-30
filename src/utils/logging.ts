const TRACE_LOG_LOCAL_STORAGE_KEY = 'settings.enableTraceLogs';

export function loadLogFilter(): void {
  // Set the log filter based on the trace log setting
  const traceLogging =
    window.appLocalStorage.getItem(TRACE_LOG_LOCAL_STORAGE_KEY) || false;
  window.tauriLoggingSetFilter(
    traceLogging ? 'juju_lens=trace' : 'juju_lens=debug'
  );
}

export function setTraceLogsEnabled(enabled: boolean): void {
  window.appLocalStorage.setItem(TRACE_LOG_LOCAL_STORAGE_KEY, enabled);
  loadLogFilter();
}

export function getTraceLogsEnabled(): boolean {
  return window.appLocalStorage.getItem(TRACE_LOG_LOCAL_STORAGE_KEY) || false;
}
