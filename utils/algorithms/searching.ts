// utils/algorithms/searching.ts

export function binarySearch(arr: number[], target: number): { state: number[]; comparisons: number; mid?: number; foundIndex?:number }[] {
    const steps = [];
    let comparisons = 0;
    let low = 0;
    let high = arr.length - 1;

    while (low <= high) {
        comparisons++;
        const mid = Math.floor((low + high) / 2);
        steps.push({ state: [...arr], comparisons, mid });

        if (arr[mid] === target) {
            steps.push({state: [...arr], comparisons, mid, foundIndex: mid });
            return steps;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    steps.push({state: [...arr], comparisons, foundIndex: -1}); // Indicate not found
    return steps;
}