@AGENTS.md

# Project Conventions

This repository is a reusable Lens Studio starter template — every new Lens is built on top of it. Follow the conventions below in addition to the Lens Studio reference in `AGENTS.md`.

## Language

Write all Lens scripts in **JavaScript** (ES2021), not TypeScript. Use `// @input` comment decorators for UI inputs and the global `script` object as the execution context.

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
