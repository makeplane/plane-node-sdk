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
 * * `image/jpeg` - JPEG
 * * `image/png` - PNG
 * * `image/webp` - WebP
 * * `image/jpg` - JPG
 * * `image/gif` - GIF
 * @export
 */
export const TypeEnum = {
    ImageJpeg: 'image/jpeg',
    ImagePng: 'image/png',
    ImageWebp: 'image/webp',
    ImageJpg: 'image/jpg',
    ImageGif: 'image/gif'
} as const;
export type TypeEnum = typeof TypeEnum[keyof typeof TypeEnum];


export function instanceOfTypeEnum(value: any): boolean {
    for (const key in TypeEnum) {
        if (Object.prototype.hasOwnProperty.call(TypeEnum, key)) {
            if (TypeEnum[key as keyof typeof TypeEnum] === value) {
                return true;
            }
        }
    }
    return false;
}

export function TypeEnumFromJSON(json: any): TypeEnum {
    return TypeEnumFromJSONTyped(json, false);
}

export function TypeEnumFromJSONTyped(json: any, ignoreDiscriminator: boolean): TypeEnum {
    return json as TypeEnum;
}

export function TypeEnumToJSON(value?: TypeEnum | null): any {
    return value as any;
}

export function TypeEnumToJSONTyped(value: any, ignoreDiscriminator: boolean): TypeEnum {
    return value as TypeEnum;
}

