import { Handlers } from "$fresh/server.ts";
import { depthFirstSearch, breadthFirstSearch, dijkstra, GraphNode } from "../../../utils/algorithms/graph.ts";

export const handler: Handlers = {
    async POST(req, _ctx) {
        const requestData = await req.json();
        const { algorithm, data, startNode } = requestData;
        let result;

        if (!data || !Array.isArray(data)) {
            return new Response(JSON.stringify({ error: "Invalid data provided" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

        switch (algorithm) {
            case "depthFirstSearch":
                result = depthFirstSearch(data as GraphNode[], startNode);
                break;
            case "breadthFirstSearch":
                result = breadthFirstSearch(data as GraphNode[], startNode);
                break;
            case "dijkstra":
                result = dijkstra(data as GraphNode[], startNode);
                break;
            default:
                return new Response(JSON.stringify({ error: "Algorithm not found" }), {
                    status: 404,
                    headers: { "Content-Type": "application/json" },
                });
        }

        return new Response(JSON.stringify(result), {
            headers: { "Content-Type": "application/json" },
        });
    },
};