import { saveAs } from 'file-saver';

export function downloadJson(data: unknown, filename: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, filename);
}

export function readJsonFile(file: File): Promise<unknown> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const result = JSON.parse(e.target?.result as string);
                resolve(result);
            } catch {
                reject(new Error('Invalid JSON file'));
            }
        };
        reader.onerror = () => reject(new Error('File read error'));
        reader.readAsText(file);
    });
}

export function formatBackupDate(): string {
    return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
}
