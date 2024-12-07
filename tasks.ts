type TaskId = string;

type Task = {
  timerId: number;
};

const PENDING_TASKS = new Map<string, Task>();

export function scheduleTask<Callback extends () => void>(
  timeout: number,
  taskId: TaskId,
  callback: Callback
) {
  const timerId = setTimeout(() => {
    try {
      callback();
    } finally {
      PENDING_TASKS.delete(taskId);
    }
  }, timeout);
  PENDING_TASKS.set(taskId, { timerId });
}

export function cancelTask(taskId: TaskId) {
  const task = PENDING_TASKS.get(taskId);

  if (task) {
    clearTimeout(task.timerId);
    PENDING_TASKS.delete(taskId);
  }
}

export function getPendingTask(taskId: string): Task | undefined {
  return PENDING_TASKS.get(taskId);
}
