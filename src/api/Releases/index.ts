import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { CreateRelease, Release, UpdateRelease } from "../../models/Release";
import { Tags } from "./Tags";
import { Labels } from "./Labels";
import { ItemLabels } from "./ItemLabels";

/**
 * Releases API resource
 * Manages releases at the workspace level with tags, labels, and item-label sub-resources
 */
export class Releases extends BaseResource {
  public tags: Tags;
  public labels: Labels;
  public itemLabels: ItemLabels;

  constructor(config: Configuration) {
    super(config);
    this.tags = new Tags(config);
    this.labels = new Labels(config);
    this.itemLabels = new ItemLabels(config);
  }

  async list(workspaceSlug: string): Promise<Release[]> {
    const data = await this.get<Release[] | { results: Release[] }>(`/workspaces/${workspaceSlug}/releases/`);
    return Array.isArray(data) ? data : data.results;
  }

  async create(workspaceSlug: string, data: CreateRelease): Promise<Release> {
    return this.post<Release>(`/workspaces/${workspaceSlug}/releases/`, data);
  }

  async update(workspaceSlug: string, releaseId: string, data: UpdateRelease): Promise<Release> {
    return this.patch<Release>(`/workspaces/${workspaceSlug}/releases/${releaseId}/`, data);
  }
}
