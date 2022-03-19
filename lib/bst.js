class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
    setData(data) {
        this.data = data
    }
    getData() {
        return this.data
    }
    setLeft(node) {
        this.left = node
    }
    getLeft() {
        return this.left
    }
    setRight(node) {
        this.right = node
    }
    getRight() {
        return this.right
    }
}

export class Score extends Node {
    constructor(score, notes, timestamp) {
        super(timestamp);
        this.score = score
        this.notes = notes
        this.timestamp = timestamp
    }
    setNotes(notes) {
        this.notes = notes
    }
    getNotes() {
        return this.notes
    }
    setScore(score) {
        this.score = score
    }
    getScore() {
        return this.score
    }
}

export class BinaryScoreTree {
    inOrderList = [];
    preOrderList = [];
    postOrderList = [];
    constructor() {
        this.root = null;
    }
    getRoot() {
        return this.root
    }
    insert(timestamp, score, notes) {
        var newScore = new Score(score, notes, timestamp)
        if (this.root == null) {
            this.root = newScore;
        }
        else {
            this.insertNode(this.root, newScore)
        }
    }
    insertNode(node, newNode) {
        if (newNode.data < node.data) {
            if(node.left == null) {
                node.left = newNode
            } else {
                // recursion
                this.insertNode(node.left, newNode)
            } 
        } else {
            if(node.right == null) {
                node.right = newNode
            } else {
                this.insertNode(node.right, newNode)
            }
        }
    }
    remove(data) {
        this.root = this.removeNode(this.root, data)
    }
    removeNode(node, key) {
        if (node === null) return null;
        else if (key < node.data) {
            node.left = this.removeNode(node.left, key);
            return node;
        } else if (key > node.data) {
            node.right = this.removeNode(node.right, key);
        } else {
            if (node.left === null && node.right === null) {
                node = null
                return null
            }
            if (node.left === null) {
                node = node.right
                return node
            }
            else if (node.right === null) {
                node = node.left
                return node
            }
            var minNode = this.findMinNode(node.right);
            node.data = minNode.data
            node.right = this.removeNode(node.right, minNode.data)
            return node
        }
    }
    findMinNode(node) {
        if (node.left === null) {
            return node
        } else return this.findMinNode(node.left)
    }
    inOrder(node) {
        if(node !== null) {
            this.inOrder(node.left)
            this.inOrderList.push(node)
            this.inOrder(node.right)
        }
    }
    preOrder(node) {
        if (node !== null) {
            this.preOrderList.push(node)
            this.preOrder(node.left)
            this.preOrder(node.right)
        }
    }
    postOrder(node) {
        if (node !== null) {
            this.postOrder(node.left)
            this.postOrder(node.right)
            this.postOrderList.push(node)
        }
    }
    findMinNode(node) {
        if (node.left === null) return node
        else return this.findMinNode(node.left)
    }
    search(node, data) {
        if (node === null) return null;
        else if (data < node.data) return this.search(node.left, data)
        else if (data > node.data) return this.search(node.right, data)
        else return node
    }
}