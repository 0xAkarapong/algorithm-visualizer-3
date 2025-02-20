// utils/algorithms/searching.ts

export function binarySearch(
  arr: number[],
  target: number
): { state: { value: number; inRange: boolean; isMid: boolean }[]; mid?: number; foundIndex?: number }[] {
  const steps: { state: { value: number; inRange: boolean; isMid: boolean }[]; mid?: number; foundIndex?: number }[] = [];
  let low = 0;
  let high = arr.length - 1;

  // IMPORTANT: Ensure the array is sorted in ascending order before calling binarySearch.
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    // Mark elements that are in the current search range and the current mid index.
    const state = arr.map((value, index) => ({
      value,
      inRange: index >= low && index <= high,
      isMid: index === mid,
    }));

    // If the target is found, record the final step with foundIndex, then return all steps.
    if (arr[mid] === target) {
      steps.push({ state, mid, foundIndex: mid });
      return steps;
    } else {
      // Record the current state (without foundIndex) as we haven't found the target.
      steps.push({ state, mid });
      if (arr[mid] < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
  }

  // If the loop finishes, the target was not found.
  // Record a final step with foundIndex set to -1.
  const finalState = arr.map((value) => ({ value, inRange: false, isMid: false }));
  steps.push({ state: finalState, foundIndex: -1 });
  return steps;
}