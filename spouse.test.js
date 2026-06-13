export const spouseTests = [
    {
        name: "Husband only",
        input: { husband: 1 },
        expected: { husband: "1/2" } // Husband takes 1/2, rest goes to Bayt al-Mal (not tracked as heir)
    },
    {
        name: "Wife only",
        input: { wife: 1 },
        expected: { wife: "1/4" }
    },
    {
        name: "Husband + Father",
        input: { husband: 1, father: 1 },
        expected: { husband: "1/2", father: "1/2" } // Father takes residue
    },
    {
        name: "Wife + Son",
        input: { wife: 1, son: 1 },
        expected: { wife: "1/8", son: "7/8" }
    },
    {
        name: "Wife + Father + Mother (Gharawiyyatayn 1)",
        input: { wife: 1, father: 1, mother: 1 },
        expected: { wife: "1/4", mother: "1/4", father: "1/2" } // Mother takes 1/3 of remainder (1/3 of 3/4 = 1/4)
    },
    {
        name: "Husband + Father + Mother (Gharawiyyatayn 2)",
        input: { husband: 1, father: 1, mother: 1 },
        expected: { husband: "1/2", mother: "1/6", father: "1/3" } // Mother takes 1/3 of remainder (1/3 of 1/2 = 1/6)
    },
    {
        name: "Husband + Son + Daughter",
        input: { husband: 1, son: 1, daughter: 1 },
        expected: { husband: "1/4", son: "1/2", daughter: "1/4" } // Remaining 3/4 split 2:1 -> Son 2/4, Daughter 1/4
    },
    {
        name: "4 Wives + 2 Sons",
        input: { wife: 4, son: 2 },
        expected: { wife: "1/8", son: "7/8" }
    },
    {
        name: "Wife + Daughter",
        input: { wife: 1, daughter: 1 },
        expected: { wife: "1/8", daughter: "7/8" } // Daughter takes 1/2, then Radd applies. Wait, wife doesn't get Radd. Daughter gets 1/2 + 3/8 = 7/8.
    },
    {
        name: "Husband + 2 Daughters + Mother + Father",
        input: { husband: 1, daughter: 2, mother: 1, father: 1 },
        expected: { husband: "3/15", daughter: "8/15", mother: "2/15", father: "2/15" } // 'Awl from 12 to 15: Husband 1/4=3, D 2/3=8, M 1/6=2, F 1/6=2
    }
];
