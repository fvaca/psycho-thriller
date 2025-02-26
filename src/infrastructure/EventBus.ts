type EventHandler = (payload: any) => void | Promise<void>;

export class EventBus {
  private static handlers: Map<string, EventHandler[]> = new Map();

  static subscribe(event: string, handler: EventHandler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler);
  }

  static async publish(event: string, payload: any) {
    const handlers = this.handlers.get(event) || [];
    for (const handler of handlers) {
      await handler(payload);
    }
  }
}