import { PriorityEnum } from "./common";
import { WorkItem } from "./WorkItem";

export interface IntakeWorkItem {
  id: string;
  issue_detail?: WorkItem;
  inbox?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  status?: IntakeWorkItemStatusEnum;
  snoozed_till?: string;
  source?: string;
  source_email?: string;
  external_source?: string;
  external_id?: string;
  extra?: any;
  created_by?: string;
  updated_by?: string;
  project?: string;
  workspace?: string;
  intake: string;
  issue?: string;
  duplicate_to?: string;
}

export interface IntakeWorkItemCreateRequest {
  issue: WorkItemForIntakeRequest; // Issue data for the intake issue
  intake?: string;
  status?: IntakeWorkItemStatusEnum;
  snoozed_till?: string;
  duplicate_to?: string;
  source?: string;
  source_email?: string;
}

export type IntakeWorkItemStatusEnum = number;

export interface WorkItemForIntakeRequest {
  name: string;
  description_html?: string;
  priority?: PriorityEnum;
}

export interface UpdateIntakeWorkItemRequest {
  status?: IntakeWorkItemStatusEnum;
  snoozed_till?: string;
  duplicate_to?: string;
  source?: string;
  source_email?: string;
  issue?: WorkItemForIntakeRequest; // Issue data to update in the intake issue
}
