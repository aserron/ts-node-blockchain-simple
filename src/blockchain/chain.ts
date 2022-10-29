// The blockchain
import {Block}       from "./block";
import {Transaction} from "./transaction";
import crypto        from "crypto";

export class Chain {
    // Singleton instance
    public static instance = new Chain();

    chain: Block[];

    constructor() {
        this.chain = [
            // Genesis block
            new Block('', new Transaction(100, 'genesis', 'satoshi'))
        ];
    }

    // Most recent block
    get lastBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Proof of work system
    mine(nonce: number) {
        let solution = 1;
        console.log('⛏️  mining...')

        while (true) {

            const hash = crypto.createHash('MD5');
            hash.update((nonce + solution).toString()).end();

            const attempt = hash.digest('hex');

            if (attempt.substr(0, 4) === '0000') {
                console.log(`Solved: ${solution}`);
                return solution;
            }

            solution += 1;
        }
    }

    // Add a new block to the chain if valid signature & proof of work is complete
    addBlock(transaction: Transaction, senderPublicKey: string, signature: Buffer) {
        const verify = crypto.createVerify('SHA256');
        verify.update(transaction.toString());

        const isValid = verify.verify(senderPublicKey, signature);

        if (isValid) {
            const newBlock = new Block(this.lastBlock.hash, transaction);
            this.mine(newBlock.nonce);
            this.chain.push(newBlock);
        }
    }

}