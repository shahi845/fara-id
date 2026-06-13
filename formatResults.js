export function formatResults(shares, estateValue) {
    // Sort by fraction size (descending)
    shares.sort((a, b) => {
        const valA = a.adjustedShare ? (a.adjustedShare.num / a.adjustedShare.den) : 0;
        const valB = b.adjustedShare ? (b.adjustedShare.num / b.adjustedShare.den) : 0;
        return valB - valA;
    });

    return shares.map(share => {
        let totalFraction = 0;
        let fracText = '-';

        if (share.adjustedShare && share.adjustedShare.num > 0) {
            totalFraction = share.adjustedShare.num / share.adjustedShare.den;
            const pctStr = (totalFraction * 100).toFixed(2) + '%';
            if (share.adjustedShare.num === share.adjustedShare.den) {
                fracText = `1 (${pctStr})`;
            } else {
                fracText = `${share.adjustedShare.num}/${share.adjustedShare.den} (${pctStr}) ${share.count > 1 ? '(Total)' : ''}`.trim();
            }
        }

        const perPersonFraction = share.count > 0 ? (totalFraction / share.count) : 0;
        const pctPerPerson = perPersonFraction * 100;
        const amountPerPerson = estateValue > 0 ? (estateValue * perPersonFraction).toFixed(2) : '-';

        return {
            ...share,
            totalFraction,
            pctPerPerson,
            amountPerPerson,
            fracText
        };
    });
}

export function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1).replace(/([A-Z])/g, ' $1').trim();
}
