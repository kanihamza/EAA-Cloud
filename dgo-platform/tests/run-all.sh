#!/usr/bin/env bash
set -e
for f in tests/*.mjs; do node "$f"; done
node tests/regression-r11.3.mjs


# OBSIDIAN governance/security/archive contracts
node tests/entity-store-contract.mjs
node tests/directorate-scope-contract.mjs
node tests/lifecycle-transition-contract.mjs
node tests/no-orphan-contract.mjs
node tests/closure-gate-contract.mjs
node tests/audit-thread-contract.mjs
node tests/error-taxonomy-contract.mjs
node tests/idempotency-contract.mjs
node tests/archive-retention-contract.mjs
node tests/archive-export-contract.mjs
node tests/otp-handshake-contract.mjs
node tests/dispatch-closure-contract.mjs
node tests/endpoint-security-contract.mjs
node tests/direct-status-write-scan.mjs

node tests/ui-provisioning-contract.mjs

node tests/state-behaviour-contract.mjs

node tests/module-lifecycle-refactor-contract.mjs

node tests/correspondence-intake-contract.mjs

node tests/registry-lifecycle-contract.mjs

node tests/assignment-lifecycle-contract.mjs

node tests/operations-action-contract.mjs

node tests/review-approval-contract.mjs

node tests/dispatch-module-contract.mjs

node tests/comment-immutability-contract.mjs

node tests/archive-immutability-contract.mjs

node tests/archive-access-contract.mjs

node tests/archive-reopen-contract.mjs

node tests/accessibility-contract.mjs

node tests/operator-walkthrough-contract.mjs

node tests/release-gate-contract.mjs

node tests/module-boundary-contract.mjs

node tests/action-ownership-contract.mjs

node tests/audited-state-patch-contract.mjs

node tests/action-surface-contract.mjs

node tests/platform-provisioning-contract.mjs

node tests/state-schema-provisioning-contract.mjs

node tests/action-runtime-provisioning-contract.mjs

node tests/data-fetch-contract.mjs

node tests/cache-policy-contract.mjs

node tests/write-manager-contract.mjs

node tests/loading-state-contract.mjs

node tests/performance-budget-contract.mjs

node tests/data-selectors-contract.mjs

node tests/router-host-retention-contract.mjs

node tests/flow-confirmation-contract.mjs

node tests/ui-selection-contract.mjs
node tests/mount-simulation-contract.mjs

node tests/performance-optimization-contract.mjs

node tests/defect-review-fixes-contract.mjs

node tests/destructive-action-confirmation-contract.mjs
