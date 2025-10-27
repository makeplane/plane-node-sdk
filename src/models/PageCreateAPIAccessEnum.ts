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
 * * `0` - Public
 * * `1` - Private
 * @export
 */
export const PageCreateAPIAccessEnum = {
    NUMBER_0: 0,
    NUMBER_1: 1
} as const;
export type PageCreateAPIAccessEnum = typeof PageCreateAPIAccessEnum[keyof typeof PageCreateAPIAccessEnum];


export function instanceOfPageCreateAPIAccessEnum(value: any): boolean {
    for (const key in PageCreateAPIAccessEnum) {
        if (Object.prototype.hasOwnProperty.call(PageCreateAPIAccessEnum, key)) {
            if (PageCreateAPIAccessEnum[key as keyof typeof PageCreateAPIAccessEnum] === value) {
                return true;
            }
        }
    }
    return false;
}

export function PageCreateAPIAccessEnumFromJSON(json: any): PageCreateAPIAccessEnum {
    return PageCreateAPIAccessEnumFromJSONTyped(json, false);
}

export function PageCreateAPIAccessEnumFromJSONTyped(json: any, ignoreDiscriminator: boolean): PageCreateAPIAccessEnum {
    return json as PageCreateAPIAccessEnum;
}

export function PageCreateAPIAccessEnumToJSON(value?: PageCreateAPIAccessEnum | null): any {
    return value as any;
}

export function PageCreateAPIAccessEnumToJSONTyped(value: any, ignoreDiscriminator: boolean): PageCreateAPIAccessEnum {
    return value as PageCreateAPIAccessEnum;
}

