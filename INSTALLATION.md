# Installation Guide

## Prerequisites

- Visual Studio Code 1.85.0 or higher
- pnpm (for development)

## Installing for Development

1. Clone the repository:

   ```
   git clone <repository-url>
   ```

2. Navigate to the extension directory:

   ```
   cd line-comment-collector
   ```

3. Install dependencies:

   ```
   pnpm install
   ```

4. Compile the extension:

   ```
   pnpm run compile
   ```

5. Run tests to verify installation:
   ```
   pnpm run test
   ```

## Running the Extension in Development Mode

1. Open the project in VS Code:

   ```
   code .
   ```

2. Press `F5` to launch the extension in a new Extension Development Host window

3. Or run the "Run Extension" debug configuration from the Debug view

## Packaging the Extension

To package the extension for distribution:

1. Run the packaging script:

   ```
   pnpm run package
   ```

2. This will create a production build in the `dist` folder

## Installing the Extension Locally

1. Package the extension as described above

2. In VS Code, go to Extensions view (`Ctrl+Shift+X`)

3. Click on the "..." menu and select "Install from VSIX..."

4. Select the generated `.vsix` file (if you've created one) or install directly from the `dist` folder

## Publishing to VS Code Marketplace

1. Ensure you have a publisher account on the VS Code Marketplace

2. Update the `package.json` with your publisher ID:

   ```json
   {
     "publisher": "your-publisher-id"
   }
   ```

3. Package the extension:

   ```
   pnpm run package
   ```

4. Publish using vsce:
   ```
   vsce publish
   ```

## Publishing to Open VSX Registry

1. Ensure you have a publisher account on Open VSX Registry (create one at https://open-vsx.org if needed)

2. Install the ovsx CLI tool:
   ```
   pnpm add -D ovsx
   ```

3. Create a personal access token (PAT) on Open VSX Registry

4. Set the PAT as an environment variable:
   ```
   export OVSX_PAT=your-personal-access-token
   ```

5. Publish using ovsx:
   ```
   ovsx publish
   ```

## Troubleshooting

- If you encounter compilation errors, ensure all dependencies are installed with `pnpm install`
- If tests fail, check that VS Code is properly installed and accessible
- If the extension doesn't load, verify that your VS Code version meets the minimum requirement
