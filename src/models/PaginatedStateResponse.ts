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
import type { State } from './State';
import {
    StateFromJSON,
    StateFromJSONTyped,
    StateToJSON,
    StateToJSONTyped,
} from './State';

/**
 * 
 * @export
 * @interface PaginatedStateResponse
 */
export interface PaginatedStateResponse {
    /**
     * 
     * @type {string}
     * @memberof PaginatedStateResponse
     */
    groupedBy: string | null;
    /**
     * 
     * @type {string}
     * @memberof PaginatedStateResponse
     */
    subGroupedBy: string | null;
    /**
     * 
     * @type {number}
     * @memberof PaginatedStateResponse
     */
    totalCount: number;
    /**
     * 
     * @type {string}
     * @memberof PaginatedStateResponse
     */
    nextCursor: string;
    /**
     * 
     * @type {string}
     * @memberof PaginatedStateResponse
     */
    prevCursor: string;
    /**
     * 
     * @type {boolean}
     * @memberof PaginatedStateResponse
     */
    nextPageResults: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PaginatedStateResponse
     */
    prevPageResults: boolean;
    /**
     * 
     * @type {number}
     * @memberof PaginatedStateResponse
     */
    count: number;
    /**
     * 
     * @type {number}
     * @memberof PaginatedStateResponse
     */
    totalPages: number;
    /**
     * 
     * @type {number}
     * @memberof PaginatedStateResponse
     */
    totalResults: number;
    /**
     * 
     * @type {string}
     * @memberof PaginatedStateResponse
     */
    extraStats: string | null;
    /**
     * 
     * @type {Array<State>}
     * @memberof PaginatedStateResponse
     */
    results: Array<State>;
}

/**
 * Check if a given object implements the PaginatedStateResponse interface.
 */
export function instanceOfPaginatedStateResponse(value: object): value is PaginatedStateResponse {
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

export function PaginatedStateResponseFromJSON(json: any): PaginatedStateResponse {
    return PaginatedStateResponseFromJSONTyped(json, false);
}

export function PaginatedStateResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): PaginatedStateResponse {
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
        'results': ((json['results'] as Array<any>).map(StateFromJSON)),
    };
}

export function PaginatedStateResponseToJSON(json: any): PaginatedStateResponse {
    return PaginatedStateResponseToJSONTyped(json, false);
}

export function PaginatedStateResponseToJSONTyped(value?: PaginatedStateResponse | null, ignoreDiscriminator: boolean = false): any {
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
        'results': ((value['results'] as Array<any>).map(StateToJSON)),
    };
}

