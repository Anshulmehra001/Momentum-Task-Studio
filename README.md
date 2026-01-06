# Momentum Task Studio

A modern, intuitive task management application with a clean design and powerful features.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://anshulmehra001.github.io/Momentum-Task-Studio/)
[![GitHub](https://img.shields.io/badge/github-repository-blue)](https://github.com/Anshulmehra001/Momentum-Task-Studio)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## Features

✨ **Modern UI/UX**
- Clean, minimalist interface with dark/light theme support
- Responsive design that works on all devices
- Smooth animations and transitions
- Intuitive navigation with sidebar layout

🎯 **Smart Task Management**
- Quick task creation with intelligent defaults
- Advanced filtering and search capabilities
- Priority levels and status tracking
- Deadline management with overdue alerts

📊 **Progress Tracking**
- Visual progress indicators
- Completion statistics and streaks
- Project progress tracking
- Daily planning and consistency metrics

🔄 **Flexible Organization**
- Optional project and goal organization
- Tag-based filtering
- Multiple view modes
- Bulk operations support

💾 **Data Management**
- Local-first storage (works offline)
- JSON import/export functionality
- Data persistence across sessions
- Backup and restore capabilities

## 🚀 Live Demo

Try the app now: **[https://anshulmehra001.github.io/Momentum-Task-Studio/](https://anshulmehra001.github.io/Momentum-Task-Studio/)**

No installation required - start managing your tasks immediately!

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Anshulmehra001/Momentum-Task-Studio.git
   cd Momentum-Task-Studio
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173/Momentum-Task-Studio/`

### Build for Production

```bash
pnpm build
# or
npm run build
```

The built files will be in the `dist/` directory.

## Usage Guide

### Getting Started
1. **Create your first task** - Use the quick add input on the dashboard or click "New Task"
2. **Set priorities** - Mark important tasks as high priority
3. **Add deadlines** - Set due dates to stay on track
4. **Track progress** - Mark tasks as in-progress or completed

### Advanced Features
- **Projects** - Group related tasks together
- **Goals** - Set objectives within projects
- **Filters** - Find tasks by status, priority, or deadline
- **Search** - Quickly locate specific tasks
- **Daily Planning** - Use the "Today" view for focused work

### Keyboard Shortcuts
- `Ctrl/Cmd + K` - Quick search
- `N` - New task
- `T` - Toggle theme
- `Esc` - Close modals

## Data Structure

The application uses a simple JSON structure for data storage:

```json
{
  "tasks": [
    {
      "id": "unique-id",
      "title": "Task title",
      "description": "Optional description",
      "status": "planned | in-progress | completed",
      "priority": "low | medium | high",
      "deadline": "ISO date string",
      "projectId": "optional project id",
      "goalId": "optional goal id",
      "createdAt": "ISO date string",
      "updatedAt": "ISO date string"
    }
  ],
  "projects": [...],
  "goals": [...],
  "settings": {
    "theme": "dark | light",
    "showMotivation": true
  }
}
```

## Customization

### Themes
The app supports both dark and light themes. Toggle using the theme button in the sidebar or it will respect your system preference.

### Import/Export
- Export your data as JSON for backup
- Import data from other task management tools
- Migrate between devices easily

## Technical Details

### Tech Stack
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand with persistence
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Date Handling**: date-fns

### Architecture
- **Local-first**: All data stored in browser localStorage
- **Component-based**: Modular React components
- **Type-safe**: Full TypeScript coverage
- **Responsive**: Mobile-first design approach

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Links

- **Live Demo**: [https://anshulmehra001.github.io/Momentum-Task-Studio/](https://anshulmehra001.github.io/Momentum-Task-Studio/)
- **Repository**: [https://github.com/Anshulmehra001/Momentum-Task-Studio](https://github.com/Anshulmehra001/Momentum-Task-Studio)
- **Issues**: [https://github.com/Anshulmehra001/Momentum-Task-Studio/issues](https://github.com/Anshulmehra001/Momentum-Task-Studio/issues)

## Support

If you encounter any issues or have questions:
1. Check the [existing issues](https://github.com/Anshulmehra001/Momentum-Task-Studio/issues) on GitHub
2. Create a [new issue](https://github.com/Anshulmehra001/Momentum-Task-Studio/issues/new) with detailed information
3. Include steps to reproduce any bugs

---

**Made with ❤️ for productivity enthusiasts**
