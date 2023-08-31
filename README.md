# Auto Error Fixer - Visual Studio Code Extension

Auto Error Fixer is an AI-powered Visual Studio Code extension that helps you automatically fix common developer-made errors in your code. Say goodbye to manual error corrections and save time with automated fixes.

## Features

- Automatic detection and correction of common coding errors.
- Integration with AI-powered code generation for error fixes.
- Support for a wide range of programming languages.
- Highly customizable to suit your coding style and preferences.

## Installation

1. Open Visual Studio Code.
2. Go to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window.
3. Search for "Auto Error Fixer."
4. Click the Install button.

## Usage

1. Open a code file with errors in Visual Studio Code.
2. The extension will automatically detect errors and suggest fixes.
3. Use the "Auto Fix" command from the Command Palette or right-click on an error to apply the suggested fix.


## Configuration

Auto Error Fixer can be customized to suit your needs. Edit the settings in your `settings.json` file:

```json
{
  "auto-error-fixer.enable": true,
  "auto-error-fixer.language": "javascript",
  "auto-error-fixer.maxSuggestions": 3
}
```