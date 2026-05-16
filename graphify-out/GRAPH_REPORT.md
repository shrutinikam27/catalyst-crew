# Graph Report - catalyst-crew  (2026-05-16)

## Corpus Check
- 45 files · ~135,022 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 106 nodes · 128 edges · 26 communities (21 shown, 5 thin omitted)
- Extraction: 80% EXTRACTED · 20% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `60dd2c40`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 12|Community 12]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 34 edges
2. `useAuth()` - 18 edges
3. `useSocket()` - 15 edges
4. `DataFetcher` - 4 edges
5. `PublicNavbar()` - 3 edges
6. `Topbar()` - 3 edges
7. `CitizenDashboard()` - 3 edges
8. `ProtectedRoute()` - 2 edges
9. `Sidebar()` - 2 edges
10. `AlertCard()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `StatCard()` --calls--> `cn()`  [INFERRED]
  client/src/components/ui/StatCard.jsx → client/src/utils/cn.js
- `CapabilityCard()` --calls--> `cn()`  [INFERRED]
  client/src/pages/AboutUs.jsx → client/src/utils/cn.js
- `FeatureCard()` --calls--> `cn()`  [INFERRED]
  client/src/pages/Features.jsx → client/src/utils/cn.js
- `ResponseCard()` --calls--> `cn()`  [INFERRED]
  client/src/pages/Features.jsx → client/src/utils/cn.js
- `ProtectedRoute()` --calls--> `useAuth()`  [INFERRED]
  client/src/App.jsx → client/src/firebase/AuthContext.jsx

## Communities (26 total, 5 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.12
Nodes (10): PublicNavbar(), AuthProvider(), useAuth(), DashboardLayout(), HomePage(), LoginPage(), SignupPage(), Navbar() (+2 more)

### Community 1 - "Community 1"
Cohesion: 0.17
Nodes (9): CitizenDashboard(), CitizenHeatmap(), Topbar(), SocketProvider(), useSocket(), FireDashboard(), HospitalDashboard(), PoliceDashboard() (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.29
Nodes (5): SafetyCompanion(), Sidebar(), AlertCard(), ChartCard(), cn()

## Knowledge Gaps
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 2` to `Community 0`, `Community 1`, `Community 3`, `Community 7`, `Community 8`, `Community 11`, `Community 12`, `Community 13`, `Community 14`, `Community 15`?**
  _High betweenness centrality (0.342) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `Community 0` to `Community 1`?**
  _High betweenness centrality (0.168) - this node is a cross-community bridge._
- **Are the 10 inferred relationships involving `cn()` (e.g. with `PublicNavbar()` and `Sidebar()`) actually correct?**
  _`cn()` has 10 INFERRED edges - model-reasoned connections that need verification._
- **Are the 9 inferred relationships involving `useAuth()` (e.g. with `ProtectedRoute()` and `PublicNavbar()`) actually correct?**
  _`useAuth()` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Are the 7 inferred relationships involving `useSocket()` (e.g. with `Topbar()` and `CitizenDashboard()`) actually correct?**
  _`useSocket()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `PublicNavbar()` (e.g. with `useAuth()` and `cn()`) actually correct?**
  _`PublicNavbar()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._