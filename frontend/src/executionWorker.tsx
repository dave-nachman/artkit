export const executionWorker = new Worker("../webworker.js");
executionWorker.onerror = e => {
  console.log(`Error in pyodideWorker at ${e.filename}, Line: ${e.lineno}, ${e.message}`);
};
