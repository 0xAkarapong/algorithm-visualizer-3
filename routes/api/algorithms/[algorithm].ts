// routes/api/algorithms/[algorithm].ts
import { Handlers } from "$fresh/server.ts";
import { bubbleSort, insertionSort, mergeSort } from "../../../utils/algorithms/sorting.ts";
import { binarySearch } from "../../../utils/algorithms/searching.ts";
import { depthFirstSearch, breadthFirstSearch, dijkstra, GraphNode } from "../../../utils/algorithms/graph.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    const algorithm = ctx.params.algorithm; // Get algorithm name from the URL parameter
    const requestData = await req.json();
    const { data, startNode, target } = requestData; // Destructure all expected data

    let result;
    switch (algorithm) {
      case "bubbleSort":
        result = bubbleSort(data);
        break;
      case "insertionSort":
        result = insertionSort(data);
        break;
      case "mergeSort":
        result = mergeSort(data);
        break;
      case "binarySearch":
        result = binarySearch(data, target); // Pass the target value
        break;
      case "depthFirstSearch":
        result = depthFirstSearch(data as GraphNode[], startNode); // Type assertion
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