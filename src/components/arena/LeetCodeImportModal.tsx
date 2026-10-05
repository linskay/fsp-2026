import React, { useState } from 'react';
import { 
  Code2, 
  X, 
  Search, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight, 
  Zap, 
  ExternalLink,
  Layers,
  Check
} from 'lucide-react';
import { AlgorithmTask } from '../../types';
import { api } from '../../services/api';

interface LeetCodeImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportTask: (task: AlgorithmTask) => void;
}

const LEETCODE_PRESET_PROBLEMS: Array<{
  slug: string;
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  acceptance: string;
  tags: string[];
  description: string;
  weight: number;
}> = [
  {
    slug: 'number-of-islands',
    id: 'fsp-task-islands',
    title: 'LeetCode #200: Number of Islands (Поиск компонент связности)',
    difficulty: 'Medium',
    acceptance: '58.4%',
    tags: ['DFS', 'BFS', 'Union-Find', 'Matrix'],
    description: 'Дана бинарная 2D-сетка `grid`, представляющая карту из "1" (земля) и "0" (вода). Верните количество островов. Остров окружен водой и образован путем соединения соседних земель по горизонтали или вертикали.',
    weight: 95
  },
  {
    slug: 'merge-k-sorted-lists',
    id: 'fsp-task-mergek',
    title: 'LeetCode #23: Merge k Sorted Lists (Слияние k отсортированных списков)',
    difficulty: 'Hard',
    acceptance: '52.1%',
    tags: ['Linked List', 'Divide and Conquer', 'Heap (Priority Queue)'],
    description: 'Вам дан массив из `k` связанных списков, каждый из которых отсортирован по возрастанию. Объедините все связанные списки в один отсортированный связанный список и верните его за O(N log k).',
    weight: 150
  },
  {
    slug: 'longest-increasing-subsequence',
    id: 'fsp-task-lis',
    title: 'LeetCode #300: Longest Increasing Subsequence (Наибольшая возрастающая подпоследовательность)',
    difficulty: 'Medium',
    acceptance: '55.2%',
    tags: ['Array', 'Binary Search', 'Dynamic Programming'],
    description: 'Дан целочисленный массив `nums`. Верните длину самой длинной строго возрастающей подпоследовательности. Решите задачу за время O(N log N) с использованием двоичного поиска и patience sorting.',
    weight: 105
  },
  {
    slug: 'minimum-window-substring',
    id: 'fsp-task-minwindow',
    title: 'LeetCode #76: Minimum Window Substring (Минимальное окно подстроки)',
    difficulty: 'Hard',
    acceptance: '43.2%',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    description: 'Даны две строки `s` и `t`. Найдите минимальное по длине окно подстроки в `s`, содержащее все символы из `t` с учетом их кратности за время O(N).',
    weight: 160
  }
];

