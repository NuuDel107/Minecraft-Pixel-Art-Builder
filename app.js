const fs = require("fs");
const BlockConverter = require("./convert/blockConverter");

const testValue = [3, 187, 69];
const bConverter = new BlockConverter();

console.log(bConverter.colorToBlock(testValue))

