@AGENTS.md

# Project Conventions

This repository is a reusable Lens Studio starter template — every new Lens is built on top of it. Follow the conventions below in addition to the Lens Studio reference in `AGENTS.md`.

## Language

Write all Lens scripts in **JavaScript** (ES2021), not TypeScript. Use `// @input` comment decorators for UI inputs and the global `script` object as the execution context.

**Everything that goes into git is written in English** — code, comments, documentation, log entries, commit messages, and file names. Chat may be in Turkish, but nothing committed to the repository is. This template is shared across projects and read by people who do not speak Turkish.

## Where Scripts Go

Create every new script in `Assets/Scripts/Custom Scripts/`.

Do not add scripts to `Assets/Scripts/Scripts Starter Pack/` or `Assets/Scripts/Core.lspkg` — those are template-owned and shared across Lenses. Only touch them when explicitly asked.

## Public Methods

**Never use the `script.api` namespace.** Declare functions as `const` first, then attach them directly to `script` to make them public.

```js
// Correct
const playIntro = function () {
    // ...
};

script.playIntro = playIntro;

// Wrong
script.api.playIntro = function () { /* ... */ };
```

Declaring the function as a `const` keeps it callable from inside the script without going through `script`, and the explicit assignment makes the public surface of the file obvious at a glance. Other scripts call these directly off the referenced script component (e.g. `script.uiManager.playIntro()`).

## Custom Inspector UI

Anything a designer might want to tune — speeds, durations, ranges, counts, toggles, colors, target objects — must be exposed as a script input so it can be changed from the Inspector instead of edited in code. Hard-coded tuning values are a bug, not a shortcut. For example, a randomizer script exposes its `speed` as an input rather than declaring it as a constant.

Do not stop at bare `// @input` lines — lay the panel out properly with `// @ui` widgets so it reads cleanly in the Inspector:

- `group_start` / `group_end` to bundle related inputs under a labeled section
- `separator` to breathe between blocks
- `label` for short explanatory text where a field name is not self-explanatory
- widget hints on the inputs themselves (sliders with sensible `min`/`max`, combo boxes for fixed choices) and `showIf` to hide inputs that do not apply

Match the existing house style in `Assets/Scripts/Scripts Starter Pack/` — for example:

```js
// @ui {"widget":"group_start", "label":"Randomizer"}
// @ui {"widget":"separator"}
// @input float speed = 1.0 {"widget":"slider", "min":0.0, "max":10.0, "step":0.1}
// @input bool randomizeOnStart = true
// @ui {"widget":"separator"}
// @ui {"widget":"group_end"}
```

Group order and labels should tell the user how to use the script at a glance.

## Logging

Keep `print()` to a minimum. Log only essential state and events — initialization failures, missing input references, and meaningful state transitions. No per-frame logging, no step-by-step traces, and no leftover debug prints in delivered code.

## Asking Questions

When a task is ambiguous, a requirement is unclear, or you need information you cannot get from the project itself, **ask**. Do not guess at intent and do not silently pick a direction — a short question up front is preferred over a wrong implementation.

## Session Log

A single Lens is built over weeks across many separate sessions, so `SESSION_LOG.md` carries the context that does not survive between them. Git history records what changed; the log records what it was for.

**At the start of every session, read `SESSION_LOG.md` before touching anything.** It is the record of where the work left off.

**The log belongs to the Lens, not to the template.** In this repository it stays empty apart from its heading skeleton — work done on the template itself is never logged. Entries only begin once this repository has been copied to build an actual Lens.

**Whenever the user asks to commit and push, update `SESSION_LOG.md` as part of that same request**, before staging. Not on a plain commit without a push, and not on a push of already-logged work — the trigger is a commit + push of new work. Do not ask for permission to update the log; it is part of the job.

Write one entry per session, newest at the top, dated absolutely (`## 2026-08-03`). Append to the existing entry if the session already has one today. Cover the four things that git cannot show on its own:

- **Work done** — which scripts and assets were added or changed, and what each one is for.
- **Decisions** — why an approach was chosen and what was rejected. This is the first thing forgotten and the most expensive to re-derive.
- **Scene setup** — SceneObjects created, which script is attached to what, which inputs were wired in the Inspector, render target and hierarchy order changes. None of this is readable from the code.
- **In progress** — unfinished work, known bugs, and the intended next step.

Keep entries short and factual — a handful of bullets per heading, skipping any heading with nothing to report. Write what a stranger would need in order to continue, not a transcript of the conversation. Do not restate the conventions in this file, do not paste code, and do not log routine formatting passes. When an old entry has been fully superseded, fold it into a one-line summary rather than leaving a contradictory record standing.
