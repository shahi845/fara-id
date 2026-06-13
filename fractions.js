import { gcd } from './gcd.js';

export const fraction = (num, den) => {
    if (den === 0) throw new Error("Denominator cannot be zero.");
    return simplifyFraction({ num, den });
};

export const simplifyFraction = (f) => {
    if (f.num === 0) return { num: 0, den: 1 };
    const d = gcd(f.num, f.den);
    // ensure denominator is positive
    if (f.den < 0) {
        return { num: -f.num / d, den: -f.den / d };
    }
    return { num: f.num / d, den: f.den / d };
};

export const addFractions = (a, b) => {
    return fraction(a.num * b.den + b.num * a.den, a.den * b.den);
};

export const subtractFractions = (a, b) => {
    return fraction(a.num * b.den - b.num * a.den, a.den * b.den);
};

export const multiplyFractions = (a, b) => {
    return fraction(a.num * b.num, a.den * b.den);
};

export const divideFractions = (a, b) => {
    return fraction(a.num * b.den, a.den * b.num);
};

export const compareFractions = (a, b) => {
    return a.num * b.den - b.num * a.den; // > 0 if a > b, < 0 if a < b, 0 if a == b
};
