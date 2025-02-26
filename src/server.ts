import { routeRequest } from "./interface/routes.ts";

Deno.serve({ port: 3000 }, routeRequest);