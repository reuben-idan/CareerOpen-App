# Deployment script for Redis monitoring stack
# This script deploys the monitoring stack and verifies its functionality

# Set error handling
$ErrorActionPreference = "Stop"

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Error "Docker is not running. Please start Docker and try again."
    exit 1
}

# Load environment variables from .env if it exists
$envFile = Join-Path $PSScriptRoot ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        $name, $value = $_.Split('=', 2)
        if ($name -and $value) {
            [System.Environment]::SetEnvironmentVariable($name.Trim(), $value.Trim())
        }
    }
} else {
    Write-Warning "No .env file found. Using default values or existing environment variables."
}

# Ensure required environment variables are set
$requiredVars = @("REDIS_PASSWORD")
foreach ($var in $requiredVars) {
    if (-not [System.Environment]::GetEnvironmentVariable($var)) {
        Write-Error "Required environment variable $var is not set. Please check your .env file."
        exit 1
    }
}

# Create necessary directories
$directories = @(
    "monitoring/prometheus/data",
    "monitoring/grafana/provisioning/dashboards",
    "monitoring/grafana/provisioning/datasources"
)

foreach ($dir in $directories) {
    $fullPath = Join-Path $PSScriptRoot $dir
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        Write-Host "Created directory: $fullPath"
    }
}

# Deploy the monitoring stack
Write-Host "Deploying monitoring stack..."
try {
    docker-compose -f docker-compose.monitoring.yml pull
    docker-compose -f docker-compose.monitoring.yml up -d
    
    Write-Host "Waiting for services to start..."
    Start-Sleep -Seconds 10
    
    # Verify services are running
    $services = @("prometheus", "grafana", "redis-exporter")
    $allRunning = $true
    
    foreach ($service in $services) {
        $status = docker ps --filter "name=$service" --format "{{.Status}}"
        if ($status -match "Up") {
            Write-Host "✅ $service is running ($status)"
        } else {
            Write-Host "❌ $service is not running"
            $allRunning = $false
        }
    }
    
    if ($allRunning) {
        Write-Host "`n🎉 Monitoring stack deployed successfully!"
        Write-Host "- Grafana: http://localhost:3000"
        Write-Host "- Prometheus: http://localhost:9090"
        Write-Host "`nTo view logs, run: docker-compose -f docker-compose.monitoring.yml logs -f"
    } else {
        Write-Error "Some services failed to start. Check the logs with: docker-compose -f docker-compose.monitoring.yml logs"
        exit 1
    }
    
} catch {
    Write-Error "Failed to deploy monitoring stack: $_"
    exit 1
}
