// Source-parity contract: the source REGEN SPA has a working "Set reminder" feature
// (datetime -> SUBSIDIARY_ACTIONS action=setReminder). The current platform defined a
// DynamicActions.setReminder contract but no module consumed it and no UI surfaced it.
// This test locks in the tailored governed equivalent added to orchestrator.js.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { DynamicActions, dynamicActionContract } from '../config/dynamic-actions.config.js';

// 1) The contract still exists and is well-formed.
const c = dynamicActionContract('setReminder');
assert.ok(c, 'setReminder contract must exist');
assert.equal(c.operation, 'create');
assert.deepEqual(c.required, ['dueAt'], 'setReminder must require dueAt');
assert.equal(c.confirm, true, 'setReminder must require confirmation');

// 2) A module now actually consumes the contract (it was previously imported by nothing).
const orch = fs.readFileSync('modules/orchestrator.js', 'utf8');
assert.match(orch, /dynamic-actions\.config\.js/, 'orchestrator must import the dynamic-actions contract');
assert.match(orch, /dynamicActionContract\(['"]setReminder['"]\)/, 'orchestrator must resolve the setReminder contract');

// 3) The reminder action is governed: UI control + dueAt validation + confirmation + preview + audit meta + governed invoke.
assert.match(orch, /data-set-reminder/, 'reminder action must have a UI control');
assert.match(orch, /data-reminder-due/, 'reminder must collect a due date input');
assert.match(orch, /required\.includes\(['"]dueAt['"]\)/, 'reminder must validate the required dueAt field');
assert.match(orch, /confirmAction\(/, 'reminder must confirm before execution');
assert.match(orch, /preview-box/, 'reminder must show a payload preview');
assert.match(orch, /action:\s*['"]setReminder['"]/, "reminder must set action:'setReminder'");
assert.match(orch, /invoke\(['"]DYNAMIC_ACTIONS['"]/, 'reminder must route through the governed DYNAMIC_ACTIONS endpoint');
assert.match(orch, /module:\s*['"]orchestrator['"],\s*action:\s*['"]setReminder['"]/, 'reminder State.patch must carry audit meta');

console.log('source-parity-reminder-contract passed');
