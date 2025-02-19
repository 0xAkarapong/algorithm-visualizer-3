import { useState } from "preact/hooks";

const algorithms = [
  { name: "Bubble Sort", category: "sorting" },
  { name: "Insertion Sort", category: "sorting" },
  { name: "Merge Sort", category: "sorting" },
  { name: "Binary Search", category: "searching" },
  { name: "Depth-First Search", category: "graph" },
  { name: "Breadth-First Search", category: "graph" },
  { name: "Dijkstra's Algorithm", category: "graph" },
];

interface AlgorithmSelectorProps {
  onAlgorithmSelect: (alg: string, cat: string) => void;
}

export default function AlgorithmSelector({ onAlgorithmSelect }: AlgorithmSelectorProps) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("");

  return (
    <div class="mb-4">
      <label htmlFor="algorithm-select" class="block text-sm font-medium text-gray-700">
        Select an Algorithm:
      </label>
      <select
        id="algorithm-select"
        class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        value={selectedAlgorithm}
        onChange={(e) => setSelectedAlgorithm((e.target as HTMLSelectElement).value)}
      >
        <option value="">-- Select an Algorithm --</option>
        {algorithms.map((algorithm) => (
          <option key={algorithm.name} value={algorithm.name}>
            {algorithm.name}
          </option>
        ))}
      </select>
    </div>
  );
}