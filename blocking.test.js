export const blockingTests = [
    {
        name: "Father blocks Grandfather",
        input: { father: 1, grandfather: 1 },
        expected: { father: "1" }
    },
    {
        name: "Mother blocks all Grandmothers",
        input: { mother: 1, maternalGrandmother: 1, paternalGrandmother: 1 },
        expected: { mother: "1" }
    },
    {
        name: "Father blocks Paternal Grandmother",
        input: { father: 1, paternalGrandmother: 1 },
        expected: { father: "1" }
    },
    {
        name: "Son blocks Grandson and Brothers",
        input: { son: 1, grandson: 1, brother: 1, sister: 1 },
        expected: { son: "1" }
    },
    {
        name: "Two Daughters block Granddaughter",
        input: { daughter: 2, granddaughter: 1, uncle: 1 },
        expected: { daughter: "2/3", uncle: "1/3" }
    },
    {
        name: "Full Brother blocks Paternal Brother",
        input: { brother: 1, paternalBrother: 1 },
        expected: { brother: "1" }
    },
    {
        name: "Full Sister with Daughter blocks Paternal Brother",
        input: { daughter: 1, sister: 1, paternalBrother: 1 },
        expected: { daughter: "1/2", sister: "1/2" } // Sister becomes residuary with daughter, blocks paternal brother
    },
    {
        name: "Nephew blocked by Brother",
        input: { brother: 1, sonOfFullBrother: 1 },
        expected: { brother: "1" }
    },
    {
        name: "Uncle blocked by Nephew",
        input: { sonOfFullBrother: 1, uncle: 1 },
        expected: { sonOfFullBrother: "1" }
    },
    {
        name: "Cousin blocked by Uncle",
        input: { uncle: 1, paternalUncleSon: 1 },
        expected: { uncle: "1" }
    }
];
