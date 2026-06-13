export const awlTests = [
    {
        name: "Al-Minbariyyah (Wife, 2 Daughters, Father, Mother)",
        input: { wife: 1, daughter: 2, father: 1, mother: 1 },
        expected: { wife: "3/27", daughter: "16/27", father: "4/27", mother: "4/27" } 
        // Base 24 -> Awl to 27. Wife 3/27 (was 1/8), Daughters 16/27 (was 2/3), Father 4/27 (was 1/6), Mother 4/27 (was 1/6)
    },
    {
        name: "Husband, 2 Full Sisters",
        input: { husband: 1, sister: 2 },
        expected: { husband: "3/7", sister: "4/7" }
        // Base 6 -> Awl to 7. Husband 3/7 (was 1/2), Sisters 4/7 (was 2/3)
    },
    {
        name: "Husband, 2 Full Sisters, Mother",
        input: { husband: 1, sister: 2, mother: 1 },
        expected: { husband: "3/8", sister: "4/8", mother: "1/8" }
        // Base 6 -> Awl to 8.
    },
    {
        name: "Husband, 2 Full Sisters, Mother, 2 Maternal Siblings (Al-Gharra')",
        input: { husband: 1, sister: 2, mother: 1, maternalBrother: 1, maternalSister: 1 },
        expected: { husband: "3/10", sister: "4/10", mother: "1/10", maternalBrother: "1/10", maternalSister: "1/10" }
        // Base 6 -> Awl to 10. Husband 3/10, Sisters 4/10, Mother 1/10, MatSibs 2/10
    },
    {
        name: "Wife, 2 Full Sisters, Mother",
        input: { wife: 1, sister: 2, mother: 1 },
        expected: { wife: "3/13", sister: "8/13", mother: "2/13" }
        // Base 12 -> Awl to 13. Wife 3/13 (was 1/4), Sisters 8/13 (was 2/3), Mother 2/13 (was 1/6)
    },
    {
        name: "Wife, 2 Full Sisters, Mother, 2 Maternal Siblings",
        input: { wife: 1, sister: 2, mother: 1, maternalSister: 2 },
        expected: { wife: "3/17", sister: "8/17", mother: "2/17", maternalSister: "4/17" }
        // Base 12 -> Awl to 17. 
    }
];
