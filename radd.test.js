export const raddTests = [
    {
        name: "Mother + Daughter",
        input: { mother: 1, daughter: 1 },
        expected: { mother: "1/4", daughter: "3/4" }
        // Base: M=1/6, D=1/2=3/6. Sum=4/6. Radd to 4. Mother=1/4, Daughter=3/4.
    },
    {
        name: "Mother + 2 Daughters",
        input: { mother: 1, daughter: 2 },
        expected: { mother: "1/5", daughter: "4/5" }
        // Base: M=1/6, D=2/3=4/6. Sum=5/6. Radd to 5. Mother=1/5, Daughters=4/5.
    },
    {
        name: "Wife + Mother + Daughter",
        input: { wife: 1, mother: 1, daughter: 1 },
        expected: { wife: "1/8", mother: "7/32", daughter: "21/32" }
        // Base: W=1/8. Remainder for Radd=7/8. 
        // M:D ratio is 1/6 : 1/2 -> 1:3. 
        // M gets 1/4 of 7/8 = 7/32. D gets 3/4 of 7/8 = 21/32.
    },
    {
        name: "Husband + 1 Daughter",
        input: { husband: 1, daughter: 1 },
        expected: { husband: "1/4", daughter: "3/4" }
        // Base: H=1/4. Remainder=3/4. D takes her 1/2, then radd takes rest. D gets 3/4 total.
    },
    {
        name: "Husband + Mother",
        input: { husband: 1, mother: 1 },
        expected: { husband: "1/2", mother: "1/2" }
        // Base: H=1/2, M=1/3. Sum=5/6. Remainder 1/6. H gets no radd. M gets 1/3 + 1/6 = 1/2.
    },
    {
        name: "Mother + Full Sister",
        input: { mother: 1, sister: 1 },
        expected: { mother: "1/4", sister: "3/4" }
        // Base: M=1/3, S=1/2. Ratio 2:3. Sum=5. M=2/5? No wait, M=1/3=2/6, S=1/2=3/6. Sum=5/6. M=2/5, S=3/5.
        // Let's check my logic: 1/3 + 1/2 = 5/6. Radd to 5. Mother 2/5, Sister 3/5.
        // Let me adjust expected for exact logic applied in the script, which uses fraction scaling.
        // Let's assume the script outputs 2/5 and 3/5.
    }
];
// Note on the last test:
raddTests[5].expected = { mother: "2/5", sister: "3/5" };
