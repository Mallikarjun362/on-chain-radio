'use client'
export function getDayDiff(s: any) {
    const diffTime = Date.now() - (new Date(s).getTime());
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;
    if (diffDays < 0) {
        // NEGETIVE >>> FUTURE
        diffDays = Math.abs(diffDays);
        if (diffDays == 1) {
            return '1 day left';
        } else {
            return `${diffDays} days left`;
        }
    } else {
        // POSITIVE >>> PAST
        if (diffDays === 0) {
            const diffSeconds = Math.ceil(diffTime / 1000);
            const diffMinutes = Math.ceil(diffSeconds / 60);
            const diffHours = Math.ceil(diffMinutes / 60);
            if (diffHours === 0) {
                return `${diffMinutes} minutes ago`;
            }
            return `${diffHours} hours ago`;
        } else if (diffDays == 1) {
            return 'Yesterday';
        } else {
            return `${diffDays} days ago`;
        }
    }
    return '';
}
