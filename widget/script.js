// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load the data
    fetch('../data/ransomware_data.json')
        .then(response => response.json())
        .then(data => {
            // Initialize the widget with the data
            initializeWidget(data);
        })
        .catch(error => {
            console.error('Error loading data:', error);
            document.querySelector('.widget-container').innerHTML = 
                '<div class="error-message">Error loading ransomware data. Please try again later.</div>';
        });
});

// Initialize the widget with data
function initializeWidget(data) {
    // Set up navigation
    setupNavigation();
    
    // Create charts
    createPrevalenceChart(data);
    createRansomChart(data);
    createRecoveryChart(data);
    createIndustryChart(data);
    createVectorChart(data);
}

// Set up navigation functionality
function setupNavigation() {
    const navLinks = document.querySelectorAll('.widget-nav a');
    const sections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(link => link.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// Create prevalence chart
function createPrevalenceChart(data) {
    const ctx = document.getElementById('prevalenceChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['SMBs', 'Large Organizations', 'Overall'],
            datasets: [{
                label: 'Ransomware Prevalence in Breaches (%)',
                data: [
                    data.ransomware_overview.smb_impact.percentage_of_smb_breaches,
                    data.ransomware_overview.smb_impact.large_organization_percentage,
                    data.ransomware_overview.overall_prevalence.percentage_of_breaches
                ],
                backgroundColor: [
                    'rgba(217, 48, 37, 0.7)',
                    'rgba(26, 75, 140, 0.7)',
                    'rgba(52, 168, 83, 0.7)'
                ],
                borderColor: [
                    'rgba(217, 48, 37, 1)',
                    'rgba(26, 75, 140, 1)',
                    'rgba(52, 168, 83, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Percentage of Breaches (%)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Ransomware Prevalence by Organization Size'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + '% of breaches involved ransomware';
                        }
                    }
                }
            }
        }
    });
}

// Create ransom payment chart
function createRansomChart(data) {
    const ctx = document.getElementById('ransomChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Previous Year', 'Current Year'],
            datasets: [
                {
                    label: 'Median Ransom Payment ($)',
                    data: [
                        data.financial_impact.median_ransom_payment.previous_year_amount_usd,
                        data.financial_impact.median_ransom_payment.amount_usd
                    ],
                    borderColor: 'rgba(26, 75, 140, 1)',
                    backgroundColor: 'rgba(26, 75, 140, 0.1)',
                    yAxisID: 'y',
                    fill: true
                },
                {
                    label: 'Refused to Pay (%)',
                    data: [
                        data.financial_impact.payment_trends.previous_year_refused_percentage,
                        data.financial_impact.payment_trends.refused_to_pay_percentage
                    ],
                    borderColor: 'rgba(52, 168, 83, 1)',
                    backgroundColor: 'rgba(52, 168, 83, 0.1)',
                    yAxisID: 'y1',
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            stacked: false,
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Median Ransom Payment ($)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Refused to Pay (%)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                    min: 0,
                    max: 100
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Ransom Payment Trends'
                }
            }
        }
    });
}

// Create recovery time chart
function createRecoveryChart(data) {
    const ctx = document.getElementById('recoveryChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['24+ Hours Recovery', 'Under 24 Hours Recovery'],
            datasets: [{
                data: [
                    data.recovery_statistics.smb_recovery_time.percentage_over_24_hours,
                    100 - data.recovery_statistics.smb_recovery_time.percentage_over_24_hours
                ],
                backgroundColor: [
                    'rgba(217, 48, 37, 0.7)',
                    'rgba(52, 168, 83, 0.7)'
                ],
                borderColor: [
                    'rgba(217, 48, 37, 1)',
                    'rgba(52, 168, 83, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'SMB Recovery Time from Ransomware Attacks'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

// Create industry chart
function createIndustryChart(data) {
    const ctx = document.getElementById('industryChart').getContext('2d');
    const industries = data.industry_breakdown.most_targeted_smb_sectors;
    
    // Since we don't have specific percentages for industries, we'll create a visualization
    // that shows the relative targeting frequency based on their order in the list
    const values = industries.map((_, index) => 100 - (index * 10)); // Arbitrary values for visualization
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: industries,
            datasets: [{
                label: 'Relative Targeting Frequency',
                data: values,
                backgroundColor: 'rgba(26, 75, 140, 0.2)',
                borderColor: 'rgba(26, 75, 140, 1)',
                pointBackgroundColor: 'rgba(26, 75, 140, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(26, 75, 140, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Most Targeted SMB Sectors (Relative Frequency)'
                },
                subtitle: {
                    display: true,
                    text: 'Note: Specific percentage breakdowns by industry were not available in the report',
                    padding: {
                        bottom: 10
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.chart.data.labels[context.dataIndex];
                        }
                    }
                }
            }
        }
    });
}

// Create attack vector chart
function createVectorChart(data) {
    const ctx = document.getElementById('vectorChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Third-Party Breaches', 'Social Engineering', 'Other Vectors'],
            datasets: [{
                data: [
                    data.attack_vectors.third_party_breaches.percentage,
                    data.attack_vectors.social_engineering.percentage_of_breaches,
                    100 - data.attack_vectors.third_party_breaches.percentage - data.attack_vectors.social_engineering.percentage_of_breaches
                ],
                backgroundColor: [
                    'rgba(26, 75, 140, 0.7)',
                    'rgba(245, 166, 35, 0.7)',
                    'rgba(153, 160, 166, 0.7)'
                ],
                borderColor: [
                    'rgba(26, 75, 140, 1)',
                    'rgba(245, 166, 35, 1)',
                    'rgba(153, 160, 166, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Ransomware Attack Vectors'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}