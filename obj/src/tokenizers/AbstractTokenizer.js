"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Token_1 = require("./Token");
const TokenType_1 = require("./TokenType");
const CharReferenceMap_1 = require("./utilities/CharReferenceMap");
const CharValidator_1 = require("./utilities/CharValidator");
const StringPushbackReader_1 = require("../io/StringPushbackReader");
/**
 * Implements an abstract tokenizer class.
 */
class AbstractTokenizer {
    constructor() {
        this._map = new CharReferenceMap_1.CharReferenceMap();
        this._lastTokenType = TokenType_1.TokenType.Unknown;
    }
    getCharacterState(symbol) {
        return this._map.lookup(symbol);
    }
    setCharacterState(fromSymbol, toSymbol, state) {
        this._map.addInterval(fromSymbol, toSymbol, state);
    }
    clearCharacterStates() {
        this._map.clear();
    }
    get reader() {
        return this._reader;
    }
    set reader(value) {
        this._reader = value;
        this._nextToken = null;
        this._lastTokenType = TokenType_1.TokenType.Unknown;
    }
    hasNextToken() {
        this._nextToken = this._nextToken == null ? this.readNextToken() : this._nextToken;
        return this._nextToken != null;
    }
    nextToken() {
        let token = this._nextToken == null ? this.readNextToken() : this._nextToken;
        this._nextToken = null;
        return token;
    }
    readNextToken() {
        if (this._reader == null) {
            return null;
        }
        let token = null;
        while (true) {
            // Read character
            let nextChar = this._reader.peek();
            // If reached Eof then exit
            if (CharValidator_1.CharValidator.isEof(nextChar)) {
                token = null;
                break;
            }
            // Get state for character
            let state = this.getCharacterState(nextChar);
            if (state != null) {
                token = state.nextToken(this._reader, this);
            }
            // Check for unknown characters and endless loops...
            if (token == null || token.value == '') {
                token = new Token_1.Token(TokenType_1.TokenType.Unknown, String.fromCharCode(this._reader.read()));
            }
            // Skip unknown characters if option set.
            if (token.type == TokenType_1.TokenType.Unknown && this.skipUnknown) {
                this._lastTokenType = token.type;
                continue;
            }
            // Decode strings is option set.
            if (state != null && state.decodeString != null && this.decodeStrings) {
                token = new Token_1.Token(token.type, this.quoteState.decodeString(token.value, nextChar));
            }
            // Skips comments if option set.
            if (token.type == TokenType_1.TokenType.Comment && this.skipComments) {
                this._lastTokenType = token.type;
                continue;
            }
            // Skips whitespaces if option set.
            if (token.type == TokenType_1.TokenType.Whitespace
                && this._lastTokenType == TokenType_1.TokenType.Whitespace
                && this.skipWhitespaces) {
                this._lastTokenType = token.type;
                continue;
            }
            // Unifies whitespaces if option set.
            if (token.type == TokenType_1.TokenType.Whitespace && this.mergeWhitespaces) {
                token = new Token_1.Token(TokenType_1.TokenType.Whitespace, " ");
            }
            // Unifies numbers if option set.
            if (this.unifyNumbers
                && (token.type == TokenType_1.TokenType.Integer
                    || token.type == TokenType_1.TokenType.Float
                    || token.type == TokenType_1.TokenType.HexDecimal)) {
                token = new Token_1.Token(TokenType_1.TokenType.Number, token.value);
            }
            break;
        }
        // Adds an Eof if option is not set.
        if (token == null && this._lastTokenType != TokenType_1.TokenType.Eof && !this.skipEof) {
            token = new Token_1.Token(TokenType_1.TokenType.Eof, null);
        }
        // Assigns the last token type
        this._lastTokenType = token != null ? token.type : TokenType_1.TokenType.Eof;
        return token;
    }
    tokenizeStream(reader) {
        this.reader = reader;
        let tokenList = [];
        for (let token = this.nextToken(); token != null; token = this.nextToken()) {
            tokenList.push(token);
        }
        return tokenList;
    }
    tokenizeBuffer(buffer) {
        let reader = new StringPushbackReader_1.StringPushbackReader(buffer);
        return this.tokenizeStream(reader);
    }
    tokenizeStreamToStrings(reader) {
        this.reader = reader;
        let stringList = [];
        for (let token = this.nextToken(); token != null; token = this.nextToken()) {
            stringList.push(token.value);
        }
        return stringList;
    }
    tokenizeBufferToStrings(buffer) {
        let reader = new StringPushbackReader_1.StringPushbackReader(buffer);
        return this.tokenizeStreamToStrings(reader);
    }
}
exports.AbstractTokenizer = AbstractTokenizer;
//# sourceMappingURL=AbstractTokenizer.js.map