# Vison

Vison - Visualize JSON: The Smarter Way to View and Edit JSON

## About

Vison is a web application designed to help non-technical individuals easily view and edit JSON data through an intuitive interface.

This application was initially vibe coded on [Lovable](https://lovable.dev/) and further fine-tuned in VSCode Agent Mode using Gemini 2.5 Pro.

**Note:** Vison is currently in **Beta**. You might encounter bugs. Contributions are welcome! Feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/wazeerc/vison).

## Purpose

The primary goal of Vison is to simplify the process of interacting with JSON data, making it accessible even if you're not familiar with the technical details of the format.

## Requirements

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/)

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

## How to Use Vison (Guides)

1. **Input JSON:** Paste your JSON data directly into the text area or drag and drop a `.json` file onto the input area.
2. **View Data:** Vison automatically parses the JSON and displays it in a user-friendly table view. For complex, deeply nested JSON (depth >= 4), it automatically switches to a tree view. You can manually toggle between table and tree views using the buttons provided.
3. **Edit Data:**
    - **Table View:** Double-click on values within the table cells to edit them directly. Press Enter or click outside the cell to save the change.
    - **Tree View:** Editing in the tree view might be limited depending on the implementation.
4. **Download:** Once you're done editing, click the download icon button to save the modified JSON data as `vison-export.json`.
5. **Copy:** Click the copy icon button to copy the current, formatted JSON to your clipboard.

## Contributing

Found a bug or have a feature request? Please check the [issues page](https://github.com/wazeerc/vison/issues) or open a new one. Pull requests are also welcome!
