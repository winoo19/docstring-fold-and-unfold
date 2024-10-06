import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  // Fold docstrings command
  let foldCommand = vscode.commands.registerCommand("extension.foldDocstrings", () => {
    foldOrUnfoldDocstrings("fold");
  });

  // Unfold docstrings command
  let unfoldCommand = vscode.commands.registerCommand("extension.unfoldDocstrings", () => {
    foldOrUnfoldDocstrings("unfold");
  });

  // Toggle docstrings command
  let toggleCommand = vscode.commands.registerCommand("extension.toggleDocstrings", () => {
    toggleDocstrings();
  });

  context.subscriptions.push(foldCommand);
  context.subscriptions.push(unfoldCommand);
  context.subscriptions.push(toggleCommand);
}

function foldOrUnfoldDocstrings(action: "fold" | "unfold") {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor!");
    return;
  }

  const doc = editor.document;
  const docText = doc.getText();

  // Regex to match Python docstrings
  const docstringRegex = /("""[\s\S]*?"""|'''[\s\S]*?''')/g;

  let match;
  while ((match = docstringRegex.exec(docText)) !== null) {
    const matchStartIndex = match.index;
    const matchEndIndex = docstringRegex.lastIndex;

    const startPos = doc.positionAt(matchStartIndex);
    const endPos = doc.positionAt(matchEndIndex);

    // Fold or unfold the range starting from the start line
    if (action === "fold") {
      editor.selection = new vscode.Selection(startPos, startPos);
      vscode.commands.executeCommand("editor.fold", { selectionLines: [startPos.line] });
    } else if (action === "unfold") {
      editor.selection = new vscode.Selection(startPos, startPos);
      vscode.commands.executeCommand("editor.unfold", { selectionLines: [startPos.line] });
    }
  }
}

function toggleDocstrings() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showErrorMessage("No active editor!");
    return;
  }

  const doc = editor.document;
  const docText = doc.getText();
  const docstringRegex = /("""[\s\S]*?"""|'''[\s\S]*?''')/g;

  let match;
  while ((match = docstringRegex.exec(docText)) !== null) {
    const matchStartIndex = match.index;
    const startPos = doc.positionAt(matchStartIndex);

    // Toggle fold/unfold at the current selection
    editor.selection = new vscode.Selection(startPos, startPos);
    vscode.commands.executeCommand("editor.toggleFold");
  }
}

export function deactivate() {}
