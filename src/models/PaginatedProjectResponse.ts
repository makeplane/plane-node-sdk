/* tslint:disable */
/* eslint-disable */
/**
 * The Plane REST API
 * The Plane REST API  Visit our quick start guide and full API documentation at [developers.plane.so](https://developers.plane.so/api-reference/introduction).
 *
 * The version of the API Spec: 0.0.1
 * Contact: support@plane.so
 *
 * NOTE: This class is auto generated.
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { Project } from './Project';
import {
    ProjectFromJSON,
    ProjectFromJSONTyped,
    ProjectToJSON,
    ProjectToJSONTyped,
} from './Project';

/**
 * 
 * @export
 * @interface PaginatedProjectResponse
 */
export interface PaginatedProjectResponse {
    /**
     * 
     * @type {string}
     * @memberof PaginatedProjectResponse
     */
    groupedBy: string | null;
    /**
     * 
     * @type {string}
     * @memberof PaginatedProjectResponse
     */
    subGroupedBy: string | null;
    /**
     * 
     * @type {number}
     * @memberof PaginatedProjectResponse
     */
    totalCount: number;
    /**
     * 
     * @type {string}
     * @memberof PaginatedProjectResponse
     */
    nextCursor: string;
    /**
     * 
     * @type {string}
     * @memberof PaginatedProjectResponse
     */
    prevCursor: string;
    /**
     * 
     * @type {boolean}
     * @memberof PaginatedProjectResponse
     */
    nextPageResults: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PaginatedProjectResponse
     */
    prevPageResults: boolean;
    /**
     * 
     * @type {number}
     * @memberof PaginatedProjectResponse
     */
    count: number;
    /**
     * 
     * @type {number}
     * @memberof PaginatedProjectResponse
     */
    totalPages: number;
    /**
     * 
     * @type {number}
     * @memberof PaginatedProjectResponse
     */
    totalResults: number;
    /**
     * 
     * @type {string}
     * @memberof PaginatedProjectResponse
     */
    extraStats: string | null;
    /**
     * 
     * @type {Array<Project>}
     * @memberof PaginatedProjectResponse
     */
    results: Array<Project>;
}

/**
 * Check if a given object implements the PaginatedProjectResponse interface.
 */
export function instanceOfPaginatedProjectResponse(value: object): value is PaginatedProjectResponse {
    if (!('groupedBy' in value) || value['groupedBy'] === undefined) return false;
    if (!('subGroupedBy' in value) || value['subGroupedBy'] === undefined) return false;
    if (!('totalCount' in value) || value['totalCount'] === undefined) return false;
    if (!('nextCursor' in value) || value['nextCursor'] === undefined) return false;
    if (!('prevCursor' in value) || value['prevCursor'] === undefined) return false;
    if (!('nextPageResults' in value) || value['nextPageResults'] === undefined) return false;
    if (!('prevPageResults' in value) || value['prevPageResults'] === undefined) return false;
    if (!('count' in value) || value['count'] === undefined) return false;
    if (!('totalPages' in value) || value['totalPages'] === undefined) return false;
    if (!('totalResults' in value) || value['totalResults'] === undefined) return false;
    if (!('extraStats' in value) || value['extraStats'] === undefined) return false;
    if (!('results' in value) || value['results'] === undefined) return false;
    return true;
}

export function PaginatedProjectResponseFromJSON(json: any): PaginatedProjectResponse {
    return PaginatedProjectResponseFromJSONTyped(json, false);
}

export function PaginatedProjectResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): PaginatedProjectResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'groupedBy': json['grouped_by'],
        'subGroupedBy': json['sub_grouped_by'],
        'totalCount': json['total_count'],
        'nextCursor': json['next_cursor'],
        'prevCursor': json['prev_cursor'],
        'nextPageResults': json['next_page_results'],
        'prevPageResults': json['prev_page_results'],
        'count': json['count'],
        'totalPages': json['total_pages'],
        'totalResults': json['total_results'],
        'extraStats': json['extra_stats'],
        'results': ((json['results'] as Array<any>).map(ProjectFromJSON)),
    };
}

export function PaginatedProjectResponseToJSON(json: any): PaginatedProjectResponse {
    return PaginatedProjectResponseToJSONTyped(json, false);
}

export function PaginatedProjectResponseToJSONTyped(value?: PaginatedProjectResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'grouped_by': value['groupedBy'],
        'sub_grouped_by': value['subGroupedBy'],
        'total_count': value['totalCount'],
        'next_cursor': value['nextCursor'],
        'prev_cursor': value['prevCursor'],
        'next_page_results': value['nextPageResults'],
        'prev_page_results': value['prevPageResults'],
        'count': value['count'],
        'total_pages': value['totalPages'],
        'total_results': value['totalResults'],
        'extra_stats': value['extraStats'],
        'results': ((value['results'] as Array<any>).map(ProjectToJSON)),
    };
}

