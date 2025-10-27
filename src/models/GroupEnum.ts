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


/**
 * * `backlog` - Backlog
 * * `unstarted` - Unstarted
 * * `started` - Started
 * * `completed` - Completed
 * * `cancelled` - Cancelled
 * * `triage` - Triage
 * @export
 */
export const GroupEnum = {
    Backlog: 'backlog',
    Unstarted: 'unstarted',
    Started: 'started',
    Completed: 'completed',
    Cancelled: 'cancelled',
    Triage: 'triage'
} as const;
export type GroupEnum = typeof GroupEnum[keyof typeof GroupEnum];


export function instanceOfGroupEnum(value: any): boolean {
    for (const key in GroupEnum) {
        if (Object.prototype.hasOwnProperty.call(GroupEnum, key)) {
            if (GroupEnum[key as keyof typeof GroupEnum] === value) {
                return true;
            }
        }
    }
    return false;
}

export function GroupEnumFromJSON(json: any): GroupEnum {
    return GroupEnumFromJSONTyped(json, false);
}

export function GroupEnumFromJSONTyped(json: any, ignoreDiscriminator: boolean): GroupEnum {
    return json as GroupEnum;
}

export function GroupEnumToJSON(value?: GroupEnum | null): any {
    return value as any;
}

export function GroupEnumToJSONTyped(value: any, ignoreDiscriminator: boolean): GroupEnum {
    return value as GroupEnum;
}

