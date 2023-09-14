import { defaults } from 'lodash-unified';

export enum MessageType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
  DEFAULT = 'default',
}

export type MessageOption = {
  type?: MessageType;
  content: string;
  duration?: number;
};

export const defaultMessageOptions = {
  type: MessageType.DEFAULT,
  duration: 5000,
};

let container: HTMLDivElement | null = null;

const initContainer = () => {
  container = document.createElement('div');
  container.id = 'message-container';
  document.body.appendChild(container);
};

export const useMessage = (o: MessageOption) => {
  !container && initContainer();

  const option = defaults(o, defaultMessageOptions);
  const { content, type, duration } = option;

  const messageElm = document.createElement('div');
  messageElm.className = `soft--box soft--message ${type}`;
  messageElm.innerHTML = content;

  // 显示
  setTimeout(() => {
    messageElm.remove();
  }, duration);

  container!.appendChild(messageElm);
};
