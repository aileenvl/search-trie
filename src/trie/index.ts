

class TrieNode {
  children: Map<any, any>;
  isEnd: boolean;
  constructor() {
    this.children = new Map();
    this.isEnd = false;
  }
}

export class Trie {
  root: TrieNode;
  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string) {
    let current = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];

      if (!current.children.get(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char);
    }
    current.isEnd = true;
  }

  search(word: string) {
    let current = this.root;

    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!current.children.get(char)) {
        return false;
      }
      current = current.children.get(char);
    }
    return current.isEnd;
  }

  startsWith(prefix: string) {
    let current = this.root;

    for (let i = 0; i < prefix.length; i++) {
      const char = prefix[i];

      if (!current.children.get(char)) {
        return false;
      }
      current = current.children.get(char);
    }
    return true;
  }

  getAllWords(prefix = '') {
    const promptKeywords = ['for', 'to', 'with'];
    const words: {word: string, isPrompt: boolean}[] = [];
    const current = this.#findNode(prefix);
    if (current) {
      const isPrompt = promptKeywords.some(keyword => prefix.includes(keyword));
      this.#traverse(current, prefix, words, isPrompt);
    }
    return words;
  }

  delete(word: string) {
    let current = this.root;

    const stack = [];

    let index = 0;

    while (index < word.length) {
      const char = word[index];

      if (!current.children.get(char)) {
        return;
      }

      stack.push({node: current, char});

      current = current.children.get(char);
      index++;
    }

    if (!current.isEnd) {
      return;
    }

    current.isEnd = false;

    while (stack.length > 0) {
      const {node, char} = stack.pop();

      if (current.children.size === 0 && !current.isEnd) {
        node.children.delete(char);
        current = node;
      } else {
        break;
      }
    }
  }

  #findNode(prefix: string) {
    let current = this.root;

    for (let i = 0; i < prefix.length; i++) {
      const char = prefix[i];

      if (!current.children.get(char)) {
        return null;
      }
      current = current.children.get(char);
    }

    return current;
  }

  #traverse(node: TrieNode, prefix: string, words: {word: string, isPrompt: boolean}[], isPrompt: boolean) {
    const stack = [];
    stack.push({node, prefix});
    while (stack.length > 0) {
      const {node, prefix} = stack.pop();
      if (node.isEnd) {
        const word = prefix;
        words.push({word, isPrompt});
      }
      for (const char of node.children.keys()) {
        const childNode: TrieNode | undefined = node.children.get(char);
        stack.push({node: childNode, prefix: prefix + char});
      }
    }
  }
}