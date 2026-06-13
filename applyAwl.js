import { compareFractions, fraction, simplifyFraction } from '../utils/fractions.js';

export function applyAwl(shares, sumFractions, context) {
    if (compareFractions(sumFractions, fraction(1, 1)) > 0) {
        context.messages.push(`'Awl applied: Total shares exceeded 100%. Shares reduced proportionally.`);
        
        for (let i = 0; i < shares.length; i++) {
            const s = shares[i];
            s.adjustedShare = simplifyFraction({
                num: s.baseShare.num * sumFractions.den,
                den: s.baseShare.den * sumFractions.num
            });
            s.reason = "Reduced due to 'Awl";
        }
        return fraction(1, 1);
    }
    return sumFractions;
}
