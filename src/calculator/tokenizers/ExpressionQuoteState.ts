/** @module calculator */
import { IQuoteState } from "../../tokenizers/IQuoteState";
import { IPushbackReader } from "../../io/IPushbackReader";
import { ITokenizer } from "../../tokenizers/ITokenizer";
import { Token } from "../../tokenizers/Token";
import { TokenType } from "../../tokenizers/TokenType";
import { CharValidator } from "../../tokenizers/utilities/CharValidator";

/**
 * Implements an Expression-specific quote string state object.
 */
export class ExpressionQuoteState implements IQuoteState {
    protected readonly QUOTE: number = '"'.charCodeAt(0);

    /**
      * Gets the next token from the stream started from the character linked to this state.
      * @param reader A textual string to be tokenized.
      * @param tokenizer A tokenizer class that controls the process.
      * @returns The next token from the top of the stream.
      */
     public nextToken(reader: IPushbackReader, tokenizer: ITokenizer): Token {
        let firstSymbol = reader.read();
        let tokenValue = "";
        tokenValue = tokenValue + String.fromCharCode(firstSymbol);

        for (let nextSymbol = reader.read(); !CharValidator.isEof(nextSymbol); nextSymbol = reader.read()) {
            tokenValue = tokenValue + String.fromCharCode(nextSymbol);
            if (nextSymbol == firstSymbol) {
                if (reader.peek() == firstSymbol) {
                    nextSymbol = reader.read();
                    tokenValue = tokenValue + String.fromCharCode(nextSymbol);
                } else {
                    break;
                }
            }
        }

        return new Token(
            firstSymbol == this.QUOTE ? TokenType.Word : TokenType.Quoted,
            tokenValue
        );
    }

    /**
     * Encodes a string value.
     * @param value A string value to be encoded.
     * @param quoteSymbol A string quote character.
     * @returns An encoded string.
     */
    public encodeString(value: string, quoteSymbol: number): string {
        if (value == null) return null;

        let quoteString = String.fromCharCode(quoteSymbol);
        let result = quoteString
            + value.replace(quoteString, quoteString + quoteString)
            + quoteString;
        return result;
    }

    /**
     * Decodes a string value.
     * @param value A string value to be decoded.
     * @param quoteSymbol A string quote character.
     * @returns An decoded string.
     */
    public decodeString(value: string, quoteSymbol: number): string {
        if (value == null) return null;

        if (value.length >= 2 && value.charCodeAt(0) == quoteSymbol
            && value.charCodeAt(value.length - 1) == quoteSymbol) {
            let quoteString = String.fromCharCode(quoteSymbol);
            return value.substring(1, value.length - 1).replace(quoteString + quoteString, quoteString);
        }
        return value;
    }
}