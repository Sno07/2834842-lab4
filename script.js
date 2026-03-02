async function searchCountry(countryName) {
    const spinner = document.getElementById('loading-spinner');
    const errorMessage = document.getElementById('error-message');
    const countryInfo = document.getElementById('country-info');
    const borderingCountriesContainer = document.getElementById('bordering-countries');

    try {
        countryInfo.innerHTML = '';
        borderingCountriesContainer.innerHTML = '';
        errorMessage.classList.add('hidden');
        spinner.classList.remove('hidden');

        // Fetch country data
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);

        if (!response.ok) {
            throw new Error('Country not found');
        }

        const data = await response.json();
        const country = data[0];

        countryInfo.innerHTML = `
            <div class="country-card">
                <h2>${country.name.common}</h2>
                <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Region:</strong> ${country.region}</p>
                <img src="${country.flags.svg}" alt="${country.name.common} flag" width="150">
            </div>
        `;

        if (country.borders && country.borders.length > 0) {
            for (let code of country.borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                borderingCountriesContainer.innerHTML += `
                    <div class="country-card">
                        <p>${borderCountry.name.common}</p>
                        <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag" width="100">
                    </div>
                `;
            }
        } else {
            borderingCountriesContainer.innerHTML = `<p>No bordering countries.</p>`;
        }

    } catch (error) {

        errorMessage.textContent = 'Unable to fetch country data. Please try again.';
        errorMessage.classList.remove('hidden');
    } finally {
        
        spinner.classList.add('hidden');
    }
}


document.getElementById('search-btn').addEventListener('click', () => {
    const country = document.getElementById('country-input').value.trim();
    if (country) {
        searchCountry(country);
    }
});


document.getElementById('country-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const country = event.target.value.trim();
        if (country) {
            searchCountry(country);
        }
    }
});