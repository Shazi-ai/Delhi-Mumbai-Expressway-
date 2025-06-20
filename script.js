// Enhanced JavaScript for Delhi Mumbai Expressway Interactive Tools

// Location data for the expressway
const expresswayData = {
    cities: {
        delhi: { name: 'Delhi', km: 0, state: 'Delhi' },
        sohna: { name: 'Sohna', km: 60, state: 'Haryana' },
        alwar: { name: 'Alwar', km: 150, state: 'Rajasthan' },
        dausa: { name: 'Dausa', km: 260, state: 'Rajasthan' },
        kota: { name: 'Kota', km: 410, state: 'Rajasthan' },
        ratlam: { name: 'Ratlam', km: 650, state: 'Madhya Pradesh' },
        vadodara: { name: 'Vadodara', km: 810, state: 'Gujarat' },
        surat: { name: 'Surat', km: 960, state: 'Gujarat' },
        virar: { name: 'Virar', km: 1200, state: 'Maharashtra' },
        mumbai: { name: 'Mumbai', km: 1350, state: 'Maharashtra' }
    },
    
    tollPlazas: [
        { name: 'Khalilpur', km: 56, rates: { light: 90, commercial: 145, heavy: 3215 } },
        { name: 'Barkapara', km: 300, rates: { light: 500, commercial: 805, heavy: 3215 } },
        { name: 'Dausa', km: 260, rates: { light: 460, commercial: 600, heavy: 2800 } },
        { name: 'Kota', km: 410, rates: { light: 350, commercial: 550, heavy: 2500 } },
        { name: 'Vadodara', km: 810, rates: { light: 400, commercial: 650, heavy: 2900 } },
        { name: 'Surat', km: 960, rates: { light: 300, commercial: 480, heavy: 2200 } }
    ],
    
    amenities: [
        { name: 'Sohna Service Area', km: 60, facilities: ['fuel', 'food', 'rest', 'medical'] },
        { name: 'Dausa Rest Area', km: 260, facilities: ['fuel', 'food', 'rest', 'atm', 'repair'] },
        { name: 'Kota Service Complex', km: 410, facilities: ['fuel', 'food', 'rest', 'medical', 'hotel'] },
        { name: 'Vadodara Hub', km: 810, facilities: ['fuel', 'food', 'rest', 'medical', 'hotel', 'shopping'] },
        { name: 'Surat Service Area', km: 960, facilities: ['fuel', 'food', 'rest', 'ev_charging'] }
    ]
};

// Enhanced toll calculation
function calculateDetailedToll(fromCity, toCity, vehicleType) {
    const fromKm = expresswayData.cities[fromCity]?.km || 0;
    const toKm = expresswayData.cities[toCity]?.km || 0;
    const startKm = Math.min(fromKm, toKm);
    const endKm = Math.max(fromKm, toKm);
    
    let totalToll = 0;
    const passedPlazas = [];
    
    // Calculate toll for each plaza passed
    expresswayData.tollPlazas.forEach(plaza => {
        if (plaza.km > startKm && plaza.km <= endKm) {
            totalToll += plaza.rates[vehicleType] || 0;
            passedPlazas.push(plaza);
        }
    });
    
    return {
        totalToll,
        passedPlazas,
        distance: Math.abs(endKm - startKm),
        estimatedTime: Math.round(Math.abs(endKm - startKm) / 100 * 60) // minutes at 100 km/h
    };
}

// Route planning with detailed information
function planDetailedRoute(fromCity, toCity, travelDate, travelTime) {
    const calculation = calculateDetailedToll(fromCity, toCity, 'light');
    const fromData = expresswayData.cities[fromCity];
    const toData = expresswayData.cities[toCity];
    
    // Find amenities along the route
    const routeAmenities = expresswayData.amenities.filter(amenity => {
        const startKm = Math.min(fromData.km, toData.km);
        const endKm = Math.max(fromData.km, toData.km);
        return amenity.km >= startKm && amenity.km <= endKm;
    });
    
    return {
        ...calculation,
        fromCity: fromData,
        toCity: toData,
        amenities: routeAmenities,
        travelDate,
        travelTime,
        fuelCost: Math.round(calculation.distance * 0.08 * 100), // Estimated fuel cost
        recommendedStops: routeAmenities.slice(0, 3) // Top 3 recommended stops
    };
}

