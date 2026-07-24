import { BaseResource } from "../BaseResource";
import { Configuration } from "../../Configuration";
import { CreateRelease, Release, UpdateRelease } from "../../models/Release";
import { Tags } from "./Tags";
import { Labels } from "./Labels";
import { ItemLabels } from "./ItemLabels";
import { Changelog } from "./Changelog";
import { Comments } from "./Comments";
import { Links } from "./Links";
import { WorkItems } from "./WorkItems";

/**
 * Releases API resource
 * Manages releases at the workspace level with tags, labels, item-label,
 * changelog, comment, link, and work-item sub-resources
 */
export class Releases extends BaseResource {
  public tags: Tags;
  public labels: Labels;
  public itemLabels: ItemLabels;
  public changelog: Changelog;
  public comments: Comments;
  public links: Links;
  public workItems: WorkItems;

  constructor(config: Configuration) {
    super(config);
    this.tags = new Tags(config);
    this.labels = new Labels(config);
    this.itemLabels = new ItemLabels(config);
    this.changelog = new Changelog(config);
    this.comments = new Comments(config);
    this.links = new Links(config);
    this.workItems = new WorkItems(config);
  }

  async list(workspaceSlug: string): Promise<Release[]> {
    const data = await this.get<Release[] | { results: Release[] }>(`/workspaces/${workspaceSlug}/releases/`);
    return Array.isArray(data) ? data : data.results;
  }

  async retrieve(workspaceSlug: string, releaseId: string): Promise<Release> {
    return this.get<Release>(`/workspaces/${workspaceSlug}/releases/${releaseId}/`);
  }

  async create(workspaceSlug: string, data: CreateRelease): Promise<Release> {
    return this.post<Release>(`/workspaces/${workspaceSlug}/releases/`, data);
  }

  async update(workspaceSlug: string, releaseId: string, data: UpdateRelease): Promise<Release> {
    return this.patch<Release>(`/workspaces/${workspaceSlug}/releases/${releaseId}/`, data);
  }

  async delete(workspaceSlug: string, releaseId: string): Promise<void> {
    return this.httpDelete(`/workspaces/${workspaceSlug}/releases/${releaseId}/`);
  }
}
