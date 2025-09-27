/* tslint:disable */
/* eslint-disable */
/**
 * The Plane REST API
 * The Plane REST API  Visit our quick start guide and full API documentation at [developers.plane.so](https://developers.plane.so/api-reference/introduction).
 *
 * The version of the API Spec: 0.0.2
 * Contact: support@plane.so
 *
 * NOTE: This class is auto generated.
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
/**
 * Full serializer for work item labels with complete metadata.
 * 
 * Provides comprehensive label information including hierarchical relationships,
 * visual properties, and organizational data for work item tagging.
 * @export
 * @interface Label
 */
export interface Label {
    /**
     * 
     * @type {string}
     * @memberof Label
     */
    readonly id?: string;
    /**
     * 
     * @type {Date}
     * @memberof Label
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof Label
     */
    readonly updatedAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof Label
     */
    readonly deletedAt?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof Label
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof Label
     */
    description?: string;
    /**
     * 
     * @type {string}
     * @memberof Label
     */
    color?: string;
    /**
     * 
     * @type {number}
     * @memberof Label
     */
    sortOrder?: number;
    /**
     * 
     * @type {string}
     * @memberof Label
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Label
     */
    externalId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Label
     */
    readonly createdBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Label
     */
    readonly updatedBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Label
     */
    readonly workspace?: string;
    /**
     * 
     * @type {string}
     * @memberof Label
     */
    readonly project?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Label
     */
    parent?: string | null;
}

/**
 * Check if a given object implements the Label interface.
 */
export function instanceOfLabel(value: object): value is Label {
    if (!('name' in value) || value['name'] === undefined) return false;
    return true;
}

export function LabelFromJSON(json: any): Label {
    return LabelFromJSONTyped(json, false);
}

export function LabelFromJSONTyped(json: any, ignoreDiscriminator: boolean): Label {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'createdAt': json['created_at'] == null ? undefined : (new Date(json['created_at'])),
        'updatedAt': json['updated_at'] == null ? undefined : (new Date(json['updated_at'])),
        'deletedAt': json['deleted_at'] == null ? undefined : (new Date(json['deleted_at'])),
        'name': json['name'],
        'description': json['description'] == null ? undefined : json['description'],
        'color': json['color'] == null ? undefined : json['color'],
        'sortOrder': json['sort_order'] == null ? undefined : json['sort_order'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
        'createdBy': json['created_by'] == null ? undefined : json['created_by'],
        'updatedBy': json['updated_by'] == null ? undefined : json['updated_by'],
        'workspace': json['workspace'] == null ? undefined : json['workspace'],
        'project': json['project'] == null ? undefined : json['project'],
        'parent': json['parent'] == null ? undefined : json['parent'],
    };
}

export function LabelToJSON(json: any): Label {
    return LabelToJSONTyped(json, false);
}

export function LabelToJSONTyped(value?: Omit<Label, 'id'|'created_at'|'updated_at'|'deleted_at'|'created_by'|'updated_by'|'workspace'|'project'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'description': value['description'],
        'color': value['color'],
        'sort_order': value['sortOrder'],
        'external_source': value['externalSource'],
        'external_id': value['externalId'],
        'parent': value['parent'],
    };
}

