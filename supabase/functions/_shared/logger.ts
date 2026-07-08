export function logError(functionName: string, errorType: string, message: string) {
  console.error(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      function: functionName,
      errorType,
      message,
    })
  );
}
