let numbers = [];
const arrayContainer = document.getElementById("array-container");
const algorithmInfo = document.getElementById("algorithm-info");

document.getElementById("addValue").addEventListener("click", () => {
    const numberInput = document.getElementById("numberInput");
    const value = parseInt(numberInput.value);
    
    if (!isNaN(value)) {
        numbers.push(value);
        numberInput.value = "";
        renderArray();
    }
});

document.getElementById("sort").addEventListener("click", () => {
    const selectedAlgorithm = document.querySelector('input[name="algorithm"]:checked');
    if (selectedAlgorithm) {
        const algorithm = selectedAlgorithm.value;
        const sourceCode = getSourceCode(algorithm);
        algorithmInfo.innerHTML = `<h3>${algorithm.charAt(0).toUpperCase() + algorithm.slice(1)} Source Code:</h3><pre>${sourceCode}</pre>`;
        switch (algorithm) {
            case "bubbleSort":
                bubbleSort();
                break;
            case "insertionSort":
                insertionSort();
                break;
            case "selectionSort":
                selectionSort();
                break;
            case "mergeSort":
                mergeSort(numbers.slice());
                break; // Use slice to avoid modifying the original array
            case "quickSort":
                quickSort(numbers.slice(), 0, numbers.length - 1);
                break; // Use slice to avoid modifying the original array
            case "heapSort":
                heapSort();
                break;
        }
    }
});