// Weather simulation (mock data)
function getWeatherInfo(city) {
    const weatherConditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain'];
    const temperatures = { delhi: 25, mumbai: 28, kota: 30, vadodara: 26 };
    
    return {
        condition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
        temperature: temperatures[city] || 27,
        visibility: 'Good',
        recommendation: 'Safe to travel'
    };
}

// Traffic simulation
function getTrafficInfo(fromCity, toCity) {
    const trafficLevels = ['Light', 'Moderate', 'Heavy'];
    const level = trafficLevels[Math.floor(Math.random() * trafficLevels.length)];
    
    let delayMinutes = 0;
    switch(level) {
        case 'Heavy': delayMinutes = 30; break;
        case 'Moderate': delayMinutes = 15; break;
        default: delayMinutes = 0;
    }
    
    return {
        level,
        delayMinutes,
        recommendation: level === 'Heavy' ? 'Consider alternative timing' : 'Good time to travel'
    };
}

// Enhanced toll calculator with detailed breakdown
function enhancedTollCalculator() {
    const form = document.getElementById('tollCalculator');
    const resultDiv = document.getElementById('tollResult');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fromLocation = document.getElementById('fromLocation').value;
        const toLocation = document.getElementById('toLocation').value;
        const vehicleType = document.getElementById('vehicleType').value;
        
        if (!fromLocation || !toLocation || !vehicleType) {
            alert('Please fill in all fields');
            return;
        }
        
        if (fromLocation === toLocation) {
            alert('Starting point and destination cannot be the same');
            return;
        }
        
        // Show loading
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Calculating...';
        button.disabled = true;
        
        setTimeout(() => {
            const calculation = calculateDetailedToll(fromLocation, toLocation, vehicleType);
            const weather = getWeatherInfo(fromLocation);
            const traffic = getTrafficInfo(fromLocation, toLocation);
            
            // Update basic results
            document.getElementById('resultDistance').textContent = `${calculation.distance} km`;
            document.getElementById('resultToll').textContent = `₹${calculation.totalToll}`;
            document.getElementById('resultTime').textContent = `${Math.floor((calculation.estimatedTime + traffic.delayMinutes)/60)}h ${(calculation.estimatedTime + traffic.delayMinutes)%60}m`;
            
            // Add detailed breakdown
            const detailedBreakdown = `
                <div class="row mt-4">
                    <div class="col-md-6">
                        <div class="feature-card">
                            <h6><i class="fas fa-receipt me-2"></i>Toll Breakdown</h6>
                            ${calculation.passedPlazas.map(plaza => 
                                `<div class="d-flex justify-content-between">
                                    <span>${plaza.name}</span>
                                    <span>₹${plaza.rates[vehicleType]}</span>
                                </div>`
                            ).join('')}
                            <hr>
                            <div class="d-flex justify-content-between fw-bold">
                                <span>Total</span>
                                <span>₹${calculation.totalToll}</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="feature-card">
                            <h6><i class="fas fa-cloud-sun me-2"></i>Travel Conditions</h6>
                            <p><strong>Weather:</strong> ${weather.condition}, ${weather.temperature}°C</p>
                            <p><strong>Traffic:</strong> ${traffic.level}</p>
                            <p><strong>Delay:</strong> ${traffic.delayMinutes} minutes</p>
                            <div class="alert alert-info mt-2">
                                <small>${traffic.recommendation}</small>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Insert detailed breakdown
            const existingBreakdown = resultDiv.querySelector('.detailed-breakdown');
            if (existingBreakdown) {
                existingBreakdown.remove();
            }
            
            const breakdownDiv = document.createElement('div');
            breakdownDiv.className = 'detailed-breakdown';
            breakdownDiv.innerHTML = detailedBreakdown;
            resultDiv.appendChild(breakdownDiv);
            
            resultDiv.style.display = 'block';
            
            // Restore button
            button.innerHTML = originalText;
            button.disabled = false;
            
            // Scroll to result
            resultDiv.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 1500);
    });
}

// Enhanced route planner
function enhancedRoutePlanner() {
    const form = document.getElementById('routePlanner');
    const resultDiv = document.getElementById('routeResult');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const startPoint = document.getElementById('startPoint').value.toLowerCase();
        const endPoint = document.getElementById('endPoint').value.toLowerCase();
        const travelDate = document.getElementById('travelDate').value;
        const travelTime = document.getElementById('travelTime').value;
        
        if (!startPoint || !endPoint || !travelDate || !travelTime) {
            alert('Please fill in all fields');
            return;
        }
        
        // Show loading
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Planning...';
        button.disabled = true;
        
        setTimeout(() => {
            // Try to match input with known cities
            let fromCity = Object.keys(expresswayData.cities).find(city => 
                city.includes(startPoint) || startPoint.includes(city)
            ) || 'delhi';
            
            let toCity = Object.keys(expresswayData.cities).find(city => 
                city.includes(endPoint) || endPoint.includes(city)
            ) || 'mumbai';
            
            const routeInfo = planDetailedRoute(fromCity, toCity, travelDate, travelTime);
            const weather = getWeatherInfo(fromCity);
            
            const routeDetails = `
                <div class="row">
                    <div class="col-md-8">
                        <div class="feature-card">
                            <h5><i class="fas fa-route me-2"></i>Route Summary</h5>
                            <div class="row">
                                <div class="col-6">
                                    <p><strong>From:</strong> ${routeInfo.fromCity.name}, ${routeInfo.fromCity.state}</p>
                                    <p><strong>To:</strong> ${routeInfo.toCity.name}, ${routeInfo.toCity.state}</p>
                                    <p><strong>Distance:</strong> ${routeInfo.distance} km</p>
                                </div>
                                <div class="col-6">
                                    <p><strong>Travel Time:</strong> ${Math.floor(routeInfo.estimatedTime/60)}h ${routeInfo.estimatedTime%60}m</p>
                                    <p><strong>Estimated Toll:</strong> ₹${routeInfo.totalToll}</p>
                                    <p><strong>Fuel Cost:</strong> ₹${routeInfo.fuelCost}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="feature-card mt-3">
                            <h6><i class="fas fa-map-signs me-2"></i>Recommended Stops</h6>
                            ${routeInfo.recommendedStops.map(stop => `
                                <div class="border-bottom pb-2 mb-2">
                                    <strong>${stop.name}</strong> (${stop.km} km)
                                    <br>
                                    <small class="text-muted">
                                        Facilities: ${stop.facilities.map(f => f.replace('_', ' ')).join(', ')}
                                    </small>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="col-md-4">
                        <div class="feature-card">
                            <h6><i class="fas fa-info-circle me-2"></i>Travel Information</h6>
                            <p><strong>Date:</strong> ${new Date(travelDate).toLocaleDateString()}</p>
                            <p><strong>Departure:</strong> ${travelTime}</p>
                            <p><strong>Weather:</strong> ${weather.condition}</p>
                            <p><strong>Temperature:</strong> ${weather.temperature}°C</p>
                        </div>
                        
                        <div class="feature-card mt-3">
                            <h6><i class="fas fa-exclamation-triangle me-2"></i>Travel Tips</h6>
                            <ul class="small">
                                <li>Ensure FASTag is active and loaded</li>
                                <li>Carry emergency contact numbers</li>
                                <li>Check vehicle condition before travel</li>
                                <li>Keep first aid kit handy</li>
                                <li>Follow speed limits (120 km/h max)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
            
            document.getElementById('routeDetails').innerHTML = routeDetails;
            resultDiv.style.display = 'block';
            
            // Restore button
            button.innerHTML = originalText;
            button.disabled = false;
            
            // Scroll to result
            resultDiv.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 2000);
    });
}

// Add real-time clock
function addRealTimeClock() {
    const clockDiv = document.createElement('div');
    clockDiv.className = 'text-center mt-3';
    clockDiv.innerHTML = `
        <div class="feature-card">
            <h6><i class="fas fa-clock me-2"></i>Current Time</h6>
            <div id="currentTime" class="fs-5 fw-bold text-primary"></div>
        </div>
    `;
    
    const toolsSection = document.getElementById('tools');
    const container = toolsSection.querySelector('.container');
    container.appendChild(clockDiv);
    
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('currentTime').textContent = timeString + ' IST';
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// Add distance calculator between any two points
function addDistanceCalculator() {
    const distanceDiv = document.createElement('div');
    distanceDiv.className = 'row mt-5';
    distanceDiv.innerHTML = `
        <div class="col-lg-8 mx-auto">
            <div class="toll-calculator">
                <h3 class="text-center mb-4">
                    <i class="fas fa-ruler me-2"></i>
                    Distance Calculator
                </h3>
                <form id="distanceCalculator">
                    <div class="row">
                        <div class="col-md-5 mb-3">
                            <label for="distanceFrom" class="form-label">From (City/Landmark)</label>
                            <input type="text" class="form-control" id="distanceFrom" placeholder="Enter starting point" required>
                        </div>
                        <div class="col-md-5 mb-3">
                            <label for="distanceTo" class="form-label">To (City/Landmark)</label>
                            <input type="text" class="form-control" id="distanceTo" placeholder="Enter destination" required>
                        </div>
                        <div class="col-md-2 mb-3 d-flex align-items-end">
                            <button type="submit" class="btn btn-primary w-100">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                </form>
                
                <div id="distanceResult" class="result">
                    <div id="distanceDetails"></div>
                </div>
            </div>
        </div>
    `;
    
    const toolsSection = document.getElementById('tools');
    const container = toolsSection.querySelector('.container');
    container.appendChild(distanceDiv);
    
    // Add event listener for distance calculator
    document.getElementById('distanceCalculator').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const from = document.getElementById('distanceFrom').value.toLowerCase();
        const to = document.getElementById('distanceTo').value.toLowerCase();
        
        // Try to find matching cities
        const fromCity = Object.keys(expresswayData.cities).find(city => 
            city.includes(from) || from.includes(city)
        );
        const toCity = Object.keys(expresswayData.cities).find(city => 
            city.includes(to) || to.includes(city)
        );
        
        if (fromCity && toCity) {
            const distance = Math.abs(expresswayData.cities[toCity].km - expresswayData.cities[fromCity].km);
            const time = Math.round(distance / 100 * 60);
            
            document.getElementById('distanceDetails').innerHTML = `
                <div class="feature-card">
                    <h5>Distance Information</h5>
                    <div class="row text-center">
                        <div class="col-md-4">
                            <div class="text-primary fs-4 fw-bold">${distance} km</div>
                            <small>Distance</small>
                        </div>
                        <div class="col-md-4">
                            <div class="text-success fs-4 fw-bold">${Math.floor(time/60)}h ${time%60}m</div>
                            <small>Travel Time</small>
                        </div>
                        <div class="col-md-4">
                            <div class="text-info fs-4 fw-bold">₹${Math.round(distance * 0.08 * 100)}</div>
                            <small>Estimated Fuel Cost</small>
                        </div>
                    </div>
                </div>
            `;
        } else {
            document.getElementById('distanceDetails').innerHTML = `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Could not find exact match for the entered locations. Please try with major cities along the expressway.
                </div>
            `;
        }
        
        document.getElementById('distanceResult').style.display = 'block';
    });
}

// Initialize all enhanced features
document.addEventListener('DOMContentLoaded', function() {
    enhancedTollCalculator();
    enhancedRoutePlanner();
    addRealTimeClock();
    addDistanceCalculator();
    
    // Add some additional interactive features
    console.log('Delhi Mumbai Expressway Interactive Tools Loaded');
    console.log('Available cities:', Object.keys(expresswayData.cities));
    console.log('Toll plazas:', expresswayData.tollPlazas.length);
    console.log('Amenities:', expresswayData.amenities.length);
});
