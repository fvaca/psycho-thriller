import { EventBus } from "../infrastructure/EventBus.ts";

EventBus.subscribe("chat.completed", ({ response, provider }) => {
  console.log(`✅ Chat completed using ${provider}: ${response}`);
});