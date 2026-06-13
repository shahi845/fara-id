import { spouseTests } from './spouse.test.js';
import { blockingTests } from './blocking.test.js';
import { awlTests } from './awl.test.js';
import { raddTests } from './radd.test.js';
import { complexTests } from './complex.test.js';
import { calculateInheritance } from '../engine/calculateInheritance.js';

const allSuites = [
    { name: "Spouse & Immediate Family Cases", tests: spouseTests },
    { name: "Blocking (Hajb) Cases", tests: blockingTests },
    { name: "'Awl (Proportional Reduction) Cases", tests: awlTests },
    { name: "Radd (Redistribution) Cases", tests: raddTests },
    { name: "Complex Scenarios", tests: complexTests }
];

export function runAllTests() {
    let totalTests = 0;
    let totalPassed = 0;

    console.log("=========================================");
    console.log("   SHAFII FARA'ID CALCULATOR TEST SUITE  ");
    console.log("=========================================\n");

    allSuites.forEach(suite => {
        if (!suite.tests) return;
        
        console.log(`--- Running Suite: ${suite.name} ---`);
        let passed = 0;
        
        suite.tests.forEach((test, index) => {
            totalTests++;
            try {
                const { shares } = calculateInheritance(test.input);
                let currentPassed = true;
                let errorMessages = [];
                
                // Check all expected heirs and their shares
                for (const [heir, expectedFraction] of Object.entries(test.expected)) {
                    const share = shares.find(s => s.heir === heir);
                    if (!share) {
                        errorMessages.push(`Missing expected share for ${heir}`);
                        currentPassed = false;
                        continue;
                    }
                    const actualFraction = share.adjustedShare.num === share.adjustedShare.den 
                        ? "1" 
                        : `${share.adjustedShare.num}/${share.adjustedShare.den}`;
                        
                    if (actualFraction !== expectedFraction) {
                        errorMessages.push(`Expected ${heir} to get ${expectedFraction}, got ${actualFraction}`);
                        currentPassed = false;
                    }
                }

                // Check that no unexpected heirs got shares (unless they are blocked and expected output doesn't care)
                shares.forEach(share => {
                    if (!share.status.includes('Blocked') && !test.expected[share.heir] && share.adjustedShare.num > 0) {
                        errorMessages.push(`Unexpected share given to ${share.heir}: ${share.adjustedShare.num}/${share.adjustedShare.den}`);
                        currentPassed = false;
                    }
                });
                
                if (currentPassed) {
                    passed++;
                    totalPassed++;
                } else {
                    console.error(`❌ Test Failed: ${test.name}`);
                    errorMessages.forEach(msg => console.error(`   - ${msg}`));
                }
            } catch (err) {
                console.error(`❌ Test Crashed: ${test.name}`);
                console.error(`   - Error: ${err.message}`);
            }
        });
        
        console.log(`Suite Result: ${passed}/${suite.tests.length} passed.\n`);
    });
    
    console.log("=========================================");
    console.log(`OVERALL RESULT: ${totalPassed}/${totalTests} tests passed.`);
    console.log("=========================================\n");
}

// If running in browser or Node
if (typeof window !== 'undefined') {
    window.runFaraidTests = runAllTests;
    console.log("Test suite loaded. Run `window.runFaraidTests()` in console to execute.");
}
