// components/AlgorithmControls.tsx
import { useState } from "preact/hooks";

interface Props {
    onStart: () => void;
    onStop: () => void;
    onStep: () => void;
    onSpeedChange: (speed: number) => void;
    isRunning: boolean;
}
export default function AlgorithmControls({ onStart, onStop, onStep, onSpeedChange, isRunning }: Props) {

    const [speed, setSpeed] = useState(1); // Default speed

    const handleSpeedChange = (e: any) => {
        const newSpeed = parseFloat(e.target.value);
        setSpeed(newSpeed);
        onSpeedChange(newSpeed);
    };

    return (
        <div class="flex space-x-4 mb-4">
            <button
                type="button"
                class={`px-4 py-2 rounded ${isRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white`}
                onClick={isRunning ? onStop : onStart}
                disabled={!isRunning && !onStart}
            >
                {isRunning ? "Stop" : "Start"}
            </button>
            <button
                type="button"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={onStep}
                disabled={isRunning}
            >
                Step
            </button>
            <div>
                <label htmlFor="speed-control" class="block text-sm font-medium text-gray-700">Speed:</label>
                <input
                    type="range"
                    id="speed-control"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={speed}
                    onChange={handleSpeedChange}
                    class="mt-1"
                />
            </div>
        </div>
    );
}