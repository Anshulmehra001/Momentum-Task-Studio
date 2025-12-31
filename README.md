# Momentum Task Studio

Local-first task manager with projects → goals → tasks, deadlines, and import/export.

Live site: https://anshulmehra001.github.io/Momentum-Task-Studio/

## Quickstart

1. Install pnpm if needed: https://pnpm.io/installation
2. Install dependencies: `pnpm install`
3. Run dev server: `pnpm dev`
4. Build for prod: `pnpm build` (artifacts in `dist/`)

## Features

- Projects with status, priority, and deadline
- Goals tied to projects with timeframes
- Tasks with deadline, status (planned / in-progress / completed), priority, and project/goal links
- Local-first storage (Zustand + persist) with JSON import/export
- Dashboard with stats, upcoming deadlines, overdue radar, high-priority feed, and project progress
- Tailwind-crafted UI with glass panels, gradients, and responsive layout

## Data model (export JSON)

```json
{
  "projects": [
    {
      "id": "project-id",
      "title": "Project name",
      "description": "",
      "deadline": "ISO",
      "status": "planned | in-progress | completed",
      "priority": "high | medium | low",
      "createdAt": "ISO",
      "updatedAt": "ISO"
    }
  ],
  "tasks": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "deadline": "ISO",
      "projectId": "project-id",
      "goalId": "goal-id",
      "status": "planned | in-progress | completed",
      "priority": "high | medium | low",
      "createdAt": "ISO",
      "updatedAt": "ISO"
    }
  ],
  "goals": [
    {
      "id": "string",
      "projectId": "project-id",
      "title": "string",
      "description": "string",
      "targetDate": "ISO",
      "durationText": "This quarter",
      "createdAt": "ISO",
      "updatedAt": "ISO"
    }
  ],
  "settings": {
    "showMotivation": true,
    "theme": "dark | light"
  }
}
```

## Notes

- All data stays in the browser until you export.
- Import expects the shape above; keep ids if you want to preserve links between tasks and goals.
- Fonts are pulled from Google Fonts (Space Grotesk, Manrope).
