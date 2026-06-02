const copyNotification = document.getElementById('email-copy-notification')
const downloadButton = document.getElementById('download-button')
const downloadOptions = document.getElementById('download-options')
const themeToggle = document.getElementById('theme-toggle')
const themeStorageKey = 'cv-theme'
let copyNotificationTimeout

function applyTheme(theme) {
    const normalizedTheme = theme === 'light' ? 'light' : 'dark'

    document.documentElement.dataset.theme = normalizedTheme
    themeToggle.setAttribute(
        'aria-label',
        normalizedTheme === 'light' ? 'Switch to dark theme' : 'Switch to light theme',
    )
}

applyTheme(localStorage.getItem(themeStorageKey))

function showCopyNotification() {
    clearTimeout(copyNotificationTimeout)
    copyNotification.textContent = 'Copied!'
    copyNotification.classList.add('is-copied')

    copyNotificationTimeout = setTimeout(() => {
        copyNotification.textContent = 'Copy?'
        copyNotification.classList.remove('is-copied')
    }, 1200)
}

function closeDownloadOptions() {
    downloadOptions.classList.remove('is-open')
    downloadButton.setAttribute('aria-expanded', 'false')
}

window.copyEmail = async () => {
    const email = document.getElementById('email').textContent.trim()
    await navigator.clipboard.writeText(email)
    showCopyNotification()
}

window.showDownloadOptions = () => {
    const isOpen = downloadOptions.classList.toggle('is-open')
    downloadButton.setAttribute('aria-expanded', String(isOpen))
}

document.addEventListener('mouseup', (event) => {
    if (!document.querySelector('.download').contains(event.target)) {
        closeDownloadOptions()
    }
})

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeDownloadOptions()
    }
})

themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'

    localStorage.setItem(themeStorageKey, nextTheme)
    applyTheme(nextTheme)
})

window.printCv = () => {
    closeDownloadOptions()
    window.print()
}
