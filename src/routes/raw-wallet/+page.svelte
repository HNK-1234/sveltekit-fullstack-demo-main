<script>
    import { PrivateKey, P2PKH, Transaction, ARC } from "@bsv/sdk";

    let privKey;
    let WIF;
    let address;

    function createKeys() {
        privKey = PrivateKey.fromRandom();
        WIF = privKey.toWif();
        address = privKey.toAddress().toString();
    }

    createKeys(); // Create initial keys

    const sourceTransaction = Transaction.fromHex(
        "0200000001849c6419aec8b65d747cb72282cc02f3fc26dd018b46962f5de48957fac50528020000006a473044022008a60c611f3b48eaf0d07b5425d75f6ce65c3730bd43e6208560648081f9661b0220278fa51877100054d0d08e38e069b0afdb4f0f9d38844c68ee2233ace8e0de2141210360cd30f72e805be1f00d53f9ccd47dfd249cbb65b0d4aee5cfaf005a5258be37ffffffff03d0070000000000001976a914acc4d7c37bc9d0be0a4987483058a2d842f2265d88ac75330100000000001976a914db5b7964eecb19fcab929bf6bd29297ec005d52988ac809f7c09000000001976a914c0b0a42e92f062bdbc6a881b1777eed1213c19eb88ac00000000",
    );

    const version = 1;

    const input = {
        sourceTransaction,
        sourceOutputIndex: 0,
        unlockingScriptTemplate: new P2PKH().unlock(privKey),
    };

    const output = {
        lockingScript: new P2PKH().lock(privKey.toPublicKey().toHash()),
        change: true,
    };

    const tx = new Transaction(version, [input], [output]);

    (async () => {
        await tx.fee();
        await tx.sign();
        await tx.broadcast();
    })();
</script>

<section>
    <button
        class="bg-black text-white p-2 rounded mx-auto"
        on:click={createKeys}>Generate Keys</button
    >
    <p>Private Key WIF format is {WIF}</p>
    <p>Your Bitcoin Address is {address}</p>
</section>
