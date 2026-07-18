# React 18 Upgrade — Performance & Architecture Improvements

**Project:** React 18 Upgrade + Vite 8 + Rolldown Migration

## Overview

As part of the React 18 migration, the application's loading architecture was redesigned with a focus on reducing the initial payload, optimizing application startup, and improving navigation performance.

The upgrade introduces a modular loading strategy consisting of:

- Fine-grained JavaScript code splitting
- Standardized application boot sequence
- Route-level bundle prefetching

The following sections document the measurable improvements observed after the upgrade.

---

# 1. Network Payload Optimization

## Objective

Reduce the amount of JavaScript downloaded during the initial application load by replacing large monolithic bundles with smaller, independently loaded chunks.

## Measurements

| Metric | Previous Production | React 18 Upgrade | Improvement |
|---------|--------------------:|-----------------:|------------:|
| JavaScript Requests | 10 | 127 | More granular code splitting |
| Total Download Size | 19.45 MB | 8.90 MB | **54% reduction** |
| Network Transfer | 12.90 MB | 2.72 MB | **79% reduction** |
| DOMContentLoaded | 1.61 s | 1.57 s | Slight improvement |
| Load Event | 2.86 s | 2.53 s | **11.5% faster** |
| Network Finish | 15.90 s | 4.10 s | **74% faster** |

## Observations

The previous production build shipped a few very large JavaScript bundles.

Examples include:

| Bundle | Size |
|---------|------|
| vendor | 10.13 MB |
| cashapps | 3.40 MB |
| amcharts | 2.45 MB |
| index | 1.88 MB |

The upgraded build replaces these with smaller, feature-specific chunks. Although the number of JavaScript requests increased, the browser downloads significantly less data and completes loading much sooner.

## Technical Improvements

- Migrated from monolithic bundles to fine-grained code splitting.
- Reduced initial JavaScript payload.
- Improved long-term browser caching.
- Enabled independent loading of application features.

## Impact

- 54% reduction in downloaded JavaScript.
- 79% reduction in transferred bytes.
- 74% faster completion of network activity.
- Lower bandwidth consumption.
- Faster first-time page loads.

---

# 2. Boot API Optimization

## Objective

Separate application initialization from business data loading by introducing a predictable application boot sequence shared across all pages.

## Previous Architecture

During startup, application initialization and dashboard-specific APIs were executed together.

Examples:

- Current user
- Collection plans
- Collection statuses
- Dashboard snapshot
- Business units
- DSO
- Balances
- Receivables
- Invoice statuses
- Aging data
- High-risk customers
- Flagged invoices
- Follow-up statuses

**Total XHR Requests:** **43**

---

## React 18 Architecture

Application startup now consists of a fixed boot sequence before any page-specific requests are made.

### Boot APIs

1. current-user
2. config
3. status
4. accounts
5. ui-config
6. features
7. rollout-features

Once initialization completes, each page requests only the business data it requires.

**Total XHR Requests:** **27**

## Comparison

| Metric | Previous Production | React 18 Upgrade |
|---------|--------------------:|-----------------:|
| Total Startup XHR Requests | 43 | 27 |
| Boot Process | Mixed with business APIs | Dedicated boot sequence |
| Boot APIs | Page dependent | Shared across application |
| Business APIs | Loaded during startup | Loaded after boot |

## Technical Improvements

The application startup is now divided into two phases.

### Phase 1 — Application Boot

Shared initialization:

- Current User
- Config
- Accounts
- UI Configuration
- Feature Flags
- Rollout Features

### Phase 2 — Page Initialization

Business APIs are executed only after application initialization has completed.

## Impact

- Reduced startup API requests from **43 → 27**.
- Consistent boot behavior across every page.
- Clear separation between platform initialization and business logic.
- Simpler debugging and future maintenance.
- New pages automatically inherit the optimized startup process.

---

# 3. Route-Level Prefetching

## Objective

Reduce navigation latency by downloading page bundles before the user navigates to a page.

## Implementation

React 18 introduces route-level bundle prefetching.

When the user is likely to navigate to another module (for example, hovering over the **Inbox** navigation item), the required JavaScript bundles begin downloading in the background while the user remains on the current page.

Only frontend assets are prefetched.

Business APIs are **not** executed until the user actually opens the page.

## Example

While viewing the Company Dashboard, hovering over **Inbox** triggers background downloads for Inbox-related bundles.

Examples:

| Prefetched Bundle |
|-------------------|
| collection-activities |
| inbox |
| Form |
| useUpdateRead |
| Antd |
| Shared utilities |

These assets are cached before navigation occurs.

## Technical Improvements

- Route-level JavaScript prefetching.
- Background asset downloads during idle time.
- Cached bundles reused during navigation.
- No unnecessary API requests.

## Impact

- Faster page-to-page navigation.
- Reduced perceived loading time.
- Improved user experience when switching modules.
- Better utilization of browser idle time.
- Backend load remains unchanged because only frontend assets are prefetched.

---

# Summary

| Improvement | Result |
|------------|--------|
| Network Payload | **54% less JavaScript downloaded** |
| Network Transfer | **79% less data transferred** |
| Network Completion | **74% faster** |
| Startup APIs | **43 → 27 requests** |
| Application Boot | Standardized boot sequence shared across all pages |
| Navigation | Route-level bundle prefetching introduced |
| Bundle Architecture | Migrated from monolithic bundles to fine-grained code splitting |
| Cache Efficiency | Improved through smaller independent bundles |

---

## Conclusion

The React 18 upgrade is more than a framework migration. It introduces a redesigned loading architecture that optimizes the application's startup, reduces the amount of JavaScript delivered to users, standardizes the initialization flow across all pages, and improves navigation responsiveness through intelligent route prefetching.

These changes establish a scalable foundation for future development while delivering measurable improvements in network utilization, startup behavior, and overall application responsiveness.
