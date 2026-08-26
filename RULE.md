# Project Operating Rules & Development Guidelines (`RULE.md`)

This document defines the core operating procedures, workflow standards, and communication protocols for AI assistants and contributors working on this codebase. All rules must be strictly followed.

---

## 1. Task Discovery & Context Initialization
- **Active Task Check:** At the start of any session or prompt, always inspect [WORK_LOG.md](file:///d:/Source/github/sorinoi/lofi-player/WORK_LOG.md) first. The top of `WORK_LOG.md` **must always contain the `Active Task Pointer`** specifying the current active task and its corresponding task file.
- **Detailed Subtask Tracking:** Follow the pointer to read `task/<task_name>_task.md` to determine the exact current phase, completed tasks, and the next immediate action to perform.

---

## 2. Planning Protocol (`planning/`)
- **Dedicated Planning Documents:** Whenever asked to plan work or tackle a non-trivial feature/refactor, create a markdown plan inside the `planning/` folder (e.g., `planning/<feature_name>.md`).
- **Phase Breakdown:** Every plan **must** be broken down into structured, sequential phases (e.g., Phase 1: Setup, Phase 2: Core Implementation, Phase 3: Integration, Phase 4: Testing & Verification).
- **Descriptive Naming:** Plan files must use clear, descriptive names matching the feature or task scope (e.g., `planning/audio_engine.md`).

---

## 3. Task Breakdown & Progress Logging (`task/`)
- **Corresponding Task File:** Whenever a new plan is opened (e.g., `planning/<feature_name>.md`), you must immediately create a corresponding task tracker in the `task/` folder (e.g., `task/<feature_name>_task.md`).
- **Mandatory Task Log Contents:** Every task file **must** clearly document the following 5 components:
  1. **Current Phase:** The phase currently in progress.
  2. **Completed Tasks:** A checklist and description of tasks completed so far.
  3. **Next Actions:** The exact next subtask(s) to be executed.
  4. **Modified & Created Files:** A complete list of all files created, modified, or deleted during this task (using file links).
  5. **Plan & Workflow Adjustments:** If any plan, requirement, or workflow process is adjusted during execution, record the changes and rationale in this section.
- **Continuous Logging:** Keep the task file up-to-date after every meaningful code modification or step to ensure seamless continuity across AI sessions.

### Standard Task File Template (`task/<feature_name>_task.md`)
```markdown
# Task: [Feature / Task Name]

- **Associated Plan:** [planning/<feature_name>.md](file:///d:/Source/github/sorinoi/lofi-player/planning/<feature_name>.md)
- **Current Phase:** Phase X - [Phase Name] (In Progress / Pending Approval / Completed)
- **Status:** 🟡 In Progress / 🟢 Completed / 🔴 Blocked

---

## 1. Completed Tasks
- [x] [Completed task description] (Files: `path/to/file`)

---

## 2. Next Actions (Upcoming Tasks)
- [ ] [Next task to execute]
- [ ] [Subsequent task]

---

## 3. Phase Checklist
### Phase 1: [Phase Name]
- [x] [Subtask]
- [x] [Subtask]

### Phase 2: [Phase Name]
- [ ] [Subtask]

---

## 4. Modified & Created Files
- [NEW] `path/to/new_file.ts` - Description of file purpose
- [MOD] `path/to/existing_file.vue` - Summary of changes made
- [DEL] `path/to/deleted_file.js` - Reason for deletion

---

## 5. Plan & Workflow Adjustments (Changelog)
- **[YYYY-MM-DD]:** [Description of changes made to the original plan or workflow, with rationale]
```

---

## 4. Phase-by-Phase Execution & Verification Gate
- **Phase Execution:** Execute work strictly phase-by-phase.
- **Verification Before Report (Definition of Done):** Before reporting a phase as complete and asking for approval, you **must verify your changes**:
  1. **Build & Syntax Check:** Run the project build or typecheck command (e.g. `npm run build`, `npm run typecheck`, or linter) to ensure 0 compile/syntax errors.
  2. **Runtime & Test Check:** Verify that the feature functions as expected without runtime crashes.
  3. **Verification Summary:** Include the commands executed and their output/results in your progress report.
- **Progress Reporting:** Upon finishing each phase and passing verification, present a concise summary report of:
  - What was implemented.
  - Files created/modified.
  - Verification results (build/test status).
  - What is scheduled next for the upcoming phase.
- **Approval Gate:** **STOP and wait for explicit user approval** before proceeding to the next phase. Do not auto-advance across phase boundaries without confirmation.

---

## 5. Work Log Cleanliness & Maintenance (`WORK_LOG.md`)
- **Active Task Pointer at the Very Top:** The very top of [WORK_LOG.md](file:///d:/Source/github/sorinoi/lofi-player/WORK_LOG.md) **must always feature the `🎯 Active Task Pointer`** block pointing to the active task file, current phase, and status.
- **Significant Updates:** Record all major milestones, handoffs, and state changes in [WORK_LOG.md](file:///d:/Source/github/sorinoi/lofi-player/WORK_LOG.md).
- **Active Task Focus:** `WORK_LOG.md` must only retain granular detail for the **currently active task**.
- **Completed Tasks Pruning:** When a task is completed, collapse it into a single line item marked with `[x]` (e.g., `- [x] Setup Project Boilerplate`), and remove all of its obsolete subtask details and temporary notes to prevent clutter.

### Standard `WORK_LOG.md` Header Structure
```markdown
# Work Log - [Project Name]

## 🎯 Active Task Pointer
- **Current Task:** [Task Name]
- **Task File:** [task/<task_name>_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/<task_name>_task.md)
- **Current Phase:** Phase X - [Phase Name] (🟡 In Progress)
```

---

## 6. Blockers, Ambiguity & Inquiries
- **Ask Before Guessing:** If you encounter blockers, insufficient information, architectural ambiguity, or unexpected errors, **always pause and ask the user for clarification** before proceeding or making assumptions.
