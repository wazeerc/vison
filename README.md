# Vison

Vison - Visualize JSON: The Smarter Way to View, Edit, and Share JSON

## About

Vison is a web application designed to help both technical and non-technical users easily view, edit, and collaborate on JSON data through an intuitive interface.

This application was initially vibe coded on [Lovable](https://lovable.dev/) and further fine-tuned in VSCode Agent Mode using Gemini 2.5 Pro.

**Note:** Vison is currently in **Beta**. You might encounter bugs. Contributions are welcome! Feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/wazeerc/vison).

## Purpose

The primary goal of Vison is to simplify the process of interacting with JSON data, making it accessible even if you're not familiar with the technical details of the format, while providing collaboration features for teams.

## Requirements

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/)
- [Supabase](https://supabase.com/) account (for share feature)

### Stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (for data persistence)

## Environment Variables

Create a `.env` file in the root directory with:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key 