export function createError(error: Error, status: number = 400, customMessage?: string): string {
    console.error(`error: ${error}`);
    console.error(`error stack: ${error.stack}`);

    const errorResponse = {
      error: customMessage ? customMessage : error.message ,
      headers: { "Content-Type": "application/json" },
      timestamp: new Date().toISOString(),
      status,
    };

    return JSON.stringify(errorResponse);
  }