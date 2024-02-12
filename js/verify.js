function isDesktop() {
    return window.matchMedia("(min-width: 768px)").matches;
}


function hideAviso() {
    var aviso = document.getElementById('aviso');
    aviso.style.display = 'none';
}

function showAviso() {
    var aviso = document.getElementById('aviso');
    aviso.style.display = 'block';
}

function checkDeviceType() {
    if (isDesktop() || isMobileViewInDesktop()) {
        showAviso();
    } else {
        showAviso();
    }
}

function isMobileViewInDesktop() {
    var userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('android') && userAgent.includes('mobile');
}

window.onload = checkDeviceType;
window.addEventListener('resize', checkDeviceType);