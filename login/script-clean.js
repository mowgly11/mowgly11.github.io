function showAlertFunction(message, type, timeBeforeFade = 5000) {
    const existingAlert = document.querySelector('.alert-message');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert-message';
    alertDiv.textContent = message;

    if (type === 'success') {
        alertDiv.style.backgroundColor = 'rgba(40, 235, 40, 0.1)';
        alertDiv.style.borderColor = 'rgb(40, 235, 40)';
        alertDiv.style.color = 'rgb(0, 150, 0)';
    } else if (type === 'failure') {
        alertDiv.style.backgroundColor = 'rgba(255, 57, 57, 0.1)';
        alertDiv.style.borderColor = 'rgb(255, 57, 57)';
        alertDiv.style.color = 'rgb(200, 0, 0)';
    }

    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.padding = '15px 20px';
    alertDiv.style.border = '2px solid';
    alertDiv.style.borderRadius = '8px';
    alertDiv.style.fontWeight = '600';
    alertDiv.style.fontFamily = "'Pixelify Sans', 'Ubuntu', sans-serif";
    alertDiv.style.fontSize = '1.1em';
    alertDiv.style.zIndex = '10000';
    alertDiv.style.minWidth = '300px';
    alertDiv.style.maxWidth = '400px';
    alertDiv.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    alertDiv.style.transition = 'all 0.3s ease';
    alertDiv.style.opacity = '0';
    alertDiv.style.transform = 'translateX(100%)';

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.style.opacity = '1';
        alertDiv.style.transform = 'translateX(0)';
    }, 10);

    setTimeout(() => {
        alertDiv.style.opacity = '0';
        alertDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 300);
    }, timeBeforeFade);
}

document.addEventListener('DOMContentLoaded', (e) => {
    let usernameField = document.getElementById('username');
    let passwordFiled = document.getElementById('password');
    let form = document.getElementById("loginForm");

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (usernameField.value.trim() === '' || passwordFiled.value.trim() === '')
            return showAlertFunction('Please Fill In The Credentials First', 'failure');

        let response;

        try {
            response = await fetch('https://api.osamabouzalim.com/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: usernameField.value, password: passwordFiled.value }),
                credentials: 'include'
            });

            response = await response.json();
            
            if (response.status === 200) {
                showAlertFunction('Successfully logged In!', 'success');
                setTimeout(() => location.href = '/dashboard', 2000);
            }
        } catch (err) {
            return showAlertFunction('An Error Occured While Trying To Communicate With The API', 'failure');
        }

    });
});