import { AlgorithmTask, CandidateProfile, EmployerProfile, Invitation, Vacancy } from '../types';

export const INITIAL_TASKS: AlgorithmTask[] = [
  {
    id: 'fsp-task-twosum',
    title: 'LeetCode #1: Two Sum (Поиск пары транзакций с целевой суммой)',
    difficulty: 'Easy',
    specialization: 'backend',
    targetGrade: 'junior',
    fspRatingWeight: 50,
    acceptanceRate: '53.2%',
    description: `Дан массив целых чисел \`nums\` и целое число \`target\`.
Верните **индексы двух чисел**, таких что их сумма равна \`target\`.

Вы можете предположить, что каждый входной набор имеет ровно одно решение, и вы не можете использовать один и тот же элемент дважды.
Ответ можно вернуть в любом порядке.
Оптимизируйте решение до временной сложности $O(N)$ с использованием однопроходной хэш-таблицы (Hash Map).`,
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Существует только один корректный ответ.',
      'Требуемая сложность: O(N) по времени, O(N) по памяти'
    ],
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'nums[0] + nums[1] == 2 + 7 == 9, поэтому возвращаем [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'nums[1] + nums[2] == 2 + 4 == 6, поэтому возвращаем [1, 2].'
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]'
      }
    ],
    tags: ['Array', 'Hash Table', 'Two Pointers', 'FinTech'],
    timeLimitMs: 50,
    memoryLimitMb: 32,
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    hints: [
      'Используйте Map для сохранения уже просмотренных чисел и их индексов.',
      'Для каждого элемента `x` проверьте, есть ли в Map значение `target - x`.'
    ],
    solutionExplanation: 'Решение за один проход: создаем хэш-таблицу. Для каждого элемента `nums[i]` вычисляем дополнение `complement = target - nums[i]`. Если `complement` уже есть в таблице, возвращаем `[map.get(complement), i]`. Иначе добавляем `nums[i] -> i` в таблицу.',
    openTestCases: [
      {
        id: 'tc-ts-1',
        input: 'nums=[2,7,11,15], target=9',
        expectedOutput: '[0,1]',
        description: 'Классический массив с первой парой'
      },
      {
        id: 'tc-ts-2',
        input: 'nums=[3,2,4], target=6',
        expectedOutput: '[1,2]',
        description: 'Пара в середине массива'
      }
    ],
    hiddenTestCases: [
      {
        id: 'htc-ts-1',
        input: 'nums=[100000 elements array], target=199999',
        expectedOutput: 'OK: Hash map resolved in 2.1ms'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, num in enumerate(nums):
            comp = target - num
            if comp in seen:
                return [seen[comp], i]
            seen[num] = i
        return []`,
      java: `import java.util.HashMap;
import java.util.Map;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`,
      cpp: `#include <vector>
#include <unordered_map>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        std::unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); ++i) {
            int comp = target - nums[i];
            if (map.count(comp)) return {map[comp], i};
            map[nums[i]] = i;
        }
        return {};
    }
};`,
      go: `func twoSum(nums []int, target int) []int {
    seen := make(map[int]int)
    for i, num := range nums {
        comp := target - num
        if idx, ok := seen[comp]; ok {
            return []int{idx, i}
        }
        seen[num] = i
    }
    return nil
}`
    }
  },
  {
    id: 'fsp-task-longest-substring',
    title: 'LeetCode #3: Longest Substring Without Repeating Characters (Уникальная сессия)',
    difficulty: 'Medium',
    specialization: 'backend',
    targetGrade: 'middle',
    fspRatingWeight: 85,
    acceptanceRate: '34.8%',
    description: `Дана строка \`s\`. Найдите длину **самой длинной подстроки** без повторяющихся символов.

Примените технику **скользящего окна (Sliding Window)** с двумя указателями и хэш-таблицей последних позиций символов для достижения сложности $O(N)$ за один проход.`,
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's состоит из английских букв, цифр, символов и пробелов.',
      'Временная сложность строго O(N), память O(min(N, M))'
    ],
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'Ответ "abc", длина 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'Ответ "b", длина 1.'
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'Ответ "wke", длина 3. "pwke" - это подпоследовательность, а не подстрока.'
      }
    ],
    tags: ['Hash Table', 'String', 'Sliding Window'],
    timeLimitMs: 80,
    memoryLimitMb: 32,
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(K)',
    hints: [
      'Используйте левый указатель `left` и правый указатель `right`.',
      'Храните в Map индекс последнего вхождения каждого символа.',
      'При обнаружении дубликата сдвигайте `left = max(left, lastIdx + 1)`.'
    ],
    solutionExplanation: 'Используем скользящее окно [left..right]. В Map храним символ -> последний индекс. Перемещая right, если символ уже встречался внутри текущего окна, переносим left правее предыдущего вхождения.',
    openTestCases: [
      {
        id: 'tc-ls-1',
        input: 's="abcabcbb"',
        expectedOutput: '3',
        description: 'Чередующиеся символы'
      },
      {
        id: 'tc-ls-2',
        input: 's="pwwkew"',
        expectedOutput: '3',
        description: 'Символ с повтором внутри окна'
      }
    ],
    hiddenTestCases: [
      {
        id: 'htc-ls-1',
        input: 's="abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"',
        expectedOutput: '44'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  const map = new Map();
  let maxLen = 0;
  let left = 0;
  
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (map.has(char) && map.get(char) >= left) {
      left = map.get(char) + 1;
    }
    map.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  
  return maxLen;
}`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        seen = {}
        max_len = 0
        left = 0
        for right, char in enumerate(s):
            if char in seen and seen[char] >= left:
                left = seen[char] + 1
            seen[char] = right
            max_len = max(max_len, right - left + 1)
        return max_len`,
      java: `import java.util.HashMap;
import java.util.Map;

public class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> map = new HashMap<>();
        int maxLen = 0, left = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (map.containsKey(c) && map.get(c) >= left) {
                left = map.get(c) + 1;
            }
            map.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>

class Solution {
public:
    int lengthOfLongestSubstring(std::string s) {
        std::unordered_map<char, int> map;
        int maxLen = 0, left = 0;
        for (int right = 0; right < s.length(); ++right) {
            char c = s[right];
            if (map.count(c) && map[c] >= left) {
                left = map[c] + 1;
            }
            map[c] = right;
            maxLen = std::max(maxLen, right - left + 1);
        }
        return maxLen;
    }
};`,
      go: `func lengthOfLongestSubstring(s string) int {
    seen := make(map[rune]int)
    maxLen, left := 0, 0
    for right, char := range s {
        if idx, ok := seen[char]; ok && idx >= left {
            left = idx + 1
        }
        seen[char] = right
        if cur := right - left + 1; cur > maxLen {
            maxLen = cur
        }
    }
    return maxLen
}`
    }
  },
  {
    id: 'fsp-task-1',
    title: 'LeetCode #146: LRU Cache (Отказоустойчивый LRU Кэш O(1))',
    difficulty: 'Medium',
    specialization: 'backend',
    targetGrade: 'senior',
    fspRatingWeight: 120,
    acceptanceRate: '42.1%',
    description: `Реализуйте структуру данных **LRU (Least Recently Used) Cache** с фиксированной емкостью \`capacity\`.
Она должна поддерживать операции:
- \`get(key)\`: возвращает значение ключа, если он присутствует в кэше, иначе \`-1\`.
- \`put(key, value)\`: обновляет значение ключа или вставляет ключ-значение. Если количество ключей превышает \`capacity\`, вытесняется наименее используемый ключ.

Все операции должны работать строго за $O(1)$ по времени.`,
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key, value <= 10^5',
      'До 2 * 10^5 вызовов get и put',
      'Лимит по времени: 150ms',
      'Лимит памяти: 64MB'
    ],
    examples: [
      {
        input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        output: '[null, null, null, 1, null, -1, null, -1, 3, 4]',
        explanation: 'Ключ 2 был вытеснен при добавлении ключа 3, так как ключ 1 был запрошен через get.'
      }
    ],
    tags: ['Hash Map', 'Doubly Linked List', 'Design', 'O(1) Memory'],
    timeLimitMs: 150,
    memoryLimitMb: 64,
    timeComplexity: 'O(1) get & put',
    spaceComplexity: 'O(capacity)',
    hints: [
      'Используйте комбинацию Hash Table (для мгновенного поиска узла за O(1)) и Doubly Linked List (для перестановки и вытеснения за O(1)).'
    ],
    openTestCases: [
      {
        id: 'tc-1',
        input: 'capacity=2, ops=[put(1,1), put(2,2), get(1), put(3,3), get(2), put(4,4), get(1), get(3), get(4)]',
        expectedOutput: '[1, -1, -1, 3, 4]',
        description: 'Базовое вытеснение наименее используемого ключа'
      },
      {
        id: 'tc-2',
        input: 'capacity=1, ops=[put(2,1), get(2), put(3,2), get(2), get(3)]',
        expectedOutput: '[1, -1, 2]',
        description: 'Емкость 1 с мгновенной перезаписью'
      }
    ],
    hiddenTestCases: [
      {
        id: 'htc-1',
        input: 'capacity=3, ops=[put(1,10), put(2,20), put(3,30), get(1), put(4,40), get(2), put(5,50), get(3)]',
        expectedOutput: '[10, -1, -1]'
      }
    ],
    starterCode: {
      javascript: `// ФСП Решение: LRU Cache
class LRUCache {
  /**
   * @param {number} capacity
   */
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  /** 
   * @param {number} key
   * @return {number}
   */
  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }

  /** 
   * @param {number} key 
   * @param {number} value
   * @return {void}
   */
  put(key, value) {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      const firstKey = this.map.keys().next().value;
      this.map.delete(firstKey);
    }
    this.map.set(key, value);
  }
}`,
      python: `class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        val = self.cache.pop(key)
        self.cache[key] = val
        return val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.pop(key)
        elif len(self.cache) >= self.capacity:
            first_key = next(iter(self.cache))
            del self.cache[first_key]
        self.cache[key] = value`,
      java: `import java.util.LinkedHashMap;
import java.util.Map;

public class LRUCache {
    private final int capacity;
    private final LinkedHashMap<Integer, Integer> map;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.map = new LinkedHashMap<>(capacity, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
                return size() > capacity;
            }
        };
    }

    public int get(int key) {
        return map.getOrDefault(key, -1);
    }

    public void put(int key, int value) {
        map.put(key, value);
    }
}`,
      cpp: `#include <unordered_map>
#include <list>

class LRUCache {
    int capacity;
    std::list<std::pair<int, int>> items;
    std::unordered_map<int, std::list<std::pair<int, int>>::iterator> cache;
public:
    LRUCache(int capacity) : capacity(capacity) {}

    int get(int key) {
        auto it = cache.find(key);
        if (it == cache.end()) return -1;
        items.splice(items.begin(), items, it->second);
        return it->second->second;
    }

    void put(int key, int value) {
        auto it = cache.find(key);
        if (it != cache.end()) {
            it->second->second = value;
            items.splice(items.begin(), items, it->second);
            return;
        }
        if (items.size() == capacity) {
            cache.erase(items.back().first);
            items.pop_back();
        }
        items.emplace_front(key, value);
        cache[key] = items.begin();
    }
};`,
      go: `package main

type LRUCache struct {
    capacity int
    cache    map[int]*Node
    head, tail *Node
}

type Node struct {
    key, value int
    prev, next *Node
}`
    }
  },
  {
    id: 'fsp-task-trapping-water',
    title: 'LeetCode #42: Trapping Rain Water (Расчет удержания буфера очереди)',
    difficulty: 'Hard',
    specialization: 'highload',
    targetGrade: 'senior',
    fspRatingWeight: 160,
    acceptanceRate: '61.4%',
    description: `Дан массив неотрицательных чисел \`height\`, представляющий профиль высот рельефа или пиковой нагрузки очередей сообщений.
Вычислите, сколько единиц воды (или буферного объема данных) может удержать эта структура после заполнения.

Добейтесь оптимальной сложности $O(N)$ по времени и $O(1)$ по дополнительной памяти с использованием алгоритма **Two Pointers (Два указателя)**.`,
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5',
      'Временная сложность строго O(N), память O(1)'
    ],
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'Суммарно удерживается 6 единиц воды между пиками высот.'
      },
      {
        input: 'height = [4,2,0,3,2,5]',
        output: '9'
      }
    ],
    tags: ['Two Pointers', 'Dynamic Programming', 'Monotonic Stack', 'HighLoad'],
    timeLimitMs: 70,
    memoryLimitMb: 32,
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    hints: [
      'Используйте два указателя `left = 0` и `right = n - 1`.',
      'Отслеживайте `left_max` и `right_max`.',
      'Двигайте указатель с меньшей максимальной высотой, добавляя разницу к результату.'
    ],
    solutionExplanation: 'Два указателя движутся навстречу. Если height[left] < height[right], то уровень воды на позиции left ограничен left_max: добавляем max(0, left_max - height[left]) и сдвигаем left++. Аналогично для right.',
    openTestCases: [
      {
        id: 'tc-trw-1',
        input: 'height=[0,1,0,2,1,0,1,3,2,1,2,1]',
        expectedOutput: '6',
        description: 'Волнообразный профиль'
      },
      {
        id: 'tc-trw-2',
        input: 'height=[4,2,0,3,2,5]',
        expectedOutput: '9',
        description: 'Глубокая центральная впадина'
      }
    ],
    hiddenTestCases: [
      {
        id: 'htc-trw-1',
        input: 'height=[10000 elements monotonic mountain]',
        expectedOutput: '24995000'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function trap(height) {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0;
  let totalWater = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        totalWater += leftMax - height[left];
      }
      left++;
    } else {
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        totalWater += rightMax - height[right];
      }
      right--;
    }
  }

  return totalWater;
}`,
      python: `class Solution:
    def trap(self, height: list[int]) -> int:
        left, right = 0, len(height) - 1
        left_max, right_max = 0, 0
        water = 0
        while left < right:
            if height[left] < height[right]:
                if height[left] >= left_max:
                    left_max = height[left]
                else:
                    water += left_max - height[left]
                left += 1
            else:
                if height[right] >= right_max:
                    right_max = height[right]
                else:
                    water += right_max - height[right]
                right -= 1
        return water`,
      java: `public class Solution {
    public int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0;
        int total = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) leftMax = height[left];
                else total += leftMax - height[left];
                left++;
            } else {
                if (height[right] >= rightMax) rightMax = height[right];
                else total += rightMax - height[right];
                right--;
            }
        }
        return total;
    }
}`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int trap(std::vector<int>& height) {
        int left = 0, right = height.size() - 1;
        int leftMax = 0, rightMax = 0, total = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) leftMax = height[left];
                else total += leftMax - height[left];
                left++;
            } else {
                if (height[right] >= rightMax) rightMax = height[right];
                else total += rightMax - height[right];
                right--;
            }
        }
        return total;
    }
};`,
      go: `func trap(height []int) int {
    left, right := 0, len(height)-1
    leftMax, rightMax := 0, 0
    total := 0
    for left < right {
        if height[left] < height[right] {
            if height[left] >= leftMax {
                leftMax = height[left]
            } else {
                total += leftMax - height[left]
            }
            left++
        } else {
            if height[right] >= rightMax {
                rightMax = height[right]
            } else {
                total += rightMax - height[right]
            }
            right--
        }
    }
    return total
}`
    }
  },
  {
    id: 'fsp-task-coin-change',
    title: 'LeetCode #322: Coin Change (Минимальный размен в платежном шлюзе)',
    difficulty: 'Medium',
    specialization: 'backend',
    targetGrade: 'middle',
    fspRatingWeight: 95,
    acceptanceRate: '43.9%',
    description: `Дан массив целых чисел \`coins\`, представляющий номиналы монет, и целое число \`amount\` (целевая сумма платежа).
Верните **наименьшее количество монет**, необходимое для составления этой суммы.
Если эту сумму невозможно составить никакой комбинацией монет, верните \`-1\`.

Примените классическое одномерное **Динамическое Программирование (DP)** с временной сложностью $O(amount \\times coins.length)$.`,
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4'
    ],
    examples: [
      {
        input: 'coins = [1,2,5], amount = 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1 (3 монеты).'
      },
      {
        input: 'coins = [2], amount = 3',
        output: '-1',
        explanation: 'Сумму 3 нельзя набрать монетами номинала 2.'
      },
      {
        input: 'coins = [1], amount = 0',
        output: '0'
      }
    ],
    tags: ['Dynamic Programming', 'Breadth-First Search', 'FinTech'],
    timeLimitMs: 90,
    memoryLimitMb: 32,
    timeComplexity: 'O(S * N)',
    spaceComplexity: 'O(S)',
    hints: [
      'Создайте массив `dp` длины `amount + 1`, заполненный значением `Infinity`.',
      '`dp[0] = 0`.',
      'Для каждого `i` от 1 до `amount` и каждой монеты `c`: `if (i >= c) dp[i] = min(dp[i], dp[i - c] + 1)`.'
    ],
    solutionExplanation: 'Bottom-up Dynamic Programming: строим минимальное количество монет для каждой промежуточной суммы от 1 до amount.',
    openTestCases: [
      {
        id: 'tc-cc-1',
        input: 'coins=[1,2,5], amount=11',
        expectedOutput: '3',
        description: 'Жадный алгоритм совпадает с оптимумом'
      },
      {
        id: 'tc-cc-2',
        input: 'coins=[2], amount=3',
        expectedOutput: '-1',
        description: 'Невозможно набрать сумму'
      }
    ],
    hiddenTestCases: [
      {
        id: 'htc-cc-1',
        input: 'coins=[186,419,83,408], amount=6249',
        expectedOutput: '20'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i >= coin && dp[i - coin] !== Infinity) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      python: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        dp = [float('inf')] * (amount + 1)
        dp[0] = 0
        for i in range(1, amount + 1):
            for c in coins:
                if i >= c:
                    dp[i] = min(dp[i], dp[i - c] + 1)
        return dp[amount] if dp[amount] != float('inf') else -1`,
      java: `import java.util.Arrays;

public class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (i >= coin) {
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int coinChange(std::vector<int>& coins, int amount) {
        std::vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; ++i) {
            for (int c : coins) {
                if (i >= c) dp[i] = std::min(dp[i], dp[i - c] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
};`,
      go: `func coinChange(coins []int, amount int) int {
    dp := make([]int, amount+1)
    for i := range dp {
        dp[i] = amount + 1
    }
    dp[0] = 0
    for i := 1; i <= amount; i++ {
        for _, c := range coins {
            if i >= c && dp[i-c]+1 < dp[i] {
                dp[i] = dp[i-c] + 1
            }
        }
    }
    if dp[amount] > amount {
        return -1
    }
    return dp[amount]
}`
    }
  },
  {
    id: 'fsp-task-course-schedule',
    title: 'LeetCode #207: Course Schedule (Топологическая сортировка микросервисов)',
    difficulty: 'Medium',
    specialization: 'backend',
    targetGrade: 'senior',
    fspRatingWeight: 110,
    acceptanceRate: '47.3%',
    description: `Вам дано общее количество микросервисов / курсов \`numCourses\` (пронумерованных от \`0\` до \`numCourses - 1\`) и массив зависимостей \`prerequisites\`, где \`prerequisites[i] = [a, b]\` означает, что для запуска сервиса \`a\` сначала должен быть успешно поднят сервис \`b\`.

Верните \`true\`, если возможно развернуть все микросервисы без взаимных циклических блокировок (Deadlock / Directed Cycle), иначе верните \`false\`.

Используйте **алгоритм Кана (Kahn's Algorithm BFS)** для вычисления входных степеней вершин (in-degree) или поиск цикла через DFS.`,
    constraints: [
      '1 <= numCourses <= 2000',
      '0 <= prerequisites.length <= 5000',
      'prerequisites[i].length == 2',
      '0 <= ai, bi < numCourses',
      'Все пары prerequisites[i] уникальны.'
    ],
    examples: [
      {
        input: 'numCourses = 2, prerequisites = [[1,0]]',
        output: 'true',
        explanation: 'Сначала запускается сервис 0, затем сервис 1.'
      },
      {
        input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]',
        output: 'false',
        explanation: 'Обнаружен взаимный цикл зависимостей (Deadlock).'
      }
    ],
    tags: ['Depth-First Search', 'Breadth-First Search', 'Graph', 'Topological Sort'],
    timeLimitMs: 90,
    memoryLimitMb: 48,
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V + E)',
    hints: [
      'Постройте граф смежности (Adjacency List) и массив входящих степеней (In-Degrees).',
      'Добавьте в очередь все вершины с `inDegree == 0`.',
      'Последовательно извлекайте вершины из очереди и уменьшайте степени соседей. Если обработаны все `numCourses` вершин — цикла нет.'
    ],
    solutionExplanation: 'Алгоритм Кана: инициируем очередь вершинами без входящих ребер. Если в конце количество извлеченных вершин равно числу курсов, граф является DAG (ацикличным).',
    openTestCases: [
      {
        id: 'tc-cs-1',
        input: 'numCourses=2, prerequisites=[[1,0]]',
        expectedOutput: 'true',
        description: 'Прямая зависимость без циклов'
      },
      {
        id: 'tc-cs-2',
        input: 'numCourses=2, prerequisites=[[1,0],[0,1]]',
        expectedOutput: 'false',
        description: 'Циклическая зависимость'
      }
    ],
    hiddenTestCases: [
      {
        id: 'htc-cs-1',
        input: 'numCourses=5, prerequisites=[[1,4],[2,4],[3,1],[3,2]]',
        expectedOutput: 'true'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
function canFinish(numCourses, prerequisites) {
  const inDegree = new Array(numCourses).fill(0);
  const adj = Array.from({ length: numCourses }, () => []);

  for (const [course, pre] of prerequisites) {
    adj[pre].push(course);
    inDegree[course]++;
  }

  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  let count = 0;
  while (queue.length > 0) {
    const node = queue.shift();
    count++;
    for (const neighbor of adj[node]) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  return count === numCourses;
}`,
      python: `from collections import deque

class Solution:
    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:
        in_degree = [0] * numCourses
        adj = [[] for _ in range(numCourses)]
        for course, pre in prerequisites:
            adj[pre].append(course)
            in_degree[course] += 1
            
        queue = deque([i for i in range(numCourses) if in_degree[i] == 0])
        count = 0
        while queue:
            node = queue.popleft()
            count += 1
            for neighbor in adj[node]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)
        return count == numCourses`,
      java: `import java.util.*;

public class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        int[] inDegree = new int[numCourses];
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        for (int[] p : prerequisites) {
            adj.get(p[1]).add(p[0]);
            inDegree[p[0]]++;
        }
        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) q.offer(i);
        int count = 0;
        while (!q.isEmpty()) {
            int node = q.poll();
            count++;
            for (int next : adj.get(node)) {
                if (--inDegree[next] == 0) q.offer(next);
            }
        }
        return count == numCourses;
    }
}`,
      cpp: `#include <vector>
#include <queue>

class Solution {
public:
    bool canFinish(int numCourses, std::vector<std::vector<int>>& prerequisites) {
        std::vector<int> inDegree(numCourses, 0);
        std::vector<std::vector<int>> adj(numCourses);
        for (auto& p : prerequisites) {
            adj[p[1]].push_back(p[0]);
            inDegree[p[0]]++;
        }
        std::queue<int> q;
        for (int i = 0; i < numCourses; ++i) if (inDegree[i] == 0) q.push(i);
        int count = 0;
        while (!q.empty()) {
            int node = q.front(); q.pop();
            count++;
            for (int next : adj[node]) {
                if (--inDegree[next] == 0) q.push(next);
            }
        }
        return count == numCourses;
    }
};`,
      go: `func canFinish(numCourses int, prerequisites [][]int) bool {
    inDegree := make([]int, numCourses)
    adj := make([][]int, numCourses)
    for _, p := range prerequisites {
        adj[p[1]] = append(adj[p[1]], p[0])
        inDegree[p[0]]++
    }
    queue := make([]int, 0)
    for i := 0; i < numCourses; i++ {
        if inDegree[i] == 0 {
            queue = append(queue, i)
        }
    }
    count := 0
    for len(queue) > 0 {
        node := queue[0]
        queue = queue[1:]
        count++
        for _, next := range adj[node] {
            inDegree[next]--
            if inDegree[next] == 0 {
                queue = append(queue, next)
            }
        }
    }
    return count == numCourses
}`
    }
  },
  {
    id: 'fsp-task-3',
    title: 'LeetCode #239: Sliding Window Maximum (Скользящее окно телеметрии)',
    difficulty: 'Hard',
    specialization: 'backend',
    targetGrade: 'senior',
    fspRatingWeight: 140,
    acceptanceRate: '46.7%',
    description: `Вам дан массив чисел \`nums\` (поток задержек сетевых пакетов) и размер окна \`k\`.
Окно движется слева направо по 1 элементу.
Необходимо вернуть массив максимальных значений для каждого положения окна за строго $O(N)$ времени с использованием монотонной двусвязной очереди (**Monotonic Deque**).`,
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
      '1 <= k <= nums.length',
      'Временная сложность строго O(N)'
    ],
    examples: [
      {
        input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3',
        output: '[3,3,5,5,6,7]',
        explanation: 'Окна: [1,3,-1] -> 3; [3,-1,-3] -> 3; [-1,-3,5] -> 5; [-3,5,3] -> 5; [5,3,6] -> 6; [3,6,7] -> 7'
      }
    ],
    tags: ['Sliding Window', 'Monotonic Queue', 'High Throughput'],
    timeLimitMs: 80,
    memoryLimitMb: 40,
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(K)',
    hints: [
      'Храните в Deque индексы элементов.',
      'Удаляйте из начала очереди индексы, вышедшие за пределы окна.',
      'Удаляйте из конца очереди индексы элементов, которые меньше текущего nums[i].'
    ],
    openTestCases: [
      {
        id: 'tc-sw-1',
        input: 'nums=[1,3,-1,-3,5,3,6,7], k=3',
        expectedOutput: '[3,3,5,5,6,7]',
        description: 'Стандартный поток с чередованием знаков'
      },
      {
        id: 'tc-sw-2',
        input: 'nums=[1], k=1',
        expectedOutput: '[1]',
        description: 'Единичный элемент'
      }
    ],
    hiddenTestCases: [
      {
        id: 'htc-sw-1',
        input: 'nums=[10^5 elements decreasing monotonically], k=5000',
        expectedOutput: 'OK: Monotonic queue processed 100k items in 4.2ms'
      }
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
function maxSlidingWindow(nums, k) {
  const deque = [];
  const result = [];
  
  for (let i = 0; i < nums.length; i++) {
    if (deque.length > 0 && deque[0] < i - k + 1) {
      deque.shift();
    }
    while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) {
      deque.pop();
    }
    deque.push(i);
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }
  
  return result;
}`,
      python: `from collections import deque

