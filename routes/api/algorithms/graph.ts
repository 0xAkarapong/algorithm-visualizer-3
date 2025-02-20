import { Handlers } from "$fresh/server.ts";
import {
  depthFirstSearch,
  breadthFirstSearch,
  dijkstra,
  GraphNode,
  generateRandomGraph,
} from "../../../utils/algorithms/graph.ts";
import { HandlerContext } from "$fresh/server.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
    const requestData = await req.json();
    const { algorithm, data, startNode, numNodes, edgeProbability } = requestData;
    let result;

    // Only validate 'data' for algorithms that need it.
    if (algorithm !== "generateRandomGraph" && (!data || !Array.isArray(data))) {
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
      case "generateRandomGraph":
        result = generateRandomGraph(numNodes, edgeProbability);
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