// components/AlgorithmSelector.tsx
import { useState, useEffect } from "preact/hooks";

interface Props {
    onAlgorithmSelect: (algorithmName: string, algorithmCategory: string) => void;
}
const algorithms = [
  { name: "bubbleSort", category: "sorting" },  // Lowercase names
  { name: "insertionSort", category: "sorting" }, // Lowercase names
  { name: "mergeSort", category: "sorting" },    // Lowercase names
  { name: "binarySearch", category: "searching" }, // Lowercase names
  { name: "depthFirstSearch", category: "graph" }, // Lowercase names
  { name: "breadthFirstSearch", category: "graph" }, // Lowercase names
  { name: "dijkstra", category: "graph" },   // Lowercase names
];

export default function AlgorithmSelector({onAlgorithmSelect}: Props) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("");

    useEffect(() => {
        if(selectedAlgorithm){
            const algo = algorithms.find(a => a.name === selectedAlgorithm)
            if(algo){
                 onAlgorithmSelect(algo.name, algo.category)
            }
        }
    }, [selectedAlgorithm, onAlgorithmSelect])


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
            {/* Display the user-friendly name, but use lowercase for the value */}
            {algorithm.name.charAt(0).toUpperCase() + algorithm.name.slice(1).replace(/([A-Z])/g, ' $1').trim()}
          </option>
        ))}
      </select>
    </div>
  );
}