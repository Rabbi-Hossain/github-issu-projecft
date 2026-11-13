function gitHubLogn() {
    const user = document.getElementById('user-input-field').value;
    const pass = document.getElementById('password-input-field').value;

    if (user === 'admin' && pass === 'admin123') {
        window.location.href = 'home.html';
    } else {
        alert('Wrong username or password!');
    }
}