class Solution:
    def maxSlidingWindow(self, nums: list[int], k: int) -> list[int]:
        dq = deque()
        res = []
        for i, n in enumerate(nums):
            if dq and dq[0] < i - k + 1:
                dq.popleft()
            while dq and nums[dq[-1]] < n:
                dq.pop()
            dq.append(i)
            if i >= k - 1:
                res.append(nums[dq[0]])
        return res`,
      java: `import java.util.*;

public class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] res = new int[n - k + 1];
        Deque<Integer> dq = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            if (!dq.isEmpty() && dq.peekFirst() < i - k + 1) dq.pollFirst();
            while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) dq.pollLast();
            dq.offerLast(i);
            if (i >= k - 1) res[i - k + 1] = nums[dq.peekFirst()];
        }
        return res;
    }
}`,
      cpp: `#include <vector>
#include <deque>

class Solution {
public:
    std::vector<int> maxSlidingWindow(std::vector<int>& nums, int k) {
        std::deque<int> dq;
        std::vector<int> res;
        for (int i = 0; i < nums.size(); ++i) {
            if (!dq.empty() && dq.front() < i - k + 1) dq.pop_front();
            while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();
            dq.push_back(i);
            if (i >= k - 1) res.push_back(nums[dq.front()]);
        }
        return res;
    }
};`,
      go: `func maxSlidingWindow(nums []int, k int) []int {
    deque := make([]int, 0)
    res := make([]int, 0, len(nums)-k+1)
    for i, num := range nums {
        if len(deque) > 0 && deque[0] < i-k+1 {
            deque = deque[1:]
        }
        for len(deque) > 0 && nums[deque[len(deque)-1]] < num {
            deque = deque[:len(deque)-1]
        }
        deque = append(deque, i)
        if i >= k-1 {
            res = append(res, nums[deque[0]])
        }
    }
    return res
}`
    }
  },
  {
    id: 'fsp-task-2',
    title: 'ФСП Чемпионат: Поиск максимального потока в сети (Dinic Algorithm)',
    difficulty: 'Hard',
    specialization: 'highload',
    targetGrade: 'senior',
    fspRatingWeight: 180,
    acceptanceRate: '29.4%',
    description: `В распределенной банковской системе задан ориентированный граф серверов с пропускными способностями каналов (RPS).
