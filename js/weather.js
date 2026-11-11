const weather = document.getElementById("weather");

fetch("https://api.open-meteo.com/v1/forecast?latitude=51.17&longitude=71.45&current=temperature_2m,wind_speed_10m")
    .then(response => {
        if (!response.ok) throw new Error("API error");
        return response.json();
    })
    .then(data => {
        weather.textContent =
            `Temperature: ${data.current.temperature_2m}°C, ` +
            `Wind: ${data.current.wind_speed_10m} km/h`;
    })
    .catch(() => {
        weather.textContent = "Weather unavailable.";
    });