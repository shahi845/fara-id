import { blockingRules, blockingReasons } from '../data/shafiiRules.js';
import { capitalize } from '../utils/formatResults.js';

export function applyBlocking(heirs, context) {
    const blocked = {};

    for (const heir in blockingRules) {
        blocked[heir] = blockingRules[heir]({ heirs, context });
        if (blocked[heir] && heirs[heir] > 0) {
            let name = capitalize(heir);
            if (heir === 'paternalUncleSon') name = "Son of Paternal Uncle";
            if (heir === 'sonOfFullBrother') name = "Son of Full Brother";
            if (heir === 'sonOfPaternalBrother') name = "Son of Paternal Half-Brother";
            
            context.messages.push(`${name} blocked by ${blockingReasons[heir] || 'closer relatives'}`);
        }
    }
    
    context.blocked = blocked;
    return blocked;
}
