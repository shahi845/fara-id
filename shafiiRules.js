import { fraction } from '../utils/fractions.js';

export const blockingRules = {
    grandfather: ({ heirs }) => heirs.father > 0,
    maternalGrandmother: ({ heirs }) => heirs.mother > 0,
    paternalGrandmother: ({ heirs }) => heirs.mother > 0 || heirs.father > 0,
    grandson: ({ heirs }) => heirs.son > 0,
    granddaughter: ({ heirs }) => heirs.son > 0 || heirs.daughter >= 2,
    brother: ({ heirs }) => heirs.son > 0 || heirs.grandson > 0 || heirs.father > 0 || heirs.grandfather > 0,
    sister: ({ heirs }) => heirs.son > 0 || heirs.grandson > 0 || heirs.father > 0 || heirs.grandfather > 0,
    sonOfFullBrother: ({ heirs }) => heirs.son > 0 || heirs.grandson > 0 || heirs.father > 0 || heirs.grandfather > 0 || heirs.brother > 0 || (heirs.sister > 0 && (heirs.daughter > 0 || heirs.granddaughter > 0)) || heirs.paternalBrother > 0,
    paternalBrother: ({ heirs }) => heirs.son > 0 || heirs.grandson > 0 || heirs.father > 0 || heirs.grandfather > 0 || heirs.brother > 0 || (heirs.sister > 0 && (heirs.daughter > 0 || heirs.granddaughter > 0)),
    paternalSister: ({ heirs }) => heirs.son > 0 || heirs.grandson > 0 || heirs.father > 0 || heirs.grandfather > 0 || heirs.brother > 0 || heirs.sister >= 2 || (heirs.sister > 0 && (heirs.daughter > 0 || heirs.granddaughter > 0)),
    sonOfPaternalBrother: ({ heirs }) => heirs.son > 0 || heirs.grandson > 0 || heirs.father > 0 || heirs.grandfather > 0 || heirs.brother > 0 || (heirs.sister > 0 && (heirs.daughter > 0 || heirs.granddaughter > 0)) || heirs.paternalBrother > 0 || heirs.sonOfFullBrother > 0 || (heirs.paternalSister > 0 && (heirs.daughter > 0 || heirs.granddaughter > 0)),
    maternalBrother: ({ heirs }) => heirs.son > 0 || heirs.grandson > 0 || heirs.daughter > 0 || heirs.granddaughter > 0 || heirs.father > 0 || heirs.grandfather > 0,
    maternalSister: ({ heirs }) => heirs.son > 0 || heirs.grandson > 0 || heirs.daughter > 0 || heirs.granddaughter > 0 || heirs.father > 0 || heirs.grandfather > 0,
    uncle: ({ heirs }) => heirs.son > 0 || heirs.grandson > 0 || heirs.father > 0 || heirs.grandfather > 0 || heirs.brother > 0 || heirs.paternalBrother > 0 || heirs.sonOfFullBrother > 0 || heirs.sonOfPaternalBrother > 0 || (heirs.sister > 0 && (heirs.daughter > 0 || heirs.granddaughter > 0)),
    paternalUncleSon: ({ heirs }) => heirs.son > 0 || heirs.grandson > 0 || heirs.father > 0 || heirs.grandfather > 0 || heirs.brother > 0 || heirs.paternalBrother > 0 || heirs.sonOfFullBrother > 0 || heirs.sonOfPaternalBrother > 0 || heirs.uncle > 0 || (heirs.sister > 0 && (heirs.daughter > 0 || heirs.granddaughter > 0))
};

export const blockingReasons = {
    grandfather: "Father",
    maternalGrandmother: "Mother",
    paternalGrandmother: "Mother or Father",
    grandson: "Son",
    granddaughter: "Daughter (if 2+) or Son",
    brother: "Son/Grandson/Father/Grandfather",
    sister: "Son/Grandson/Father/Grandfather",
    sonOfFullBrother: "Closer relative (e.g., Brother, Ascendant, Descendant)",
    paternalBrother: "Brother, Sister (with Descendant), or closer relative",
    paternalSister: "Brother, Sister (if 2+ or with Descendant), or closer relative",
    sonOfPaternalBrother: "Closer relative",
    maternalBrother: "Descendant or Ascendant Male",
    maternalSister: "Descendant or Ascendant Male",
    uncle: "Brother, Nephew, or closer relative",
    paternalUncleSon: "Uncle or closer relative"
};

