import { initDrawer } from './drawer';
import { markColorfulIcon } from './mark';
import { registerDetailInterceptor } from './project';

const projectSite = process.env.ICON_PLUGIN_BACKEND || 'http://localhost:3000';

const isRunningInProjectSite = window.location.href.startsWith(projectSite);

if (isRunningInProjectSite) {
  const detectHandle = () => {
    document.dispatchEvent(new CustomEvent('plugin-loaded'));
  };
  document.removeEventListener('plugin-detect', detectHandle);
  document.addEventListener('plugin-detect', detectHandle);
} else {
  registerDetailInterceptor();
  markColorfulIcon();
  initDrawer();
}
