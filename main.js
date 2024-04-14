function showCopyNotification() {
    const element = document.getElementById('email-copy-notification')

    element.classList.remove('invisible')
    setTimeout(() => element.classList.add('invisible'), 50)
}

function showDownloadOptions() {
    document.getElementById('download-button').style.transition = ''
    document.getElementById('download-options').style.display = 'block'
    document.getElementById('download-button').style.borderRadius = '7px 7px 0 0'
}

function closeDownloadOptions() {
    document.getElementById('download-options').style.display = 'none'
    document.getElementById('download-button').style.borderRadius = '7px'
}

window.copyEmail = async () => {
    const email = document.getElementById('email').innerText
    await navigator.clipboard.writeText(email)
    showCopyNotification()
}

window.showDownloadOptions = () => {
    const element = document.getElementById('download-options')
    if (element.style.display === 'block') {
        closeDownloadOptions()
    } else {
        showDownloadOptions()
    }
}

document.addEventListener('mouseup', (e) => {
    const downloadButton = document.getElementsByClassName('download')[0]

    if (!downloadButton.contains(e.target)) {
        closeDownloadOptions()
    }
})

window.download = (file) => {
    const element = document.createElement('a');
    document.body.appendChild(element);
    element.download = 'Trofimov Daniil CV';
    element.href = `assets/${file}`;
    element.click();
    document.body.removeChild(element);
}