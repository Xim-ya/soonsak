/**
 * 🔄 snake_case → camelCase 자동 변환 유틸리티
 */

/**
 * snake_case 문자열을 camelCase로 변환
 */
function toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * 객체의 모든 키를 snake_case → camelCase로 변환 (재귀적)
 */
export function convertKeysToCamelCase<T = any>(obj: any): T {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => convertKeysToCamelCase(item)) as T;
    }

    if (typeof obj === 'object' && obj.constructor === Object) {
        const camelCaseObj: any = {};

        for (const [key, value] of Object.entries(obj)) {
            const camelKey = toCamelCase(key);
            camelCaseObj[camelKey] = convertKeysToCamelCase(value);
        }

        return camelCaseObj as T;
    }

    return obj;
}

/**
 * 특정 필드 매핑 규칙 (예외 처리용)
 */
export const FIELD_MAPPING: Record<string, string> = {
    content_type: 'type',
    poster_path: 'posterPath',
    backdrop_path: 'backdropImgUrl',
    created_at: 'createdAt',
    updated_at: 'updatedAt',
    uploaded_at: 'uploadedAt',
};

/**
 * 사용자 정의 필드 매핑과 함께 변환
 */
export function convertWithCustomMapping<T = any>(
    obj: any,
    customMapping: Record<string, string> = {}
): T {
    const mergedMapping = { ...FIELD_MAPPING, ...customMapping };

    if (obj === null || obj === undefined) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => convertWithCustomMapping(item, customMapping)) as T;
    }

    if (typeof obj === 'object' && obj.constructor === Object) {
        const convertedObj: any = {};

        for (const [key, value] of Object.entries(obj)) {
            // 커스텀 매핑이 있으면 사용, 없으면 자동 camelCase 변환
            const newKey = mergedMapping[key] || toCamelCase(key);
            convertedObj[newKey] = convertWithCustomMapping(value, customMapping);
        }

        return convertedObj as T;
    }

    return obj;
} 