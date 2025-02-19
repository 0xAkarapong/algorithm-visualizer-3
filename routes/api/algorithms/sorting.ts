import { Handlers } from "$fresh/server.ts";
import { bubbleSort, insertionSort, mergeSort } from "../../../utils/algorithms/sorting.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
    const requestData = await req.json();
    const { algorithm, data } = requestData;
    let result;

    if (!data || !Array.isArray(data)) {
      return new Response(JSON.stringify({ error: "Invalid data provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    switch (algorithm) {
      case "bubbleSort":
        result = bubbleSort([...data]); // Pass a copy to avoid modifying the original
        break;
      case "insertionSort":
        result = insertionSort([...data]);
        break;
      case "mergeSort":
        result = mergeSort([...data]);
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