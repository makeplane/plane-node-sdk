/** POST `.../work-items/{id}/relations/` body — links to `work_item_ids` via `relation_definition_id`; `direction` picks the side. */
export interface WorkItemRelationCreateRequest {
  /** The definition's outward or inward label — sets the relation direction. */
  direction: string;
  relation_definition_id: string;
  work_item_ids: string[];
}

/** Related work-item ids grouped by direction label. `list` returns one grouped object, not paged rows. */
export type WorkItemRelationList = Record<string, string[]>;
