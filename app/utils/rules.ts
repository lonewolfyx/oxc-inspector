import type { SeverityValue } from '#shared/types/types'
import type { AllowWarnDeny } from 'oxlint'

export function getRuleSeverity(values: AllowWarnDeny): SeverityValue {
    switch (values) {
        case 'allow':
        case 'off':
            return 'off'
        case 'warn':
            return 'warn'
        default:
            // deny error
            return 'error'
    }
}
