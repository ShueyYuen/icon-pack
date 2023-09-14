import { optimize } from 'svgo';

export const isContainAnimation = (content: string) =>
  content.includes('<animate') ||
  content.includes('<animateTransform') ||
  content.includes('attributeName=') ||
  content.includes('animation:') ||
  content.includes('<script') ||
  content.includes('<style');

export const optimizeSvg = (content: string) =>
  isContainAnimation(content)
    ? optimize(content, {
        plugins: [
          'removeDimensions',
          'cleanupIds',
          'minifyStyles',
          'removeComments',
          'removeDesc',
          'removeMetadata',
          'removeUselessDefs',
          'removeEditorsNSData',
          'removeUnusedNS',
          'removeUselessStrokeAndFill',
          'removeEmptyAttrs',
          'removeUnknownsAndDefaults',
          'removeEmptyContainers',
          'reusePaths',
          'sortDefsChildren',
          'convertColors',
          {
            name: 'removeAttrs',
            params: {
              attrs: ['stop:id', 'svg:id', 'svg:x', 'svg:y'],
            },
          },
        ],
      }).data
    : optimize(content, {
        plugins: [
          'preset-default',
          'reusePaths',
          'removeDimensions',
          {
            name: 'removeAttrs',
            params: {
              attrs: ['class', 'stop:id', 'svg:id', 'svg:x', 'svg:y'],
            },
          },
        ],
      }).data;
