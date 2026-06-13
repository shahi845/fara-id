export function buildContext(heirs) {
    const hasMaleDescendants = heirs.son > 0 || heirs.grandson > 0;
    const hasFemaleDescendants = heirs.daughter > 0 || heirs.granddaughter > 0;
    const hasDescendants = hasMaleDescendants || hasFemaleDescendants;

    const siblingCount = heirs.brother + heirs.sister + heirs.paternalBrother + heirs.paternalSister + heirs.maternalBrother + heirs.maternalSister;

    return {
        hasMaleDescendants,
        hasFemaleDescendants,
        hasDescendants,
        siblingCount,
        hasFather: heirs.father > 0,
        hasGrandfather: heirs.grandfather > 0,
        blocked: {}, // Will be populated by applyBlocking
        messages: [] // To store reasoning or notifications
    };
}
