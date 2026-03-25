import dotenv from "dotenv";
import Problem from "../models/Problem.js";
import connectDB from "./connectDB.js";

dotenv.config({ path: "../.env" });

const companiesPool = [
  "Google",
  "Amazon",
  "Microsoft",
  "Meta",
  "Apple",
  "Netflix",
  "Adobe",
  "Uber",
  "Atlassian",
  "LinkedIn",
  "Salesforce",
  "Oracle",
  "Walmart",
  "PayPal",
  "Bloomberg",
  "ByteDance",
  "Airbnb",
  "Nvidia",
  "DoorDash",
  "Stripe",
  "Intuit",
  "ServiceNow",
  "VMware",
  "Cisco",
  "Goldman Sachs"
];

const faangCompanies = ["Google", "Amazon", "Meta", "Apple", "Netflix"];

const topicCompanyHints = {
  Arrays: ["Google", "Meta", "Amazon"],
  Strings: ["Google", "Amazon", "Microsoft"],
  LinkedList: ["Microsoft", "Amazon", "Meta"],
  "Stack & Queue": ["Amazon", "Google", "ByteDance"],
  "Binary Search": ["Google", "Microsoft", "Adobe"],
  "Sliding Window": ["Amazon", "Google", "Meta"],
  "Two Pointers": ["Meta", "Amazon", "Apple"],
  "Trees & BST": ["Google", "Amazon", "Microsoft"],
  "Graphs & BFS/DFS": ["Google", "Meta", "Uber"],
  "Dynamic Programming": ["Google", "Amazon", "Microsoft"],
  "Recursion & Backtracking": ["Google", "Meta", "Adobe"]
};

const topicConfigs = [
  {
    topic: "Arrays",
    count: 20,
    patterns: ["Kadane's Algorithm", "Prefix Sum", "Simulation", "Hash Map"],
    titles: [
      "Two Sum",
      "Best Time to Buy and Sell Stock",
      "Contains Duplicate",
      "Product of Array Except Self",
      "Maximum Subarray",
      "Merge Sorted Array",
      "Rotate Array",
      "Move Zeroes",
      "Majority Element",
      "Missing Number",
      "Find Pivot Index",
      "Set Matrix Zeroes",
      "Spiral Matrix",
      "Subarray Sum Equals K",
      "Maximum Product Subarray",
      "Find All Duplicates in an Array",
      "Find the Duplicate Number",
      "First Missing Positive",
      "Jump Game",
      "Maximum Sum Circular Subarray"
    ]
  },
  {
    topic: "Strings",
    count: 15,
    patterns: ["Frequency Count", "Hashing", "String Builder"],
    titles: [
      "Valid Anagram",
      "Longest Common Prefix",
      "Valid Palindrome",
      "Reverse String",
      "Group Anagrams",
      "Encode and Decode Strings",
      "Longest Substring Without Repeating Characters",
      "Minimum Window Substring",
      "Palindrome Partitioning",
      "String to Integer (atoi)",
      "Roman to Integer",
      "Implement strStr()",
      "Longest Palindromic Substring",
      "Zigzag Conversion",
      "Find All Anagrams in a String"
    ]
  },
  {
    topic: "LinkedList",
    count: 15,
    patterns: ["Fast & Slow Pointers", "In-place Reversal of LinkedList", "Dummy Node"],
    titles: [
      "Reverse Linked List",
      "Linked List Cycle",
      "Merge Two Sorted Lists",
      "Remove Nth Node From End of List",
      "Reorder List",
      "Add Two Numbers",
      "Palindrome Linked List",
      "Intersection of Two Linked Lists",
      "Copy List with Random Pointer",
      "Swap Nodes in Pairs",
      "Reverse Nodes in k-Group",
      "Sort List",
      "Middle of the Linked List",
      "Delete Node in a Linked List",
      "Odd Even Linked List"
    ]
  },
  {
    topic: "Stack & Queue",
    count: 10,
    patterns: ["Monotonic Stack", "Stack Simulation", "Queue"],
    titles: [
      "Valid Parentheses",
      "Min Stack",
      "Evaluate Reverse Polish Notation",
      "Daily Temperatures",
      "Next Greater Element I",
      "Implement Queue using Stacks",
      "Implement Stack using Queues",
      "Decode String",
      "Largest Rectangle in Histogram",
      "Sliding Window Maximum"
    ]
  },
  {
    topic: "Binary Search",
    count: 10,
    patterns: ["Binary Search", "Binary Search on Answer"],
    titles: [
      "Binary Search",
      "Search Insert Position",
      "Search in Rotated Sorted Array",
      "Find Minimum in Rotated Sorted Array",
      "Find Peak Element",
      "Koko Eating Bananas",
      "Capacity To Ship Packages Within D Days",
      "Search a 2D Matrix",
      "Median of Two Sorted Arrays",
      "Time Based Key-Value Store"
    ]
  },
  {
    topic: "Sliding Window",
    count: 10,
    patterns: ["Sliding Window", "Fixed Window", "Variable Window"],
    titles: [
      "Maximum Average Subarray I",
      "Permutation in String",
      "Longest Repeating Character Replacement",
      "Minimum Size Subarray Sum",
      "Fruit Into Baskets",
      "Longest Subarray of 1's After Deleting One Element",
      "Subarrays with K Different Integers",
      "Count Number of Nice Subarrays",
      "Max Consecutive Ones III",
      "Find K Closest Elements"
    ]
  },
  {
    topic: "Two Pointers",
    count: 10,
    patterns: ["Two Pointers", "Opposite Ends", "Same Direction"],
    titles: [
      "3Sum",
      "Container With Most Water",
      "Trapping Rain Water",
      "Sort Colors",
      "Remove Duplicates from Sorted Array",
      "Remove Duplicates from Sorted Array II",
      "Backspace String Compare",
      "Squares of a Sorted Array",
      "Two Sum II - Input Array Is Sorted",
      "Boats to Save People"
    ]
  },
  {
    topic: "Trees & BST",
    count: 15,
    patterns: ["DFS (Tree & Graph)", "BFS (Level Order Traversal)", "Tree DP"],
    titles: [
      "Maximum Depth of Binary Tree",
      "Same Tree",
      "Invert Binary Tree",
      "Binary Tree Level Order Traversal",
      "Validate Binary Search Tree",
      "Kth Smallest Element in a BST",
      "Lowest Common Ancestor of a Binary Search Tree",
      "Binary Tree Right Side View",
      "Diameter of Binary Tree",
      "Balanced Binary Tree",
      "Construct Binary Tree from Preorder and Inorder Traversal",
      "Serialize and Deserialize Binary Tree",
      "Path Sum",
      "Subtree of Another Tree",
      "Binary Tree Zigzag Level Order Traversal"
    ]
  },
  {
    topic: "Graphs & BFS/DFS",
    count: 15,
    patterns: ["BFS (Level Order Traversal)", "DFS (Tree & Graph)", "Union Find", "Topological Sort"],
    titles: [
      "Number of Islands",
      "Clone Graph",
      "Course Schedule",
      "Course Schedule II",
      "Pacific Atlantic Water Flow",
      "Word Ladder",
      "Rotting Oranges",
      "Surrounded Regions",
      "Graph Valid Tree",
      "Number of Connected Components in an Undirected Graph",
      "Minimum Height Trees",
      "Reconstruct Itinerary",
      "Alien Dictionary",
      "Network Delay Time",
      "Open the Lock"
    ]
  },
  {
    topic: "Dynamic Programming",
    count: 20,
    patterns: ["Dynamic Programming", "0/1 Knapsack", "LCS", "Kadane's Algorithm"],
    titles: [
      "Climbing Stairs",
      "House Robber",
      "House Robber II",
      "Coin Change",
      "Coin Change II",
      "Longest Increasing Subsequence",
      "Longest Common Subsequence",
      "Word Break",
      "Partition Equal Subset Sum",
      "Target Sum",
      "Best Time to Buy and Sell Stock with Cooldown",
      "Decode Ways",
      "Unique Paths",
      "Minimum Path Sum",
      "Edit Distance",
      "Distinct Subsequences",
      "Burst Balloons",
      "Maximum Length of Pair Chain",
      "Longest Palindromic Subsequence",
      "Delete and Earn"
    ]
  },
  {
    topic: "Recursion & Backtracking",
    count: 10,
    patterns: ["Backtracking", "Subsets", "Recursion"],
    titles: [
      "Subsets",
      "Subsets II",
      "Permutations",
      "Permutations II",
      "Combinations",
      "Combination Sum",
      "Combination Sum II",
      "N-Queens",
      "Sudoku Solver",
      "Letter Combinations of a Phone Number"
    ]
  }
];

