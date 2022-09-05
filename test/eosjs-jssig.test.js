var FIBOS = require('..');

var { ec } = require('elliptic');

var { generateKeyPair, PrivateKey, PublicKey, sha256, Signature } = require('eosjs/dist/eosjs-key-conversions');
var { digestFromSerializedData, JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
var { KeyType } = require('eosjs/dist/eosjs-numeric');
var { SignatureProviderArgs } = require('eosjs/dist/eosjs-api-interfaces');

describe('JsSignatureProvider', () => {
    var privateKeys = [
        '5Juww5SS6aLWxopXBAWzwqrwadiZKz7XpKAiktXTKcfBGi1DWg8',
        '5JnHjSFwe4r7xyqAUAaVs51G7HmzE86DWGa3VAA5VvQriGYnSUr',
        '5K4XZH5XR2By7Q5KTcZnPAmUMU5yjUNBdoKzzXyrLfmiEZJqoKE',
    ];
    var privateKeysK1 = [
        'PVT_K1_26fMPzM27mXhoSF8y56ro7pN2te7rFT6W6wXiUi5joY79NHfZf',
        'PVT_K1_y19korZcH8hyStRy8bn2G8tgx51zE8nTWGFz7LG3ZDYkaELTY',
        'PVT_K1_2FEybdSLZcyrPh3RR7tJ82M8sG4XLW6uzGDmMw76nv54xk8FLu',
    ];
    var privateKeysR1 = [
        'PVT_R1_GrfEfbv5at9kbeHcGagQmvbFLdm6jqEpgE1wsGbrfbZNjpVgT',
        'PVT_R1_wCpPsaY9o8NU9ZsuwaYVQUDkCfj1aWJZGVcmMM6XyYHJVqvqp',
    ];
    var legacyPublicKeys = [
        'FO7tgwU6E7pAUQJgqEJt66Yi8cWvanTUW8ZfBjeXeJBQvhTU9ypi',
        'FO8VaY5CiTexYqgQZyPTJkc3qvWuZUi12QrZL9ssjqW2es6aQk2F',
        'FO7VGhqctkKprW1VUj19DZZiiZLX3YcJqUJCuEcahJmUCw3wJEMu',
    ];
    var k1FormatPublicKeys = [
        'PUB_K1_7tgwU6E7pAUQJgqEJt66Yi8cWvanTUW8ZfBjeXeJBQvhYTBFvY',
        'PUB_K1_8VaY5CiTexYqgQZyPTJkc3qvWuZUi12QrZL9ssjqW2es7e7bRJ',
        'PUB_K1_7VGhqctkKprW1VUj19DZZiiZLX3YcJqUJCuEcahJmUCw9RT8v2',
    ];
    var r1FormatPublicKeys = [
        'PUB_R1_4ztaVy8L9zbmzTdpfq5GcaFYwGwXTNmN3qW7qcgHMmfUZhpzQQ',
        'PUB_R1_5xawnnr3mWayv2wkiqBGWqu4RQLNJffLSXHiL3BofdY7ortMy4',
    ];
    var signatures = [
        'SIG_K1_HKkqi3zray76i63ZQwAHWMjoLk3wTa1ajZWPcUnrhgmSWQYEHDJsxkny6VDTWEmVdfktxpGoTA81qe6QuCrDmazeQndmxh',
        'SIG_K1_HCaY9Y9qdjnkRhE9hokAyp3pFtkMmjpxF6xTd514Vo8vLVSWKek5m5aHfCaka9TqZUbajkhhd4BfBLxSwCwZUEmy8cvt1x',
        'SIG_K1_GrZqp9ZkuhBeNpeQ5b2L2UWUUrNU1gHbTyMzkyWRhiXNkxPP84Aq9eziU399eBf9xJw8MqHHjz7R2wMTMXhXjHLgpZYFeA',
    ];
    var eccSignatures = [
        'SIG_K1_KeEyJFpkp63Qq5E1zRD9aNZtTjpStvdkdnL31Z7wVmhYtrKGtpVdMBJnXyEUXNkNEyo4d4i4Q79qmRpCUsCRdFqhV6KAeF',
        'SIG_K1_JvgMmFSDhipS1SeBLNBMdAxayAsWS3GuVGSHS7YQth5Z5ZpijxnZgaa23dYD1efQhpEgtEggdRfHMmp31RDXjmJdZYoKLm',
        'SIG_K1_JwMqV2nbEntHSq9AuG3Zq1JBc5YqD2SftMHCTGK4A8DYGn1VPQ8QAduwCNksT5JhYgAmGMzPyJdZ2Ws4p8TCvQ16LeNhrw',
    ];

    // These are simplified tests simply to verify a refactor didn't mess with existing code
    describe('secp256k1 elliptic', () => {
        it('generates a private and public key pair', () => {
            var { privateKey, publicKey } = generateKeyPair(KeyType.k1, { secureEnv: true });
            assert.ok(privateKey.isValid());
            assert.ok(publicKey.isValid());
        });

        it('throws error with no options.secureEnv variable', () => {
            assert.throws(() => generateKeyPair(KeyType.k1));
        });

        it('Retrieves the public key from a private key', () => {
            var privateKey = PrivateKey.fromString(privateKeys[0]);
            var publicKey = privateKey.getPublicKey();
            assert.equal(publicKey.toString(), k1FormatPublicKeys[0]);
        });

        it('builds public keys from private when constructed', async () => {
            var provider = new JsSignatureProvider(privateKeys);
            var actualPublicKeys = await provider.getAvailableKeys();
            assert.deepEqual(actualPublicKeys, k1FormatPublicKeys);
        });

        it('signs a transaction', async () => {
            var provider = new JsSignatureProvider(privateKeys);
            var chainId = '12345';
            var requiredKeys = k1FormatPublicKeys;
            var serializedTransaction = new Uint8Array([
                0, 16, 32, 128, 255,
            ]);

            var signOutput = await provider.sign(
                { chainId, requiredKeys, serializedTransaction }
            );

            assert.deepEqual(signOutput.serializedTransaction, serializedTransaction);
        });

        it('confirm elliptic conversion functions are actually reciprocal', async () => {
            var provider = new JsSignatureProvider(privateKeys);
            var chainId = '12345';
            var requiredKeys = k1FormatPublicKeys;
            var serializedTransaction = new Uint8Array([
                0, 16, 32, 128, 255,
            ]);

            var signOutput = await provider.sign(
                { chainId, requiredKeys, serializedTransaction }
            );

            var sig = Signature.fromString(signOutput.signatures[0]);
            var ellipticSig = sig.toElliptic();
            var eosSig = Signature.fromElliptic(ellipticSig, KeyType.k1);
            assert.deepEqual(sig, eosSig);
        });

        it('verify a transaction', async () => {
            var provider = new JsSignatureProvider([privateKeys[0]]);
            var chainId = '12345';
            var requiredKeys = [k1FormatPublicKeys[0]];
            var serializedTransaction = new Uint8Array([
                0, 16, 32, 128, 255,
            ]);

            var signOutput = await provider.sign(
                { chainId, requiredKeys, serializedTransaction }
            );

            var signature = Signature.fromString(signOutput.signatures[0]);
            assert.isTrue(
                signature.verify(
                    digestFromSerializedData(chainId, serializedTransaction),
                    PublicKey.fromString(k1FormatPublicKeys[0]),
                    false
                )
            );
        });

        it('ensure public key functions are actual inverses of each other', async () => {
            var eosioPubKey = PublicKey.fromString(k1FormatPublicKeys[0]);
            var ellipticPubKey = eosioPubKey.toElliptic();
            var finalEosioKeyAsK1String = PublicKey.fromElliptic(ellipticPubKey, KeyType.k1).toString();
            assert.equal(finalEosioKeyAsK1String, k1FormatPublicKeys[0]);
        });

        it('verify that PUB_K1_ and Legacy pub formats are consistent', () => {
            var eosioLegacyPubKey = legacyPublicKeys[0];
            var ellipticPubKey = PublicKey.fromString(eosioLegacyPubKey).toElliptic();
            assert.equal(PublicKey.fromElliptic(ellipticPubKey, KeyType.k1).toString(), k1FormatPublicKeys[0]);
        });

        it('verify that privateKey toLegacyString() and toString() are consistent', () => {
            var privKeyFromK1 = PrivateKey.fromString(privateKeysK1[0]);
            var privKeyFromLegacy = PrivateKey.fromString(privateKeys[0]);
            assert.equal(privKeyFromK1.toLegacyString(), privateKeys[0]);
            assert.equal(privKeyFromLegacy.toString(), privateKeysK1[0]);
        });

        it('verify that publicKey toLegacyString() and toString() are consistent', () => {
            var pubKeyFromK1 = PublicKey.fromString(k1FormatPublicKeys[0]);
            var pubKeyFromLegacy = PublicKey.fromString(legacyPublicKeys[0]);
            assert.equal(pubKeyFromK1.toLegacyString(), legacyPublicKeys[0]);
            assert.equal(pubKeyFromLegacy.toString(), k1FormatPublicKeys[0]);
        });

        it('ensure private key functions are actual inverses of each other', async () => {
            var priv = privateKeys[0];
            var privEosioKey = PrivateKey.fromString(priv);
            var privEllipticKey = privEosioKey.toElliptic();
            var finalEosioKeyAsString = PrivateKey.fromElliptic(privEllipticKey, KeyType.k1).toString();
            assert.equal(privEosioKey.toString(), finalEosioKeyAsString);
        });

        it('verify that public key validate function correctly assesses public keys', () => {
            var publicKey = PublicKey.fromString(k1FormatPublicKeys[0]);
            assert.isTrue(publicKey.isValid());
        });

        it('Ensure elliptic sign, recover, verify flow works', () => {
            var KPrivStr = privateKeys[0];
            var KPriv = PrivateKey.fromString(KPrivStr);

            var dataAsString = 'some string';
            var ellipticHashedString = sha256(dataAsString);
            var sig = KPriv.sign(ellipticHashedString);
            var KPub = sig.recover(ellipticHashedString);

            assert.equal(KPub.toString(), k1FormatPublicKeys[0]);
            var valid = sig.verify(ellipticHashedString, KPub);
            assert.isTrue(valid);
        });

        it('Ensure elliptic sign, recover, verify flow works with shouldHash', () => {
            var KPrivStr = privateKeys[0];
            var KPriv = PrivateKey.fromString(KPrivStr);

            var dataAsString = 'some string';
            var sig = KPriv.sign(dataAsString, true);
            var KPub = sig.recover(dataAsString, true);

            assert.equal(KPub.toString(), k1FormatPublicKeys[0]);
            var valid = sig.verify(dataAsString, KPub, true);
            assert.isTrue(valid);
        });

        it('Ensure elliptic sign, recover, verify flow works with shouldHash and encoding', () => {
            var KPrivStr = privateKeys[0];
            var KPriv = PrivateKey.fromString(KPrivStr);

            var dataAsString = 'some string';
            var sig = KPriv.sign(dataAsString, true, 'utf8');
            var KPub = sig.recover(dataAsString, true, 'utf8');

            assert.equal(KPub.toString(), k1FormatPublicKeys[0]);
            var valid = sig.verify(dataAsString, KPub, true, 'utf8');
            assert.isTrue(valid);
        });
    });

    describe('p256 elliptic', () => {
        it('generates a private and public key pair', () => {
            var { privateKey, publicKey } = generateKeyPair(KeyType.r1, { secureEnv: true });
            assert.ok(privateKey.isValid());
            assert.ok(publicKey.isValid());
        });

        it('throws error with no options.secureEnv variable', () => {
            assert.throws(() => generateKeyPair(KeyType.r1));
        });

        it('throws error when attempting a legacy private key from r1 format', () => {
            var privateKey = PrivateKey.fromString(privateKeysR1[0]);
            assert.throws(() => privateKey.toLegacyString());
        });

        it('throws error when attempting a legacy public key from r1 format', () => {
            var publicKey = PublicKey.fromString(r1FormatPublicKeys[0]);
            assert.throws(() => publicKey.toLegacyString());
        });

        it('Retrieves the public key from a private key', () => {
            var privateKey = PrivateKey.fromString(privateKeysR1[0]);
            var publicKey = privateKey.getPublicKey();
            assert.equal(publicKey.toString(), r1FormatPublicKeys[0]);
        });

        it('builds public keys from private when constructed', async () => {
            var provider = new JsSignatureProvider(privateKeysR1);
            var actualPublicKeys = await provider.getAvailableKeys();
            assert.deepEqual(actualPublicKeys, r1FormatPublicKeys);
        });

        it('signs a transaction', async () => {
            var provider = new JsSignatureProvider(privateKeysR1);
            var chainId = '12345';
            var requiredKeys = r1FormatPublicKeys;
            var serializedTransaction = new Uint8Array([
                0, 16, 32, 128, 255,
            ]);

            var signOutput = await provider.sign(
                { chainId, requiredKeys, serializedTransaction }
            );

            assert.equal(signOutput.serializedTransaction, serializedTransaction);
        });

        it('confirm elliptic conversion functions are actually reciprocal', async () => {
            var provider = new JsSignatureProvider(privateKeysR1);
            var chainId = '12345';
            var requiredKeys = r1FormatPublicKeys;
            var serializedTransaction = new Uint8Array([
                0, 16, 32, 128, 255,
            ]);

            var signOutput = await provider.sign(
                { chainId, requiredKeys, serializedTransaction }
            );

            var sig = Signature.fromString(signOutput.signatures[0]);
            var ellipticSig = sig.toElliptic();
            var eosSig = Signature.fromElliptic(ellipticSig, KeyType.r1);
            assert.deepEqual(sig, eosSig);
        });

        it('verify a transaction', async () => {
            var provider = new JsSignatureProvider([privateKeysR1[0]]);
            var chainId = '12345';
            var requiredKeys = [r1FormatPublicKeys[0]];
            var serializedTransaction = new Uint8Array([
                0, 16, 32, 128, 255,
            ]);

            var signOutput = await provider.sign(
                { chainId, requiredKeys, serializedTransaction }
            );

            var signature = Signature.fromString(signOutput.signatures[0]);
            assert.isTrue(
                signature.verify(
                    digestFromSerializedData(chainId, serializedTransaction),
                    PublicKey.fromString(r1FormatPublicKeys[0]),
                    false
                )
            );
        });

        it('ensure public key functions using p256 format are actual inverses of each other', async () => {
            var eosioPubKey = PublicKey.fromString(r1FormatPublicKeys[0]);
            var ellipticPubKey = eosioPubKey.toElliptic();
            var finalEosioKeyAsR1String = PublicKey.fromElliptic(ellipticPubKey, KeyType.r1).toString();
            assert.equal(finalEosioKeyAsR1String, r1FormatPublicKeys[0]);
        });

        it('ensure private key functions using p256 format are actual inverses of each other', async () => {
            var priv = privateKeysR1[0];
            var privEosioKey = PrivateKey.fromString(priv);
            var privEllipticKey = privEosioKey.toElliptic();
            var finalEosioKeyAsString = PrivateKey.fromElliptic(privEllipticKey, KeyType.r1).toString();
            assert.equal(privEosioKey.toString(), finalEosioKeyAsString);
        });

        it('verify that public key validate function correctly assesses public keys', () => {
            var publicKey = PublicKey.fromString(r1FormatPublicKeys[0]);
            assert.isTrue(publicKey.isValid());
        });

        it('Ensure elliptic sign, recover, verify flow works', () => {
            var KPrivStr = privateKeysR1[0];
            var KPriv = PrivateKey.fromString(KPrivStr);

            var dataAsString = 'some string';
            var ellipticHashedString = sha256(dataAsString);
            var sig = KPriv.sign(ellipticHashedString);
            var KPub = sig.recover(ellipticHashedString);

            assert.equal(KPub.toString(), r1FormatPublicKeys[0]);
            var valid = sig.verify(ellipticHashedString, KPub);
            assert.isTrue(valid);
        });

        it('Ensure elliptic sign, recover, verify flow works with shouldHash', () => {
            var KPrivStr = privateKeysR1[0];
            var KPriv = PrivateKey.fromString(KPrivStr);

            var dataAsString = 'some string';
            var sig = KPriv.sign(dataAsString, true);
            var KPub = sig.recover(dataAsString, true);

            assert.equal(KPub.toString(), r1FormatPublicKeys[0]);
            var valid = sig.verify(dataAsString, KPub, true);
            assert.isTrue(valid);
        });

        it('Ensure elliptic sign, recover, verify flow works with shouldHash and encoding', () => {
            var KPrivStr = privateKeysR1[0];
            var KPriv = PrivateKey.fromString(KPrivStr);

            var dataAsString = 'some string';
            var sig = KPriv.sign(dataAsString, true, 'utf8');
            var KPub = sig.recover(dataAsString, true, 'utf8');

            assert.equal(KPub.toString(), r1FormatPublicKeys[0]);
            var valid = sig.verify(dataAsString, KPub, true, 'utf8');
            assert.isTrue(valid);
        });
    });
});

require.main === module && test.run(console.DEBUG);
