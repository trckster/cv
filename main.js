function showCopyNotification() {
    const element = document.getElementById('email-copy-notification')

    element.classList.remove('invisible')
    setTimeout(() => element.classList.add('invisible'), 50)
}

window.copyEmail = async () => {
    const email = document.getElementById('email').innerText
    await navigator.clipboard.writeText(email)
    showCopyNotification()
}

window.showDownloadOptions = () => {
    const element = document.getElementById('download-options')
    element.style.display = element.style.display === 'block' ? 'none' : 'block'
}

document.addEventListener('mouseup', (e) => {
    const downloadButton = document.getElementsByClassName('download')[0]

    if (!downloadButton.contains(e.target)) {
        document.getElementById('download-options').style.display = 'none'
    }
})