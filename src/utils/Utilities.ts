// Helper functions for gatsbycli.ts
import { window, workspace, Terminal, WorkspaceFolder, Uri } from 'vscode';

export default class Utilities {
  static getActiveTerminal() {
    const { terminals, createTerminal } = window;
    const filteredTerminals = terminals.filter(
      (obj: Terminal) => obj.name === 'GatsbyHub'
    );

    let terminal: Terminal;

    // if there is no gatsby terminal running, create one
    if (filteredTerminals.length === 0) {
      terminal = createTerminal('GatsbyHub');
    } else {
      // if gatsby terminal already exists, return it
      [terminal] = filteredTerminals;
    }

    return terminal;
  }

  static getActiveServerTerminal() {
    const { terminals, createTerminal } = window;
    const filteredTerminals = terminals.filter(
      (obj: Terminal) => obj.name === 'Gatsby Server'
    );

    let terminal: Terminal;

    if (filteredTerminals.length === 0) {
      terminal = createTerminal('Gatsby Server');
    } else {
      [terminal] = filteredTerminals;
    }

    return terminal;
  }

  static async checkIfWorkspaceEmpty(): Promise<boolean> {
    const currWorkspace: readonly WorkspaceFolder[] | undefined =
      workspace.workspaceFolders;

    if (currWorkspace === undefined) return false;

    const uri = Uri.file(currWorkspace[0].uri.path);

    const data = await workspace.fs.readDirectory(uri);

    return data.length < 1;
  }

  static async checkIfGatsbySiteInitiated(root: string): Promise<boolean> {
    const uri = Uri.file(root);

    const data = await workspace.fs.readDirectory(uri);

    // if workspace is empty, that means a gatsby site has not been initiated
    if (data.length < 1) return false;

    let initiated: boolean = false;
    // if there are files/folders
    data.forEach((file) => {
      // if one of these files is gatsby-config set initiated to true
      if (file[0] === 'gatsby-config.js') initiated = true;
    });

    return initiated;
  }

  static getRootPath() {
    if (window.activeTextEditor) {
      return (
      // gets path to file in active text editor
        window.activeTextEditor?.document.fileName
        // replaces spaces with backslash
          .replace(/\s/g, '\\ ')
        // drops fileName and common folders that aren't part of the root path
          .replace(
            /\/(src\/)?(pages\/)?(components\/)?[a-zA-Z\-\d]+\.(ts)?(js)?x?/,
            '',
          )
      );
    }

    const currWorkspace: readonly WorkspaceFolder[] | undefined =
      workspace.workspaceFolders;

    console.log('currSpace --> ', currWorkspace[0].name);
    if (currWorkspace === undefined) return currWorkspace;

    const uri = Uri.file(currWorkspace[0].uri.path);
    return uri.path;
  }
}
