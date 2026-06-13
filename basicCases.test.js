import { calculateInheritance } from '../engine/calculateInheritance.js';

const tests = [
    {
        name: "Husband + Father",
        input: { husband: 1, father: 1 },
        expected: {
            husband: "1/2",
            father: "1/2"
        }
    },
    {
        name: "Wife + Son",
        input: { wife: 1, son: 1 },
        expected: {
            wife: "1/8",
            son: "7/8"
        }
    },
    {
        name: "Mother + Father + 2 Daughters",
        input: { mother: 1, father: 1, daughter: 2 },
        expected: {
            mother: "1/6",
            father: "1/6",
            daughter: "2/3"
        }
    }
];

function runTests() {
    let passed = 0;
    tests.forEach(test => {
        const { shares } = calculateInheritance(test.input);
        let currentPassed = true;
        
        for (const [heir, expectedFraction] of Object.entries(test.expected)) {
            const share = shares.find(s => s.heir === heir);
            if (!share) {
                console.error(`❌ ${test.name}: Missing share for ${heir}`);
                currentPassed = false;
                continue;
            }
            const actualFraction = share.adjustedShare.num === share.adjustedShare.den ? "1" : `${share.adjustedShare.num}/${share.adjustedShare.den}`;
            if (actualFraction !== expectedFraction) {
                console.error(`❌ ${test.name}: Expected ${heir} to get ${expectedFraction}, got ${actualFraction}`);
                currentPassed = false;
            }
        }
        
        if (currentPassed) {
            console.log(`✅ ${test.name}`);
            passed++;
        }
    });
    
    console.log(`\n${passed}/${tests.length} tests passed.`);
}

runTests();
