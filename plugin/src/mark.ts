import { MutationBus } from "./mutation";
import style from "./styles/global.module.less";

export const markColorfulIcon = () => {
  MutationBus.register({
    when: (element) => element.className === "project-iconlist",
    callback: (element) => {
      $(element)
        .find("li")
        .filter((index, ele) => {
          return $(ele).find('.icon-twrap').html().includes('fill=');
        })
        .addClass(style.colorful);
    },
  });
};
