import { PlaneError } from "./PlaneError";

/**
 * A URL template named a path id the call never supplied.
 *
 * The first failure most callers hit on the flat surface: forgetting a leading id, or
 * reaching a resource whose flat migration is still pending. A bare
 * `Missing path parameter 'project_id'` names the template key and nothing else, so
 * this carries the resource, the method, the template, the id that is missing and the
 * ids that *were* supplied — everything needed to see which argument is absent
 * without opening the SDK.
 */
export class MissingPathIdError extends PlaneError {
  constructor(
    /** The resource class the call was made on, e.g. `States`. */
    public readonly resource: string,
    /** The method that built the URL, e.g. `retrieve`. */
    public readonly action: string,
    /** The URL template being filled, e.g. `/workspaces/{slug}/projects/{project_id}/states/`. */
    public readonly template: string,
    /** The template key with no value behind it, e.g. `project_id`. */
    public readonly missing: string,
    /** Every path id the call did supply, sorted. */
    public readonly supplied: readonly string[]
  ) {
    super(
      `${resource}.${action}() needs the path id '${missing}', which was not supplied. ` +
        `The URL template is '${template}'; ids supplied: ${supplied.length > 0 ? supplied.join(", ") : "none"}. ` +
        `Pass every path id the template names, in path order.`
    );
    this.name = "MissingPathIdError";
  }
}
