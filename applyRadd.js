import { fraction, subtractFractions, compareFractions, addFractions, multiplyFractions, divideFractions } from '../utils/fractions.js';

export function applyRadd(shares, sumFractions, context) {
    if (compareFractions(sumFractions, fraction(1, 1)) >= 0) {
        return shares;
    }

    let remainder = subtractFractions(fraction(1, 1), sumFractions);

    let nonSpouseSharers = shares.filter(s => s.heir !== 'husband' && s.heir !== 'wife' && s.status.includes('Sharer'));

    if (nonSpouseSharers.length > 0) {
        context.messages.push(`Radd applied: Remainder redistributed among non-spouse sharers.`);
        
        let sharersSum = fraction(0, 1);
        for (let s of nonSpouseSharers) {
            sharersSum = addFractions(sharersSum, s.adjustedShare);
        }

        for (let s of nonSpouseSharers) {
            let raddPortion = multiplyFractions(divideFractions(s.adjustedShare, sharersSum), remainder);
            s.adjustedShare = addFractions(s.adjustedShare, raddPortion);
            s.reason = s.reason ? `${s.reason}, Increased due to Radd` : "Increased due to Radd";
        }
    } else if (remainder.num > 0 && shares.length > 0) {
        context.messages.push(`No non-spouse sharers or residuaries exist. Remaining estate goes to Bayt al-Māl (Public Treasury).`);
        shares.push({
            heir: 'baytAlMal',
            name: 'Bayt al-Māl (Public Treasury)',
            count: 1,
            baseShare: remainder,
            adjustedShare: remainder,
            status: 'Public Treasury'
        });
    }

    return shares;
}
