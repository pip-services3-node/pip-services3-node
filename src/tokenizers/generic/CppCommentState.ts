/** @module tokenizers */

import { Token } from '../Token';
import { TokenType } from '../TokenType';
import { ITokenizer } from '../ITokenizer';
import { IPushbackReader } from '../../io/IPushbackReader';
import { CharValidator } from '../utilities/CharValidator';
import { GenericCommentState } from './GenericCommentState';

/**
 * This state will either delegate to a comment-handling state, or return a token with just a slash in it.
 */
export class CppCommentState extends GenericCommentState {
    protected readonly STAR: number = '*'.charCodeAt(0);
    protected readonly SLASH: number = '/'.charCodeAt(0);

    /**
     * Ignore everything up to a closing star and slash, and then return the tokenizer's next token.
     * @param IPushbackReader 
     * @param reader 
     */
    protected getMultiLineComment(reader: IPushbackReader): string {
        let result = "";
        let lastSymbol = 0;
        for (let nextSymbol = reader.read(); !CharValidator.isEof(nextSymbol); nextSymbol = reader.read()) {
            result = result + String.fromCharCode(nextSymbol);
            if (lastSymbol == this.STAR && nextSymbol == this.SLASH) {
                break;
            }
            lastSymbol = nextSymbol;
        }
        return result;
    }

    /**
     * Ignore everything up to an end-of-line and return the tokenizer's next token.
     * @param reader 
     */
    protected getSingleLineComment(reader: IPushbackReader): string {
        let result = "";
        let nextSymbol: number;
        for (nextSymbol = reader.read();
            !CharValidator.isEof(nextSymbol) && !CharValidator.isEol(nextSymbol);
            nextSymbol = reader.read()) {
            result = result + String.fromCharCode(nextSymbol);
        }
        if (CharValidator.isEol(nextSymbol)) {
            reader.pushback(nextSymbol);
        }
        return result;
    }

    /**
     * Either delegate to a comment-handling state, or return a token with just a slash in it.
     * @param reader A textual string to be tokenized.
     * @param tokenizer A tokenizer class that controls the process.
     * @returns The next token from the top of the stream.
     */
    public nextToken(reader: IPushbackReader, tokenizer: ITokenizer): Token {
        let firstSymbol = reader.read();
        if (firstSymbol != this.SLASH) {
            reader.pushback(firstSymbol);
            throw new Error("Incorrect usage of CppCommentState.");
        }

        let secondSymbol = reader.read();
        if (secondSymbol == this.STAR) {
            return new Token(TokenType.Comment, "/*" + this.getMultiLineComment(reader));
        } else if (secondSymbol == this.SLASH) {
            return new Token(TokenType.Comment, "//" + this.getSingleLineComment(reader));
        } else {
            if (!CharValidator.isEof(secondSymbol)) {
                reader.pushback(secondSymbol);
            }
            if (!CharValidator.isEof(firstSymbol)) {
                reader.pushback(firstSymbol);
            }
            return tokenizer.symbolState.nextToken(reader, tokenizer);
        }
    }
}