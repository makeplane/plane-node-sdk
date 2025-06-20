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
 * * `0` - Secret
 * * `2` - Public
 * @export
 */
export const NetworkEnum = {
    NUMBER_0: 0,
    NUMBER_2: 2
} as const;
export type NetworkEnum = typeof NetworkEnum[keyof typeof NetworkEnum];


export function instanceOfNetworkEnum(value: any): boolean {
    for (const key in NetworkEnum) {
        if (Object.prototype.hasOwnProperty.call(NetworkEnum, key)) {
            if (NetworkEnum[key as keyof typeof NetworkEnum] === value) {
                return true;
            }
        }
    }
    return false;
}

export function NetworkEnumFromJSON(json: any): NetworkEnum {
    return NetworkEnumFromJSONTyped(json, false);
}

export function NetworkEnumFromJSONTyped(json: any, ignoreDiscriminator: boolean): NetworkEnum {
    return json as NetworkEnum;
}

export function NetworkEnumToJSON(value?: NetworkEnum | null): any {
    return value as any;
}

export function NetworkEnumToJSONTyped(value: any, ignoreDiscriminator: boolean): NetworkEnum {
    return value as NetworkEnum;
}

