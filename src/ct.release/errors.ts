let errors = 0;
// eslint-disable-next-line prefer-destructuring
let mute: boolean = ![/*!@showErrors@*/][0];
// eslint-disable-next-line prefer-destructuring
const reportLink: string = [/*!@reportLink@*/][0];
const errorsContainer: HTMLDivElement = document.querySelector('.ct-Errors')!;
let tooManyErrors: HTMLDivElement | undefined;

const copyContent = function (this: HTMLButtonElement) {
    const errorHeader = this.nextSibling as HTMLDivElement;
    const errorBody = errorHeader.nextSibling as HTMLDivElement;
    navigator.clipboard.writeText(`${errorHeader.innerText}\n${errorBody.innerText}`);
};

const hideErrors = function (this: HTMLButtonElement) {
    const parent = this.parentNode as HTMLDivElement;
    parent.style.display = 'none';
    mute = true;
};

const onError = function (this: Document, ev: ErrorEvent) {
    if (mute) {
        return;
    }
    if (!errors) {
        const hideButton = document.createElement('button');
        hideButton.innerText = '❌';
        hideButton.style.fontSize = '80%';
        hideButton.addEventListener('click', hideErrors);
        const header = document.createElement('b');
        header.innerHTML = '😿 An error has occurred: ';
        errorsContainer.appendChild(hideButton);
        errorsContainer.appendChild(header);
        if (reportLink) {
            const reportA = document.createElement('a');
            reportA.innerText = 'Report this issue ↗️';
            reportA.href = reportLink;
            reportA.target = '_blank';
            errorsContainer.appendChild(reportA);
        }
        errorsContainer.style.display = 'block';
    }
    errors++;
    if (errors <= 50) {
        const errorBlock = document.createElement('div');
        errorBlock.className = 'ct-anError';
        const errorHeader = document.createElement('b');
        errorHeader.innerHTML = `In position ${ev.lineno}:${ev.colno} of <a href="${ev.filename}" target="_blank">${ev.filename}</a>`;
        const errorCopy = document.createElement('button');
        errorCopy.innerText = '📋 Copy';
        errorCopy.addEventListener('click', copyContent);
        const errorBody = document.createElement('div');
        errorBody.innerText = `${ev.message}\n${ev.error?.stack ?? '(no stack available)'}`;
        errorBlock.appendChild(errorCopy);
        errorBlock.appendChild(errorHeader);
        errorBlock.appendChild(errorBody);
        errorsContainer.appendChild(errorBlock);
    } else if (!tooManyErrors) {
        tooManyErrors = document.createElement('div');
        tooManyErrors.className = 'ct-anError';
        tooManyErrors.innerText = `Too many errors (${errors}).`;
        errorsContainer.appendChild(tooManyErrors);
    } else {
        tooManyErrors.innerText = `Too many errors (${errors}).`;
    }
};

export const mount = () => {
    window.addEventListener('error', onError);
};
