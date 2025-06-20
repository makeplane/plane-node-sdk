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
 * * `USER_AVATAR` - User Avatar
 * * `USER_COVER` - User Cover
 * @export
 */
export const EntityTypeEnum = {
    UserAvatar: 'USER_AVATAR',
    UserCover: 'USER_COVER'
} as const;
export type EntityTypeEnum = typeof EntityTypeEnum[keyof typeof EntityTypeEnum];


export function instanceOfEntityTypeEnum(value: any): boolean {
    for (const key in EntityTypeEnum) {
        if (Object.prototype.hasOwnProperty.call(EntityTypeEnum, key)) {
            if (EntityTypeEnum[key as keyof typeof EntityTypeEnum] === value) {
                return true;
            }
        }
    }
    return false;
}

export function EntityTypeEnumFromJSON(json: any): EntityTypeEnum {
    return EntityTypeEnumFromJSONTyped(json, false);
}

export function EntityTypeEnumFromJSONTyped(json: any, ignoreDiscriminator: boolean): EntityTypeEnum {
    return json as EntityTypeEnum;
}

export function EntityTypeEnumToJSON(value?: EntityTypeEnum | null): any {
    return value as any;
}

export function EntityTypeEnumToJSONTyped(value: any, ignoreDiscriminator: boolean): EntityTypeEnum {
    return value as EntityTypeEnum;
}

