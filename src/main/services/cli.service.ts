import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { BrowserWindow, app } from 'electron';
import path from 'path';
import { DATA_DIR } from '../utils/setupHelpers';

export default class CliService {
  private cliPath: string;

  private process: ChildProcessWithoutNullStreams | null = null;

  constructor() {
    this.cliPath = app.isPackaged
      ? path.join(process.resourcesPath, 'bin', 'fake-installer')
      : path.join(
          __dirname,
          '../../bin/rosetta/rosetta-2.7.0-mac_aarch64/bin/rosetta',
        );
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
    if (args.length !== 2) {
      throw new Error('Invalid number of arguments');
    }
    args[1] = path.join(DATA_DIR, args[1]);

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
