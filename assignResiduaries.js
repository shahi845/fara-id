import { residuaryPriority } from '../data/heirs.js';
import { fraction, subtractFractions, compareFractions, addFractions } from '../utils/fractions.js';

export function assignResiduaries(shares, heirs, sumFractions, context) {
    if (compareFractions(sumFractions, fraction(1, 1)) >= 0) {
        return shares; // No residue left
    }

    let remainder = subtractFractions(fraction(1, 1), sumFractions);

    const addResiduaryShares = (maleKey, femaleKey, maleName, femaleName) => {
        let maleCount = heirs[maleKey] || 0;
        let femaleCount = heirs[femaleKey] || 0;
        
        let maleUnits = maleCount * 2;
        let femaleUnits = femaleCount;
        let totalUnits = maleUnits + femaleUnits;

        if (totalUnits > 0) {
            if (maleCount > 0) {
                shares.push({
                    heir: maleKey,
                    name: maleName,
                    count: maleCount,
                    baseShare: fraction(remainder.num * maleUnits, remainder.den * totalUnits),
                    adjustedShare: fraction(remainder.num * maleUnits, remainder.den * totalUnits),
                    status: 'Residuary',
                    reason: femaleCount > 0 ? "Residuary (Takes remainder, 2:1 ratio male/female)" : "Residuary (Takes remainder)"
                });
                context.messages.push(`Remaining distributed to ${maleName} as residuary`);
            }
            if (femaleCount > 0) {
                shares.push({
                    heir: femaleKey,
                    name: femaleName,
                    count: femaleCount,
                    baseShare: fraction(remainder.num * femaleUnits, remainder.den * totalUnits),
                    adjustedShare: fraction(remainder.num * femaleUnits, remainder.den * totalUnits),
                    status: 'Residuary',
                    reason: "Residuary (Takes remainder, 2:1 ratio male/female)"
                });
                context.messages.push(`Remaining distributed to ${femaleName} as residuary (2:1 ratio)`);
            }
            return true;
        }
        return false;
    };

    // 1. Descendants
    if (heirs.son > 0) {
    if (addResiduaryShares(
        'son',
        'daughter',
        'Son',
        'Daughter (with Son)'
    )) return shares;
}
    
    if (heirs.grandson > 0 && !context.blocked.grandson) {
         if (addResiduaryShares(
            'grandson',
            'granddaughter',
            'Grandson', 
            'Granddaughter (with Grandson)'
        )) 
        return shares;
    }

    // 2. Ascendants
    if (heirs.father > 0) {
        let existing = shares.find(s => s.heir === 'father');
        if (existing) {
            existing.status = 'Sharer + Residuary';
            existing.baseShare = addFractions(existing.baseShare, remainder);
            existing.adjustedShare = existing.baseShare;
            existing.reason += " + Residuary (Takes remainder)";
            context.messages.push(`Father acts as Residuary and takes remaining portion`);
        } else {
            shares.push({
                heir: 'father',
                name: 'Father',
                count: 1,
                baseShare: remainder,
                adjustedShare: remainder,
                status: 'Residuary',
                reason: "Residuary (Takes remainder)"
            });
            context.messages.push(`Remaining distributed to Father as residuary`);
        }
        return shares;
    }
    
    if (heirs.grandfather > 0 && !context.blocked.grandfather) {
        let existing = shares.find(s => s.heir === 'grandfather');
        if (existing) {
            existing.status = 'Sharer + Residuary';
            existing.baseShare = addFractions(existing.baseShare, remainder);
            existing.adjustedShare = existing.baseShare;
            existing.reason += " + Residuary (Takes remainder)";
            context.messages.push(`Grandfather acts as Residuary and takes remaining portion`);
        } else {
            shares.push({
                heir: 'grandfather',
                name: 'Grandfather',
                count: 1,
                baseShare: remainder,
                adjustedShare: remainder,
                status: 'Residuary',
                reason: "Residuary (Takes remainder)"
            });
            context.messages.push(`Remaining distributed to Grandfather as residuary`);
        }
        return shares;
    }

    // 3. Siblings and Extended
    for (let i = 4; i < residuaryPriority.length; i++) {
        let maleKey = residuaryPriority[i];
        if (heirs[maleKey] > 0 && !context.blocked[maleKey]) {
            if (maleKey === 'brother') {
                if (addResiduaryShares('brother', 'sister', 'Full Brother', 'Full Sister (with Brother)')) return shares;
            } else if (maleKey === 'paternalBrother') {
                if (addResiduaryShares('paternalBrother', 'paternalSister', 'Paternal Half-Brother', 'Paternal Half-Sister (with Brother)')) return shares;
            } else {
                let name = maleKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                if (maleKey === 'sonOfFullBrother') name = "Son of Full Brother";
                if (maleKey === 'sonOfPaternalBrother') name = "Son of Paternal Half-Brother";
                if (maleKey === 'paternalUncleSon') name = "Son of Paternal Uncle";

                shares.push({
                    heir: maleKey,
                    name: name,
                    count: heirs[maleKey],
                    baseShare: remainder,
                    adjustedShare: remainder,
                    status: 'Residuary',
                    reason: "Residuary (Takes remainder)"
                });
                context.messages.push(`Remaining distributed to ${name} as residuary`);
                return shares;
            }
        }
    }

    // Sisters with descendants
    if (heirs.sister > 0 && !context.blocked.sister && context.hasFemaleDescendants) {
        shares.push({
            heir: 'sister',
            name: 'Full Sister (with Descendants)',
            count: heirs.sister,
            baseShare: remainder,
            adjustedShare: remainder,
            status: 'Residuary',
            reason: "Residuary with others (takes remainder due to female descendants)"
        });
        context.messages.push(`Remaining distributed to Full Sister as residuary with others`);
        return shares;
    }
    
    if (heirs.paternalSister > 0 && 
        !context.blocked.paternalSister && 
        context.hasFemaleDescendants) {


        shares.push({
            heir: 'paternalSister',
            name: 'Paternal Half-Sister (with Descendants)',
            count: heirs.paternalSister,
            baseShare: remainder,
            adjustedShare: remainder,
            status: 'Residuary',
            reason: "Residuary with others (takes remainder due to female descendants)"
        });


        context.messages.push(
            `Remaining distributed to Paternal Half-Sister as residuary with others`
        );
        return shares;
    }

    return shares;
}
