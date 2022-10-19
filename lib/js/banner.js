function spawnBanner(type, message) {
    const banner = document.createElement("div");
    banner.className = "banner " + type;
    banner.innerHTML = message;
    document.body.appendChild(banner);
    setTimeout(function() {
        despawnBanner(banner);
    }, 4000);
}

function despawnBanner(element) {
    $(element).css("transition", "opacity 0.5s ease-in-out");
    $(element).css("opacity", "0");
    setTimeout(function() {
        $(element).remove();
    }, 1000);
}