# Vison

<img src="public\vison.svg" alt="Vison Logo" width="100">

<br/>

Vison - Visualize JSON: The Smarter Way to View, Edit, and Securely Share JSON

## About

Vison is a web application designed to help non-technical individuals easily view and edit JSON data through an intuitive interface.

**New: Secure Share!**

Vison now lets you share JSON data with end-to-end encryption. When you use the Share button, your JSON is encrypted in your browser and only those with your unique link can decrypt and view it. Even the server cannot see your data.

This application was initially vibe coded on [Lovable](https://lovable.dev/) and further fine-tuned in VSCode Agent Mode.

**Note:** Vison is currently in **Beta**. You might encounter bugs. Contributions are welcome! Feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/wazeerc/vison).

## Purpose

The primary goal of Vison is to simplify the process of interacting with JSON data, making it accessible even if you're not familiar with the technical details of the format.

## Requirements

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/)

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
    # or
    # yarn install
    # or
    # pnpm install
    ```

3. **Run the development server:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:8080` (or another port if 8080 is busy).

## How to Use Vison

1. **Input JSON:** Paste your JSON data directly into the text area or drag and drop a `.json` file onto the input area.
2. **View Data:** Vison automatically parses the JSON and displays it in a user-friendly table view. For complex, deeply nested JSON (depth >= 4), it automatically switches to a tree view. You can manually toggle between table and tree views using the buttons provided.
3. **Edit Data:**
    - **Table View:** Double-click on values within the table cells to edit them directly. Press Enter or click outside the cell to save the change.
    - **Tree View:** Editing in the tree view might be limited depending on the implementation.
4. **Download:** Once you're done editing, click the download icon button to save the modified JSON data as `vison-export.json`.
5. **Copy:** Click the copy icon button to copy the current, formatted JSON to your clipboard.
6. **Secure Share:** Click the Share button to generate a secure, encrypted link. The link is copied to your clipboard. Anyone with the link can view and edit the JSON, but the data is encrypted and cannot be read by the server or anyone without the link.

   - How it works: Your JSON is encrypted in your browser before upload. The decryption key is only included in the link (after the <code>#</code>). Only someone with the full link can decrypt and view the data.
   - Links expire after 15 minutes for extra privacy.

## Supabase Setup for Secure Share

To use the Secure Share feature, you need a free [Supabase](https://supabase.com/) account.

1. Create a Supabase project and get your Project URL and anon key from the API settings.
2. Set up your <code>.env</code> file in the project root:

   ```env
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_KEY="your-anon-key"
   ```

3. Create the table in the SQL editor:

   ```sql
   CREATE TABLE IF NOT EXISTS shared_json (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     json jsonb NOT NULL,
     created_at timestamp with time zone DEFAULT timezone('utc', now())
   );
   CREATE INDEX IF NOT EXISTS idx_shared_json_created_at ON shared_json(created_at);
   ```

4. Optional: Set up automatic cleanup (Edge Function or cron) to delete rows older than 15 minutes:

   ```sql
   DELETE FROM shared_json WHERE created_at < NOW() - INTERVAL '15 minutes';
   ```

   Note: In the current implementation, the Supabase table is cleared every 24 hours using a cron job which invokes an [Edge Function](https://supabase.com/docs/guides/functions).

5. Start the app and enjoy secure sharing!

## Contributing

Found a bug or have a feature request? Please check the [issues page](https://github.com/wazeerc/vison/issues) or open a new one. Pull requests are also welcome!
