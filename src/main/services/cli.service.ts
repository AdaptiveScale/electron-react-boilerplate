import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { BrowserWindow, app } from 'electron';
import path from 'path';

export default class CliService {
  private cliPath: string;

  private process: ChildProcessWithoutNullStreams | null = null;

  constructor() {
    this.cliPath = app.isPackaged
      ? path.join(process.resourcesPath, 'bin', 'fake-installer')
      : path.join(__dirname, '../../bin/fake-installer');
  }

  setPath(value: string) {
    if (this.process) {
      throw new Error('A command is already running. Please wait.');
    }
    this.cliPath = value;
  }

  getStatus() {
    return {
      path: this.cliPath,
      status: this.process ? 'running' : 'stopped',
    };
  }

  runCommand(mainWindow: BrowserWindow, args: string[]) {
    return new Promise<void>((resolve, reject) => {
      if (this.process) {
        reject(new Error('A command is already running. Please wait.'));
        return;
      }

      this.process = spawn(this.cliPath, args, { shell: true });

      this.process.stdout.on('data', (data) => {
        mainWindow.webContents.send('cli:output', '', data.toString());
      });

      this.process.stderr.on('data', (data) => {
        mainWindow.webContents.send('cli:error', '', data.toString());
      });

      this.process.on('close', (code) => {
        mainWindow.webContents.send(
          'cli:done',
          `Process exited with code ${code}`,
        );
        this.process = null;
        resolve();
      });

      this.process.on('error', (err) => {
        mainWindow.webContents.send(
          'cli:error',
          `Process error: ${err.message}`,
        );
        this.process = null;
        reject(err);
      });
    });
  }

  sendInput(input: string) {
    if (this.process && this.process.stdin) {
      this.process.stdin.write(`${input}\n`);
    }
  }

  stopCommand() {
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
  }
}
