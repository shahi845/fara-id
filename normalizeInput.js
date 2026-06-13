import { defaultHeirs } from '../data/heirs.js';

export function normalizeInput(raw) {
    const heirs = { ...defaultHeirs };
    for (const key in heirs) {
        if (raw[key] !== undefined) {
            let val = parseInt(raw[key], 10);
            if (isNaN(val) || val < 0) val = 0;
            
            // Apply clamps
            if (key === 'husband' || key === 'father' || key === 'grandfather' || key === 'mother' || key === 'maternalGrandmother' || key === 'paternalGrandmother') {
                val = Math.min(val, 1);
            } else if (key === 'wife') {
                val = Math.min(val, 4);
            }
            heirs[key] = val;
        }
    }
    return heirs;
}