function renderArray() {
    arrayContainer.innerHTML = "";
    numbers.forEach((num) => {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${num * 3}px`; // Scale the height
        bar.textContent = num;
        arrayContainer.appendChild(bar);
    });
}

function highlightBars(indices) {
    const bars = document.querySelectorAll('.bar');
    indices.forEach(index => {
        bars[index].style.backgroundColor = "orange"; // Highlight the bar
    });
    setTimeout(() => {
        indices.forEach(index => {
            bars[index].style.backgroundColor = "#007BFF"; // Reset the color
        });
    }, 500);
}

// Sorting Algorithms with Visualization
function bubbleSort() {
    const arr = [...numbers];
    let n = arr.length;
    let swapped;
    (async () => {
        do {
            swapped = false;
            for (let i = 0; i < n - 1; i++) {
                highlightBars([i, i + 1]); // Highlight bars being compared
                await sleep(500); // Pause for visualization
                if (arr[i] > arr[i + 1]) {
                    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                    renderArray(arr);
                    swapped = true;
                    highlightBars([i, i + 1]); // Highlight bars being swapped
                    await sleep(500); // Pause for visualization
                }
            }
            n--;
        } while (swapped);
        numbers = arr;
        renderArray(numbers); // Final render after sorting
    })();
}

function insertionSort() {
    const arr = [...numbers];
    (async () => {
        for (let i = 1; i < arr.length; i++) {
            let key = arr[i];
            let j = i - 1;
            highlightBars([i]); // Highlight the current key
            await sleep(500); // Pause for visualization
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                renderArray(arr);
                await sleep(500); // Pause for visualization
                j--;
            }
            arr[j + 1] = key;
            renderArray(arr);
        }
        numbers = arr;
    })();
}

function selectionSort() {
    const arr = [...numbers];
    (async () => {
        for (let i = 0; i < arr.length - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < arr.length; j++) {
                highlightBars([minIndex, j]); // Highlight the current minimum
                await sleep(500); // Pause for visualization
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }
            if (minIndex !== i) {
                [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
                renderArray(arr);
                highlightBars([i, minIndex]); // Highlight bars being swapped
                await sleep(500); // Pause for visualization
            }
        }
        numbers = arr;
    })();
}

async function mergeSort(arr) {
    if (arr.length < 2) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = await mergeSort(arr.slice(0, mid));
    const right = await mergeSort(arr.slice(mid));
    return merge(left, right);
}

async function merge(left, right) {
    const merged = [];
    while (left.length && right.length) {
        highlightBars([0, 1]); // Highlight bars being compared
        await sleep(500); // Pause for visualization
        if (left[0] < right[0]) {
            merged.push(left.shift());
        } else {
            merged.push(right.shift());
        }
    }
    while (left.length) merged.push(left.shift());
    while (right.length) merged.push(right.shift());
    
    numbers = merged;
    renderArray(numbers);
    return merged;
}

async function quickSort(arr, left, right) {
    if (left < right) {
        const index = await partition(arr, left, right);
        await quickSort(arr, left, index - 1);
        await quickSort(arr, index + 1, right);
    } else {
        numbers = arr; // Update the numbers array when sorting is complete
        renderArray(numbers);
    }
}

async function partition(arr, left, right) {
    const pivot = arr[right];
    let i = left - 1;
    for (let j = left; j < right; j++) {
        highlightBars([j, right]); // Highlight the current comparison
        await sleep(500); // Pause for visualization
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            renderArray(arr);
            highlightBars([i, j]); // Highlight bars being swapped
            await sleep(500); // Pause for visualization
        }
    }
    [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
    renderArray(arr);
    highlightBars([i + 1, right]); // Highlight the pivot swap
    await sleep(500); // Pause for visualization
    return i + 1;
}

function heapSort() {
    const arr = [...numbers];
    // Build heap and sort code
    (async () => {
        let n = arr.length;

        // Heapify
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            await heapify(arr, n, i);
        }

        // Sort
        for (let i = n - 1; i > 0; i--) {
            [arr[0], arr[i]] = [arr[i], arr[0]];
            renderArray(arr);
            highlightBars([0, i]); // Highlight bars being swapped
            await sleep(500); // Pause for visualization
            await heapify(arr, i, 0);
        }
        numbers = arr;
        renderArray(numbers);
    })();
}

async function heapify(arr, n, i) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        renderArray(arr);
        highlightBars([i, largest]); // Highlight bars being swapped
        await sleep(500); // Pause for visualization
        await heapify(arr, n, largest);
    }
}

function getSourceCode(algorithm) {
    const sourceCodes = {
        bubbleSort: `public void bubbleSort(int[] arr) {\n    int n = arr.length;\n    boolean swapped;\n    do {\n        swapped = false;\n        for (int i = 0; i < n - 1; i++) {\n            if (arr[i] > arr[i + 1]) {\n                int temp = arr[i];\n                arr[i] = arr[i + 1];\n                arr[i + 1] = temp;\n                swapped = true;\n            }\n        }\n        n--;\n    } while (swapped);\n}`,
        insertionSort: `public void insertionSort(int[] arr) {\n    for (int i = 1; i < arr.length; i++) {\n        int key = arr[i];\n        int j = i - 1;\n        while (j >= 0 && arr[j] > key) {\n            arr[j + 1] = arr[j];\n            j--;\n        }\n        arr[j + 1] = key;\n    }\n}`,
        selectionSort: `public void selectionSort(int[] arr) {\n    for (int i = 0; i < arr.length - 1; i++) {\n        int minIndex = i;\n        for (int j = i + 1; j < arr.length; j++) {\n            if (arr[j] < arr[minIndex]) {\n                minIndex = j;\n            }\n        }\n        int temp = arr[minIndex];\n        arr[minIndex] = arr[i];\n        arr[i] = temp;\n    }\n}`,
        mergeSort: `public void mergeSort(int[] arr) {\n    if (arr.length < 2) return;\n    int mid = arr.length / 2;\n    int[] left = Arrays.copyOfRange(arr, 0, mid);\n    int[] right = Arrays.copyOfRange(arr, mid, arr.length);\n    mergeSort(left);\n    mergeSort(right);\n    merge(left, right, arr);\n}\n\nprivate void merge(int[] left, int[] right, int[] merged) {\n    int i = 0, j = 0, k = 0;\n    while (i < left.length && j < right.length) {\n        if (left[i] <= right[j]) {\n            merged[k++] = left[i++];\n        } else {\n            merged[k++] = right[j++];\n        }\n    }\n    while (i < left.length) merged[k++] = left[i++];\n    while (j < right.length) merged[k++] = right[j++];\n}`,
        quickSort: `public void quickSort(int[] arr, int left, int right) {\n    if (left < right) {\n        int pivot = arr[right];\n        int i = left - 1;\n        for (int j = left; j < right; j++) {\n            if (arr[j] < pivot) {\n                i++;\n                int temp = arr[i];\n                arr[i] = arr[j];\n                arr[j] = temp;\n            }\n        }\n        int temp = arr[i + 1];\n        arr[i + 1] = arr[right];\n        arr[right] = temp;\n        quickSort(arr, left, i);\n        quickSort(arr, i + 2, right);\n    }\n}`,
        heapSort: `public void heapSort(int[] arr) {\n    int n = arr.length;\n    for (int i = n / 2 - 1; i >= 0; i--) {\n        heapify(arr, n, i);\n    }\n    for (int i = n - 1; i > 0; i--) {\n        int temp = arr[0];\n        arr[0] = arr[i];\n        arr[i] = temp;\n        heapify(arr, i, 0);\n    }\n}\n\nprivate void heapify(int[] arr, int n, int i) {\n    int largest = i;\n    int left = 2 * i + 1;\n    int right = 2 * i + 2;\n    if (left < n && arr[left] > arr[largest]) largest = left;\n    if (right < n && arr[right] > arr[largest]) largest = right;\n    if (largest != i) {\n        int temp = arr[i];\n        arr[i] = arr[largest];\n        arr[largest] = temp;\n        heapify(arr, n, largest);\n    }\n}`
    };
    return sourceCodes[algorithm];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
