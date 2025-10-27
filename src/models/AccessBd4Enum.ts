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
 * * `INTERNAL` - INTERNAL
 * * `EXTERNAL` - EXTERNAL
 * @export
 */
export const AccessBd4Enum = {
    Internal: 'INTERNAL',
    External: 'EXTERNAL'
} as const;
export type AccessBd4Enum = typeof AccessBd4Enum[keyof typeof AccessBd4Enum];


export function instanceOfAccessBd4Enum(value: any): boolean {
    for (const key in AccessBd4Enum) {
        if (Object.prototype.hasOwnProperty.call(AccessBd4Enum, key)) {
            if (AccessBd4Enum[key as keyof typeof AccessBd4Enum] === value) {
                return true;
            }
        }
    }
    return false;
}

export function AccessBd4EnumFromJSON(json: any): AccessBd4Enum {
    return AccessBd4EnumFromJSONTyped(json, false);
}

export function AccessBd4EnumFromJSONTyped(json: any, ignoreDiscriminator: boolean): AccessBd4Enum {
    return json as AccessBd4Enum;
}

export function AccessBd4EnumToJSON(value?: AccessBd4Enum | null): any {
    return value as any;
}

export function AccessBd4EnumToJSONTyped(value: any, ignoreDiscriminator: boolean): AccessBd4Enum {
    return value as AccessBd4Enum;
}

