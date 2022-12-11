import { trim } from './trim';

export function formatValue(value: number, decimal: number) {
    if (value > 1000000)
        return (trim(value / 1000000, 2) + 'M')
    else if (value > 1000)
        return (trim(value / 1000, 2) + 'K')
    else
        return (trim(value, decimal))
} 