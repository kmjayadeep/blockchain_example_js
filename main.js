const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount
    }
}

class Block {

    constructor(timeStamp, transactions, previousHash) {
        this.timeStamp = timeStamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.timeStamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce).toString()
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join(0)) {
            this.nonce++;
            this.hash = this.calculateHash()
        }
    }

}

class BlockChain {
    constructor() {
        let genesisBlock = new Block('1/1/2018', 'none', 0);
        this.chain = [genesisBlock];
        this.difficulty = 3;
        this.pendingTransactions = []
        this.miningReward = 100
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty)
        this.chain.push(block)
        console.log('Block mined')
        this.pendingTransactions = [new Transaction(null, miningRewardAddress, this.miningReward)]
    }

    addTransaction(transaction) {
        this.pendingTransactions.push(transaction)
    }

    getBalanceOfAddress(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address)
                    balance -= trans.amount;
                else if (trans.toAddress === address)
                    balance += trans.amount
            }
        }
        return balance;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            let currentBock = this.chain[i];
            let prevBock = this.chain[i - 1];

            if (currentBock.hash !== currentBock.calculateHash())
                return false;
            if (currentBock.previousHash !== prevBock.hash)
                return false;
        }
        return true;
    }
}

let myCoin = new BlockChain();
myCoin.addTransaction(new Transaction(null, 'lorem', 100));
myCoin.addTransaction(new Transaction('lorem', 'ipsum', 100));
myCoin.addTransaction(new Transaction('ipsum', 'lorem', 50));

myCoin.minePendingTransactions('lorem');

myCoin.addTransaction(new Transaction('lorem', 'ipsum', 10));

myCoin.minePendingTransactions('ipsum');

console.log(myCoin);
console.log(myCoin.getBalanceOfAddress('lorem'));
console.log(myCoin.getBalanceOfAddress('ipsum'));