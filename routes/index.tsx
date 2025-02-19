// routes/index.tsx
import { Head } from "$fresh/runtime.ts";
import { useState, useEffect } from "preact/hooks";
import AlgorithmSelector from "../components/AlgorithmSelector.tsx";
import DataInput from "../components/DataInput.tsx";
import Visualizer from "../components/Visualizer.tsx";
import AlgorithmControls from "../components/AlgorithmControls.tsx";
import HighlightedInfo from "../components/HighlightedInfo.tsx";
import { GraphNode } from "../utils/algorithms/graph.ts";

export default function Home() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("");
  const [algorithmCategory, setAlgorithmCategory] = useState("");
  const [data, setData] = useState<number[] | GraphNode[]>([]);
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
    const [targetValue, setTargetValue] = useState<number| undefined>(undefined);
    const [startNode, setStartNode] = useState<number | undefined>(undefined)
    const [highlightedInfo, setHighlightedInfo] = useState({});

  // Fetch and set steps when the algorithm or data changes
    useEffect(() => {
        if (selectedAlgorithm && data.length > 0) {
             const fetchData = async () => {

                let url = `/api/algorithms/${selectedAlgorithm}`;
                // if you had separate endpoints:
                if(algorithmCategory === 'sorting'){
                    url = `/api/algorithms/sorting`
                }
                else if(algorithmCategory === 'searching'){
                    url = `/api/algorithms/searching`
                }
                else if(algorithmCategory === 'graph'){
                    url = `/api/algorithms/graph`
                }
                try {
                     const response = await fetch(url, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                         body: JSON.stringify({
                            data: data,
                            algorithm: selectedAlgorithm, // Send the algorithm name
                             target: targetValue,
                             startNode: startNode,
                        }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`Error fetching algorithm steps: ${response.status} - ${errorData.error}`);
                    }
                    const result = await response.json();
                    setSteps(result);
                    setCurrentStep(0); // Reset to the first step
                    setIsRunning(false);
                }
                catch (error: any) {
                    console.error("Error fetching data:", error);
                    alert(error.message) //show error to user
                }
            };
            fetchData();
           setHighlightedInfo({}); // Clear previous info
        }
    }, [selectedAlgorithm, data, algorithmCategory, targetValue, startNode]);

    useEffect(() => {
        if (isRunning && currentStep < steps.length - 1) {
            const timeoutId = setTimeout(() => {
                setCurrentStep((prevStep) => prevStep + 1);
            }, 1000 / speed); // Adjust delay based on speed

            return () => clearTimeout(timeoutId);
        }
        else if(currentStep === steps.length -1){
            setIsRunning(false)
        }
    }, [isRunning, currentStep, steps, speed]);

    useEffect(() => {
        if(steps.length > 0){
            //Update HighlightInfo
            const currentStepData = steps[currentStep];
            const {state, ...otherInfo} = currentStepData; //remove state key.
            setHighlightedInfo(otherInfo);
        }
    }, [currentStep, steps])


  const handleDataChange = (newData: number[] | GraphNode[], newAlgorithmCategory: string, newTarget?:number, newStartNode?: number) => {
    setData(newData);
    setAlgorithmCategory(newAlgorithmCategory);
      setTargetValue(newTarget)
      setStartNode(newStartNode)
  };

  const handleStart = () => {
      if(currentStep < steps.length -1){
        setIsRunning(true);
      }

  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };
    const handleSpeedChange = (newSpeed: number) => {
        setSpeed(newSpeed)
    }
  return (
    <div>
      <Head>
        <title>Algorithm Visualizer</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <main class="p-4">
        <h1 class="text-2xl font-bold mb-4">Algorithm Visualizer</h1>
        <AlgorithmSelector  onAlgorithmSelect={(alg, cat) => {setSelectedAlgorithm(alg); setAlgorithmCategory(cat)}} />
        <DataInput selectedAlgorithm={selectedAlgorithm} onDataChange={handleDataChange} />
        <AlgorithmControls
                    onStart={handleStart}
                    onStop={handleStop}
                    onStep={handleStep}
                    onSpeedChange={handleSpeedChange}
                    isRunning={isRunning}
                />
        <HighlightedInfo info={highlightedInfo} />
        <Visualizer data={data} algorithmCategory={algorithmCategory} steps={steps} currentStep={currentStep}  />
      </main>
    </div>
  );
}