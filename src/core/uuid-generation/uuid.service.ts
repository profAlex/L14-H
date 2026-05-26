import { randomUUID } from 'crypto';

export class GeneratorUtil {
    static generateUUID(): string {
        return randomUUID();
    }
}