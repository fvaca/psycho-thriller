import { EventBus } from "./EventBus.ts";
import { ensureFileSync } from "https://deno.land/std/fs/mod.ts";

// Define allowed log levels
type LogLevel = "log" | "warn" | "error" | "info" | "debug";

// Log file path (optional)
const LOG_FILE_PATH = "./logs/app.log";

// Ensure log file exists
ensureFileSync(LOG_FILE_PATH);

// Subscribe to the `log` event
EventBus.subscribe("log", ({ level, message }: { level: LogLevel; message: string }) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;

  // Write to console
  console[level](logMessage);

  // Write to log file
  try {
    Deno.writeTextFileSync(LOG_FILE_PATH, logMessage, { append: true });
  } catch (error) {
    console.error("Failed to write to log file:", error);
  }
});

// Function to log messages
export function log(level: LogLevel, message: string) {
  EventBus.publish("log", { level, message });
}