// components/DataInput.tsx
import { useState } from "preact/hooks";
import { generateRandomArray, generateRandomGraph, predefinedDatasets } from "../utils/dataGenerators.ts";
import { GraphNode } from "../utils/algorithms/graph.ts";

interface Props {
    onDataChange: (data: number[] | GraphNode[], algorithmCategory: string, target?: number, startNode?:number) => void;
    selectedAlgorithm: string;
}

export default function DataInput({ onDataChange, selectedAlgorithm }: Props) {
    const [inputType, setInputType] = useState<"random" | "manual" | "predefined">("random");
    const [arraySize, setArraySize] = useState(10);
    const [minValue, setMinValue] = useState(1);
    const [maxValue, setMaxValue] = useState(100);
    const [manualInput, setManualInput] = useState("");
    const [numNodes, setNumNodes] = useState(5);
    const [edgeProbability, setEdgeProbability] = useState(0.3);
    const [selectedDataset, setSelectedDataset] = useState("");
    const [targetValue, setTargetValue] = useState<number>(0); //for searching algorithm
    const [startNode, setStartNode] = useState<number>(0);

    const handleGenerateData = () => {
        let data: number[] | GraphNode[] = [];
        let algorithmCategory = "";

        if (!selectedAlgorithm) {
            alert("Please select an algorithm first.");
            return;
        }

        if (selectedAlgorithm.includes("Sort")) {
            algorithmCategory = "sorting"
        } else if (selectedAlgorithm.includes("Search")) {
            algorithmCategory = "searching"
        } else {
            algorithmCategory = "graph"
        }

        if (inputType === "random") {
            if (algorithmCategory === "sorting" || algorithmCategory === "searching") {
                data = generateRandomArray(arraySize, minValue, maxValue);
                if (algorithmCategory === "searching") {
                    data = (data as number[]).sort((a, b) => a - b);
                }
            } else if (algorithmCategory === "graph") {
                data = generateRandomGraph(numNodes, edgeProbability);
            }
            console.log("Data:", data);
            onDataChange(
                data,
                algorithmCategory,
                algorithmCategory === "searching" ? targetValue : undefined,
                algorithmCategory === "graph" ? startNode : undefined
            );

        } else if (inputType === "manual") {

            if (algorithmCategory === "sorting" || algorithmCategory === "searching") {
               const parsedInput = manualInput.split(",").map((num) => parseInt(num.trim(), 10));
                if (parsedInput.some(isNaN)) {
                    alert("Invalid input. Please enter numbers separated by commas.");
                    return;
                }
                data = parsedInput
            } else if(algorithmCategory === 'graph'){
                try {
                    const parsedGraph = JSON.parse(manualInput);
                    if (!Array.isArray(parsedGraph)) {
                        alert("Invalid graph data.  Must be an array of GraphNode objects.");
                        return;
                    }
                    // Basic validation (could be more robust)
                    for(const node of parsedGraph) {
                      if(typeof node.value !== 'number' || !Array.isArray(node.neighbors)){
                        alert("Invalid graph data structure. Ensure nodes have 'value' and 'neighbors' properties.");
                        return
                      }
                    }
                    data = parsedGraph as GraphNode[];


                } catch (error) {
                     alert("Invalid JSON input for graph data." + error);
                    return;
                }
            }
            console.log("Data:", data); //add this line before onDataChange
             onDataChange(data, algorithmCategory, algorithmCategory === "searching" ? targetValue: undefined, algorithmCategory === 'graph' ? startNode: undefined);
        }
        else if (inputType === "predefined") {
             if (algorithmCategory === "sorting" || algorithmCategory === "searching") {
                if (selectedDataset in predefinedDatasets) {
                    data = (predefinedDatasets as any)[selectedDataset] as number[]; // Type assertion
                } else {
                    alert("Please select a predefined dataset.");
                    return;
                }
             }
             else if (algorithmCategory === 'graph') {
                if (selectedDataset in predefinedDatasets) {
                    data = (predefinedDatasets as any)[selectedDataset] as GraphNode[];
                }
                else {
                    alert("Please select a predefined dataset.");
                    return;
                }
            }
            console.log("Data:", data); //add this line before onDataChange
             onDataChange(data, algorithmCategory, algorithmCategory === "searching" ? targetValue: undefined, algorithmCategory === 'graph' ? startNode: undefined);

        }


    };

    return (
        <div class="mb-4">
            <div class="flex space-x-4 mb-2">
                <button
                    type="button"
                    class={`px-4 py-2 rounded ${inputType === "random" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    onClick={() => setInputType("random")}
                >
                    Random Data
                </button>
                <button
                    type="button"
                    class={`px-4 py-2 rounded ${inputType === "manual" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    onClick={() => setInputType("manual")}
                >
                    Manual Input
                </button>
                <button
            type="button"
          class={`px-4 py-2 rounded ${inputType === "predefined" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setInputType("predefined")}
        >
          Predefined Dataset
        </button>
            </div>

            {inputType === "random" && (
                <div>
                     {(selectedAlgorithm.includes("Sort") || selectedAlgorithm.includes("Search")) && (
                        <>
                            <label class="block text-sm font-medium text-gray-700">Array Size:</label>
                            <input
                                type="number"
                                class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={arraySize}
                                onChange={(e) => setArraySize(Math.max(1, parseInt((e.target as HTMLInputElement).value, 10)))}
                            />
                            <label class="block text-sm font-medium text-gray-700">Min Value:</label>
                            <input
                                type="number"
                                class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={minValue}
                                 onChange={(e) => setMinValue(parseInt((e.target as HTMLInputElement).value, 10))}
                            />
                            <label class="block text-sm font-medium text-gray-700">Max Value:</label>
                            <input
                                type="number"
                                class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={maxValue}
                                onChange={(e) => setMaxValue(parseInt((e.target as HTMLInputElement).value, 10))}
                            />

                        </>
                    )}
                    {selectedAlgorithm.includes("Graph") && (
                        <>
                            <label class="block text-sm font-medium text-gray-700">Number of Nodes:</label>
                            <input
                                type="number"
                                class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={numNodes}
                                onChange={(e) => setNumNodes(Math.max(1, parseInt((e.target as HTMLInputElement).value, 10)))}
                            />
                            <label class="block text-sm font-medium text-gray-700">Edge Probability:</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="1"
                                class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={edgeProbability}
                                onChange={(e) => {
                                    if (e.target) {
                                        setEdgeProbability(parseFloat((e.target as HTMLInputElement).value));
                                    }
                                }}
                            />
                            <label className="block text-sm font-medium text-gray-700">Start Node:</label>
                            <input
                                type="number"
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={startNode}
                                onChange={(e) => setStartNode(parseInt((e.target as HTMLInputElement).value, 10))}
                            />
                        </>
                    )}
                </div>
            )}

            {inputType === "manual" && (
                <div>
                    { (selectedAlgorithm.includes("Sort") || selectedAlgorithm.includes("Search")) && (
                        <>
                            <label class="block text-sm font-medium text-gray-700">Enter numbers separated by commas:</label>
                            <textarea
                            class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={manualInput}
                            onChange={(e) => setManualInput((e.target as HTMLTextAreaElement).value)}
                            />
                            {selectedAlgorithm.includes("Search") && (
                              <>
                                <label className="block text-sm font-medium text-gray-700">
                                  Enter target value:
                                </label>
                                <input
                                  type="number"
                                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                  value={targetValue}
                                  onChange={(e) =>
                                    onDataChange(
                                      manualInput
                                        .split(",")
                                        .map((n) => parseInt(n.trim(), 10))
                                        .sort((a, b) => a - b),
                                      selectedAlgorithm.includes("Graph") ? "graph" : "searching",
                                      parseInt((e.target as HTMLInputElement).value, 10)
                                    )
                                  }
                                />
                              </>
                            )}
                        </>
                    )}
                    {selectedAlgorithm.includes("Graph") &&(
                        <>
                         <label class="block text-sm font-medium text-gray-700">Enter graph data as JSON:</label>
                            <textarea
                            class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={manualInput}
                            onChange={(e) => setManualInput((e.target as HTMLTextAreaElement).value)}
                            placeholder={`[\n  { "value": 0, "neighbors": [1, 2] },\n  { "value": 1, "neighbors": [0, 3] }\n]`}
                            />
                        </>
                    )}

                </div>
            )}
            {inputType === "predefined" && (
        <div>
             {(selectedAlgorithm.includes("Sort") || selectedAlgorithm.includes("Search")) && (
          <>
            <label class="block text-sm font-medium text-gray-700">Select a Dataset:</label>
            <select
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={selectedDataset}
              onChange={(e) => setSelectedDataset((e.target as HTMLSelectElement).value)}
            >
              <option value="">-- Select a Dataset --</option>
              <option value="sortedArray">Sorted Array</option>
              <option value="reverseSortedArray">Reverse Sorted Array</option>
              <option value="almostSortedArray">Almost Sorted Array</option>
            </select>
          </>
        )}
        {selectedAlgorithm.includes("Graph") && (
            <>
             <label class="block text-sm font-medium text-gray-700">Select a Dataset:</label>
            <select
              class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={selectedDataset}
              onChange={(e) => setSelectedDataset((e.target as HTMLSelectElement).value)}
            >
              <option value="">-- Select a Dataset --</option>
              <option value="sampleGraph">Sample Graph</option>
            </select>
            </>
        )}
        </div>
      )}
            {selectedAlgorithm.includes("Search") && (
                <>
                    <label className="block text-sm font-medium text-gray-700">Target Value:</label>
                    <input
                        type="number"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={targetValue}
                        onChange={(e) => setTargetValue(parseInt((e.target as HTMLInputElement).value, 10))}
                    />
                </>

            )}

            {selectedAlgorithm.includes("Graph") && (
                <>
                    <label className="block text-sm font-medium text-gray-700">Start Node:</label>
                     <input
                        type="number"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={startNode}
                        onChange={(e) => setStartNode(parseInt((e.target as HTMLInputElement).value, 10))}
                    />
                </>
            )}

            <button
                type="button"
                class="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handleGenerateData}
            >
                Generate/Set Data
            </button>
        </div>
    );
}