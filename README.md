# Vison - The Smarter Way to View, Edit, and Securely Share JSON

<img src="public\vison.svg" alt="Vison Logo" width="125">

### Try out [Vison](https://vison.wazeer.dev)!
[![Netlify Status](https://api.netlify.com/api/v1/badges/a5cb7aaa-62dc-4600-bf9d-d1e82d3a5eac/deploy-status)](https://app.netlify.com/projects/vi-son/deploys)
[![Daily Purge](https://github.com/wazeerc/vison/actions/workflows/db-purge.yml/badge.svg?branch=main)](https://github.com/wazeerc/vison/actions/workflows/db-purge.yml)

## ✨ Features

- 🖥️ **Modern UI:** Clean, beginner-friendly interface for effortless JSON editing and viewing.
- 🪄 **Non-technical Friendly:** Vison is a web application designed to help non-technical individuals easily view, edit and JSON data.
- 📊 **Table & Tree Views:** Instantly switch between table and tree views for simple or deeply nested JSON.
- 📝 **Direct Editing:** Edit JSON values directly in the table or tree view.
- 📥 **Download:** Export your edited JSON as a file with a single click.
- 📄 **Copy to Clipboard:** Copy formatted JSON to your clipboard instantly.
- 🔐 **Secure Share:** End-to-end encrypted sharing, your data is encrypted in your browser, and only those with your unique link can access it.
- ⏳ **Expiring Links:** Shared links expire after 30 minutes for extra privacy.
- ☁️ **Supabase Integration:** Secure Share feature uses Supabase for backend storage (bring your own keys).

> [!NOTE]
> Vison is currently in **Beta**. You might encounter bugs. Feel free to open an issue or submit a pull request.

## Requirements

- [Node.js](https://nodejs.org/) (LTS version recommended)

### Stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Usage

1. **Clone the repository:**

```bash
git clone https://github.com/wazeerc/vison.git
cd vison
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

Copy the example environment file and configure your Supabase credentials:

```bash
cp .env.example .env
```

Edit the `.env` file with your actual Supabase credentials (see [Supabase Setup](#supabase-setup-for-secure-share) below).

4. **Run the development server:**

```bash
npm run dev
```

The application will be available at `http://localhost:8080`.

## Supabase Setup for Secure Share

To use the Secure Share feature, you need a free [Supabase](https://supabase.com/) account.

1. Create a Supabase project and get your Project URL and anon key from the API settings.
2. Copy `.env.example` to `.env` and update with your credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key
```

3. Create the table in the SQL editor:

```sql
CREATE TABLE IF NOT EXISTS vison (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    json jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc', now())
  );
  CREATE INDEX IF NOT EXISTS idx_vison_created_at ON vison(created_at);
```

4. Optional: Set up automatic cleanup (Edge Function or cron) to delete rows older than 30 minutes:

```sql
DELETE FROM vison WHERE created_at < NOW() - INTERVAL '30 minutes';
```

Note: In the current implementation, the Supabase table is cleared every 24 hours using a cron job which invokes an [Edge Function](https://supabase.com/docs/guides/functions).

## Contributing

Found a bug or have a feature request? Please check the [issues page](https://github.com/wazeerc/vison/issues) or open a new one. Pull requests are also welcome!

> [!IMPORTANT]
> Please make sure to follow the code style and guidelines in the [CODE_STYLE.md](CODE_STYLE.md) file. Run `npm run fix` to format your code before submitting a PR.
