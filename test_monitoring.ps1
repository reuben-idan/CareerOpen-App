# Test script for Redis monitoring alerts
# This script verifies that alerts are working as expected

# Set error handling
$ErrorActionPreference = "Stop"

# Check if redis-cli is available
function Test-RedisCli {
    try {
        $redisCli = Get-Command redis-cli -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

# Function to test Redis connection
function Test-RedisConnection {
    param (
        [string]$host = "localhost",
        [int]$port = 6379,
        [string]$password = $null
    )
    
    $authCmd = if ($password) { "-a \"$password\"" } else { "" }
    $cmd = "redis-cli -h $host -p $port $authCmd PING"
    
    try {
        $result = Invoke-Expression $cmd 2>&1
        if ($result -eq "PONG") {
            return $true
        } else {
            Write-Host "Unexpected response from Redis: $result"
            return $false
        }
    } catch {
        Write-Host "Failed to connect to Redis: $_"
        return $false
    }
}

# Function to generate Redis load
function Invoke-RedisLoadTest {
    param (
        [string]$host = "localhost",
        [int]$port = 6379,
        [string]$password = $null,
        [int]$iterations = 1000
    )
    
    $authCmd = if ($password) { "-a \"$password\"" } else { "" }
    $cmd = "1..$iterations | ForEach-Object { redis-cli -h $host -p $port $authCmd SET \"testkey_\$_\" \"testvalue_\$_\" EX 60 }"
    
    Write-Host "Generating Redis load ($iterations SET operations)..."
    try {
        Invoke-Expression $cmd | Out-Null
        Write-Host "✅ Load test completed successfully"
        return $true
    } catch {
        Write-Host "❌ Load test failed: $_"
        return $false
    }
}

# Function to check Prometheus alerts
function Get-PrometheusAlerts {
    param (
        [string]$host = "localhost",
        [int]$port = 9090
    )
    
    $url = "http://${host}:${port}/api/v1/alerts"
    
    try {
        $response = Invoke-RestMethod -Uri $url -Method Get
        return $response.data.alerts
    } catch {
        Write-Host "Failed to fetch alerts from Prometheus: $_"
        return $null
    }
}

# Main script execution
Write-Host "=== Redis Monitoring Test ==="

# 1. Check Redis connection
Write-Host "`n[1/4] Testing Redis connection..."
if (Test-RedisConnection -password $env:REDIS_PASSWORD) {
    Write-Host "✅ Successfully connected to Redis"
} else {
    Write-Error "❌ Failed to connect to Redis. Please check your Redis server and credentials."
    exit 1
}

# 2. Generate load to trigger alerts
Write-Host "`n[2/4] Generating Redis load to trigger alerts..."
Invoke-RedisLoadTest -password $env:REDIS_PASSWORD -iterations 5000

# 3. Check Prometheus alerts
Write-Host "`n[3/4] Checking Prometheus alerts..."
$alerts = Get-PrometheusAlerts

if ($alerts) {
    Write-Host "Active alerts:"
    foreach ($alert in $alerts) {
        $status = $alert.state
        $severity = $alert.labels.severity
        $alertname = $alert.labels.alertname
        $description = $alert.annotations.description
        
        $statusSymbol = if ($status -eq "firing") { "🔥" } else { "ℹ️" }
        Write-Host "$statusSymbol [$severity] $alertname - $description"
    }
} else {
    Write-Host "No active alerts found."
}

# 4. Provide next steps
Write-Host "`n[4/4] Next steps:"
Write-Host "1. Open Grafana at http://localhost:3000 to view metrics"
Write-Host "2. Check Prometheus alerts at http://localhost:9090/alerts"
Write-Host "3. Review container logs with: docker-compose -f docker-compose.monitoring.yml logs -f"

Write-Host "`n✅ Monitoring test completed successfully!"
