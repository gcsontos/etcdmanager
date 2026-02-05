/**
 * Helper to convert various data types to Buffer.
 * Handles serialized Buffer objects from localStorage (e.g., {type: "Buffer", data: [...]}),
 * arrays, existing Buffers, and strings.
 *
 * @param data - The data to convert to a Buffer
 * @returns A Buffer instance
 */
export function toBuffer(data: any): Buffer {
    // Handle serialized Buffer objects from localStorage
    if (data && typeof data === 'object' && data.type === 'Buffer' && Array.isArray(data.data)) {
        return Buffer.from(data.data);
    }
    // Handle arrays directly
    if (Array.isArray(data)) {
        return Buffer.from(data);
    }
    // Handle Buffer instances
    if (Buffer.isBuffer(data)) {
        return data;
    }
    // Handle strings
    if (typeof data === 'string') {
        return Buffer.from(data);
    }
    // Fallback for empty/invalid data
    return Buffer.from('');
}
