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
 * * `urgent` - Urgent
 * * `high` - High
 * * `medium` - Medium
 * * `low` - Low
 * * `none` - None
 * @export
 */
export const PriorityEnum = {
    Urgent: 'urgent',
    High: 'high',
    Medium: 'medium',
    Low: 'low',
    None: 'none'
} as const;
export type PriorityEnum = typeof PriorityEnum[keyof typeof PriorityEnum];


export function instanceOfPriorityEnum(value: any): boolean {
    for (const key in PriorityEnum) {
        if (Object.prototype.hasOwnProperty.call(PriorityEnum, key)) {
            if (PriorityEnum[key as keyof typeof PriorityEnum] === value) {
                return true;
            }
        }
    }
    return false;
}

export function PriorityEnumFromJSON(json: any): PriorityEnum {
    return PriorityEnumFromJSONTyped(json, false);
}

export function PriorityEnumFromJSONTyped(json: any, ignoreDiscriminator: boolean): PriorityEnum {
    return json as PriorityEnum;
}

export function PriorityEnumToJSON(value?: PriorityEnum | null): any {
    return value as any;
}

export function PriorityEnumToJSONTyped(value: any, ignoreDiscriminator: boolean): PriorityEnum {
    return value as PriorityEnum;
}

