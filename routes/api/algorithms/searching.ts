import { Handlers } from "$fresh/server.ts";
import { binarySearch } from "../../../utils/algorithms/searching.ts";

export const handler: Handlers = {
    async POST(req, _ctx) {
        const requestData = await req.json();
        const { algorithm, data, target } = requestData; //searching need target.
        let result;
        if (!data || !Array.isArray(data)) {
            return new Response(JSON.stringify({ error: "Invalid data provided" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }
        switch (algorithm) {
            case "binarySearch":
                result = binarySearch(data, target);
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