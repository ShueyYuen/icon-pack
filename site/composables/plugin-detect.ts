export const usePluginDetect = () => {
  if (process.client) {
    const pluginInstall = ref(true);

    const time = setTimeout(() => (pluginInstall.value = false), 150);
    const loadedHandle = () => {
      clearTimeout(time);
      pluginInstall.value = true;
    };
    document.removeEventListener('plugin-loaded', loadedHandle);
    document.addEventListener('plugin-loaded', loadedHandle);
    // 发送事件查询插件是否安装
    document.dispatchEvent(new CustomEvent('plugin-detect'));
    return pluginInstall;
  }
  return false;
};
