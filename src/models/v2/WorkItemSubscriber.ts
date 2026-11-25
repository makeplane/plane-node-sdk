/** The users subscribed to a work item. A singleton list, not a page of rows. */
export interface WorkItemSubscribers {
  subscriber_ids: string[];
}

/** PATCH body: subscribe `add`, unsubscribe `remove`. Both optional, at most 100 ids each, never the same id in both. */
export interface UpdateWorkItemSubscribers {
  add?: string[];
  remove?: string[];
}
