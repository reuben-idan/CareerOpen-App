# Setup script for Redis monitoring
# This script helps configure the monitoring stack

Write-Host "Setting up Redis monitoring..."

# Create required directories
$monitoringDir = Join-Path $PSScriptRoot "monitoring"
$prometheusDir = Join-Path $monitoringDir "prometheus"
$grafanaDir = Join-Path $monitoringDir "grafana"

# Create .env file if it doesn't exist
$envFile = Join-Path $PSScriptRoot ".env"
if (-not (Test-Path $envFile)) {
    @"
# Redis configuration
REDIS_PASSWORD=your_secure_password_here

# Grafana configuration
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=admin
"@ | Out-File -FilePath $envFile -Encoding utf8
    
    Write-Host "Created .env file. Please update it with your Redis password and secure Grafana credentials."
}

# Install Python dependencies
Write-Host "Installing Python dependencies..."
pip install -r requirements.txt

Write-Host """

Redis monitoring setup complete!

Next steps:
1. Update the .env file with your Redis password and secure Grafana credentials
2. Start the monitoring stack with:
   docker-compose -f docker-compose.monitoring.yml up -d

Access the monitoring tools:
- Grafana: http://localhost:3000 (admin/admin by default)
- Prometheus: http://localhost:9090
"""
