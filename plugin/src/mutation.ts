export interface MutationCallback {
  when?: (element: HTMLElement) => boolean;
  callback: (element: HTMLElement) => void;
}

export class MutationBus {
  private static instance: MutationBus = new MutationBus();
  private observer: MutationObserver;
  private callbacks: Array<MutationCallback> = [];

  private constructor() {
    this.observer = new MutationObserver(this.mutationHandler.bind(this));
    const config = { childList: true, subtree: true };
    document.addEventListener("DOMContentLoaded", () =>
      this.observer.observe(document.body, config)
    );
  }

  private mutationHandler(mutations: MutationRecord[]) {
    mutations.forEach((mutation) => {
      // 检查是否有新的节点被添加到项目元素中
      if (mutation.addedNodes) {
        Array.from(mutation.addedNodes)
          .filter((node) => node instanceof HTMLElement)
          .forEach((node) => {
            const element = node as HTMLElement;
            this.callbacks.forEach((handle) => {
              if (!handle.when || handle.when(element)) {
                handle.callback(element);
              }
            });
          });
      }
    });
  }

  public static register(callback: MutationCallback) {
    MutationBus.instance.callbacks.push(callback);
  }
}
