// utils/algorithms/sorting.ts

export function bubbleSort(arr: number[]): { state: number[]; swappedIndices?: [number, number] }[] {
  const steps: { state: number[]; swappedIndices?: [number, number] }[] = [];
  const array = [...arr];
  let n = array.length;
  let swapped: boolean;

  do {
    swapped = false;
    for (let i = 0; i < n - 1; i++) {
      if (array[i] > array[i + 1]) {
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        swapped = true;
        steps.push({ state: [...array], swappedIndices: [i, i + 1] });
      }
    }
    n--;
  } while (swapped);

  steps.push({ state: [...array] }); // Final state
  return steps;
}

export function insertionSort(arr: number[]): { state: number[]; comparisons: number; swaps: number }[] {
  const steps = [];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0; //In insertion sort, swaps can consider as shift.

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    comparisons++;
    steps.push({ state: [...arr], comparisons, swaps }); // Capture state before comparison

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
      swaps++;
      comparisons++; // Each shift is a type of comparison.
      steps.push({ state: [...arr], comparisons, swaps }); // Capture state after shift
    }
    arr[j + 1] = key;
    steps.push({ state: [...arr], comparisons, swaps });
  }

  return steps;
}

export function mergeSort(arr: number[]): { state: number[]; comparisons: number; swaps: number }[] {
  const steps: { state: number[]; comparisons: number; swaps: number }[] = [];
  let comparisons = 0;
  let swaps = 0; // Merge sort doesn't have swaps in the traditional sense.

    function merge(arr: number[], l: number, m: number, r: number)
    {
        const n1 = m - l + 1;
        const n2 = r - m;
        const L = new Array(n1);
        const R = new Array(n2);

        for (let i = 0; i < n1; i++)
            L[i] = arr[l + i];
        for (let j = 0; j < n2; j++)
            R[j] = arr[m + 1 + j];

        let i = 0;
        let j = 0;
        let k = l;

        while (i < n1 && j < n2) {
            comparisons++;
             steps.push({ state: [...arr], comparisons, swaps });
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            }
            else {
                arr[k] = R[j];
                j++;
            }
            k++;
        }
        while (i < n1) {
            arr[k] = L[i];
            i++;
            k++;
             steps.push({ state: [...arr], comparisons, swaps });
        }

        while (j < n2) {
            arr[k] = R[j];
            j++;
            k++;
            steps.push({ state: [...arr], comparisons, swaps });
        }
    }
  function mergeSortInternal(arr: number[],l: number, r: number){
    if(l>=r){
        return;
    }
    const m =l+ Math.floor((r-l)/2);
    mergeSortInternal(arr,l,m);
    mergeSortInternal(arr,m+1,r);
    merge(arr,l,m,r);
  }
  mergeSortInternal(arr, 0, arr.length - 1);
  steps.push({ state: [...arr], comparisons, swaps }); // Final state
  return steps;
}