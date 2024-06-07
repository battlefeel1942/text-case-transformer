const morseCodeMap = {
    'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.', 'g': '--.', 'h': '....', 'i': '..',
    'j': '.---', 'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.',
    's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-', 'y': '-.--', 'z': '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.'
};

const emojiMap = {
    happy: '😊',
    sad: '😢',
    love: '❤️',
    angry: '😠',
    laugh: '😂',
    cry: '😭',
    cool: '😎'
};

const zalgoUp = ['̍','̎','̄','̅','̿','̑','̆','̐','͒','͗','͑','̇','̈','̊','͂','̓','̈','͊','͋','͌','̃','̂','̌','͐','̀','́','̋','̏','̒','̓','̔','̽','̉','ͣ','ͤ','ͥ','ͦ','ͧ','ͨ','ͩ','ͪ','ͫ','ͬ','ͭ','ͮ','ͯ','̾','͛','͆','̚'];
const zalgoDown = ['̖','̗','̘','̙','̜','̝','̞','̟','̠','̤','̥','̦','̩','̪','̫','̬','̭','̮','̯','̰','̱','̲','̳','̹','̺','̻','̼','ͅ','͇','͈','͉','͍','͎','͓','͔','͕','͖','͙','͚','̣'];
const zalgoMid = ['̕','̛','̀','́','͘','̡','̢','̧','̨','̴','̵','̶','͜','͝','͞','͟','͠','͢','̸','̷','͡','҉'];

const caseTransformations = {
    uppercase: {
        name: 'Uppercase',
        transform: text => text.toUpperCase()
    },
    lowercase: {
        name: 'Lowercase',
        transform: text => text.toLowerCase()
    },
    titleCase: {
        name: 'Title Case',
        transform: text => text.split(' ').map((word, index, arr) => {
            const lowerWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet'];
            if (lowerWords.includes(word.toLowerCase()) && index !== 0 && index !== arr.length - 1) {
                return word.toLowerCase();
            }
            return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
        }).join(' ')
    },
    sentenceCase: {
        name: 'Sentence Case',
        transform: text => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    },
    capitalizedCase: {
        name: 'Capitalized Case',
        transform: text => text.replace(/\b\w/g, char => char.toUpperCase())
    },
    swapCase: {
        name: 'Swap Case',
        transform: text => text.split('').map(char => char === char.toLowerCase() ? char.toUpperCase() : char.toLowerCase()).join('')
    }
};

const encodingTransformations = {
    snakeCase: {
        name: 'Snake Case',
        transform: text => text.replace(/\s+/g, '_').toLowerCase()
    },
    kebabCase: {
        name: 'Kebab Case',
        transform: text => text.replace(/\s+/g, '-').toLowerCase()
    },
    camelCase: {
        name: 'Camel Case',
        transform: text => text.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => index === 0 ? match.toLowerCase() : match.toUpperCase()).replace(/\s+/g, '')
    },
    underscoreCase: {
        name: 'Underscore Case',
        transform: text => text.replace(/\s+/g, '_')
    },
    binaryCode: {
        name: 'Binary Code',
        transform: text => text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ')
    },
    hexCode: {
        name: 'Hexadecimal Code',
        transform: text => text.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join(' ')
    },
    base64Encode: {
        name: 'Base64 Encode',
        transform: text => btoa(text)
    },
    urlEncode: {
        name: 'URL Encode',
        transform: text => encodeURIComponent(text)
    }
};

const cipherTransformations = {
    rot13: {
        name: 'ROT13',
        transform: text => text.replace(/[a-zA-Z]/g, char => String.fromCharCode(char.charCodeAt(0) + (char.toLowerCase() < 'n' ? 13 : -13)))
    },
    rot47: {
        name: 'ROT47',
        transform: text => text.split('').map(char => {
            const charCode = char.charCodeAt(0);
            return String.fromCharCode((charCode >= 33 && charCode <= 126) ? 33 + ((charCode + 14) % 94) : charCode);
        }).join('')
    },
    atbashCipher: {
        name: 'Atbash Cipher',
        transform: text => text.split('').map(char => {
            const charCode = char.charCodeAt(0);
            if (char >= 'a' && char <= 'z') {
                return String.fromCharCode('z'.charCodeAt(0) - (charCode - 'a'.charCodeAt(0)));
            } else if (char >= 'A' && char <= 'Z') {
                return String.fromCharCode('Z'.charCodeAt(0) - (charCode - 'A'.charCodeAt(0)));
            }
            return char;
        }).join('')
    },
    caesarCipher: {
        name: 'Caesar Cipher',
        transform: (text, shift = 3) => text.replace(/[a-zA-Z]/g, char => {
            const start = char <= 'Z' ? 65 : 97;
            return String.fromCharCode((char.charCodeAt(0) - start + shift) % 26 + start);
        })
    }
};

