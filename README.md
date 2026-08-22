# GlyphKanban - Intelligent Web Kanban Board

A modern web-based Kanban board built using **[Glyph](https://github.com/chadetov/glyph)** (`@glyphlang/glyph`), React, TypeScript, and Tailwind CSS.

---

## Key Features

1. **Role-Driven Workflows (RBAC)**:
   - **Admin**: Full control over board configuration, task lifecycle, WIP limits tuning, and exclusive access to the **Admin Executive Analytics Dashboard**.
   - **Reporter**: Create, document, and manage reported feature/bug cards. Filter by *"Reported by me"*.
   - **Assignee**: Transition cards across workflow stages, log effort/hours, add comments, and filter by *"Assigned to me"*.
   - **Live Role Switcher**: Easily test and switch between Admin, Reporter, and Assignee perspectives from the top header.

2. **Core Domain & Analytics Powered by Glyph (`src/glyph/`)**:
   - `models.glyph`: Statically typed data models for Cards, Users, Roles, Priorities, Statuses, and Activity Logs.
   - `permissions.glyph`: Strict pattern-matched role-based access control engine.
   - `analytics.glyph`: Metrics calculation engine for Cycle Time, Lead Time, Completion Rate, Flow Bottleneck alerts, and Board Health Score.
   - `board_engine.glyph`: State transition validation, quick movement rules, and audit message formatting.

3. **Kanban Board View**:
   - 5 Workflow Stages: **Backlog**, **To Do**, **In Progress**, **In Review**, and **Completed**.
   - Drag-and-drop support with real-time column drop zones and hover feedback.
   - Work In Progress (WIP) limits with visual bottleneck alerts.
   - Priority badges, time estimation vs. logged hours progress bars, and overdue indicators.
   - Interactive search by title, description, task ID, or tag.
   - Filtering by Priority, Tags, Reporter, and Assignee.

4. **Admin Metrics & Insights Dashboard**:
   - **Board Health Score** (0-100 gauge).
   - **Cycle Time & Lead Time** averages (calculated in hours & days).
   - **Throughput & Completion Rate** KPIs.
   - **Cumulative Flow & Pipeline Distribution** visualization.
   - **Assignee Workload & Capacity Grid**: Individual progress, assigned vs. completed tasks, logged vs. estimated hours.
   - **Priority Distribution Matrix**.
   - **Complete System Audit Trail**: Immutable chronological log of every board action.
   - **WIP Limits Manager**: Real-time threshold adjustments.

5. **Persistence & Data Portability**:
   - Automatic synchronization to `localStorage`.
   - Single-click JSON backup export & restore functionality.
   - Demo reset utility to reload initial sample project tasks and activity history.

---

## Development & Build Commands

```bash
# Install dependencies
npm install

# Compile Glyph source files into TypeScript
npm run build:glyph

# Start local development server
npm run dev

# Build full production bundle (compiles Glyph + Vite bundle)
npm run build

# Preview production build
npm run preview
```

---

## Project Structure

```
├── src/
│   ├── glyph/               # Core Glyph domain logic (.glyph files)
│   │   ├── models.glyph
│   │   ├── permissions.glyph
│   │   ├── analytics.glyph
│   │   └── board_engine.glyph
│   ├── generated/           # TypeScript modules emitted by Glyph compiler
│   │   ├── models.ts
│   │   ├── permissions.ts
│   │   ├── analytics.ts
│   │   └── board_engine.ts
│   ├── components/          # React UI components
│   │   ├── Header.tsx
│   │   ├── KanbanBoard.tsx
│   │   ├── KanbanColumn.tsx
│   │   ├── KanbanCard.tsx
│   │   ├── CardModal.tsx
│   │   └── AdminDashboard.tsx
│   ├── context/             # Board state & Glyph integration
│   │   └── BoardContext.tsx
│   ├── data/                # Initial seed data
│   │   └── initialData.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx              # Main App layout & view switcher
│   ├── main.tsx             # Entry point
│   └── index.css            # Styling & Glassmorphic design
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

---

## Documentation & Retrospectives

For detailed technical evaluations, trade-off analyses, and architecture comparisons, see:
- [Glyph Evaluation & Engineering Retrospective](docs/glyph-retrospective.md)
- [Comparative Analysis: Glyph vs. Pure TypeScript](docs/glyph-vs-pure-typescript.md)
- [Ideal Use Cases & Project Fits for Glyph](docs/ideal-glyph-use-cases.md)
