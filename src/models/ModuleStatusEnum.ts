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
 * * `planned` - Planned
 * * `in-progress` - In Progress
 * * `paused` - Paused
 * * `completed` - Completed
 * * `cancelled` - Cancelled
 * @export
 */
export const ModuleStatusEnum = {
    Backlog: 'backlog',
    Planned: 'planned',
    InProgress: 'in-progress',
    Paused: 'paused',
    Completed: 'completed',
    Cancelled: 'cancelled'
} as const;
export type ModuleStatusEnum = typeof ModuleStatusEnum[keyof typeof ModuleStatusEnum];


export function instanceOfModuleStatusEnum(value: any): boolean {
    for (const key in ModuleStatusEnum) {
        if (Object.prototype.hasOwnProperty.call(ModuleStatusEnum, key)) {
            if (ModuleStatusEnum[key as keyof typeof ModuleStatusEnum] === value) {
                return true;
            }
        }
    }
    return false;
}

export function ModuleStatusEnumFromJSON(json: any): ModuleStatusEnum {
    return ModuleStatusEnumFromJSONTyped(json, false);
}

export function ModuleStatusEnumFromJSONTyped(json: any, ignoreDiscriminator: boolean): ModuleStatusEnum {
    return json as ModuleStatusEnum;
}

export function ModuleStatusEnumToJSON(value?: ModuleStatusEnum | null): any {
    return value as any;
}

export function ModuleStatusEnumToJSONTyped(value: any, ignoreDiscriminator: boolean): ModuleStatusEnum {
    return value as ModuleStatusEnum;
}

