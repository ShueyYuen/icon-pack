import { hasManagePermission } from './project';
import style from './styles/global.module.less';
import { renderIcon } from './svg/sprite';
import { MutationBus } from './mutation';

export interface Drawer {
  show: (src: string) => void;
  hide: () => void;
  element: JQuery<HTMLElement>;
}

const preparedDrawer = (): Drawer => {
  const drawer = $(`<div></div>`);
  drawer.addClass([style.iconGenerateDrawer, style.hide]);
  const iframe = $('<iframe id="icon-pack"></iframe>');

  const drawerInstance = {
    show: (src: string) => {
      drawer.removeClass(style.hide);
      $('html').addClass('dialog-lock-hide').attr('style', 'margin-right: 6px;');
      iframe.attr('src', src);
      drawer.append(iframe);
    },
    hide: () => {
      drawer.addClass(style.hide);
      $('html').removeClass('dialog-lock-hide').attr('style', 'margin-right: 0px;');
      iframe.attr('src', '');
    },
    element: drawer,
  };

  drawer.on('click', () => drawerInstance.hide());

  return drawerInstance;
};

export const initDrawer = () => {
  const drawer = preparedDrawer();

  const migrateButton = $(
    `<button id="migrate-button">${renderIcon('migrate').outerHTML}</button>`
  );
  migrateButton.addClass([style.iconGenerateButton, 'bar-text btn btn-normal']);
  const tooltip = $(
    `<span>迁移到icon-pack平台，该项目中的图标和用户关系都会被迁移。
    如果用户不存在则默认创建用户，初始密码为@123456</span>`
  );
  tooltip.addClass(style.tooltip);
  migrateButton.append(tooltip);
  migrateButton.on('click', () => {
    if (!hasManagePermission()) {
      return;
    }
    drawer.show(`${process.env.ICON_PLUGIN_BACKEND}/migrate`);
  });

  const menuButton = $(`<span class="radius-btn">${renderIcon('menu').outerHTML}</span>`);
  menuButton.addClass(style.iconGenerateMenu);
  menuButton.on('click', () => drawer.show(`${process.env.ICON_PLUGIN_BACKEND}/`));

  MutationBus.register({
    when: (element) => element.className === 'project-manage-bar',
    callback: (element) => {
      $(element).prepend(migrateButton);
      $(document.body).append(drawer.element);
    },
  });

  MutationBus.register({
    when: (element) => element.className === 'block-radius-btn-group clearfix',
    callback: (element) => $(element).prepend(menuButton),
  });
};
