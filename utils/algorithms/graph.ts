// utils/algorithms/graph.ts
export interface GraphNode {
    value: number;
    neighbors: number[]; // Indices of neighboring nodes
}
export function depthFirstSearch(graph: GraphNode[], startNode: number): { state: GraphNode[]; visited: number[]; current?: number; stack: number[] }[] {
    const steps: { state: GraphNode[]; visited: number[]; current?: number; stack:number[]}[] = [];
    const visited: number[] = [];
    const stack: number[] = [startNode];
     steps.push({ state: [...graph], visited:[...visited], stack:[...stack]});
    while (stack.length > 0) {
        const current = stack.pop()!;
        if (!visited.includes(current)) {
            visited.push(current);
            steps.push({ state: [...graph], visited:[...visited], current, stack:[...stack]});
            // Add neighbors to the stack in reverse order to maintain DFS order
            for (let i = graph[current].neighbors.length - 1; i >= 0; i--) {
                const neighbor = graph[current].neighbors[i];
                 if (!visited.includes(neighbor)) {
                    stack.push(neighbor);

                }
            }
             steps.push({ state: [...graph], visited:[...visited], current, stack:[...stack]});
        }
    }
    return steps;
}

export function breadthFirstSearch(graph: GraphNode[], startNode: number): { state: GraphNode[]; visited: number[]; current?: number; queue: number[] }[] {
    const steps: { state: GraphNode[]; visited: number[]; current?: number, queue: number[] }[] = [];
    const visited: number[] = [];
    const queue: number[] = [startNode];
    visited.push(startNode);
     steps.push({ state: [...graph], visited:[...visited], queue:[...queue]});
    while (queue.length > 0) {
        const current = queue.shift()!;
        steps.push({ state: [...graph], visited:[...visited], current, queue:[...queue]});
        for (const neighbor of graph[current].neighbors) {
            if (!visited.includes(neighbor)) {
                visited.push(neighbor);
                queue.push(neighbor);
                steps.push({ state: [...graph], visited:[...visited], current, queue:[...queue]});
            }
        }

    }

    return steps;
}

export function dijkstra(graph: GraphNode[], startNode: number): {
    state: GraphNode[];
    distances: (number | null)[];
    previous: (number | null)[];
    current?: number;
    unvisited: number[];
  }[] {
    const steps: {
      state: GraphNode[];
      distances: (number | null)[];
      previous: (number | null)[];
      current?: number;
      unvisited: number[];
    }[] = [];

    const numNodes = graph.length;
    const distances: (number | null)[] = new Array(numNodes).fill(null);
    const previous: (number | null)[] = new Array(numNodes).fill(null);
    const unvisited: number[] = [];

    for (let i = 0; i < numNodes; i++) {
      unvisited.push(i);
    }

    distances[startNode] = 0;
    steps.push({ state: [...graph], distances: [...distances], previous: [...previous], unvisited: [...unvisited] });
    while (unvisited.length > 0) {
        //find min distance node.
        let minDistanceIndex = 0;
        for (let i = 1; i < unvisited.length; i++) {
            if(distances[unvisited[i]] !== null && (distances[unvisited[minDistanceIndex]] === null || distances[unvisited[i]]! < distances[unvisited[minDistanceIndex]]!)){
                minDistanceIndex = i;
            }

        }

      const current = unvisited.splice(minDistanceIndex, 1)[0];
      steps.push({ state: [...graph], distances: [...distances], previous: [...previous], current, unvisited: [...unvisited] });
      for (const neighbor of graph[current].neighbors) {
        const altPath = distances[current]! + 1; // Assuming edge weights are all 1

        if (distances[neighbor] === null || altPath < distances[neighbor]!) {
          distances[neighbor] = altPath;
          previous[neighbor] = current;
           steps.push({ state: [...graph], distances: [...distances], previous: [...previous], current, unvisited: [...unvisited] });
        }
      }
    }
     steps.push({ state: [...graph], distances: [...distances], previous: [...previous], unvisited: [] });
    return steps;
}