const difficultyForIndex = (index, topic) => {
  if (topic === "Dynamic Programming" || topic === "Graphs & BFS/DFS") {
    return index % 4 === 0 ? "Hard" : index % 2 === 0 ? "Medium" : "Easy";
  }
  if (topic === "Recursion & Backtracking") {
    return index % 3 === 0 ? "Hard" : "Medium";
  }
  return index % 5 === 0 ? "Hard" : index % 2 === 0 ? "Medium" : "Easy";
};

const slugify = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const pickCompanies = (seed, topic) => {
  const first = companiesPool[seed % companiesPool.length];
  const second = companiesPool[(seed * 3 + 2) % companiesPool.length];
  const third = companiesPool[(seed * 5 + 4) % companiesPool.length];
  const hintCompanies = topicCompanyHints[topic] || [];

  const selected = [first, second, third, ...hintCompanies];

  // Bias top 100 toward FAANG-style sheets.
  if (seed <= 100) {
    selected.push(faangCompanies[seed % faangCompanies.length]);
  }

  return [...new Set(selected)].slice(0, 5);
};

const buildProblems = () => {
  let number = 1;
  const list = [];

  for (const config of topicConfigs) {
    if (config.titles.length !== config.count) {
      throw new Error(`${config.topic} titles mismatch: expected ${config.count}, got ${config.titles.length}`);
    }

    for (let i = 0; i < config.count; i += 1) {
      const title = config.titles[i];
      const pattern = config.patterns[i % config.patterns.length];
      const difficulty = difficultyForIndex(i + 1, config.topic);
      const isCompanyImportant = number <= 100;
      const difficultyBoost = difficulty === "Hard" ? 14 : difficulty === "Medium" ? 8 : 4;

      list.push({
        number,
        title,
        difficulty,
        topic: config.topic,
        pattern,
        leetcodeLink: `https://leetcode.com/problems/${slugify(title)}/`,
        companies: pickCompanies(number, config.topic),
        isCompanyImportant,
        frequencyScore: Math.max(1, 170 - number + difficultyBoost)
      });
      number += 1;
    }
  }

  if (list.length !== 150) {
    throw new Error(`Expected 150 problems but generated ${list.length}`);
  }

  return list;
};

const seed = async () => {
  await connectDB();
  const problems = buildProblems();

  await Problem.deleteMany({});
  await Problem.insertMany(problems);

  // eslint-disable-next-line no-console
  console.log(`Seeded ${problems.length} problems successfully.`);
  process.exit(0);
};

seed().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Failed to seed problems", error);
  process.exit(1);
});



