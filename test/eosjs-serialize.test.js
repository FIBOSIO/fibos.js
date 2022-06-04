var FIBOS = require('..');

var { TextEncoder, TextDecoder } = require('util');
var { ec } = require('elliptic');
var { createInitialTypes, Type, SerialBuffer } = require('eosjs/dist/eosjs-serialize');

describe('Serialize', () => {
    var types;

    before(() => {
        types = createInitialTypes();
    });

    it('should be able to createInitialTypes', () => {
        assert.ok(types);
    });

    describe('pushAsset', () => {
        var serialBuffer;
        const genericValidSymbolCharacter = 'A';
        const invalidSymbolErrorMessage = 'Expected symbol to be A-Z and between one and seven characters';

        beforeEach(() => {
            serialBuffer = new SerialBuffer({
                textEncoder: new TextEncoder(),
                textDecoder: new TextDecoder()
            });
        });

        const expectSuccessForICharactersSymbol = (i) => {
            const symbol = genericValidSymbolCharacter.repeat(i);
            const asset = `10.000 ${symbol}`;

            serialBuffer.pushAsset(asset);

            assert.notEqual(serialBuffer.length, 0);
        };

        const expectExceptionThrown = (asset) => {
            let exceptionCaught = false;

            try {
                serialBuffer.pushAsset(asset);
            } catch (e) {
                assert.equal(e.message, invalidSymbolErrorMessage);
                exceptionCaught = true;
            }

            assert.ok(exceptionCaught);
        };

        for (let i = 1; i <= 7; i++) {
            it(`should be able to push asset with valid symbol of ${i} character(s)`, () => {
                expectSuccessForICharactersSymbol(i);
            });
        }

        it('should be able to push asset with valid EOS symbol "10.000 EOS"', () => {
            const asset = '10.000 EOS';

            serialBuffer.pushAsset(asset);

            assert.notEqual(serialBuffer.length, 0);
        });

        it('should not be able to push no symbol "10.000 "', () => {
            const asset = '10.000 ';

            expectExceptionThrown(asset);
        });

        it('should not be able to push symbol with 8 or more characters "10.000 AAAAAAAA"', () => {
            const asset = '10.000 AAAAAAAA';

            expectExceptionThrown(asset);
        });

        it('should not be able to push invalid lowercase symbol "10.000 eos"', () => {
            const asset = '10.000 eos';

            expectExceptionThrown(asset);
        });

        it('should not be able to push two symbols "10.000 EOS blah"', () => {
            const asset = '10.000 EOS blah';

            expectExceptionThrown(asset);
        });
    });

    describe('name', () => {
        var serialBuffer;
        const invalidNameErrorMessage = 'Name should be less than 13 characters, or less than 14 if last character is between 1-5 or a-j, and only contain the following symbols .12345abcdefghijklmnopqrstuvwxyz';

        beforeEach(() => {
            serialBuffer = new SerialBuffer({
                textEncoder: new TextEncoder(),
                textDecoder: new TextDecoder()
            });
        });

        it('should be able to push name with a valid account name', () => {
            const name = '.12345abcdefg';

            serialBuffer.pushName(name);

            assert.equal(serialBuffer.getName(), name);
        });

        it('should remove the `.` character from the end of the account name', () => {
            const name = 'abcd......';
            const expectedName = 'abcd';

            serialBuffer.pushName(name);
            assert.equal(serialBuffer.getName(), expectedName);
        });

        it('should not be able to push name with an account name too long', () => {
            const name = 'abcdabcdabcdab';

            const shouldFail = () => serialBuffer.pushName(name);
            assert.throws(shouldFail);
        });

        it('should not be able to push name with an account name with invalid characters', () => {
            const name = '6789$/,';

            const shouldFail = () => serialBuffer.pushName(name);
            assert.throws(shouldFail);
        });
    });

    xdescribe('bool', () => {
        var boolType;
        var mockedBuffer;

        const shouldThrowErrorForValue = (value) => {
            try {
                boolType.serialize(mockedBuffer, value);
            } catch (e) {
                expect(e.message).toBe('Expected boolean or number equal to 1 or 0');
            }
        };

        const shouldNotThrowErrorForValue = (value) => {
            expect(() => {
                boolType.serialize(mockedBuffer, value);
            }).not.toThrow();
        };

        before(() => {
            boolType = types.get('bool');
            mockedBuffer = Object.create(SerialBuffer);
            mockedBuffer.push = jest.fn().mockImplementation((value) => {
                return;
            });
        });

        it('should be able to create bool type', () => {
            assert.ok(boolType);
        });

        it('should throw error when calling serialize when type is not boolean or number', () => {
            const dataValue = 'string';

            shouldThrowErrorForValue(dataValue);
        });

        it('should throw error when calling serialize when number that is not 1 or 0', () => {
            const dataValue = 10;

            shouldThrowErrorForValue(dataValue);
        });

        it('should not throw error when calling serialize with false', () => {
            const dataValue = false;

            shouldNotThrowErrorForValue(dataValue);
        });

        it('should not throw error when calling serialize with true', () => {
            const dataValue = true;

            shouldNotThrowErrorForValue(dataValue);
        });

        it('should not throw error when calling serialize with 0', () => {
            const dataValue = 0;

            shouldNotThrowErrorForValue(dataValue);
        });

        it('should not throw error when calling serialize with 1', () => {
            const dataValue = 1;

            shouldNotThrowErrorForValue(dataValue);
        });
    });
});
