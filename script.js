const textInput = document.getElementById('textInput');
const inputContainer = document.getElementById('inputContainer');
const inputWrapper = document.getElementById('inputWrapper');
const contentArea = document.getElementById('contentArea');

const placeholderText = "Enter your text here, where words take flight...";

// Set the placeholder text dynamically
textInput.placeholder = placeholderText;

const groups = [
    {
        group: 'Case Transformations',
        transformations: caseTransformations
    },
    {
        group: 'Encoding Transformations',
        transformations: encodingTransformations
    },
    {
        group: 'Cipher Transformations',
        transformations: cipherTransformations
    },
    {
        group: 'Fun Transformations',
        transformations: funTransformations
    }
];

textInput.addEventListener('keyup', () => {
    const text = textInput.value;
    updateOutputs(text);
    updateURLHash(text);
    announceUpdate();
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
        inputContainer.classList.add('full-width');
    } else {
        inputContainer.classList.remove('full-width');
    }
});

function updateURLHash(text) {
    history.pushState(null, '', '#' + encodeURIComponent(text));
}

function populateInputFromURL() {
    try {
        const hash = decodeURIComponent(window.location.hash.substring(1));
        if (hash) {
            textInput.value = hash;
            updateOutputs(hash);
        } else {
            updateOutputs(placeholderText);
        }
    } catch (error) {
        console.error("Error decoding URL hash:", error);
        updateOutputs(placeholderText);
    }
}

function clearInput() {
    textInput.value = '';
    updateOutputs('');
    updateURLHash('');
    announceUpdate();
}

function createOutputDiv(key, name, className = '') {
    const container = document.createElement('div');
    container.className = 'bg-white p-4 rounded-md shadow-sm output-container';
    container.id = `container-${key}`;

    const title = document.createElement('h3');
    title.className = 'text-xl font-bold';
    title.textContent = name;

    const output = document.createElement('p');
    output.id = key;
    output.className = `flex-grow ${className}`;

    const button = document.createElement('button');
    button.className = 'copy-btn';
    button.setAttribute('aria-label', `Copy ${name} to clipboard`);
    button.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 14H19C20.1046 14 21 13.1046 21 12V5C21 3.89543 20.1046 3 19 3H12C10.8954 3 10 3.89543 10 5V6.5M5 10H12C13.1046 10 14 10.8954 14 12V19C14 20.1046 13.1046 21 12 21H5C3.89543 21 3 20.1046 3 19V12C3 10.8954 3.89543 10 5 10Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    button.onclick = () => copyToClipboard(output.id);

    container.appendChild(title);
    container.appendChild(output);
    container.appendChild(button);

    return container;
}

function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text).then(() => {
        showCopySuccessMessage();
    });
}

function showCopySuccessMessage() {
    const message = document.createElement('div');
    message.className = 'fixed bottom-4 right-4 bg-green-500 text-white p-2 rounded';
    message.textContent = 'Copied to clipboard!';
    message.setAttribute('role', 'alert');
    document.body.appendChild(message);
    setTimeout(() => {
        message.remove();
    }, 2000);
}

function updateOutputs(text) {
    for (const key in caseTransformations) {
        const element = document.getElementById(key);
        element.textContent = caseTransformations[key].transform(text);
    }
    for (const key in encodingTransformations) {
        const element = document.getElementById(key);
        element.textContent = encodingTransformations[key].transform(text);
    }
    for (const key in cipherTransformations) {
        const element = document.getElementById(key);
        element.textContent = cipherTransformations[key].transform(text);
    }
    for (const key in funTransformations) {
        const element = document.getElementById(key);
        element.textContent = funTransformations[key].transform(text);
    }
}

function createAndAppendOutputDivs(transformations, outputGrid) {
    for (const key in transformations) {
        const { name, class: className } = transformations[key];
        const outputDiv = createOutputDiv(key, name, className);
        outputGrid.appendChild(outputDiv);
    }
}

function populateContentArea() {
    groups.forEach(group => {
        const groupTitle = document.createElement('h2');
        groupTitle.className = 'text-2xl font-bold text-gray-300 pt-10 pb-6';
        groupTitle.textContent = group.group;
        groupTitle.id = `${group.group.replace(/\s+/g, '').toLowerCase()}Title`;
        groupTitle.setAttribute('aria-label', group.group);

        const outputGrid = document.createElement('div');
        outputGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-6';
        outputGrid.id = `${group.group.replace(/\s+/g, '').toLowerCase()}OutputGrid`;
        outputGrid.setAttribute('aria-labelledby', groupTitle.id);

        contentArea.appendChild(groupTitle);
        contentArea.appendChild(outputGrid);

        createAndAppendOutputDivs(group.transformations, outputGrid);
    });
}

function announceUpdate() {
    const liveRegion = document.getElementById('live-region');
    liveRegion.textContent = 'Content updated';
}

populateContentArea();

// Create a live region for screen readers to announce updates
const liveRegion = document.createElement('div');
liveRegion.id = 'live-region';
liveRegion.className = 'sr-only';
liveRegion.setAttribute('aria-live', 'polite');
document.body.appendChild(liveRegion);

// Initialize outputs with placeholder text or URL hash
populateInputFromURL();
