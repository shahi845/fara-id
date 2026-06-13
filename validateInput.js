export function validateInput(heirs) {
    const totalHeirs = Object.values(heirs).reduce((sum, count) => sum + count, 0);
    if (totalHeirs === 0) {
        throw new Error("Invalid input: No heirs entered. Estate remains unassigned or goes to Bayt al-Māl.");
    }

    if (heirs.husband > 0 && heirs.wife > 0) {
        throw new Error("Invalid input: Cannot have both husband and wife as heirs.");
    }
    if (heirs.father > 1) {
        throw new Error("Invalid input: Cannot have more than one father.");
    }
    if (heirs.mother > 1) {
        throw new Error("Invalid input: Cannot have more than one mother.");
    }
    if (heirs.husband > 1) {
        throw new Error("Invalid input: Cannot have more than one husband.");
    }
    if (heirs.wife > 4) {
        throw new Error("Invalid input: Cannot have more than four wives.");
    }
    if (heirs.paternalGrandmother > 1 || heirs.maternalGrandmother > 1) {
        throw new Error("Invalid input: Cannot have more than one of each grandmother type.");
    }
    if (heirs.grandfather > 1) {
        throw new Error("Invalid input: Cannot have more than one paternal grandfather.");
    }
}
