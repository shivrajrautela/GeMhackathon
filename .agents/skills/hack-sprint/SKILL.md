---
name: hack-sprint
description: Rapid feature build with bounded token consumption in three strict phases.
---

# Hack-Sprint Workflow

Rapid feature build with bounded token consumption.

Execute this task in three strict phases:

1. **Diff-Only Plan (Max 4 bullets)**:
   - Identify which files to touch.
   - Outline the logic in 1-2 sentences per file.
   - Wait for approval if in 'Planning' mode, else proceed.

2. **Targeted Implementation**:
   - Make minimal edits using exact replacement blocks.
   - Do not touch unrelated styling or documentation unless requested.

3. **Silent Verification**:
   - Run the local build or unit test.
   - If green:
     1. Update `.agents/state/last-session.md` with completion status
     2. Output: "SUCCESS: [Task name] verified."
   - If red:
     1. Update `.agents/state/last-session.md` with error status
     2. Output only the root cause error and fix plan.
