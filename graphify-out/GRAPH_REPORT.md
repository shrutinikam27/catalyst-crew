# Graph Report - catalyst-crew  (2026-05-16)

## Corpus Check
- 14 files · ~36,119 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 25 nodes · 20 edges · 12 communities (10 shown, 2 thin omitted)
- Extraction: 80% EXTRACTED · 20% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b40c0b08`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 9 edges
2. `Navbar()` - 2 edges
3. `AuthProvider()` - 2 edges
4. `HomePage()` - 2 edges
5. `LoginPage()` - 2 edges
6. `SignupPage()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Navbar()` --calls--> `useAuth()`  [INFERRED]
  client/src/App.jsx → client/src/firebase/AuthContext.jsx
- `HomePage()` --calls--> `useAuth()`  [INFERRED]
  client/src/pages/HomePage.jsx → client/src/firebase/AuthContext.jsx
- `LoginPage()` --calls--> `useAuth()`  [INFERRED]
  client/src/pages/LoginPage.jsx → client/src/firebase/AuthContext.jsx
- `SignupPage()` --calls--> `useAuth()`  [INFERRED]
  client/src/pages/SignupPage.jsx → client/src/firebase/AuthContext.jsx

## Communities (12 total, 2 thin omitted)

### Community 1 - "Community 1"
Cohesion: 0.6
Nodes (3): useAuth(), LoginPage(), SignupPage()

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAuth()` connect `Community 1` to `Community 0`, `Community 2`?**
  _High betweenness centrality (0.225) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `useAuth()` (e.g. with `Navbar()` and `HomePage()`) actually correct?**
  _`useAuth()` has 4 INFERRED edges - model-reasoned connections that need verification._