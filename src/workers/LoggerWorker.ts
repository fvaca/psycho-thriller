import { EventBus } from "../infrastructure/EventBus.ts";

type LogLevel = "log" | "warn" | "error" | "info" | "debug";

EventBus.subscribe("log", ({ level, message }: { level: LogLevel; message: string }) => {
  console[level](`[${new Date().toISOString()}] ${message}`);
});