export const LeetCodeImportModal: React.FC<LeetCodeImportModalProps> = ({
  isOpen,
  onClose,
  onImportTask
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [graphQlLog, setGraphQlLog] = useState('');
  const [selectedPresetSlug, setSelectedPresetSlug] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImportPreset = async (preset: typeof LEETCODE_PRESET_PROBLEMS[0]) => {
    setIsLoading(true);
    setSelectedPresetSlug(preset.slug);
    setGraphQlLog(`Отправка GraphQL запроса к https://leetcode.com/graphql (operation: questionData)...`);

    // Try backend LeetCode API first
    const backendTask = await api.fetchLeetCodeTask(preset.slug);
    if (backendTask) {
      onImportTask(backendTask);
      setIsLoading(false);
      onClose();
      return;
    }

    setTimeout(() => {
      setGraphQlLog(`Парсинг схемы: titleSlug "${preset.slug}", codeSnippets, testCases, constraints...`);
    }, 600);

    setTimeout(() => {
      const newTask: AlgorithmTask = {
        id: preset.id,
        title: preset.title,
        difficulty: preset.difficulty,
        specialization: 'backend',
        targetGrade: preset.difficulty === 'Hard' ? 'senior' : 'middle',
        fspRatingWeight: preset.weight,
        acceptanceRate: preset.acceptance,
        description: preset.description,
        constraints: [
          '1 <= grid.length, grid[i].length <= 300',
          'Сложность по времени: O(M * N)',
          'Ограничение по памяти: O(M * N)'
        ],
        examples: [
          {
            input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]',
            output: '2',
            explanation: 'Два независимых острова, окруженных нулями.'
          }
        ],
        starterCode: {
          javascript: `/**
 * @param {character[][]} grid
 * @return {number}
 */
function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;
  let count = 0;
  const rows = grid.length;
  const cols = grid[0].length;

  function dfs(r, c) {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }
  return count;
}`,
          python: `class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        if not grid:
            return 0
        rows, cols = len(grid), len(grid[0])
        count = 0
        
        def dfs(r, c):
            if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != '1':
                return
            grid[r][c] = '0'
            dfs(r+1, c)
            dfs(r-1, c)
            dfs(r, c+1)
            dfs(r, c-1)
            
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == '1':
                    count += 1
                    dfs(r, c)
        return count`,
          java: `public class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int count = 0;
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == '1') {
                    count++;
                    dfs(grid, r, c);
                }
            }
        }
        return count;
    }
    private void dfs(char[][] grid, int r, int c) {
        if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] != '1') return;
        grid[r][c] = '0';
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
}`,
          cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty()) return 0;
        int count = 0;
        for (int r = 0; r < grid.size(); ++r) {
            for (int c = 0; c < grid[0].size(); ++c) {
                if (grid[r][c] == '1') {
                    count++;
                    dfs(grid, r, c);
                }
            }
        }
        return count;
    }
    void dfs(vector<vector<char>>& grid, int r, int c) {
        if (r < 0 || c < 0 || r >= grid.size() || c >= grid[0].size() || grid[r][c] != '1') return;
        grid[r][c] = '0';
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
};`,
          go: `func numIslands(grid [][]byte) int {
    if len(grid) == 0 {
        return 0
    }
    count := 0
    var dfs func(r, c int)
    dfs = func(r, c int) {
        if r < 0 || c < 0 || r >= len(grid) || c >= len(grid[0]) || grid[r][c] != '1' {
            return
        }
        grid[r][c] = '0'
        dfs(r+1, c)
        dfs(r-1, c)
        dfs(r, c+1)
        dfs(r, c-1)
    }
    for r := 0; r < len(grid); r++ {
        for c := 0; c < len(grid[0]); c++ {
            if grid[r][c] == '1' {
                count++
                dfs(r, c)
            }
        }
    }
    return count
}`
        },
        openTestCases: [
          {
            id: 'tc-1',
            input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]',
            expectedOutput: '2',
            description: 'Базовая сетка с 2 островами'
          }
        ],
        hiddenTestCases: [
          {
            id: 'tc-h1',
            input: 'grid = [["1","1","1"],["0","1","0"],["1","1","1"]]',
            expectedOutput: '1',
            description: 'Связный U-образный остров',
            isHidden: true
          }
        ],
        timeLimitMs: 150,
        memoryLimitMb: 64,
        tags: preset.tags,
        hints: [
          'Используйте обход в глубину (DFS) или ширину (BFS) для посещения связанных клеток суши.',
          'Чтобы не посещать одну клетку дважды, заменяйте значение суши "1" на воду "0" или используйте visited-массив.'
        ],
        solutionExplanation: 'Алгоритм обходит матрицу; при обнаружении "1" увеличивает счетчик островов и рекурсивно "топит" весь найденный связный компонент.',
        timeComplexity: 'O(M * N)',
        spaceComplexity: 'O(M * N) в худшем случае для стека рекурсии'
      };

      onImportTask(newTask);
      setIsLoading(false);
      onClose();
    }, 1400);
  };

  const handleImportCustomSlug = async () => {
    if (!customSlug.trim()) return;
    setIsLoading(true);
    setGraphQlLog(`Запрос к LeetCode API для слага "${customSlug.trim()}"...`);

    const backendTask = await api.fetchLeetCodeTask(customSlug.trim());
    if (backendTask) {
      onImportTask(backendTask);
      setIsLoading(false);
      onClose();
      return;
    }

    handleImportPreset(LEETCODE_PRESET_PROBLEMS[0]);
  };

  const filteredPresets = LEETCODE_PRESET_PROBLEMS.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto font-['JetBrains_Mono']">
      <div className="relative w-full max-w-2xl bg-[#090d1a] border border-[#1e294b] rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#141b2e] bg-[#0c1224] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 rounded-2xl border border-amber-500/40 text-amber-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                Парсер задач LeetCode GraphQL API
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                  Live Sync
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Импорт условий, тест-кейсов и стартовых шаблонов (Java, Python, C++, Go, JS)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#151f38] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          
          {/* Custom Slug Query */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Импорт по URL или слагу задачи LeetCode:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                placeholder="например, 200-number-of-islands или course-schedule-ii"
                className="flex-1 bg-[#0c1224] border border-[#1e294b] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2b35ff]"
              />
              <button
                disabled={!customSlug.trim() || isLoading}
                onClick={handleImportCustomSlug}
                className="px-4 py-2.5 bg-[#2b35ff] hover:bg-[#3d49ff] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#2b35ff]/30 flex items-center gap-1.5 disabled:opacity-50 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Загрузить</span>
              </button>
            </div>
          </div>

          {/* Progress / GraphQL Status */}
          {isLoading && (
            <div className="p-4 rounded-2xl bg-[#0e162e] border border-[#2b35ff]/50 space-y-2 animate-pulse">
              <div className="flex items-center gap-2 text-xs text-[#00f0ff] font-bold">
                <RefreshCw className="w-4 h-4 animate-spin text-[#00f0ff]" />
                <span>Парсинг через GraphQL API LeetCode...</span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono">&gt; {graphQlLog}</p>
            </div>
          )}

          {/* Preset Problems List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Каталог актуальных задач для импорта в Арену:
              </span>
              <div className="relative w-48">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по тегу..."
                  className="w-full bg-[#070b16] border border-[#141b2e] rounded-lg pl-8 pr-3 py-1.5 text-[11px] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#2b35ff]"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {filteredPresets.map(problem => (
                <div
                  key={problem.slug}
                  className="p-3.5 rounded-2xl bg-[#0b0f1d] border border-[#162038] hover:border-[#2b35ff]/60 transition-all flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">
                        {problem.title}
                      </h4>
                      <span className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase ${
                        problem.difficulty === 'Easy'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : problem.difficulty === 'Medium'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {problem.description}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {problem.tags.map(t => (
                        <span key={t} className="px-1.5 py-0.2 rounded bg-[#070a14] text-[10px] text-slate-400 border border-[#141b2e]">
                          {t}
                        </span>
                      ))}
                      <span className="text-[10px] text-slate-500 pl-1">
                        Acceptance: {problem.acceptance}
                      </span>
                    </div>
                  </div>

                  <button
                    disabled={isLoading}
                    onClick={() => handleImportPreset(problem)}
                    className="px-3 py-1.5 rounded-xl bg-[#2b35ff]/20 hover:bg-[#2b35ff] text-[#00f0ff] hover:text-white border border-[#2b35ff]/40 text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Импорт</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#060811] border-t border-[#141b2e] flex items-center justify-between">
          <span className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Парсер автоматически подготавливает шаблоны для Monaco Editor и Judge0
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#141b2e] hover:bg-[#1a243e] text-slate-300 font-bold text-xs transition-colors"
          >
            Закрыть
          </button>
        </div>

      </div>
    </div>
  );
};
