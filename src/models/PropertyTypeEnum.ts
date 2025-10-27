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
 * * `TEXT` - Text
 * * `DATETIME` - Datetime
 * * `DECIMAL` - Decimal
 * * `BOOLEAN` - Boolean
 * * `OPTION` - Option
 * * `RELATION` - Relation
 * * `URL` - URL
 * * `EMAIL` - Email
 * * `FILE` - File
 * @export
 */
export const PropertyTypeEnum = {
    Text: 'TEXT',
    Datetime: 'DATETIME',
    Decimal: 'DECIMAL',
    Boolean: 'BOOLEAN',
    Option: 'OPTION',
    Relation: 'RELATION',
    Url: 'URL',
    Email: 'EMAIL',
    File: 'FILE'
} as const;
export type PropertyTypeEnum = typeof PropertyTypeEnum[keyof typeof PropertyTypeEnum];


export function instanceOfPropertyTypeEnum(value: any): boolean {
    for (const key in PropertyTypeEnum) {
        if (Object.prototype.hasOwnProperty.call(PropertyTypeEnum, key)) {
            if (PropertyTypeEnum[key as keyof typeof PropertyTypeEnum] === value) {
                return true;
            }
        }
    }
    return false;
}

export function PropertyTypeEnumFromJSON(json: any): PropertyTypeEnum {
    return PropertyTypeEnumFromJSONTyped(json, false);
}

export function PropertyTypeEnumFromJSONTyped(json: any, ignoreDiscriminator: boolean): PropertyTypeEnum {
    return json as PropertyTypeEnum;
}

export function PropertyTypeEnumToJSON(value?: PropertyTypeEnum | null): any {
    return value as any;
}

export function PropertyTypeEnumToJSONTyped(value: any, ignoreDiscriminator: boolean): PropertyTypeEnum {
    return value as PropertyTypeEnum;
}

