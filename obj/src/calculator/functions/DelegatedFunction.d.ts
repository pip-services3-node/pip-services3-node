import { Variant } from "../../variants/Variant";
import { IVariantOperations } from "../../variants/IVariantOperations";
import { IFunction } from "./IFunction";
/**
 * Defines a delegate to implement a function
 */
export declare type FunctionCalculator = (params: Variant[], variantOperations: IVariantOperations, callback: (err: any, result: Variant) => void) => void;
export declare class DelegatedFunction implements IFunction {
    private _name;
    private _calculator;
    private _context;
    /**
     * Constructs this function class with specified parameters.
     * @param name The name of this function.
     * @param calculator The function calculator delegate.
     */
    constructor(name: string, calculator: FunctionCalculator, context?: any);
    /**
     * The function name.
     */
    readonly name: string;
    /**
     * The function calculation method.
     * @param params an array with function parameters.
     * @param variantOperations Variants operations manager.
     * @param callback a callback to return function result.
     */
    calculate(params: Variant[], variantOperations: IVariantOperations, callback: (err: any, result: Variant) => void): void;
}
