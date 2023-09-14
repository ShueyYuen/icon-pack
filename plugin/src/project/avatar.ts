import { MutationBus } from '../mutation';

const imageMap = new Map<string, string>();

const RESIZE_SIZE = 100;

const resizeImageToBase64 = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.setAttribute('crossOrigin', 'anonymous');
  const canvas = document.createElement('canvas');
  canvas.width = RESIZE_SIZE;
  canvas.height = RESIZE_SIZE;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, RESIZE_SIZE, RESIZE_SIZE);
  const base64 = canvas.toDataURL('image/jpeg');
  imageMap.set(img.src, base64.replace(/^data:image\/\w+;base64,/, ''));
};

MutationBus.register({
  when: (element) => element.classList.contains('manage-right-top'),
  callback: (element) => {
    const images = element.querySelectorAll('.user-item img');
    imageMap.clear();
    images.forEach((img) => {
      img.removeEventListener('load', resizeImageToBase64);
      img.addEventListener('load', resizeImageToBase64);
    });
  },
});

export const getAvatar = () => imageMap;
