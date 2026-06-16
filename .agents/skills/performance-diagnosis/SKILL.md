---
name: performance-diagnosis
description: rendering cost, layout shift, re-render loops, slow interactions, LCP, hydration delay, scroll jank, bundle impact 같은 프론트엔드 성능 이슈를 분석할 때 사용합니다.
---

# Performance Diagnosis

Use this skill when performance is the problem. Do not modify code before analysis.

## Required Output

1. Symptom Summary
2. Top Possible Causes
   - probability
   - reasoning
3. Most Likely Root Cause
4. Validation Plan
   - metric
   - tool
   - expected observation
5. Improvement Plan
   - low cost to high cost
   - trade-offs
6. Priority Action Checklist

## Rules

- Follow `AGENTS.md`.
- Mark assumptions as `[Assumption]`.
- Focus on measurable validation.
- Avoid generic advice.
- Consider the actual app environment after `package.json` and app framework are created.
- Prefer low-risk improvements before structural rewrites.
- Define verification steps before implementation.

## DONGCHIMI Checks

- Is the issue app-specific or caused by a shared package?
- Are response-changing params included in query keys?
- Is layout shift caused by loading, validation, image, or font states?
- Does mobile WebView need separate validation?
- Is the performance issue measurable in local browser tooling?
