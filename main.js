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