import { ChildProcess, spawn } from 'node:child_process';

export interface ProcessResult {
  code: number | null;
  stdout: string;
  stderr: string;
  cancelled: boolean;
}

export interface ProcessOptions {
  command: string;
  args: string[];
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  onStdout?: (chunk: string) => void;
  onStderr?: (chunk: string) => void;
  registerCancellation?: (cancel: () => void) => void;
}

export function runProcess(options: ProcessOptions): Promise<ProcessResult> {
  return new Promise((resolve, reject) => {
    let child: ChildProcess;
    try {
      child = spawn(options.command, options.args, {
        cwd: options.cwd,
        env: options.env,
        stdio: ['ignore', 'pipe', 'pipe'],
        windowsHide: true,
      });
    } catch (error) {
      reject(error);
      return;
    }
    let stdout = '';
    let stderr = '';
    let cancelled = false;
    let settled = false;
    const cancel = () => {
      if (settled) return;
      cancelled = true;
      try { child.kill(); } catch { /* already stopped */ }
    };
    options.registerCancellation?.(cancel);
    child.stdout?.on('data', (data) => {
      const chunk = String(data);
      stdout += chunk;
      options.onStdout?.(chunk);
    });
    child.stderr?.on('data', (data) => {
      const chunk = String(data);
      stderr += chunk;
      options.onStderr?.(chunk);
    });
    child.once('error', (error) => {
      settled = true;
      reject(error);
    });
    child.once('close', (code) => {
      if (settled) return;
      settled = true;
      resolve({ code, stdout, stderr, cancelled });
    });
  });
}
