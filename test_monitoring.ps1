# Simple test script to verify Redis monitoring setup
# This script checks if the monitoring services are accessible

# Set error handling
$ErrorActionPreference = "Stop"

# Function to check if a URL is accessible
function Test-Url {
    param (
        [string]$url,
        [int]$timeoutSec = 5
    )
    
    try {
        $request = [System.Net.WebRequest]::Create($url)
        $request.Timeout = $timeoutSec * 1000
        $response = $request.GetResponse()
        $statusCode = [int]$response.StatusCode
        $response.Close()
        return ($statusCode -ge 200 -and $statusCode -lt 400)
    } catch {
        return $false
    }
}

# Function to get service status
function Get-ServiceStatus {
    param (
        [string]$serviceName,
        [string]$url
    )
    
    $isRunning = Test-Url -url $url
    $status = if ($isRunning) { "[RUNNING]" } else { "[STOPPED]" }
    return @{
        Name = $serviceName
        Status = $status
        URL = $url
    }
}

# Main script execution
Write-Host "=== Redis Monitoring Status ==="
Write-Host "Checking monitoring services...`n"

# Check Prometheus
$prometheusStatus = Get-ServiceStatus -serviceName "Prometheus" -url "http://localhost:9090"

# Check Grafana
$grafanaStatus = Get-ServiceStatus -serviceName "Grafana" -url "http://localhost:3000"

# Check Redis Exporter
$redisExporterStatus = Get-ServiceStatus -serviceName "Redis Exporter" -url "http://localhost:9121/metrics"

# Display status
$services = @($prometheusStatus, $grafanaStatus, $redisExporterStatus)
foreach ($service in $services) {
    Write-Host "$($service.Status) $($service.Name) - $($service.URL)"
}

# Provide next steps
Write-Host "`nNext steps:"
Write-Host "1. Open Grafana at http://localhost:3000 to view metrics"
Write-Host "   - Username: admin"
Write-Host "   - Password: (check your .env file or use the default 'admin' if not changed)"
Write-Host "2. Check Prometheus targets at http://localhost:9090/targets"
Write-Host "3. View Redis metrics at http://localhost:9121/metrics"
Write-Host "`n[SUCCESS] Monitoring status check completed!"
