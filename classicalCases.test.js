import { calculateInheritance } from '../engine/calculateInheritance.js';

const classicalCases = [
    {
        name: "Al-Minbariyyah (Wife, Father, Mother, 2 Daughters)",
        input: { wife: 1, father: 1, mother: 1, daughter: 2 },
        expected: {
            wife: "3/27",
            father: "4/27",
            mother: "4/27",
            daughter: "16/27" 
        }
    },
    {
        name: "Al-Gharawiyyatayn 1 (Husband, Mother, Father)",
        input: { husband: 1, mother: 1, father: 1 },
        expected: {
            husband: "1/2",
            mother: "1/6",
            father: "1/3"
        }
    },
    {
        name: "Al-Gharawiyyatayn 2 (Wife, Mother, Father)",
        input: { wife: 1, mother: 1, father: 1 },
        expected: {
            wife: "1/4",
            mother: "1/4",
            father: "1/2"
        }
    },
    {
        name: "Grandmothers (Maternal and Paternal share 1/6)",
        input: { maternalGrandmother: 1, paternalGrandmother: 1 },
        expected: {
            grandmothers: "1/6"
        }
    },
    {
        name: "Extended Asabah (Wife, Paternal Uncle Son)",
        input: { wife: 1, paternalUncleSon: 1 },
        expected: {
            wife: "1/4",
            paternalUncleSon: "3/4"
        }
    }
];

function runTests() {
    let passed = 0;
    
    classicalCases.forEach(test => {
        const { shares } = calculateInheritance(test.input);
        let currentPassed = true;
        
        for (const [heir, expectedFraction] of Object.entries(test.expected)) {
            const share = shares.find(s => s.heir === heir);
            if (!share && expectedFraction !== "0") {
                console.error(`❌ ${test.name}: Missing share for ${heir}`);
                currentPassed = false;
                continue;
            }
            if (share) {
                const actualFraction = share.adjustedShare.num === share.adjustedShare.den ? "1" : `${share.adjustedShare.num}/${share.adjustedShare.den}`;
                if (actualFraction !== expectedFraction) {
                    console.error(`❌ ${test.name}: Expected ${heir} to get ${expectedFraction}, got ${actualFraction}`);
                    currentPassed = false;
                }
            }
        }
        
        if (currentPassed) {
            console.log(`✅ ${test.name}`);
            passed++;
        }
    });
    
    console.log(`\n${passed}/${classicalCases.length} classical cases passed.`);
}

runTests();