Необходимо найти **максимальный суммарный поток (Max Flow)** от источника $S$ к стоку $T$ алгоритмом Диница с блокирующими потоками.
Оптимизируйте работу с графом для высоконагруженных очередей сообщений.`,
    constraints: [
      '2 <= V <= 500 (число узлов)',
      '1 <= E <= 10000 (число ребер)',
      '0 <= capacity <= 10^7',
      'Лимит по времени: 100ms',
      'Лимит памяти: 32MB'
    ],
    examples: [
      {
        input: 'V=4, edges=[[0,1,20], [0,2,10], [1,2,5], [1,3,10], [2,3,20]], source=0, sink=3',
        output: '25',
        explanation: 'Максимальный поток составляет 25 единиц трафика.'
      }
    ],
    tags: ['Max Flow', 'Dinic Algorithm', 'Graph Theory', 'HighLoad'],
    timeLimitMs: 100,
    memoryLimitMb: 32,
    timeComplexity: 'O(V^2 * E)',
    spaceComplexity: 'O(V + E)',
    hints: [
      'Используйте BFS для построения слоистой сети (Layered Network).',
      'Используйте DFS для нахождения блокирующего потока с оптимизацией указателей (ptr array).'
    ],
    openTestCases: [
      {
        id: 'tc-maxflow-1',
        input: 'source=0, sink=3, edges=[[0,1,10],[0,2,10],[1,2,2],[1,3,4],[2,3,9]]',
        expectedOutput: '13',
        description: 'Стандартный ромб с параллельными каналами'
      }
    ],
    hiddenTestCases: [
      {
        id: 'htc-maxflow-1',
        input: 'V=100, bipartite matching cluster',
        expectedOutput: '482'
      }
    ],
    starterCode: {
      javascript: `// ФСП Алгоритм Диница для Max Flow
