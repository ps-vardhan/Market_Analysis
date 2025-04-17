document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchButton = document.getElementById('searchButton');
    const backButton1 = document.getElementById('backButton1');
    const backButton2 = document.getElementById('backButton2');
    const newAnalysisBtn = document.getElementById('newAnalysisBtn');
    const addRowBtn = document.getElementById('addRowBtn');
    const updateAnalysisBtn = document.getElementById('updateAnalysisBtn');
    const searchInput = document.getElementById('searchInput');
    const page1 = document.getElementById('page1');
    const page2 = document.getElementById('page2');
    const page3 = document.getElementById('page3');
    const resultsContainer = document.getElementById('resultsContainer');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    // Sample popular product suggestions
    const popularSuggestions = [
        "Wireless Earbuds",
        "Smartphone",
        "Laptop Stand",
        "Gaming Chair",
        "Air Purifier",
        "Bluetooth Speaker",
        "Smartwatch",
        "Portable Monitor"
    ];

// Initialize Awesomplete
const input = document.getElementById("searchInput");
new Awesomplete(input, {
    list: popularSuggestions,
    minChars: 1,
    maxItems: 7,
    autoFirst: true
});

// Optional: handle enter or selection
input.addEventListener("awesomplete-selectcomplete", (e) => {
    document.getElementById("searchButton").click(); // trigger search
});

    
    // Sample product database
    const productDatabase = [
        { id: 1, name: "Wireless Bluetooth Headphones", price: 89.99, category: "electronics", 
          historicalData: [
              { date: "2023-01-01", demand: 120 },
              { date: "2023-02-01", demand: 135 },
              { date: "2023-03-01", demand: 150 },
              { date: "2023-04-01", demand: 145 },
              { date: "2023-05-01", demand: 160 },
              { date: "2023-06-01", demand: 175 }
          ]},
        { id: 2, name: "Stainless Steel Water Bottle", price: 24.95, category: "home",
          historicalData: [
              { date: "2023-01-01", demand: 85 },
              { date: "2023-02-01", demand: 78 },
              { date: "2023-03-01", demand: 92 },
              { date: "2023-04-01", demand: 88 },
              { date: "2023-05-01", demand: 95 },
              { date: "2023-06-01", demand: 102 }
          ]},
        { id: 3, name: "Organic Cotton T-Shirt", price: 29.99, category: "clothing",
          historicalData: [
              { date: "2023-01-01", demand: 210 },
              { date: "2023-02-01", demand: 195 },
              { date: "2023-03-01", demand: 225 },
              { date: "2023-04-01", demand: 240 },
              { date: "2023-05-01", demand: 230 },
              { date: "2023-06-01", demand: 250 }
          ]},
        { id: 4, name: "Smart Fitness Tracker", price: 59.99, category: "electronics",
          historicalData: [
              { date: "2023-01-01", demand: 75 },
              { date: "2023-02-01", demand: 85 },
              { date: "2023-03-01", demand: 90 },
              { date: "2023-04-01", demand: 110 },
              { date: "2023-05-01", demand: 105 },
              { date: "2023-06-01", demand: 115 }
          ]}
    ];
    
    // Current product being analyzed
    let currentProduct = null;
    
    // Event Listeners
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });
    
    backButton1.addEventListener('click', function() {
        page2.style.display = 'none';
        page1.style.display = 'flex';
        searchInput.value = '';
        searchInput.focus();
    });
    
    backButton2.addEventListener('click', function() {
        page3.style.display = 'none';
        page2.style.display = 'flex';
    });
    
    newAnalysisBtn.addEventListener('click', function() {
        page3.style.display = 'none';
        page1.style.display = 'flex';
        searchInput.value = '';
        searchInput.focus();
    });
    
    addRowBtn.addEventListener('click', addDemandRow);
    updateAnalysisBtn.addEventListener('click', updateAnalysis);
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Functions
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        
        if (query) {
            // Filter products (in real app, this would be an API call)
            const filteredProducts = productDatabase.filter(product => 
                product.name.toLowerCase().includes(query) || 
                product.category.toLowerCase().includes(query)
            );
            
            displaySearchResults(filteredProducts);
            
            // Switch to results page
            page1.style.display = 'none';
            page2.style.display = 'flex';
        } else {
            alert('Please enter a search term');
            searchInput.focus();
        }
    }
    
    function displaySearchResults(products) {
        resultsContainer.innerHTML = '';
        
        if (products.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 50px;">
                    <p>No products found matching your search</p>
                </div>
            `;
            return;
        }
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image">
                    ${product.name.charAt(0)}
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <button class="analyze-btn" data-id="${product.id}">Analyze Demand</button>
                </div>
            `;
            resultsContainer.appendChild(productCard);
        });
        
        // Add event listeners to analyze buttons
        document.querySelectorAll('.analyze-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const product = productDatabase.find(p => p.id === productId);
                if (product) {
                    currentProduct = product;
                    loadProductAnalysis(product);
                    page2.style.display = 'none';
                    page3.style.display = 'flex';
                }
            });
        });
    }
    
    function loadProductAnalysis(product) {
        // Set product name
        document.getElementById('resultProduct').textContent = product.name;
        document.getElementById('analysisProductName').value = product.name;
        
        // Load historical data
        const demandContainer = document.querySelector('.demand-input');
        demandContainer.innerHTML = '';
        
        product.historicalData.forEach(dataPoint => {
            const date = new Date(dataPoint.date);
            const formattedDate = date.toISOString().split('T')[0].substr(0, 7);
            
            const row = document.createElement('div');
            row.className = 'demand-row';
            row.innerHTML = `
                <input type="month" class="month-input" value="${formattedDate}">
                <input type="number" class="demand-input" value="${dataPoint.demand}" placeholder="Units sold">
                <button class="remove-btn">×</button>
            `;
            demandContainer.appendChild(row);
            
            // Add event to remove button
            row.querySelector('.remove-btn').addEventListener('click', function() {
                if (document.querySelectorAll('.demand-row').length > 1) {
                    demandContainer.removeChild(row);
                } else {
                    alert('You need at least one data point');
                }
            });
        });
        
        // Perform initial analysis
        performAnalysis();
    }
    
    function addDemandRow() {
        const demandContainer = document.querySelector('.demand-input');
        const lastRow = demandContainer.lastElementChild;
        let lastDate = '';
        
        if (lastRow) {
            const lastDateInput = lastRow.querySelector('.month-input').value;
            if (lastDateInput) {
                const date = new Date(lastDateInput + '-01');
                date.setMonth(date.getMonth() + 1);
                lastDate = date.toISOString().split('T')[0].substr(0, 7);
            }
        }
        
        const row = document.createElement('div');
        row.className = 'demand-row';
        row.innerHTML = `
            <input type="month" class="month-input" value="${lastDate}">
            <input type="number" class="demand-input" placeholder="Units sold">
            <button class="remove-btn">×</button>
        `;
        demandContainer.appendChild(row);
        
        // Add event to remove button
        row.querySelector('.remove-btn').addEventListener('click', function() {
            if (document.querySelectorAll('.demand-row').length > 1) {
                demandContainer.removeChild(row);
            } else {
                alert('You need at least one data point');
            }
        });
    }
    
    function updateAnalysis() {
        // Get updated historical data
        const historicalData = [];
        const rows = document.querySelectorAll('.demand-row');
        
        rows.forEach(row => {
            const date = row.querySelector('.month-input').value;
            const demand = parseFloat(row.querySelector('.demand-input').value);
            
            if (date && !isNaN(demand)) {
                historicalData.push({
                    date: date + '-01', // Add day for proper date parsing
                    demand: demand
                });
            }
        });
        
        if (historicalData.length >= 3) {  // Minimum 3 data points
            // Update current product data
            currentProduct.historicalData = historicalData;
            
            // Perform analysis with updated data
            performAnalysis();
            
            // Switch back to forecast tab
            switchTab('forecast-tab');
        } else {
            alert('Please provide at least 3 months of historical data');
        }
    }
    
    function performAnalysis() {
        if (!currentProduct) return;
        
        const forecastPeriod = parseInt(document.getElementById('forecastPeriod').value);
        const historicalData = currentProduct.historicalData;
        
        // Sort data by date
        historicalData.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Simulate forecasting (in real app, this would call your backend API)
        const forecastData = [];
        const lastDemand = historicalData[historicalData.length - 1].demand;
        const trend = calculateTrend(historicalData);
        
        for (let i = 1; i <= forecastPeriod; i++) {
            const baseValue = lastDemand + (trend * i);
            const randomFactor = 0.8 + Math.random() * 0.4; // 0.8-1.2
            const forecastValue = baseValue * randomFactor;
            
            forecastData.push({
                period: `Month ${i}`,
                date: addMonths(new Date(historicalData[historicalData.length - 1].date), i),
                demand: Math.round(forecastValue),
                lower: Math.round(forecastValue * 0.9),
                upper: Math.round(forecastValue * 1.1)
            });
        }
        
        // Generate recommendation
        const avgDemand = historicalData.reduce((sum, item) => sum + item.demand, 0) / historicalData.length;
        const last3Avg = historicalData.slice(-3).reduce((sum, item) => sum + item.demand, 0) / 3;
        const growthRate = (last3Avg - avgDemand) / avgDemand;
        
        let recommendation, confidence, recommendationClass;
        
        if (growthRate > 0.15) {
            recommendation = "Grow Production";
            recommendationClass = "recommend-grow";
            confidence = "High";
        } else if (growthRate > -0.1) {
            recommendation = "Maintain Production";
            recommendationClass = "recommend-maintain";
            confidence = "Medium";
        } else {
            recommendation = "Reduce Production";
            recommendationClass = "recommend-reduce";
            confidence = "High";
        }
        
        // Display results
        document.getElementById('resultRecommendation').textContent = recommendation;
        document.getElementById('resultRecommendation').className = recommendationClass;
        document.getElementById('resultConfidence').textContent = confidence;
        
        // Generate insights
        const insightsList = document.getElementById('insightsList');
        insightsList.innerHTML = '';
        
        const insights = [
            `Historical data shows ${growthRate > 0 ? 'an increasing' : 'a decreasing'} trend (${(growthRate * 100).toFixed(1)}%)`,
            `The last quarter was ${last3Avg > avgDemand ? 'above' : 'below'} average demand by ${Math.abs(last3Avg - avgDemand).toFixed(1)} units`,
            `Expected demand range for next period: ${forecastData[0].lower} - ${forecastData[0].upper} units`,
            `Seasonality analysis shows ${Math.random() > 0.5 ? 'moderate seasonal patterns' : 'limited seasonal variation'}`
        ];
        
        insights.forEach(insight => {
            const li = document.createElement('li');
            li.textContent = insight;
            insightsList.appendChild(li);
        });
        
        // Generate actionable recommendations
        const actionRecommendations = document.getElementById('actionRecommendations');
        actionRecommendations.innerHTML = '';
        
        const actions = [];
        
        if (growthRate > 0.15) {
            actions.push(
                "Consider increasing production capacity by 15-20%",
                "Explore expanding distribution channels",
                "Monitor inventory levels to prevent stockouts"
            );
        } else if (growthRate > -0.1) {
            actions.push(
                "Maintain current production levels",
                "Focus on marketing to existing customer base",
                "Monitor competitor activity closely"
            );
        } else {
            actions.push(
                "Consider reducing production by 10-15%",
                "Run promotions to clear existing inventory",
                "Evaluate product for potential redesign or discontinuation"
            );
        }
        
        actions.forEach(action => {
            const p = document.createElement('p');
            p.innerHTML = `✓ ${action}`;
            p.style.marginBottom = '10px';
            actionRecommendations.appendChild(p);
        });
        
        // Populate forecast table
        const forecastTable = document.getElementById('forecastTable').querySelector('tbody');
        forecastTable.innerHTML = '';
        
        forecastData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(item.date)}</td>
                <td>${item.demand}</td>
                <td>${item.lower}</td>
                <td>${item.upper}</td>
            `;
            forecastTable.appendChild(row);
        });
        
        // Render chart
        renderChart(historicalData, forecastData);
    }
    
    function switchTab(tabId) {
        // Hide all tab contents
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Deactivate all tab buttons
        tabButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        // Activate selected tab
        document.getElementById(tabId).classList.add('active');
        document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
    }
    
    // Helper functions
    function calculateTrend(data) {
        if (data.length < 2) return 0;
        
        const first = data[0].demand;
        const last = data[data.length - 1].demand;
        return (last - first) / data.length;
    }
    
    function addMonths(date, months) {
        const result = new Date(date);
        result.setMonth(result.getMonth() + months);
        return result;
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('default', { month: 'short', year: 'numeric' });
    }
    
    function renderChart(historicalData, forecastData) {
        const ctx = document.getElementById('demandChart').getContext('2d');
        
        // Destroy previous chart if it exists
        if (window.demandChart) {
            window.demandChart.destroy();
        }
        
        // Prepare labels and data
        const historyLabels = historicalData.map(item => 
            formatDate(item.date)
        );
        
        const forecastLabels = forecastData.map(item => 
            formatDate(item.date)
        );
        
        const historyValues = historicalData.map(item => item.demand);
        const forecastValues = forecastData.map(item => item.demand);
        const forecastLower = forecastData.map(item => item.lower);
        const forecastUpper = forecastData.map(item => item.upper);
        
        // Create chart
        window.demandChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [...historyLabels, ...forecastLabels],
                datasets: [
                    {
                        label: 'Historical Demand',
                        data: [...historyValues, ...Array(forecastLabels.length).fill(null)],
                        borderColor: '#4a6fa5',
                        backgroundColor: 'rgba(74, 111, 165, 0.1)',
                        fill: true,
                        tension: 0.3
                    },
                    {
                        label: 'Forecasted Demand',
                        data: [...Array(historyLabels.length).fill(null), ...forecastValues],
                        borderColor: '#28a745',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        fill: true,
                        borderDash: [5, 5],
                        tension: 0.3
                    },
                    {
                        label: 'Confidence Range',
                        data: [...Array(historyLabels.length).fill(null), ...forecastUpper],
                        borderColor: '#ffc107',
                        backgroundColor: 'rgba(255, 193, 7, 0.1)',
                        fill: '-1',
                        borderDash: [2, 2],
                        tension: 0.1
                    },
                    {
                        label: '',
                        data: [...Array(historyLabels.length).fill(null), ...forecastLower],
                        borderColor: '#ffc107',
                        backgroundColor: 'rgba(255, 193, 7, 0.1)',
                        fill: '-1',
                        borderDash: [2, 2],
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Demand (units)'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    },
                    legend: {
                        position: 'top'
                    },
                    annotation: {
                        annotations: {
                            line1: {
                                type: 'line',
                                yMin: 0,
                                yMax: 0,
                                xMin: historyLabels.length - 0.5,
                                xMax: historyLabels.length - 0.5,
                                borderColor: 'rgba(0, 0, 0, 0.5)',
                                borderWidth: 2,
                                borderDash: [5, 5]
                            }
                        }
                    }
                }
            }
        });
    }
});