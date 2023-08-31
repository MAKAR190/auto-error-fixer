import * as vscode from "vscode";
import * as openai from "openai";

const openaiClient = new openai.OpenAI({
  apiKey: "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",
});

// Store unique error messages with their locations and associated code
const uniqueErrors = new Map<string, { range: vscode.Range; code: string }>();

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "auto-error-fixer.fixErrors",
    () => {
      console.log("Command 'auto-error-fixer.fixErrors' executed");
      const activeEditor = vscode.window.activeTextEditor;
      if (activeEditor) {
        console.log("Processing active document");

        const document = activeEditor.document;

        // Process the document's diagnostics
        const diagnostics = vscode.languages.getDiagnostics(document.uri);
        for (const diagnostic of diagnostics) {
          if (
            diagnostic.severity === vscode.DiagnosticSeverity.Error &&
            !uniqueErrors.has(diagnostic.message) &&
            !hasErrorOnSameLine(uniqueErrors, diagnostic)
          ) {
            const code = document.getText(diagnostic.range);
            uniqueErrors.set(diagnostic.message, {
              range: diagnostic.range,
              code,
            });
            fixError(document, diagnostic);
          }
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

function hasErrorOnSameLine(
  uniqueErrors: Map<string, { range: vscode.Range; code: string }>,
  diagnostic: vscode.Diagnostic
) {
  const line = diagnostic.range.start.line; // Get the line number from the diagnostic range
  for (const [, errorInfo] of uniqueErrors) {
    if (errorInfo.range.start.line === line) {
      return true;
    }
  }
  return false;
}

// ... (rest of the code)

async function fixError(
  document: vscode.TextDocument,
  diagnostic: vscode.Diagnostic
): Promise<void> {
  try {
    // Get the error message from the diagnostic
    const errorMessage = diagnostic.message;

    // Get the range of the line containing the error
    const line = document.lineAt(diagnostic.range.start.line);
    const range = line.rangeIncludingLineBreak;

    // Determine the programming language based on the file type
    let language = "TypeScript"; // Default to TypeScript
    if (document.languageId === "javascript") {
      language = "JavaScript";
    }
    // Add more conditions for other programming languages as needed

    // Use GPT-3 to generate a code fix based on the error message and language
    const response = await openaiClient.completions.create({
      model: "text-davinci-003",
      prompt:
        `Fix the following ${language} error by providing only a valid code solution:\n\n` +
        `Error message: ${errorMessage}\n` +
        `Code snippet:\n${line.text}\n` +
        `Please fix the error by:`,
      temperature: 0, // Set temperature to 0 to make responses more focused
    });

    // Extract the generated code fix from the GPT-3 response
    const generatedFix = response.choices[0].text;

    // Apply the generated fix to the entire line
    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, range, generatedFix);
    vscode.workspace.applyEdit(edit);
  } catch (error) {
    console.error("Error calling GPT-3 API:", error);
  }
}

export function deactivate() {}
