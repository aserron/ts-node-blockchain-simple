// Wallet gives a user a public/private keypair
import crypto        from "crypto";
import {Transaction} from "./blockchain/transaction";
import {Chain}       from "./blockchain/chain";

export class Wallet {
    public publicKey: string;
    public privateKey: string;

    constructor() {
        const keypair = crypto.generateKeyPairSync('rsa', {
            modulusLength     : 2048,
            publicKeyEncoding : {type: 'spki', format: 'pem'},
            privateKeyEncoding: {type: 'pkcs8', format: 'pem'},
        });

        this.privateKey = keypair.privateKey;
        this.publicKey = keypair.publicKey;
    }

    sendMoney(amount: number, payeePublicKey: string) {
        const transaction = new Transaction(amount, this.publicKey, payeePublicKey);

        const sign = crypto.createSign('SHA256');
        sign.update(transaction.toString()).end();

        const signature = sign.sign(this.privateKey);
        Chain.instance.addBlock(transaction, this.publicKey, signature);
    }
}