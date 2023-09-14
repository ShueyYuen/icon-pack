import { noop, tryOnScopeDispose, unrefElement } from '@vueuse/core';

interface UploadOptions<T> {
  accept: string;
  multiple: boolean;
  fileParse: (file: File) => Promise<T> | undefined;
}

export const useUploadHook = <T>(
  element: MaybeRef<HTMLElement | undefined>,
  options: MaybeRef<UploadOptions<T>>
) => {
  const files = ref<Array<T>>([]) as Ref<Array<T>>;

  const parseFiles = (originFiles: FileList | null | undefined, options: UploadOptions<T>) => {
    const originFilesArray = Array.from(originFiles ?? []);
    if (!originFilesArray.length) {
      return;
    }
    originFilesArray.forEach(async (file) => {
      const parsed = await options.fileParse(file);
      if (parsed) {
        !options.multiple && (files.value.length = 0);
        files.value.push(parsed);
      }
    });
  };

  const register = (elm: HTMLElement, options: UploadOptions<T>) => {
    const dragover = (e: DragEvent) => {
      e.preventDefault();
      elm.classList.add('drop');
    };
    const dragleave = (e: DragEvent) => {
      e.preventDefault();
      elm.classList.remove('drop');
    };
    const drop = (e: DragEvent) => {
      e.preventDefault();
      elm?.classList.remove('drop');
      parseFiles(e.dataTransfer?.files, options);
    };
    elm.addEventListener('dragover', dragover);
    elm.addEventListener('dragleave', dragleave);
    elm.addEventListener('drop', drop);
    return () => {
      elm.removeEventListener('dragover', dragover);
      elm.removeEventListener('dragleave', dragleave);
      elm.removeEventListener('drop', drop);
    };
  };

  let stopListener = noop;

  const stopWatch = watch(
    () => [unrefElement(element), toValue(options)],
    ([elm, options]) => {
      stopListener();
      if (!elm) {
        return (stopListener = noop);
      }
      stopListener = register(elm as HTMLElement, options as UploadOptions<T>);
    },
    { immediate: true, flush: 'post' }
  );

  const stop = () => {
    stopWatch();
    stopListener();
  };

  const click = () => {
    const option = toValue(options);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = option.accept;
    input.style.display = 'none';
    input.multiple = option.multiple;
    document.body.appendChild(input);
    input.click();

    input.addEventListener('change', function () {
      parseFiles(input.files, option);
      document.body.removeChild(input);
    });
  };

  tryOnScopeDispose(stop);

  return { stop, click, files };
};
