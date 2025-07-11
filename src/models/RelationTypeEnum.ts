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


/**
 * * `ISSUE` - Issue
 * * `USER` - User
 * @export
 */
export const RelationTypeEnum = {
    Issue: 'ISSUE',
    User: 'USER'
} as const;
export type RelationTypeEnum = typeof RelationTypeEnum[keyof typeof RelationTypeEnum];


export function instanceOfRelationTypeEnum(value: any): boolean {
    for (const key in RelationTypeEnum) {
        if (Object.prototype.hasOwnProperty.call(RelationTypeEnum, key)) {
            if (RelationTypeEnum[key as keyof typeof RelationTypeEnum] === value) {
                return true;
            }
        }
    }
    return false;
}

export function RelationTypeEnumFromJSON(json: any): RelationTypeEnum {
    return RelationTypeEnumFromJSONTyped(json, false);
}

export function RelationTypeEnumFromJSONTyped(json: any, ignoreDiscriminator: boolean): RelationTypeEnum {
    return json as RelationTypeEnum;
}

export function RelationTypeEnumToJSON(value?: RelationTypeEnum | null): any {
    return value as any;
}

export function RelationTypeEnumToJSONTyped(value: any, ignoreDiscriminator: boolean): RelationTypeEnum {
    return value as RelationTypeEnum;
}