export const fixedShareRules = {
    husband: {
        eligible: ({ heirs }) => heirs.husband === 1,
        share: ({ context }) => context.hasDescendants ? fraction(1, 4) : fraction(1, 2),
        reason: ({ context }) => context.hasDescendants ? "1/4 due to presence of descendants" : "1/2 due to absence of descendants"
    },
    wife: {
        eligible: ({ heirs }) => heirs.wife > 0,
        share: ({ context }) => context.hasDescendants ? fraction(1, 8) : fraction(1, 4),
        reason: ({ context }) => context.hasDescendants ? "1/8 due to presence of descendants" : "1/4 due to absence of descendants"
    },
    mother: {
        eligible: ({ heirs }) => heirs.mother === 1,
        share: ({ context, heirs }) => {
            if (context.hasDescendants || context.siblingCount >= 2) return fraction(1, 6);
            if (heirs.father > 0 && (heirs.husband > 0 || heirs.wife > 0)) {
                if (heirs.husband > 0) return fraction(1, 6);
                if (heirs.wife > 0) return fraction(1, 4);
            }
            return fraction(1, 3);
        },
        reason: ({ context, heirs }) => {
            if (context.hasDescendants || context.siblingCount >= 2) return "1/6 due to descendants or multiple siblings";
            if (heirs.father > 0 && (heirs.husband > 0 || heirs.wife > 0)) return "1/3 of remainder (Gharāwiyyatayn case)";
            return "1/3 due to absence of descendants and siblings";
        }
    },
    grandmothers: {
        eligible: ({ heirs, context }) => (heirs.maternalGrandmother > 0 && !context.blocked.maternalGrandmother) || (heirs.paternalGrandmother > 0 && !context.blocked.paternalGrandmother),
        share: () => fraction(1, 6),
        reason: () => "1/6 fixed share (shared if multiple valid grandmothers)"
    },
    father: {
        eligible: ({ heirs }) => heirs.father === 1,
        share: ({ context }) => {
            if (context.hasMaleDescendants) return fraction(1, 6);
            if (context.hasDescendants) return fraction(1, 6);
            return null;
        },
        reason: ({ context }) => {
            if (context.hasMaleDescendants) return "1/6 as sharer (due to male descendants)";
            if (context.hasDescendants) return "1/6 as sharer (takes residue later)";
            return "";
        }
    },
    grandfather: {
        eligible: ({ heirs, context }) => heirs.grandfather === 1 && !context.blocked.grandfather,
        share: ({ context }) => {
            if (context.hasMaleDescendants) return fraction(1, 6);
            if (context.hasDescendants) return fraction(1, 6);
            return null;
        },
        reason: ({ context }) => {
            if (context.hasMaleDescendants) return "1/6 as sharer (due to male descendants)";
            if (context.hasDescendants) return "1/6 as sharer (takes residue later)";
            return "";
        }
    },
    daughter: {
        eligible: ({ heirs }) => heirs.daughter > 0 && heirs.son === 0,
        share: ({ heirs }) => heirs.daughter === 1 ? fraction(1, 2) : fraction(2, 3),
        reason: ({ heirs }) => heirs.daughter === 1 ? "1/2 fixed share (single)" : "2/3 fixed share (multiple)"
    },
    granddaughter: {
        eligible: ({ heirs, context }) => heirs.granddaughter > 0 && heirs.grandson === 0 && !context.blocked.granddaughter,
        share: ({ heirs }) => {
            if (heirs.daughter === 1) return fraction(1, 6);
            return heirs.granddaughter === 1 ? fraction(1, 2) : fraction(2, 3);
        },
        reason: ({ heirs }) => {
            if (heirs.daughter === 1) return "1/6 to complete 2/3 with daughter";
            return heirs.granddaughter === 1 ? "1/2 fixed share (single)" : "2/3 fixed share (multiple)";
        }
    },
    sister: {
        eligible: ({ heirs, context }) => heirs.sister > 0 && !context.blocked.sister && heirs.brother === 0 && !context.hasDescendants,
        share: ({ heirs }) => heirs.sister === 1 ? fraction(1, 2) : fraction(2, 3),
        reason: ({ heirs }) => heirs.sister === 1 ? "1/2 fixed share (single)" : "2/3 fixed share (multiple)"
    },
    paternalSister: {
        eligible: ({ heirs, context }) => heirs.paternalSister > 0 && !context.blocked.paternalSister && heirs.paternalBrother === 0 && !context.hasDescendants,
        share: ({ heirs }) => {
            if (heirs.sister === 1) return fraction(1, 6);
            return heirs.paternalSister === 1 ? fraction(1, 2) : fraction(2, 3);
        },
        reason: ({ heirs }) => {
            if (heirs.sister === 1) return "1/6 to complete 2/3 with full sister";
            return heirs.paternalSister === 1 ? "1/2 fixed share (single)" : "2/3 fixed share (multiple)";
        }
    },
    maternalSiblings: {
        eligible: ({ heirs, context }) => {
            const count = (context.blocked.maternalBrother ? 0 : heirs.maternalBrother) + (context.blocked.maternalSister ? 0 : heirs.maternalSister);
            return count > 0;
        },
        share: ({ heirs, context }) => {
            const count = (context.blocked.maternalBrother ? 0 : heirs.maternalBrother) + (context.blocked.maternalSister ? 0 : heirs.maternalSister);
            return count === 1 ? fraction(1, 6) : fraction(1, 3);
        },
        reason: ({ heirs, context }) => {
            const count = (context.blocked.maternalBrother ? 0 : heirs.maternalBrother) + (context.blocked.maternalSister ? 0 : heirs.maternalSister);
            return count === 1 ? "1/6 fixed share (single)" : "1/3 fixed share (multiple)";
        }
    }
};
