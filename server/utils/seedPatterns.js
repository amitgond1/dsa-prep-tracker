import dotenv from "dotenv";
import Pattern from "../models/Pattern.js";
import connectDB from "./connectDB.js";

dotenv.config({ path: "../.env" });

const patterns = [
  {
    name: "Sliding Window",
    explanation:
      "Process contiguous subarrays by expanding and shrinking a window instead of recomputing from scratch.",
    whenToUse:
      "Use when the question asks for longest/shortest/maximum/minimum over a contiguous range and constraints suggest O(n).",
    complexity: "Usually O(n) time, O(1) or O(k) space",
    jsTemplate: `let left = 0;
for (let right = 0; right < nums.length; right += 1) {
  // include nums[right]
  while (/* window invalid */) {
    // exclude nums[left]
    left += 1;
  }
  // update answer from current window
}`,
    pyTemplate: `left = 0
for right in range(len(nums)):
    # include nums[right]
    while False:  # window invalid
        # exclude nums[left]
        left += 1
    # update answer`,
    relatedProblems: ["Minimum Window Substring", "Longest Repeating Character Replacement", "Fruit Into Baskets"]
  },
  {
    name: "Two Pointers",
    explanation:
      "Maintain two indices moving through the data to avoid nested loops and reduce O(n^2) scans to O(n).",
    whenToUse:
      "Use on sorted arrays or when comparing two ends/speeds; clue words include pair, sorted, palindrome, or remove duplicates.",
    complexity: "Mostly O(n) time, O(1) space",
    jsTemplate: `let left = 0;
let right = arr.length - 1;
while (left < right) {
  const cur = arr[left] + arr[right];
  if (cur === target) break;
  if (cur < target) left += 1;
  else right -= 1;
}`,
    pyTemplate: `left, right = 0, len(arr) - 1
while left < right:
    cur = arr[left] + arr[right]
    if cur == target:
        break
    if cur < target:
        left += 1
    else:
        right -= 1`,
    relatedProblems: ["Two Sum II - Input Array Is Sorted", "Container With Most Water", "3Sum"]
  },
  {
    name: "Fast & Slow Pointers",
    explanation:
      "Move one pointer faster than another to detect cycles or middle points in linked structures.",
    whenToUse: "Use in linked list cycle detection, middle-node finding, and loop entry problems.",
    complexity: "O(n) time, O(1) space",
    jsTemplate: `let slow = head;
let fast = head;
while (fast && fast.next) {
  slow = slow.next;
  fast = fast.next.next;
  if (slow === fast) {
    // cycle detected
    break;
  }
}`,
    pyTemplate: `slow = fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
    if slow == fast:
        break`,
    relatedProblems: ["Linked List Cycle", "Middle of the Linked List", "Palindrome Linked List"]
  },
  {
    name: "Merge Intervals",
    explanation:
      "Sort by start and merge overlapping ranges greedily.",
    whenToUse: "Use whenever intervals overlap or need union/coverage calculations.",
    complexity: "O(n log n) time, O(n) space",
    jsTemplate: `intervals.sort((a, b) => a[0] - b[0]);
const merged = [];
for (const curr of intervals) {
  if (!merged.length || merged[merged.length - 1][1] < curr[0]) {
    merged.push(curr);
  } else {
    merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], curr[1]);
  }
}`,
    pyTemplate: `intervals.sort(key=lambda x: x[0])
merged = []
for s, e in intervals:
    if not merged or merged[-1][1] < s:
        merged.append([s, e])
    else:
        merged[-1][1] = max(merged[-1][1], e)`,
    relatedProblems: ["Insert Interval", "Merge Intervals", "Non-overlapping Intervals"]
  },
  {
    name: "Cyclic Sort",
    explanation:
      "Place each number at its correct index when values are within a known range 1..n or 0..n.",
    whenToUse: "Use for missing/duplicate number problems with near-contiguous value ranges.",
    complexity: "O(n) time, O(1) space",
    jsTemplate: `let i = 0;
while (i < nums.length) {
  const correct = nums[i] - 1;
  if (nums[i] > 0 && nums[i] <= nums.length && nums[i] !== nums[correct]) {
    [nums[i], nums[correct]] = [nums[correct], nums[i]];
  } else {
    i += 1;
  }
}`,
    pyTemplate: `i = 0
while i < len(nums):
    correct = nums[i] - 1
    if 1 <= nums[i] <= len(nums) and nums[i] != nums[correct]:
        nums[i], nums[correct] = nums[correct], nums[i]
    else:
        i += 1`,
    relatedProblems: ["Missing Number", "Find All Duplicates in an Array", "First Missing Positive"]
  },
  {
    name: "In-place Reversal of LinkedList",
    explanation: "Reverse pointers iteratively while tracking previous/current/next nodes.",
    whenToUse: "Use when needing reversed traversal/order without extra memory.",
    complexity: "O(n) time, O(1) space",
    jsTemplate: `let prev = null;
let curr = head;
while (curr) {
  const next = curr.next;
  curr.next = prev;
  prev = curr;
  curr = next;
}
return prev;`,
    pyTemplate: `prev, curr = None, head
while curr:
    nxt = curr.next
    curr.next = prev
    prev = curr
    curr = nxt
return prev`,
    relatedProblems: ["Reverse Linked List", "Reverse Nodes in k-Group", "Reorder List"]
  },
  {
    name: "BFS (Level Order Traversal)",
    explanation: "Use a queue to explore nodes layer by layer.",
    whenToUse: "Use for shortest path in unweighted graphs or level-by-level tree questions.",
    complexity: "O(V + E) time, O(V) space",
    jsTemplate: `const queue = [start];
const seen = new Set([start]);
while (queue.length) {
  const size = queue.length;
  for (let i = 0; i < size; i += 1) {
    const node = queue.shift();
    for (const nei of graph[node]) {
      if (!seen.has(nei)) {
        seen.add(nei);
        queue.push(nei);
      }
    }
  }
}`,
    pyTemplate: `from collections import deque
q = deque([start])
seen = {start}
while q:
    for _ in range(len(q)):
        node = q.popleft()
        for nei in graph[node]:
            if nei not in seen:
                seen.add(nei)
                q.append(nei)`,
    relatedProblems: ["Binary Tree Level Order Traversal", "Rotting Oranges", "Word Ladder"]
  },
  {
    name: "DFS (Tree & Graph)",
    explanation: "Explore as deep as possible recursively or with an explicit stack.",
    whenToUse: "Use for connectivity, path existence, subtree processing, and backtracking prep.",
    complexity: "O(V + E) time, O(H) recursion/stack",
    jsTemplate: `function dfs(node, parent) {
  if (!node) return;
  // process node
  for (const nei of graph[node] || []) {
    if (nei !== parent) dfs(nei, node);
  }
}`,
    pyTemplate: `def dfs(node, parent):
    if not node:
        return
    # process node
    for nei in graph.get(node, []):
        if nei != parent:
            dfs(nei, node)`,
    relatedProblems: ["Number of Islands", "Subtree of Another Tree", "Pacific Atlantic Water Flow"]
  },
  {
    name: "Two Heaps",
    explanation: "Maintain max-heap for lower half and min-heap for upper half for running median-like logic.",
    whenToUse: "Use when repeatedly querying median/top of two dynamic partitions.",
    complexity: "O(log n) insert, O(1) median query",
    jsTemplate: `// JS needs a heap class; conceptual flow:
// push number into one heap, rebalance sizes, read median from heap tops`,
    pyTemplate: `import heapq
small, large = [], []  # max-heap via negative values, min-heap

def add_num(x):
    heapq.heappush(small, -x)
    if small and large and -small[0] > large[0]:
        heapq.heappush(large, -heapq.heappop(small))
    if len(small) > len(large) + 1:
        heapq.heappush(large, -heapq.heappop(small))
    if len(large) > len(small):
        heapq.heappush(small, -heapq.heappop(large))`,
    relatedProblems: ["Find Median from Data Stream", "Sliding Window Median", "IPO"]
  },
  {
    name: "Subsets",
    explanation: "Generate power set/permutations/combinations using decision-tree traversal.",
    whenToUse: "Use when output asks for all possible subsets, permutations, or combinations.",
    complexity: "O(2^n) or O(n!) depending on output",
    jsTemplate: `const result = [];
function backtrack(start, path) {
  result.push([...path]);
  for (let i = start; i < nums.length; i += 1) {
    path.push(nums[i]);
    backtrack(i + 1, path);
    path.pop();
  }
}`,
    pyTemplate: `res = []
def backtrack(start, path):
    res.append(path[:])
    for i in range(start, len(nums)):
        path.append(nums[i])
        backtrack(i + 1, path)
        path.pop()`,
    relatedProblems: ["Subsets", "Subsets II", "Combinations"]
  },
  {
    name: "Binary Search",
    explanation: "Repeatedly halve the search space on sorted/monotonic conditions.",
    whenToUse: "Use with sorted arrays or monotonic feasibility checks.",
    complexity: "O(log n) time",
    jsTemplate: `let left = 0;
let right = arr.length - 1;
while (left <= right) {
  const mid = Math.floor((left + right) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) left = mid + 1;
  else right = mid - 1;
}
return -1;`,
    pyTemplate: `left, right = 0, len(arr) - 1
while left <= right:
    mid = (left + right) // 2
    if arr[mid] == target:
        return mid
    if arr[mid] < target:
        left = mid + 1
    else:
        right = mid - 1
return -1`,
    relatedProblems: ["Binary Search", "Search in Rotated Sorted Array", "Koko Eating Bananas"]
  },
  {
    name: "Top K Elements",
    explanation: "Use heaps to maintain the top/smallest K elements efficiently.",
    whenToUse: "Use when only K best/worst elements are required, not full sorting.",
    complexity: "O(n log k) time, O(k) space",
    jsTemplate: `// keep min heap of size k for top-k largest values`,
    pyTemplate: `import heapq
heap = []
for x in nums:
    heapq.heappush(heap, x)
    if len(heap) > k:
        heapq.heappop(heap)
# heap contains top k`,
    relatedProblems: ["Top K Frequent Elements", "K Closest Points to Origin", "Find K Pairs with Smallest Sums"]
  },
  {
    name: "K-way Merge",
    explanation: "Merge multiple sorted lists/streams using a heap of current heads.",
    whenToUse: "Use with k sorted inputs where global order is needed.",
    complexity: "O(n log k) time, O(k) space",
    jsTemplate: `// push first item from each list into min-heap, repeatedly pop smallest and push next from same list`,
    pyTemplate: `import heapq
heap = []
for i, arr in enumerate(lists):
    if arr:
        heapq.heappush(heap, (arr[0], i, 0))
res = []
while heap:
    val, i, j = heapq.heappop(heap)
    res.append(val)
    if j + 1 < len(lists[i]):
        heapq.heappush(heap, (lists[i][j+1], i, j+1))`,
    relatedProblems: ["Merge k Sorted Lists", "Find K Pairs with Smallest Sums", "Kth Smallest Number in M Sorted Lists"]
  },
  {
    name: "Dynamic Programming",
    explanation: "Break complex problems into overlapping subproblems with memoization or tabulation.",
    whenToUse: "Use when brute force has repeated states and optimal substructure.",
    complexity: "State dependent; often O(n^2) time and O(n^2) space",
    jsTemplate: `const dp = Array(n + 1).fill(0);
for (let i = 1; i <= n; i += 1) {
  dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i - 1]);
}`,
    pyTemplate: `dp = [0] * (n + 1)
for i in range(1, n + 1):
    dp[i] = max(dp[i - 1], dp[i - 2] + nums[i - 1])`,
    relatedProblems: ["House Robber", "Longest Common Subsequence", "Coin Change"]
  },
  {
    name: "Backtracking",
    explanation: "Try choices, recurse, then undo choices to search all valid configurations.",
    whenToUse: "Use for constraint satisfaction (N-Queens, Sudoku, combinations).",
    complexity: "Exponential in decision depth",
    jsTemplate: `function backtrack(state) {
  if (isGoal(state)) {
    result.push(copy(state));
    return;
  }
  for (const choice of choices(state)) {
    apply(state, choice);
    backtrack(state);
    undo(state, choice);
  }
}`,
    pyTemplate: `def backtrack(state):
    if is_goal(state):
        res.append(copy_state(state))
        return
    for choice in choices(state):
        apply(state, choice)
        backtrack(state)
        undo(state, choice)`,
    relatedProblems: ["N-Queens", "Sudoku Solver", "Combination Sum"]
  },
  {
    name: "Monotonic Stack",
    explanation: "Maintain increasing/decreasing stack to answer next greater/smaller queries in linear time.",
    whenToUse: "Use for nearest greater/smaller element, histogram area, daily temperatures.",
    complexity: "O(n) time, O(n) space",
    jsTemplate: `const stack = [];
for (let i = 0; i < nums.length; i += 1) {
  while (stack.length && nums[stack[stack.length - 1]] < nums[i]) {
    const idx = stack.pop();
    ans[idx] = i;
  }
  stack.push(i);
}`,
    pyTemplate: `stack = []
for i, val in enumerate(nums):
    while stack and nums[stack[-1]] < val:
        idx = stack.pop()
        ans[idx] = i
    stack.append(i)`,
    relatedProblems: ["Daily Temperatures", "Next Greater Element I", "Largest Rectangle in Histogram"]
  },
  {
    name: "Trie",
    explanation: "Store prefixes in a tree to support fast prefix lookup and autocomplete.",
    whenToUse: "Use for prefix dictionaries, wildcard word search, and autocomplete.",
    complexity: "Insert/Search O(L) where L is word length",
    jsTemplate: `class TrieNode {
  constructor() {
    this.children = {};
    this.end = false;
  }
}`,
    pyTemplate: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.end = False`,
    relatedProblems: ["Implement Trie (Prefix Tree)", "Word Search II", "Design Add and Search Words Data Structure"]
  },
  {
    name: "Union Find",
    explanation: "Track connected components with disjoint set union + path compression.",
    whenToUse: "Use for dynamic connectivity, cycle detection in undirected graphs.",
    complexity: "Near O(1) amortized per union/find",
    jsTemplate: `const parent = Array.from({ length: n }, (_, i) => i);
function find(x) {
  if (parent[x] !== x) parent[x] = find(parent[x]);
  return parent[x];
}
function union(a, b) {
  const pa = find(a);
  const pb = find(b);
  if (pa !== pb) parent[pb] = pa;
}`,
    pyTemplate: `parent = list(range(n))
def find(x):
    if parent[x] != x:
        parent[x] = find(parent[x])
    return parent[x]
def union(a, b):
    pa, pb = find(a), find(b)
    if pa != pb:
        parent[pb] = pa`,
    relatedProblems: ["Number of Connected Components in an Undirected Graph", "Graph Valid Tree", "Accounts Merge"]
  },
  {
    name: "Topological Sort",
    explanation: "Linearize DAG dependencies using indegree (Kahn) or DFS ordering.",
    whenToUse: "Use with prerequisite/dependency problems and cycle detection in directed graphs.",
    complexity: "O(V + E) time, O(V) space",
    jsTemplate: `const indegree = Array(n).fill(0);
const graph = Array.from({ length: n }, () => []);
for (const [u, v] of edges) {
  graph[u].push(v);
  indegree[v] += 1;
}
const q = [];
for (let i = 0; i < n; i += 1) if (indegree[i] === 0) q.push(i);`,
    pyTemplate: `from collections import deque
indeg = [0] * n
graph = [[] for _ in range(n)]
for u, v in edges:
    graph[u].append(v)
    indeg[v] += 1
q = deque([i for i in range(n) if indeg[i] == 0])`,
    relatedProblems: ["Course Schedule", "Course Schedule II", "Alien Dictionary"]
  },
  {
    name: "Kadane's Algorithm",
    explanation: "Track best subarray ending at current index and global best.",
    whenToUse: "Use for maximum subarray sum variants over contiguous ranges.",
    complexity: "O(n) time, O(1) space",
    jsTemplate: `let current = nums[0];
let best = nums[0];
for (let i = 1; i < nums.length; i += 1) {
  current = Math.max(nums[i], current + nums[i]);
  best = Math.max(best, current);
}
return best;`,
    pyTemplate: `current = best = nums[0]
for x in nums[1:]:
    current = max(x, current + x)
    best = max(best, current)
return best`,
    relatedProblems: ["Maximum Subarray", "Maximum Sum Circular Subarray", "Maximum Product Subarray"]
  }
];

const seed = async () => {
  await connectDB();
  await Pattern.deleteMany({});
  await Pattern.insertMany(patterns);

  // eslint-disable-next-line no-console
  console.log(`Seeded ${patterns.length} patterns successfully.`);
  process.exit(0);
};

seed().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to seed patterns", error);
  process.exit(1);
});
