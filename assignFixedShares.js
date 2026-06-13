import { fixedShareRules } from '../data/shafiiRules.js';
import { fraction, addFractions } from '../utils/fractions.js';
import { capitalize } from '../utils/formatResults.js';

export function assignFixedShares(heirs, context) {
    if (heirs.grandmother > 0) {
        heirs.paternalGrandmother = heirs.grandmother;
    }
    let shares = [];
    let sumFractions = fraction(0, 1);

    for (const ruleKey in fixedShareRules) {
        const rule = fixedShareRules[ruleKey];
        if (rule.eligible({ heirs, context })) {
            const frac = rule.share({ heirs, context });
            if (frac) {
                let name = capitalize(ruleKey);
                if (ruleKey === 'maternalSiblings') {
                    name = 'Maternal Sibling(s)';
                } else if (ruleKey === 'paternalSister') {
                    name = 'Paternal Half-Sister';
                } else if (ruleKey === 'grandmothers') {
                    name = 'Grandmother(s)';
                }
                
                let count = heirs[ruleKey] || 1;
                if (ruleKey === 'maternalSiblings') {
                    count = heirs.maternalBrother + heirs.maternalSister;
                } else if (ruleKey === 'grandmothers') {
                    count = (heirs.maternalGrandmother && !context.blocked.maternalGrandmother ? 1 : 0) + 
                            (heirs.paternalGrandmother && !context.blocked.paternalGrandmother ? 1 : 0);
                }

                const reason = rule.reason ? rule.reason({ heirs, context }) : '';

                shares.push({
                    heir: ruleKey,
                    name,
                    count,
                    baseShare: frac,
                    adjustedShare: frac,
                    status: 'Sharer',
                    reason: reason
                });
                
                context.messages.push(`${name} receives ${frac.num}/${frac.den} - ${reason}`);

                sumFractions = addFractions(sumFractions, frac);
            }
        }
    }

    return { shares, sumFractions };
}
