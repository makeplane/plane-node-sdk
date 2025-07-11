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
 * * `INTERNAL` - INTERNAL
 * * `EXTERNAL` - EXTERNAL
 * @export
 */
export const AccessEnum = {
    Internal: 'INTERNAL',
    External: 'EXTERNAL'
} as const;
export type AccessEnum = typeof AccessEnum[keyof typeof AccessEnum];


export function instanceOfAccessEnum(value: any): boolean {
    for (const key in AccessEnum) {
        if (Object.prototype.hasOwnProperty.call(AccessEnum, key)) {
            if (AccessEnum[key as keyof typeof AccessEnum] === value) {
                return true;
            }
        }
    }
    return false;
}

export function AccessEnumFromJSON(json: any): AccessEnum {
    return AccessEnumFromJSONTyped(json, false);
}

export function AccessEnumFromJSONTyped(json: any, ignoreDiscriminator: boolean): AccessEnum {
    return json as AccessEnum;
}

export function AccessEnumToJSON(value?: AccessEnum | null): any {
    return value as any;
}

export function AccessEnumToJSONTyped(value: any, ignoreDiscriminator: boolean): AccessEnum {
    return value as AccessEnum;
}

