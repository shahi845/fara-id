import { normalizeInput } from './normalizeInput.js';
import { validateInput } from './validateInput.js';
import { buildContext } from './buildContext.js';
import { applyBlocking } from './applyBlocking.js';
import { assignFixedShares } from './assignFixedShares.js';
import { applyAwl } from './applyAwl.js';
import { assignResiduaries } from './assignResiduaries.js';
import { applyRadd } from './applyRadd.js';
import { capitalize } from '../utils/formatResults.js';
import { blockingReasons } from '../data/shafiiRules.js';

export function calculateInheritance(rawInput) {
    const heirs = normalizeInput(rawInput);
    validateInput(heirs);
    const context = buildContext(heirs);
    applyBlocking(heirs, context);

    let { shares, sumFractions } = assignFixedShares(heirs, context);
    sumFractions = applyAwl(shares, sumFractions, context);

    let prevSharesLength = shares.length;
    shares = assignResiduaries(shares, heirs, sumFractions, context);
    let hasResiduaries = shares.length > prevSharesLength || shares.some(s => s.status.includes('Residuary'));

    if (!hasResiduaries) {
        shares = applyRadd(shares, sumFractions, context);
    }

    for (const key in heirs) {
        if (heirs[key] > 0 && context.blocked[key]) {
            let name = capitalize(key);
            if (key === 'paternalUncleSon') name = "Son of Paternal Uncle";
            if (key === 'sonOfFullBrother') name = "Son of Full Brother";
            if (key === 'sonOfPaternalBrother') name = "Son of Paternal Half-Brother";

            shares.push({
                heir: key,
                name: name,
                count: heirs[key],
                baseShare: { num: 0, den: 1 },
                adjustedShare: { num: 0, den: 1 },
                status: 'Blocked',
                reason: `Blocked by ${blockingReasons[key] || 'closer relatives'}`
            });
        }
    }

    return { shares, messages: context.messages };
}
