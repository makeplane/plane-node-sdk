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
 * * `-2` - Pending
 * * `-1` - Rejected
 * * `0` - Snoozed
 * * `1` - Accepted
 * * `2` - Duplicate
 * @export
 */
export const IntakeWorkItemStatusEnum = {
    NUMBER_MINUS_2: -2,
    NUMBER_MINUS_1: -1,
    NUMBER_0: 0,
    NUMBER_1: 1,
    NUMBER_2: 2
} as const;
export type IntakeWorkItemStatusEnum = typeof IntakeWorkItemStatusEnum[keyof typeof IntakeWorkItemStatusEnum];


export function instanceOfIntakeWorkItemStatusEnum(value: any): boolean {
    for (const key in IntakeWorkItemStatusEnum) {
        if (Object.prototype.hasOwnProperty.call(IntakeWorkItemStatusEnum, key)) {
            if (IntakeWorkItemStatusEnum[key as keyof typeof IntakeWorkItemStatusEnum] === value) {
                return true;
            }
        }
    }
    return false;
}

export function IntakeWorkItemStatusEnumFromJSON(json: any): IntakeWorkItemStatusEnum {
    return IntakeWorkItemStatusEnumFromJSONTyped(json, false);
}

export function IntakeWorkItemStatusEnumFromJSONTyped(json: any, ignoreDiscriminator: boolean): IntakeWorkItemStatusEnum {
    return json as IntakeWorkItemStatusEnum;
}

export function IntakeWorkItemStatusEnumToJSON(value?: IntakeWorkItemStatusEnum | null): any {
    return value as any;
}

export function IntakeWorkItemStatusEnumToJSONTyped(value: any, ignoreDiscriminator: boolean): IntakeWorkItemStatusEnum {
    return value as IntakeWorkItemStatusEnum;
}

