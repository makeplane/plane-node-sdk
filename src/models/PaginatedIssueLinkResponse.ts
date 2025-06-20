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
import type { IssueLink } from './IssueLink';
import {
    IssueLinkFromJSON,
    IssueLinkFromJSONTyped,
    IssueLinkToJSON,
    IssueLinkToJSONTyped,
} from './IssueLink';

/**
 * 
 * @export
 * @interface PaginatedIssueLinkResponse
 */
export interface PaginatedIssueLinkResponse {
    /**
     * 
     * @type {string}
     * @memberof PaginatedIssueLinkResponse
     */
    groupedBy: string | null;
    /**
     * 
     * @type {string}
     * @memberof PaginatedIssueLinkResponse
     */
    subGroupedBy: string | null;
    /**
     * 
     * @type {number}
     * @memberof PaginatedIssueLinkResponse
     */
    totalCount: number;
    /**
     * 
     * @type {string}
     * @memberof PaginatedIssueLinkResponse
     */
    nextCursor: string;
    /**
     * 
     * @type {string}
     * @memberof PaginatedIssueLinkResponse
     */
    prevCursor: string;
    /**
     * 
     * @type {boolean}
     * @memberof PaginatedIssueLinkResponse
     */
    nextPageResults: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PaginatedIssueLinkResponse
     */
    prevPageResults: boolean;
    /**
     * 
     * @type {number}
     * @memberof PaginatedIssueLinkResponse
     */
    count: number;
    /**
     * 
     * @type {number}
     * @memberof PaginatedIssueLinkResponse
     */
    totalPages: number;
    /**
     * 
     * @type {number}
     * @memberof PaginatedIssueLinkResponse
     */
    totalResults: number;
    /**
     * 
     * @type {string}
     * @memberof PaginatedIssueLinkResponse
     */
    extraStats: string | null;
    /**
     * 
     * @type {Array<IssueLink>}
     * @memberof PaginatedIssueLinkResponse
     */
    results: Array<IssueLink>;
}

/**
 * Check if a given object implements the PaginatedIssueLinkResponse interface.
 */
export function instanceOfPaginatedIssueLinkResponse(value: object): value is PaginatedIssueLinkResponse {
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

export function PaginatedIssueLinkResponseFromJSON(json: any): PaginatedIssueLinkResponse {
    return PaginatedIssueLinkResponseFromJSONTyped(json, false);
}

export function PaginatedIssueLinkResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): PaginatedIssueLinkResponse {
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
        'results': ((json['results'] as Array<any>).map(IssueLinkFromJSON)),
    };
}

export function PaginatedIssueLinkResponseToJSON(json: any): PaginatedIssueLinkResponse {
    return PaginatedIssueLinkResponseToJSONTyped(json, false);
}

export function PaginatedIssueLinkResponseToJSONTyped(value?: PaginatedIssueLinkResponse | null, ignoreDiscriminator: boolean = false): any {
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
        'results': ((value['results'] as Array<any>).map(IssueLinkToJSON)),
    };
}

