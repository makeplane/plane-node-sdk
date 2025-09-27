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
 * * `ISSUE` - Issue
 * * `USER` - User
 * @export
 */
export const IssuePropertyAPIRelationTypeEnum = {
    Issue: 'ISSUE',
    User: 'USER'
} as const;
export type IssuePropertyAPIRelationTypeEnum = typeof IssuePropertyAPIRelationTypeEnum[keyof typeof IssuePropertyAPIRelationTypeEnum];


export function instanceOfIssuePropertyAPIRelationTypeEnum(value: any): boolean {
    for (const key in IssuePropertyAPIRelationTypeEnum) {
        if (Object.prototype.hasOwnProperty.call(IssuePropertyAPIRelationTypeEnum, key)) {
            if (IssuePropertyAPIRelationTypeEnum[key as keyof typeof IssuePropertyAPIRelationTypeEnum] === value) {
                return true;
            }
        }
    }
    return false;
}

export function IssuePropertyAPIRelationTypeEnumFromJSON(json: any): IssuePropertyAPIRelationTypeEnum {
    return IssuePropertyAPIRelationTypeEnumFromJSONTyped(json, false);
}

export function IssuePropertyAPIRelationTypeEnumFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssuePropertyAPIRelationTypeEnum {
    return json as IssuePropertyAPIRelationTypeEnum;
}

export function IssuePropertyAPIRelationTypeEnumToJSON(value?: IssuePropertyAPIRelationTypeEnum | null): any {
    return value as any;
}

export function IssuePropertyAPIRelationTypeEnumToJSONTyped(value: any, ignoreDiscriminator: boolean): IssuePropertyAPIRelationTypeEnum {
    return value as IssuePropertyAPIRelationTypeEnum;
}

