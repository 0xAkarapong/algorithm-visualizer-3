// utils/dataGenerators.ts

export function generateRandomArray(size: number, min: number, max: number): number[] {
    const arr = [];
    for (let i = 0; i < size; i++) {
      arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return arr;
  }
  
  interface GraphNode {
      value: number;
      neighbors: number[];
  }
  export function generateRandomGraph(numNodes: number, edgeProbability: number): GraphNode[] {
    const graph: GraphNode[] = [];
    for (let i = 0; i < numNodes; i++) {
      graph.push({ value: i, neighbors: [] });
    }
  
    for (let i = 0; i < numNodes; i++) {
      for (let j = i + 1; j < numNodes; j++) { // Avoid self-loops and duplicate edges
        if (Math.random() < edgeProbability) {
          graph[i].neighbors.push(j);
          graph[j].neighbors.push(i); // For an undirected graph
        }
      }
    }
    return graph;
  }
  
  // Example Predefined Datasets (you can add more)
  export const predefinedDatasets = {
    sortedArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    reverseSortedArray: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    almostSortedArray: [1, 2, 4, 3, 5, 6, 8, 7, 9, 10],
      sampleGraph: [
          { value: 0, neighbors: [1, 2] },
          { value: 1, neighbors: [0, 3] },
          { value: 2, neighbors: [0, 3, 4] },
          { value: 3, neighbors: [1, 2, 5] },
          { value: 4, neighbors: [2] },
          { value: 5, neighbors: [3] },
      ] as GraphNode[],
  };