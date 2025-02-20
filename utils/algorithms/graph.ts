// utils/algorithms/graph.ts
export interface GraphNode {
  value: number;
  neighbors: number[]; // Indices of neighboring nodes
}

export function depthFirstSearch(
  graph: GraphNode[],
  startNode: number
): { state: GraphNode[]; visited: number[]; current?: number; stack: number[] }[] {
  if (startNode < 0 || startNode >= graph.length) {
    throw new Error("Invalid startNode provided.");
  }

  const steps: { state: GraphNode[]; visited: number[]; current?: number; stack: number[] }[] = [];
  const visited: number[] = [];
  const stack: number[] = [startNode];
  
  steps.push({ state: [...graph], visited: [...visited], stack: [...stack] });
  
  while (stack.length > 0) {
    const current = stack.pop()!;
    // Guard: Skip processing if current node is undefined in the graph.
    if (!graph[current]) {
      console.error(`Node ${current} is not defined in the graph.`);
      continue;
    }

    if (!visited.includes(current)) {
      visited.push(current);
      steps.push({ state: [...graph], visited: [...visited], current, stack: [...stack] });
      
      // Add neighbors in reverse order to maintain DFS order
      for (let i = graph[current].neighbors.length - 1; i >= 0; i--) {
        const neighbor = graph[current].neighbors[i];
        if (!visited.includes(neighbor)) {
          stack.push(neighbor);
        }
      }
      
      steps.push({ state: [...graph], visited: [...visited], current, stack: [...stack] });
    }
  }
  
  return steps;
}

export function breadthFirstSearch(
  graph: GraphNode[],
  startNode: number
): { state: GraphNode[]; visited: number[]; current?: number; queue: number[] }[] {
  if (startNode < 0 || startNode >= graph.length) {
    throw new Error("Invalid startNode provided.");
  }

  const steps: { state: GraphNode[]; visited: number[]; current?: number; queue: number[] }[] = [];
  const visited: number[] = [];
  const queue: number[] = [startNode];
  visited.push(startNode);

  steps.push({ state: [...graph], visited: [...visited], queue: [...queue] });
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    // Guard: Ensure node exists before processing
    if (!graph[current]) {
      console.error(`Node ${current} is not defined in the graph.`);
      continue;
    }
    
    steps.push({ state: [...graph], visited: [...visited], current, queue: [...queue] });
    
    for (const neighbor of graph[current].neighbors) {
      if (!visited.includes(neighbor)) {
        visited.push(neighbor);
        queue.push(neighbor);
      }
    }
    
    steps.push({ state: [...graph], visited: [...visited], current, queue: [...queue] });
  }
  
  return steps;
}

export function dijkstra(
  graph: GraphNode[],
  startNode: number
): {
  state: GraphNode[];
  distances: (number | null)[];
  previous: (number | null)[];
  current?: number;
  unvisited: number[];
}[] {
  if (startNode < 0 || startNode >= graph.length) {
    throw new Error("Invalid startNode provided.");
  }

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
  steps.push({
    state: [...graph],
    distances: [...distances],
    previous: [...previous],
    unvisited: [...unvisited],
  });

  // Main loop
  while (unvisited.length > 0) {
    // Find the unvisited node with the smallest defined distance.
    let minDistance = Infinity;
    let minNode = -1;
    for (const node of unvisited) {
      if (distances[node] !== null && distances[node]! < minDistance) {
        minDistance = distances[node]!;
        minNode = node;
      }
    }

    // If no remaining node is reachable, exit the loop.
    if (minNode === -1) break;

    // Remove the node from the unvisited set.
    unvisited.splice(unvisited.indexOf(minNode), 1);
    const current = minNode;

    steps.push({
      state: [...graph],
      distances: [...distances],
      previous: [...previous],
      current,
      unvisited: [...unvisited],
    });

    // Ensure the current node exists.
    if (!graph[current]) {
      console.error(`Node ${current} is not defined in the graph.`);
      continue;
    }

    // For each neighbor, update distances and previous if a better path is found.
    for (const neighbor of graph[current].neighbors) {
      if (!graph[neighbor]) {
        console.error(`Neighbor ${neighbor} is not defined in the graph.`);
        continue;
      }

      const altPath = distances[current]! + 1; // Assuming all edge weights are 1.
      if (distances[neighbor] === null || altPath < distances[neighbor]!) {
        distances[neighbor] = altPath;
        previous[neighbor] = current;
      }
    }

    steps.push({
      state: [...graph],
      distances: [...distances],
      previous: [...previous],
      current,
      unvisited: [...unvisited],
    });
  }

  return steps;
}

export function generateRandomGraph(numNodes: number, edgeProbability: number): GraphNode[] {
  const graph: GraphNode[] = [];
  
  // Create nodes
  for (let i = 0; i < numNodes; i++) {
    graph.push({ value: i, neighbors: [] });
  }
  
  // Add edges randomly for an undirected graph
  for (let i = 0; i < numNodes; i++) {
    for (let j = i + 1; j < numNodes; j++) {
      if (Math.random() < edgeProbability) {
        graph[i].neighbors.push(j);
        graph[j].neighbors.push(i);
      }
    }
  }
  
  return graph;
}