const funTransformations = {
    reverseText: {
        name: 'Reverse Text',
        transform: text => text.split('').reverse().join('')
    },
    reverseWords: {
        name: 'Reverse Words',
        transform: text => text.split(' ').map(word => word.split('').reverse().join('')).join(' ')
    },
    palindrome: {
        name: 'Palindrome',
        transform: text => text + text.split('').reverse().join('')
    },
    vowelRemoval: {
        name: 'Vowel Removal',
        transform: text => text.replace(/[aeiou]/gi, '')
    },
    consonantRemoval: {
        name: 'Consonant Removal',
        transform: text => text.replace(/[^aeiou]/gi, '')
    },
    leetSpeak: {
        name: 'Leet Speak',
        transform: text => text.split('').map(char => {
            const leetMap = { a: '4', e: '3', i: '1', o: '0', s: '5', t: '7' };
            const lowerChar = char.toLowerCase();
            return leetMap[lowerChar] || char;
        }).join('')
    },
    morseCode: {
        name: 'Morse Code',
        transform: text => text.toLowerCase().split('').map(char => morseCodeMap[char] || char).join(' ')
    },
    pigLatin: {
        name: 'Pig Latin',
        transform: text => text.split(' ').map(word => {
            const match = word.match(/^([aeiouAEIOU]\w*|[^aeiouAEIOU]+)(\w*)/);
            return match ? `${match[2]}${match[1].toLowerCase()}ay` : word;
        }).join(' ')
    },
    numberToWords: {
        name: 'Number to Words',
        transform: text => text.replace(/\d/g, digit => ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][digit])
    },
    zalgoText: {
        name: 'Zalgo Text',
        transform: text => text.split('').map(char => char + zalgoUp[Math.floor(Math.random() * zalgoUp.length)] + zalgoMid[Math.floor(Math.random() * zalgoMid.length)] + zalgoDown[Math.floor(Math.random() * zalgoDown.length)]).join('')
    },
    emojiReplacement: {
        name: 'Emoji Replacement',
        transform: text => text.split(' ').map(word => emojiMap[word.toLowerCase()] || word).join(' ')
    },
    doubleCharacters: {
        name: 'Double Characters',
        transform: text => text.split('').map(char => char + char).join('')
    },
    wordRepetition: {
        name: 'Word Repetition',
        transform: (text, times = 2) => text.split(' ').map(word => word.repeat(times)).join(' ')
    },
    scrambleText: {
        name: 'Scramble Text',
        transform: text => text.split(' ').map(word => word.split('').sort(() => Math.random() - 0.5).join('')).join(' ')
    },
    characterMirror: {
        name: 'Character Mirror',
        transform: text => {
            const mirrorMap = {
                'a': 'ɒ', 'b': 'd', 'c': 'ɔ', 'd': 'b', 'e': 'ɘ', 'f': 'Ꮈ', 'g': 'ϱ', 'h': 'ɥ', 'i': 'ᴉ', 
                'j': 'ᒧ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'q', 'q': 'p', 'r': 'ɿ', 
                's': 's', 't': 'Ɉ', 'u': 'n', 'v': 'v', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z'
            };
            return text.split('').map(char => mirrorMap[char.toLowerCase()] || char).join('');
        }
    },
    alternatingCase: {
        name: 'Alternating Case',
        transform: text => text.split('').map((char, index) => index % 2 ? char.toLowerCase() : char.toUpperCase()).join('')
    },
    spongebobCase: {
        name: 'Spongebob Case',
        transform: text => text.split('').map((char, index) => index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()).join(''),
        class: 'spongebob-case'
    },
    randomCase: {
        name: 'Random Case',
        transform: text => text.split('').map(char => Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()).join('')
    }
};