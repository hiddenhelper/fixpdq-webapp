const clearLocalStorage = async () => {

    localStorage.removeItem("activeLogStreamName");
    localStorage.removeItem("nextSequenceToken");
    localStorage.removeItem("pendingLogs");
    localStorage.removeItem("logsLastSent");

}

export default clearLocalStorage;