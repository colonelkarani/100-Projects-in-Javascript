const path = require('path');

// Go two levels up from the directory of the current script
const twoLevelsUp = path.resolve(__dirname, '..', '..', '..', '..', '..', '..', '..');

console.log('Two levels up from script directory:', twoLevelsUp);
