-- V2__seed_data.sql: Seed initial FSP data, athletes, employers, and LeetCode algorithmic tasks

-- Insert Algorithmic Tasks
INSERT INTO algorithm_tasks (
    id, title, slug, difficulty, tags, description, input_format, output_format, time_limit_ms, memory_limit_mb,
    initial_code_java, initial_code_python, initial_code_cpp, initial_code_go, initial_code_js
) VALUES 
(
    'a0000000-0000-0000-0000-000000000001',
    'Алгоритм Диница на графе пропускной способности',
    'dinic-max-flow',
    'HARD',
    'Графы, Максимальный поток, Оптимизация',
    'Дан ориентированный граф с истоком S и стоком T. Каждое ребро имеет пропускную способность C. Найдите максимальный поток с асимптотикой O(V^2 * E) с использованием блоковых потоков и слоистого графа (BFS + DFS).',
    'Первая строка: V (вершины), E (ребра), S (исток), T (сток). Следующие E строк: u, v, capacity.',
    'Единственное целое число — величина максимального потока.',
    2000, 256,
    'class Solution {\n    public long maxFlow(int n, int s, int t, int[][] edges) {\n        // Напишите реализацию алгоритма Диница\n        return 0;\n    }\n}',
    'class Solution:\n    def maxFlow(self, n: int, s: int, t: int, edges: list[list[int]]) -> int:\n        # Реализация алгоритма Диница\n        return 0',
    'class Solution {\npublic:\n    long long maxFlow(int n, int s, int t, vector<vector<int>>& edges) {\n        // Реализация алгоритма Диница\n        return 0;\n    }\n};',
    'func maxFlow(n int, s int, t int, edges [][]int) int64 {\n    // Реализация алгоритма Диница\n    return 0\n}',
    'var maxFlow = function(n, s, t, edges) {\n    // Реализация алгоритма Диница\n    return 0;\n};'
),
(
    'a0000000-0000-0000-0000-000000000002',
    'Дерево отрезков с ленивым проталкиванием (Lazy Segment Tree)',
    'segment-tree-lazy-propagation',
    'MEDIUM',
    'Деревья отрезков, Массивы, Префиксные суммы',
    'Реализуйте структуру данных для поддержки двух операций над массивом A размера N:\n1. Прибавить число V ко всем элементам на отрезке [L, R]\n2. Найти сумму элементов на отрезке [L, R] по модулю 10^9+7.',
    'N, Q (число элементов и запросов). Далее массив A. Далее Q запросов.',
    'Для каждого запроса 2 выведите сумму по модулю 10^9+7.',
    1500, 256,
    'class SegmentTree {\n    public SegmentTree(int[] arr) {}\n    public void updateRange(int l, int r, long val) {}\n    public long querySum(int l, int r) {\n        return 0;\n    }\n}',
    'class SegmentTree:\n    def __init__(self, arr: list[int]):\n        pass\n    def update_range(self, l: int, r: int, val: int):\n        pass\n    def query_sum(self, l: int, r: int) -> int:\n        return 0',
    'class SegmentTree {\npublic:\n    SegmentTree(vector<int>& arr) {}\n    void updateRange(int l, int r, long long val) {}\n    long long querySum(int l, int r) {\n        return 0;\n    }\n};',
    'type SegmentTree struct {}\nfunc Constructor(arr []int) SegmentTree { return SegmentTree{} }\nfunc (this *SegmentTree) UpdateRange(l int, r int, val int64) {}\nfunc (this *SegmentTree) QuerySum(l int, r int) int64 { return 0 }',
    'var SegmentTree = function(arr) {};\nSegmentTree.prototype.updateRange = function(l, r, val) {};\nSegmentTree.prototype.querySum = function(l, r) { return 0; };'
);
