document.addEventListener('DOMContentLoaded', () => {
	const GEO_IPIFY_API_KEY = config.GEO_IPIFY_API_KEY;
	// const DEFAULT_IP = '192.212.174.101';

	const input = document.querySelector('#search-bar');
	const searchButton = document.querySelector('#search-button');

	const ipAddressPart = document.querySelector('#ip-address');
	const locationPart = document.querySelector('#location');
	const timezonePart = document.querySelector('#timezone');
	const ispPart = document.querySelector('#isp');

	let map;

	//--- functions calling ----------------------------------------
	getIpAddress();
	//--- handlers -------------------------------------------------
	searchButton.addEventListener('click', searchIpAddress); // getInput() 괄호붙이면 실행안됨...
	input.addEventListener('keyup', (e) => {
		if (e.key === 'Enter') {
			searchIpAddress();
		}
	});
	//--- functions declation ---------------------------------------

	// display default map as a landing page

	// function sendDefaultIp() {
	// 	return getIpAddress(DEFAULT_IP);
	// }

	function getInput() {
		// since the first landingpage's input.value is '' , this warning is not working now. will update later
		if (input.value === '') {
			alert('Please put the right type of IP address');
			return;
		} else {
			return input.value;
		}
	}

	function getIpAddress(inputValue) {
		let apiURL = `https://geo.ipify.org/api/v2/country,city?apiKey=${GEO_IPIFY_API_KEY}`;

		// If an input value is provided, append it to the API URL
		if (inputValue) {
			apiURL += `&ipAddress=${inputValue}`;
		}

		fetch(apiURL)
			.then((response) => response.json()) //
			.then((data) => {
				console.log(data);
				const ipAddress = data.ip; //ex)192.212.174.101
				const locationCity = data.location.city;
				const locationRegion = data.location.region;
				const locationPostalCode = data.location.postalCode;
				const timezone = data.location.timezone;
				const isp = data.isp;

				const lat = data.location.lat;
				const lng = data.location.lng;
				const latLng = [lat, lng];

				ipAddressPart.innerText = ipAddress;
				locationPart.innerText = `${locationCity}, ${locationRegion} ${locationPostalCode}`;
				timezonePart.innerText = `UTC ${timezone}`;
				ispPart.innerText = isp === '' ? 'NA' : isp;

				// console.log(latLng);
				return renderMap(latLng);
				// return latLng;
			})
			.catch((error) => {
				alert(error);
			});
	}

	async function searchIpAddress() {
		let inputValue;
		try {
			inputValue = await getInput();
		} catch {
			// if inputValue is rejected -> display the default
			// inputValue = 'default';
			console.error();
			return;
		}

		return getIpAddress(inputValue);
	}

	//--- Map-related ---------------------------------------

	function renderMap(latLng) {
		if (map) {
			map.off();
			map.remove();
		}

		map = L.map('map').setView(latLng, 13);
		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution:
				'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		}).addTo(map);
	}
});
