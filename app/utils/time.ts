export function convertIsoTimeToUnixEpoche(isoTimeString: string): number | null {
    try {
        const date = new Date(isoTimeString);
        return date.getTime();
    } catch {
        return null
    }
}

const readableOptions: Intl.DateTimeFormatOptions = Object.freeze({
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'Europe/Zurich',
    hour12: false,
});


const formatterReadable = new Intl.DateTimeFormat('de-CH', readableOptions);


export function isoTimeByUnixEpoch(published: number): string {
    try {
        const date = new Date(published);
        const iso = date.toISOString()
        return iso
    } catch {
        return ''
    }

}


export function readableAndIsoTimeByUnixEpoch(
    published: number
): { iso: string, readable: string } {
    try {
        const date = new Date(published);
        const readable = formatterReadable.format(date);
        const iso = date.toISOString()
        return { iso, readable };
    } catch {
        return { iso: '', readable: '' }
    }

}


export function formatDateShort(dateString: string, locale: string = 'de-CH'): string {
    try {
        const date = new Date(dateString);
        const formatter = new Intl.DateTimeFormat(locale, { timeZone: 'Europe/Zurich' });
        return formatter.format(date);
    } catch {
        return dateString
    }
}