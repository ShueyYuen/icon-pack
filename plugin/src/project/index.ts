import { projectInfo } from "./detail";

export interface ProjectInformation {
  id: string;
}

export const getProjectInfo = (): ProjectInformation => {
  const url = new URL(window.location.href);
  const id = url.searchParams.get("projectId");

  return {
    id: id ?? "",
    ...projectInfo,
  };
};

export * from "./detail";