function maxFlow(n, source, sink, edges) {
  const head = new Int32Array(n).fill(-1);
  const to = [], next = [], cap = [], flow = [];
  let edgeCount = 0;

  function addEdge(u, v, c) {
    to[edgeCount] = v; cap[edgeCount] = c; flow[edgeCount] = 0; next[edgeCount] = head[u]; head[u] = edgeCount++;
    to[edgeCount] = u; cap[edgeCount] = 0; flow[edgeCount] = 0; next[edgeCount] = head[v]; head[v] = edgeCount++;
  }

  for (const [u, v, c] of edges) addEdge(u, v, c);

  const level = new Int32Array(n);
  const ptr = new Int32Array(n);

  function bfs() {
    level.fill(-1);
    level[source] = 0;
    const q = [source];
    let qHead = 0;
    while (qHead < q.length) {
      const u = q[qHead++];
      for (let e = head[u]; e !== -1; e = next[e]) {
        const v = to[e];
        if (cap[e] - flow[e] > 0 && level[v] === -1) {
          level[v] = level[u] + 1;
          q.push(v);
        }
      }
    }
    return level[sink] !== -1;
  }

  function dfs(u, pushed) {
    if (u === sink || pushed === 0) return pushed;
    for (let e = ptr[u]; e !== -1; e = next[e]) {
      ptr[u] = e;
      const v = to[e];
      const tr = cap[e] - flow[e];
      if (level[u] + 1 === level[v] && tr > 0) {
        const push = dfs(v, Math.min(pushed, tr));
        if (push > 0) {
          flow[e] += push;
          flow[e ^ 1] -= push;
          return push;
        }
      }
    }
    return 0;
  }

  let totalFlow = 0;
  while (bfs()) {
    ptr.set(head);
    while (true) {
      const pushed = dfs(source, Infinity);
      if (pushed === 0) break;
      totalFlow += pushed;
    }
  }
  return totalFlow;
}`,
      python: `def max_flow(n, source, sink, edges):
    # Dinic Algorithm
    pass`,
      java: `public class MaxFlowDinic {
    public static int compute(int n, int s, int t, int[][] edges) {
        return 0;
    }
}`,
      cpp: `int maxFlow(int n, int s, int t, vector<vector<int>>& edges) {
    return 0;
}`,
      go: `func maxFlow(n int, s int, t int, edges [][]int) int {
    return 0
}`
    }
  }
];

export const INITIAL_CANDIDATES: CandidateProfile[] = [
  {
    id: 'cand-1',
    email: 'alex.belov.fsp@arena.pro',
    fullName: 'Александр Белов',
    city: 'Москва',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    title: 'Senior Backend Engineer / HighLoad & Algorithms Lead',
    specialization: 'backend',
    targetGrade: 'senior',
    currentGradeAssigned: 'senior',
    fspId: 'FSP-RU-2024-0042',
    fspRank: 'Мастер спорта РФ',
    fspRating: 2740,
    fspBadges: [
      'Победитель Чемпионата РФ 2024',
      'Мастер спорта РФ по СП',
      'Top 0.5% Algorithmic Speed',
      'Distributed DB Expert',
      'Keycloak Verified'
    ],
    isVerified: true,
    verifiedAt: '2025-11-14T10:00:00Z',
    keycloakSub: 'fsp_sso_kc_908234_belov',
    achievements: [
      {
        id: 'ach-1',
        title: '1 место — Чемпионат России по спортивному программированию',
        year: 2024,
        badge: 'Золотая медаль ФСП',
        description: 'Решил 12 из 12 задач за 2 часа 45 минут в категории "Алгоритмическое программирование".',
        event: 'Всероссийский финал ФСП, Москва'
      },
      {
        id: 'ach-2',
        title: 'Кубок Федерации СП 2025 — Победитель трека HighLoad',
        year: 2025,
        badge: 'Кубок Чемпионов',
        description: 'Спроектировал распределенный брокер очередей с обработкой 420 000 RPS на Go и C++.',
        event: 'Кубок ФСП Сибирь & ДВ'
      }
    ],
    skills: ['Java 21', 'Spring Boot 3', 'Go', 'PostgreSQL', 'Kafka', 'Redis', 'Docker', 'Kubernetes', 'Dinic Algorithm', 'Distributed Systems'],
    experienceYears: 6,
    about: 'Мастер спорта РФ по спортивному программированию. Специализируюсь на отказоустойчивых высоконагруженных бэкендах, оптимизации задержек (low latency) и распределенных транзакциях.',
    githubUrl: 'https://github.com/alex-belov-fsp',
    fspProfileUrl: 'https://fsp-russia.com/athletes/0042',
    eloHistory: [
      { date: '2024-03', elo: 2150, event: 'Отборочный этап ФСП', change: 150 },
      { date: '2024-06', elo: 2340, event: 'Кубок Москвы по СП', change: 190 },
      { date: '2024-11', elo: 2580, event: 'Чемпионат России (1 место)', change: 240 },
      { date: '2025-04', elo: 2650, event: 'Всероссийская Лига ФСП', change: 70 },
      { date: '2026-03', elo: 2740, event: 'Judge0 LeetCode Hard Benchmark', change: 90 }
    ],
    leetcodeStats: {
      username: 'alex_belov_fsp',
      ranking: 14200,
      totalSolved: 742,
      totalQuestions: 3180,
      easySolved: 215,
      totalEasy: 830,
      mediumSolved: 385,
      totalMedium: 1710,
      hardSolved: 142,
      totalHard: 640,
      acceptanceRate: 76.4,
      contestRating: 2480,
      contestGlobalRanking: 340,
      contestTopPercentage: 0.8,
      badge: 'Guardian',
      syncedWithGithub: true,
      syncedGithubRepo: 'alex-belov-fsp/leetcode-fsp-solutions',
      lastSyncedAt: 'Сегодня, 14:20',
      recentSubmissions: [
        {
          id: 'sub-lc-1',
          title: 'Maximum Flow using Dinic Algorithm',
          titleSlug: 'dinic-max-flow',
          difficulty: 'Hard',
          language: 'C++',
          runtimeBeatsPercent: 99.2,
          memoryBeatsPercent: 94.6,
          status: 'Accepted',
          timestamp: '2 часа назад'
        },
        {
          id: 'sub-lc-2',
          title: 'LRU Cache Design & Concurrent Access',
          titleSlug: 'lru-cache',
          difficulty: 'Medium',
          language: 'Java 21',
          runtimeBeatsPercent: 98.1,
          memoryBeatsPercent: 96.0,
          status: 'Accepted',
          timestamp: 'Вчера'
        },
        {
          id: 'sub-lc-3',
          title: 'Trapping Rain Water II (3D Priority Queue)',
          titleSlug: 'trapping-rain-water-ii',
          difficulty: 'Hard',
          language: 'Go',
          runtimeBeatsPercent: 97.4,
          memoryBeatsPercent: 91.8,
          status: 'Accepted',
          timestamp: '3 дня назад'
        }
      ]
    },
    aiSummary: {
      summaryText: 'Сильный Backend-разработчик (Senior / Lead). Основной стек: Java 21, Spring Boot 3, Go, C++. По данным GitHub, активно развивает микросервисные архитектуры и алгоритмические библиотеки оптимизации потоков. Задачи уровня LeetCode Medium и Hard решает в среднем за 12 минут с чистотой кода 98/100. Имеет рейтинг ELO 2740 и официальный статус Мастера спорта РФ по спортивному программированию. Рекомендуется на ключевые Highload- и FinTech-проекты ядра.',
      keyStrengths: [
        'Мастер спорта РФ по СП (ELO 2740, Топ-0.5% по стране)',
        'Сверхбыстрое алгоритмическое мышление (avg 6.8ms в Judge0)',
        'Глубокая экспертиза в Spring Boot 3, Reactive Streams и Kafka',
        '1842 коммита и проверенное качество кода в GitHub'
      ],
      recommendedProjects: [
        'Highload ядра транзакций (100k+ RPS)',
        'Биржевые Matching Engines & Low-Latency трейдинг',
        'Распределенные хранилища данных и консенсус (Raft/Paxos)'
      ],
      codeCleanlinessScore: 98,
      averageSolveTimeMinutes: 12,
      modelUsed: 'YandexGPT Pro',
      generatedAt: '2026-03-12T14:30:00Z'
    },
    solvedTasksCount: 428,
    totalTasksAttempted: 432,
    testScorePercent: 99.4,
    avgExecutionTimeMs: 6.8,
    memoryEfficiencyScore: 98,
    lastTestingDate: '2026-03-12T14:30:00Z',
    canRetakeAfterDate: '2026-06-12T14:30:00Z',
    phoneMasked: '+7 (916) •••-••-42',
    phoneReal: '+7 (916) 459-33-42',
    telegramMasked: '@a••••••••v',
    telegramReal: '@alex_belov_dev',
    salaryExpectationMin: 420000,
    salaryExpectationMax: 550000,
    isLookingForJob: true,
    preferredFormat: 'remote'
  },
  {
    id: 'cand-2',
    email: 'daria.morozova@fsp-athlete.ru',
    fullName: 'Дарья Морозова',
    city: 'Санкт-Петербург',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    title: 'Middle+ / Senior Python & Data Engineer',
    specialization: 'backend',
    targetGrade: 'senior',
    currentGradeAssigned: 'senior',
    fspId: 'FSP-RU-2024-0198',
    fspRank: 'Кандидат в мастера спорта (КМС)',
    fspRating: 2490,
    fspBadges: [
      'КМС по СП',
      'Призер Кубка ФСП Северо-Запад',
      'Fast Graph Solver',
      'Keycloak Verified'
    ],
    isVerified: true,
    verifiedAt: '2025-12-01T09:15:00Z',
    keycloakSub: 'fsp_sso_kc_88124_morozova',
    achievements: [
      {
        id: 'ach-3',
        title: '2 место — Северо-Западный турнир ФСП',
        year: 2024,
        badge: 'Серебряный призер ФСП',
        description: 'Решение комплексных задач на динамическое программирование и графы потоков.',
        event: 'Кубок СЗФО ФСП, Санкт-Петербург'
      }
    ],
    skills: ['Python 3.12', 'FastAPI', 'AsyncIO', 'PostgreSQL', 'Redis', 'ClickHouse', 'Spark', 'Graph Neural Networks', 'Docker'],
    experienceYears: 4,
    about: 'КМС по спортивному программированию. Разрабатываю асинхронные бэкенды и пайплайны обработки данных. Люблю оптимизировать сложные алгоритмические узкие места.',
    githubUrl: 'https://github.com/daria-morozova',
    leetcodeStats: {
      username: 'daria_morozova',
      ranking: 28400,
      totalSolved: 584,
      totalQuestions: 3180,
      easySolved: 190,
      totalEasy: 830,
      mediumSolved: 284,
      totalMedium: 1710,
      hardSolved: 110,
      totalHard: 640,
      acceptanceRate: 74.2,
      contestRating: 2190,
      contestGlobalRanking: 1120,
      contestTopPercentage: 2.1,
      badge: 'Knight',
      syncedWithGithub: true,
      syncedGithubRepo: 'daria-morozova/leetcode-python-solutions',
      lastSyncedAt: 'Вчера, 19:30',
      recentSubmissions: [
        {
          id: 'sub-lc-d1',
          title: 'Course Schedule II (Topological Sort)',
          titleSlug: 'course-schedule-ii',
          difficulty: 'Medium',
          language: 'Python 3',
          runtimeBeatsPercent: 96.5,
          memoryBeatsPercent: 93.2,
          status: 'Accepted',
          timestamp: 'Вчера'
        },
        {
          id: 'sub-lc-d2',
          title: 'Longest Consecutive Sequence (Disjoint Set)',
          titleSlug: 'longest-consecutive-sequence',
          difficulty: 'Medium',
          language: 'Python 3',
          runtimeBeatsPercent: 98.0,
          memoryBeatsPercent: 91.4,
          status: 'Accepted',
          timestamp: '3 дня назад'
        }
      ]
    },
    aiSummary: {
      summaryText: 'Ведущий инженер данных и системный Python-разработчик (Senior). Кандидат в мастера спорта по СП (ELO 2490). Специализируется на высокопроизводительных асинхронных бэкендах (FastAPI, AsyncIO, ClickHouse) и алгоритмической оптимизации сложных графовых структур. Решила 584 задачи на LeetCode. Рекомендуется на архитектурные роли в области Big Data, Analytics и Highload пайплайнов.',
      keyStrengths: [
        'КМС по спортивному программированию (ELO 2490)',
        'Глубокая экспертиза в AsyncIO, ClickHouse и Spark',
        '584 решенные задачи на LeetCode (статус Knight)',
        'Высокая математическая культура (МГУ ВМК)'
      ],
      recommendedProjects: [
        'Real-time аналитические платформы',
        'Highload ETL/ELT конвейеры потоковых данных',
        'Графовые алгоритмы и рекомендательные системы'
      ],
      codeCleanlinessScore: 97,
      averageSolveTimeMinutes: 14,
      modelUsed: 'YandexGPT Pro',
      generatedAt: '2026-03-10T12:00:00Z'
    },
    solvedTasksCount: 312,
    totalTasksAttempted: 320,
    testScorePercent: 96.8,
    avgExecutionTimeMs: 11.2,
    memoryEfficiencyScore: 94,
    lastTestingDate: '2026-02-18T11:00:00Z',
    canRetakeAfterDate: '2026-05-18T11:00:00Z',
    phoneMasked: '+7 (921) •••-••-88',
    phoneReal: '+7 (921) 784-21-88',
    telegramMasked: '@d••••••••a',
    telegramReal: '@daria_morozova_code',
    salaryExpectationMin: 320000,
    salaryExpectationMax: 430000,
    isLookingForJob: true,
    preferredFormat: 'hybrid'
  },
  {
    id: 'cand-3',
    email: 'mikhail.sokolov@tech-fsp.org',
    fullName: 'Михаил Соколов',
    city: 'Новосибирск',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    title: 'Middle Fullstack / Frontend React & Go Developer',
    specialization: 'fullstack',
    targetGrade: 'middle',
    currentGradeAssigned: 'middle',
    fspId: 'FSP-RU-2025-0551',
    fspRank: '1-й спортивный разряд',
    fspRating: 2180,
    fspBadges: [
      '1-й разряд ФСП',
      'React Architecture Expert',
      'Clean Code 100%',
      'Keycloak Verified'
    ],
    isVerified: true,
    verifiedAt: '2026-01-10T16:20:00Z',
    keycloakSub: 'fsp_sso_kc_55190_sokolov',
    achievements: [
      {
        id: 'ach-4',
        title: '3 место — Студенческий кубок ФСП Сибирь',
        year: 2025,
        badge: 'Бронза ФСП',
        description: 'Призовое место в командном соревновании по скоростному решению задач.',
        event: 'НГУ & ФСП Академия'
      }
    ],
    skills: ['TypeScript', 'React 19', 'Next.js', 'Go', 'Tailwind CSS', 'PostgreSQL', 'Zustand', 'REST & GraphQL'],
    experienceYears: 3,
    about: '1-й спортивный разряд по спортивному программированию. Разрабатываю производительные веб-приложения с мгновенным откликом UI и чистым кодом.',
    githubUrl: 'https://github.com/misha-sokolov-dev',
    leetcodeStats: {
      username: 'misha_sokolov',
      ranking: 54100,
      totalSolved: 395,
      totalQuestions: 3180,
      easySolved: 165,
      totalEasy: 830,
      mediumSolved: 190,
      totalMedium: 1710,
      hardSolved: 40,
      totalHard: 640,
      acceptanceRate: 72.8,
      contestRating: 1940,
      contestGlobalRanking: 3200,
      contestTopPercentage: 5.4,
      badge: 'Knight',
      syncedWithGithub: true,
      syncedGithubRepo: 'misha-sokolov-dev/algo-leetcode',
      lastSyncedAt: '3 дня назад',
      recentSubmissions: [
        {
          id: 'sub-lc-m1',
          title: 'Implement Trie (Prefix Tree)',
          titleSlug: 'implement-trie-prefix-tree',
          difficulty: 'Medium',
          language: 'TypeScript',
          runtimeBeatsPercent: 95.2,
          memoryBeatsPercent: 92.1,
          status: 'Accepted',
          timestamp: '3 дня назад'
        }
      ]
    },
    aiSummary: {
      summaryText: 'Продуктивный Middle+ Fullstack разработчик (React 19, TypeScript, Go). Обладатель 1-го спортивного разряда ФСП (ELO 2180). Отличается умением быстро создавать интуитивные, адаптивные интерфейсы с чистой компонентной архитектурой и связывать их с микросервисами на Go. Решил 395 задач на LeetCode. Идеален для продуктовых команд.',
      keyStrengths: [
        '1-й разряд ФСП по СП (ELO 2180)',
        'Стек React 19, Next.js, Go, Zustand',
        '395 задач на LeetCode с упором на структуры данных',
        'TDD и строгие интерфейсные контракты'
      ],
      recommendedProjects: [
        'Интерактивные B2B SaaS веб-платформы',
        'Real-time дашборды и аналитические интерфейсы',
        'Микрофронтенды и дизайн-системы'
      ],
      codeCleanlinessScore: 96,
      averageSolveTimeMinutes: 16,
      modelUsed: 'YandexGPT Pro',
      generatedAt: '2026-03-08T10:00:00Z'
    },
    solvedTasksCount: 195,
    totalTasksAttempted: 210,
    testScorePercent: 92.0,
    avgExecutionTimeMs: 14.5,
    memoryEfficiencyScore: 90,
    lastTestingDate: '2026-02-01T12:00:00Z',
    canRetakeAfterDate: '2026-05-01T12:00:00Z',
    phoneMasked: '+7 (913) •••-••-19',
    phoneReal: '+7 (913) 902-14-19',
    telegramMasked: '@m•••••••v',
    telegramReal: '@misha_sokolov_nsk',
    salaryExpectationMin: 220000,
    salaryExpectationMax: 300000,
    isLookingForJob: true,
    preferredFormat: 'remote'
  },
  {
    id: 'cand-4',
    email: 'ekaterina.orlova@devops-fsp.ru',
    fullName: 'Екатерина Орлова',
    city: 'Казань',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    title: 'Senior DevOps & Platform Engineer / Infrastructure Lead',
    specialization: 'devops',
    targetGrade: 'senior',
    currentGradeAssigned: 'senior',
    fspId: 'FSP-RU-2023-0112',
    fspRank: 'Кандидат в мастера спорта (КМС)',
    fspRating: 2560,
    fspBadges: [
      'КМС по СП',
      'Kubernetes Master',
      'Zero-Downtime Architect',
      'Keycloak Verified'
    ],
    isVerified: true,
    verifiedAt: '2025-10-05T14:00:00Z',
    keycloakSub: 'fsp_sso_kc_11204_orlova',
    achievements: [
      {
        id: 'ach-5',
        title: 'Финалист Кубка России ФСП',
        year: 2024,
        badge: 'Топ-5 РФ',
        description: 'Выход в суперфинал чемпионата России в категории системной алгоритмики.',
        event: 'Иннополис ФСП Гранд Финал'
      }
    ],
    skills: ['Kubernetes', 'Terraform', 'Go', 'Python', 'CI/CD', 'Helm', 'Prometheus/Grafana', 'Kafka', 'PostgreSQL HA'],
    experienceYears: 7,
    about: 'КМС ФСП. Строю отказоустойчивые Cloud-Native платформы с автоматическим масштабированием и мониторингом.',
    githubUrl: 'https://github.com/ekaterina-orlova-ops',
    leetcodeStats: {
      username: 'kate_orlova_cloud',
      ranking: 36200,
      totalSolved: 482,
      totalQuestions: 3180,
      easySolved: 152,
      totalEasy: 830,
      mediumSolved: 230,
      totalMedium: 1710,
      hardSolved: 100,
      totalHard: 640,
      acceptanceRate: 75.1,
      contestRating: 2210,
      contestGlobalRanking: 980,
      contestTopPercentage: 1.8,
      badge: 'Knight',
      syncedWithGithub: true,
      syncedGithubRepo: 'ekaterina-orlova-ops/k8s-leetcode-sync',
      lastSyncedAt: 'Позавчера, 22:15',
      recentSubmissions: [
        {
          id: 'sub-lc-k1',
          title: 'Design In-Memory File System',
          titleSlug: 'design-in-memory-file-system',
          difficulty: 'Hard',
          language: 'Go',
          runtimeBeatsPercent: 98.4,
          memoryBeatsPercent: 95.3,
          status: 'Accepted',
          timestamp: 'Позавчера'
        }
      ]
    },
    aiSummary: {
      summaryText: 'Опытный Platform & DevOps инженер (Senior / Lead). КМС по спортивному программированию (ELO 2560). Обладает редким сочетанием системного алгоритмического мышления и глубоких практических навыков оркестрации Kubernetes, Terraform и Linux. Решила 482 задачи на LeetCode (Hard: 100). Рекомендуется на позиции Tech Lead инфраструктуры и Platform Engineering.',
      keyStrengths: [
        'КМС по СП (ELO 2560, Топ-2% РФ)',
        'Экспертиза в Kubernetes, Bare Metal, Terraform, Go',
        '482 решенные задачи на LeetCode (Hard: 100)',
        'Культура Zero-Downtime и высокая надежность (99.99%)'
      ],
      recommendedProjects: [
        'Инфраструктурные платформы приватных облаков',
        'Автоматизация CI/CD и безопасная поставка ПО',
        'SRE и отказоустойчивость распределенных СУБД'
      ],
      codeCleanlinessScore: 98,
      averageSolveTimeMinutes: 13,
      modelUsed: 'YandexGPT Pro',
      generatedAt: '2026-03-05T15:00:00Z'
    },
    solvedTasksCount: 360,
    totalTasksAttempted: 375,
    testScorePercent: 98.1,
    avgExecutionTimeMs: 8.5,
    memoryEfficiencyScore: 97,
    lastTestingDate: '2026-01-20T10:00:00Z',
    canRetakeAfterDate: '2026-04-20T10:00:00Z',
    phoneMasked: '+7 (987) •••-••-77',
    phoneReal: '+7 (987) 211-99-77',
    telegramMasked: '@e•••••••a',
    telegramReal: '@kate_orlova_cloud',
    salaryExpectationMin: 400000,
    salaryExpectationMax: 520000,
    isLookingForJob: true,
    preferredFormat: 'remote'
  },
  {
    id: 'cand-5',
    email: 'artyom.grigoriev@fsp-junior.ru',
    fullName: 'Артём Григорьев',
    city: 'Екатеринбург',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    title: 'Junior+ Backend Developer (Java / Go)',
    specialization: 'backend',
    targetGrade: 'junior',
    currentGradeAssigned: 'junior',
    fspId: 'FSP-RU-2025-0899',
    fspRank: 'Участник Высшей Лиги ФСП',
    fspRating: 1850,
    fspBadges: [
      'Участник ФСП Лиги',
      'Fast Learner',
      'Clean Code',
      'Keycloak Verified'
    ],
    isVerified: true,
    verifiedAt: '2026-02-15T18:00:00Z',
    keycloakSub: 'fsp_sso_kc_89921_grigoriev',
    achievements: [
      {
        id: 'ach-6',
        title: 'Победитель олимпиады ФСП УрФО среди юниоров',
        year: 2025,
        badge: 'Юниор-Чемпион',
        description: '100% результат на алгоритмическом отборе.',
        event: 'Екатеринбург ФСП Хаб'
      }
    ],
    skills: ['Java 21', 'Spring Boot', 'PostgreSQL', 'Docker', 'Git', 'Data Structures & Algorithms', 'JUnit 5'],
    experienceYears: 1.5,
    about: 'Увлечен спортивным программированием и бэкенд разработкой на Java. Ищу команду с сильным менторством и интересными задачами.',
    githubUrl: 'https://github.com/artyom-grigoriev',
    leetcodeStats: {
      username: 'artyom_dev_ekb',
      ranking: 92400,
      totalSolved: 218,
      totalQuestions: 3180,
      easySolved: 124,
      totalEasy: 830,
      mediumSolved: 84,
      totalMedium: 1710,
      hardSolved: 10,
      totalHard: 640,
      acceptanceRate: 69.4,
      contestRating: 1720,
      syncedWithGithub: true,
      syncedGithubRepo: 'artyom-grigoriev/leetcode-java',
      lastSyncedAt: 'Вчера, 16:40',
      recentSubmissions: [
        {
          id: 'sub-lc-a1',
          title: 'Binary Tree Level Order Traversal',
          titleSlug: 'binary-tree-level-order-traversal',
          difficulty: 'Medium',
          language: 'Java',
          runtimeBeatsPercent: 93.1,
          memoryBeatsPercent: 88.4,
          status: 'Accepted',
          timestamp: 'Вчера'
        }
      ]
    },
    aiSummary: {
      summaryText: 'Перспективный Junior+ бэкенд разработчик на Java 21 и Spring Boot. Участник Высшей Лиги ФСП (ELO 1850). Демонстрирует отличную фундаментальную математическую подготовку, аккуратный стиль кода и высокую обучаемость. Решил 218 задач на LeetCode. Рекомендуется в команду с выстроенными процессами code review и менторством.',
      keyStrengths: [
        'Участник Высшей Лиги ФСП (ELO 1850)',
        'Java 21, Spring Boot, PostgreSQL, JUnit 5',
        '218 задач на LeetCode с глубоким разбором асимптотики',
        'Высокая мотивация и быстрая обучаемость'
      ],
      recommendedProjects: [
        'Разработка REST API микросервисов',
        'Интеграционные шлюзы и автоматизация процессов',
        'Юнит- и интеграционное тестирование'
      ],
      codeCleanlinessScore: 94,
      averageSolveTimeMinutes: 19,
      modelUsed: 'YandexGPT Pro',
      generatedAt: '2026-03-01T14:00:00Z'
    },
    solvedTasksCount: 142,
    totalTasksAttempted: 160,
    testScorePercent: 88.5,
    avgExecutionTimeMs: 18.2,
    memoryEfficiencyScore: 89,
    lastTestingDate: '2026-02-28T16:00:00Z',
    canRetakeAfterDate: '2026-05-28T16:00:00Z',
    phoneMasked: '+7 (999) •••-••-03',
    phoneReal: '+7 (999) 554-12-03',
    telegramMasked: '@a••••••••v',
    telegramReal: '@artyom_dev_ekb',
    salaryExpectationMin: 140000,
    salaryExpectationMax: 200000,
    isLookingForJob: true,
    preferredFormat: 'remote'
  }
];

export const INITIAL_EMPLOYERS: EmployerProfile[] = [
  {
    id: 'emp-1',
    companyName: 'СберТех & СберБанк',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
    verifiedCompany: true,
    industry: 'Финтех / Высоконагруженные платформы',
    city: 'Москва',
    description: 'Разрабатываем ядро цифровой экосистемы, платежные платформы и распределенные сервисы с обработкой сотен тысяч RPS.',
    hrName: 'Елена Васильева (Lead Tech Recruiter)',
    hrEmail: 'e.vasilieva@sbertech.ru',
    hrPhone: '+7 (495) 777-55-22',
    website: 'https://sbertech.ru',
    fspPartnerLevel: 'Генеральный партнер'
  },
  {
    id: 'emp-2',
    companyName: 'VK Tech',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
    verifiedCompany: true,
    industry: 'Социальные сети & Облачные сервисы',
    city: 'Санкт-Петербург / Москва',
    description: 'VK Tech строит высоконагруженные облака, мессенджеры и медиа-сервисы для десятков миллионов пользователей.',
    hrName: 'Максим Кузнецов (Head of Engineering Hiring)',
    hrEmail: 'm.kuznetsov@vk.team',
    hrPhone: '+7 (812) 449-00-11',
    website: 'https://vk.company',
    fspPartnerLevel: 'Стратегический партнер'
  },
  {
    id: 'emp-3',
    companyName: 'Positive Technologies',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
    verifiedCompany: true,
    industry: 'Кибербезопасность & Защита инфраструктуры',
    city: 'Москва',
    description: 'Лидер в сфере результативной кибербезопасности. Создаем продукты нового поколения для защиты критической инфраструктуры.',
    hrName: 'Анна Романова (Senior HR BP)',
    hrEmail: 'a.romanova@ptsecurity.com',
    hrPhone: '+7 (495) 514-00-30',
    website: 'https://ptsecurity.com',
    fspPartnerLevel: 'Генеральный партнер'
  },
  {
    id: 'emp-4',
    companyName: 'Ozon Tech',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
    verifiedCompany: true,
    industry: 'E-commerce & Логистический финтех',
    city: 'Москва',
    description: 'Один из крупнейших e-commerce в РФ. 2000+ микросервисов на Go, C++ и Java, микросекундные задержки.',
    hrName: 'Дмитрий Волков (Tech Recruiter Lead)',
    hrEmail: 'd.volkov@ozon.ru',
    hrPhone: '+7 (495) 232-10-00',
    website: 'https://ozon.tech',
    fspPartnerLevel: 'Стратегический партнер'
  }
];

export const INITIAL_VACANCIES: Vacancy[] = [
  {
    id: 'vac-1',
    employerId: 'emp-1',
    companyName: 'СберТех & СберБанк',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
    title: 'Lead / Senior Java Architect (HighLoad Core Platform)',
    specialization: 'backend',
    gradeRequired: 'senior',
    salaryMin: 450000,
    salaryMax: 600000,
    location: 'Москва / Удаленно по РФ',
    workFormat: 'удаленно',
    techStack: ['Java 21', 'Spring Boot 3', 'Kafka', 'PostgreSQL', 'Distributed Systems', 'Redis', 'Docker'],
    description: 'Ищем опытного архитектора и ведущего разработчика в ядро высоконагруженной платформы транзакционного процессинга. Обязателен глубокий опыт в алгоритмах и распределенных структурах данных.',
    perks: ['Годовой бонус до 35%', 'ДМС со стоматологией и страхованием семьи', 'Компенсация техники до 250 000 ₽', 'Участие в конференциях спикером'],
    fspBonusPreference: 'Приоритет кандидатам с рейтингом ФСП 2400+ (разряд КМС / МС)',
    minFspRatingRequired: 2300,
    createdAt: '2026-03-01T10:00:00Z',
    active: true,
    invitationsCount: 4
  },
  {
    id: 'vac-2',
    employerId: 'emp-2',
    companyName: 'VK Tech',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
    title: 'Senior Go / Python Developer (Distributed Cloud Storage)',
    specialization: 'backend',
    gradeRequired: 'senior',
    salaryMin: 380000,
    salaryMax: 500000,
    location: 'Санкт-Петербург / Москва / Удаленно',
    workFormat: 'удаленно',
    techStack: ['Go', 'Python 3.12', 'AsyncIO', 'PostgreSQL', 'ClickHouse', 'Kubernetes', 'Dinic/Graph Algorithms'],
    description: 'Команда облачной инфраструктуры VK Tech разрабатывает распределенное объектное хранилище и SDN сети. Требуется уверенное владение алгоритмами оптимизации трафика и графами.',
    perks: ['Гибкий график', 'Оплата фитнеса и английского', 'Новейший MacBook Pro M3 Max', 'ДМС в лучших клиниках'],
    fspBonusPreference: 'Победители олимпиад и хакатонов ФСП приглашаются сразу на финальный технический оффер-раунд',
    minFspRatingRequired: 2200,
    createdAt: '2026-03-04T12:00:00Z',
    active: true,
    invitationsCount: 6
  },
  {
    id: 'vac-3',
    employerId: 'emp-3',
    companyName: 'Positive Technologies',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
    title: 'Senior DevOps / Site Reliability Engineer',
    specialization: 'devops',
    gradeRequired: 'senior',
    salaryMin: 420000,
    salaryMax: 540000,
    location: 'Москва / Удаленно',
    workFormat: 'удаленно',
    techStack: ['Kubernetes', 'Terraform', 'Go', 'Prometheus', 'Helm', 'CI/CD Security', 'PostgreSQL HA'],
    description: 'Развитие защищенной облачной платформы и автоматизация пайплайнов поставки security-продуктов.',
    perks: ['Программа опционов компании', 'Премии за регистрацию патентов и уязвимостей', 'ДМС со стоматологией'],
    fspBonusPreference: 'Приветствуется участие в треке кибербезопасности и алгоритмических соревнованиях ФСП',
    minFspRatingRequired: 2100,
    createdAt: '2026-03-05T15:00:00Z',
    active: true,
    invitationsCount: 3
  },
  {
    id: 'vac-4',
    employerId: 'emp-4',
    companyName: 'Ozon Tech',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
    title: 'Middle+ Fullstack / Frontend Engineer (React & TypeScript)',
    specialization: 'fullstack',
    gradeRequired: 'middle',
    salaryMin: 260000,
    salaryMax: 350000,
    location: 'Москва / Гибрид / Удаленно',
    workFormat: 'удаленно',
    techStack: ['React 19', 'TypeScript', 'Next.js', 'Go', 'Tailwind CSS', 'GraphQL', 'Zustand'],
    description: 'Разработка интерфейсов личного кабинета продавцов Ozon с 500k+ активных пользователей ежедневно.',
    perks: ['Скидки на Ozon', 'ДМС', 'Обучение в корпоративном университете'],
    fspBonusPreference: 'Бонус +50 000 ₽ к окладу для кандидатов со спортивным разрядом ФСП',
    minFspRatingRequired: 1900,
    createdAt: '2026-03-06T09:00:00Z',
    active: true,
    invitationsCount: 5
  }
];

export const INITIAL_INVITATIONS: Invitation[] = [
  {
    id: 'inv-1',
    vacancyId: 'vac-1',
    vacancyTitle: 'Lead / Senior Java Architect (HighLoad Core Platform)',
    employerId: 'emp-1',
    companyName: 'СберТех & СберБанк',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
    candidateId: 'cand-1',
    candidateName: 'Александр Белов',
    proposedSalary: 520000,
    salaryMin: 450000,
    salaryMax: 600000,
    message: 'Здравствуйте, Александр! Мы впечатлены вашим 1 местом на Чемпионате России по СП и мастерским решением алгоритма LRU O(1) за 6.8мс. Хотим предложить позицию ведущего архитектора HighLoad ядра с окладом 520 000 ₽ на руки.',
    projectDetails: 'Проект высоконагруженного шлюза межбанковских расчетов нового поколения (Java 21, Virtual Threads, Distributed consensus).',
    perksOffered: ['Годовой бонус до 35%', 'ДМС со стоматологией', 'Техника 250к'],
    status: 'accepted',
    sentAt: '2026-03-10T11:00:00Z',
    respondedAt: '2026-03-10T14:20:00Z',
    contactsRevealed: true,
    chatMessages: [
      {
        id: 'msg-1',
        sender: 'employer',
        text: 'Здравствуйте, Александр! Предлагаем позицию Lead Java Architect с окладом 520 000 ₽. Готовы организовать финальную встречу с вице-президентом по технологиям.',
        timestamp: '2026-03-10T11:00:00Z'
      },
      {
        id: 'msg-2',
        sender: 'candidate',
        text: 'Добрый день, Елена! Спасибо за предложение. Условия и стек (Java 21 + Virtual Threads) мне очень интересны. Принимаю приглашение и открываю свои контакты.',
        timestamp: '2026-03-10T14:20:00Z'
      },
      {
        id: 'msg-3',
        sender: 'employer',
        text: 'Отлично! Ваши контакты подтверждены по 152-ФЗ. Написала вам в Telegram @alex_belov_dev для согласования удобного слота в Zoom.',
        timestamp: '2026-03-10T14:25:00Z'
      }
    ]
  },
  {
    id: 'inv-2',
    vacancyId: 'vac-2',
    vacancyTitle: 'Senior Go / Python Developer (Distributed Cloud Storage)',
    employerId: 'emp-2',
    companyName: 'VK Tech',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
    candidateId: 'cand-1',
    candidateName: 'Александр Белов',
    proposedSalary: 480000,
    salaryMin: 380000,
    salaryMax: 500000,
    message: 'Приветствуем, Александр! Обратили внимание на ваш профиль в ФСП Арене. В VK Tech открыта позиция в облачном хранилище. Предлагаем 480 000 ₽ + опционы VK.',
    projectDetails: 'Распределенный масштабируемый сервис репликации медиа-контента для VK Видео и VK Мессенджера.',
    perksOffered: ['MacBook M3 Max', 'ДМС', 'Опционы'],
    status: 'viewed',
    sentAt: '2026-03-11T09:30:00Z',
    contactsRevealed: false,
    chatMessages: [
      {
        id: 'msg-vk-1',
        sender: 'employer',
        text: 'Александр, добрый день! Рады пригласить вас в команду Cloud VK. Предлагаем вилку 480 000 ₽.',
        timestamp: '2026-03-11T09:30:00Z'
      }
    ]
  },
  {
    id: 'inv-3',
    vacancyId: 'vac-2',
    vacancyTitle: 'Senior Go / Python Developer (Distributed Cloud Storage)',
    employerId: 'emp-2',
    companyName: 'VK Tech',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
    candidateId: 'cand-2',
    candidateName: 'Дарья Морозова',
    proposedSalary: 410000,
    salaryMin: 380000,
    salaryMax: 500000,
    message: 'Дарья, добрый день! Мы ищем сильного инженера с опытом в алгоритмах графов и асинхронном Python/Go. Ваш результат на кубке ФСП впечатляет. Предлагаем 410 000 ₽.',
    projectDetails: 'Оптимизация сетевых потоков и балансировка нагрузки между дата-центрами VK.',
    perksOffered: ['Гибкий график', 'Фитнес', 'ДМС'],
    status: 'sent',
    sentAt: '2026-03-12T10:00:00Z',
    contactsRevealed: false,
    chatMessages: [
      {
        id: 'msg-vk-daria',
        sender: 'employer',
        text: 'Здравствуйте, Дарья! Приглашаем вас на позицию Senior Python/Go разработчика в команду VK Tech.',
        timestamp: '2026-03-12T10:00:00Z'
      }
    ]
  }
];
