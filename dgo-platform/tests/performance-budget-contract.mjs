import assert from 'node:assert/strict';
import { PerformanceBudget } from '../config/performance-budget.config.js';
import { PerformanceMonitor } from '../core/performance-monitor.js';
assert.ok(PerformanceBudget.fetchAllMs>=45000);
PerformanceMonitor.record('render','TEST',5);
assert.ok(PerformanceMonitor.snapshot().events.length>=1);
console.log('performance-budget-contract passed');
