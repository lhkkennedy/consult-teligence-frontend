import type { Region, Specialty, CountriesMap } from './types';


// exactly what your JS module exports:
export declare const regions: readonly Region[];
export declare const specialties: readonly Specialty[];
export declare const subSpecialties: Record<Specialty, readonly SubSpecialty[]>;
export declare const countries: CountriesMap;
export declare const consultants: readonly Consultant[];
export declare const articles: readonly Article[];