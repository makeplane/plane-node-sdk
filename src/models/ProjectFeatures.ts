/**
 * Project Features model interfaces
 */
export interface ProjectFeatures {
  epics: boolean;
  modules: boolean;
  cycles: boolean;
  views: boolean;
  pages: boolean;
  intakes: boolean;
  work_item_types: boolean;
}

export type UpdateProjectFeatures = Partial<ProjectFeatures>;

