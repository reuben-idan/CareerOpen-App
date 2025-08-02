# Redis Monitoring and Security Setup

This directory contains the configuration for monitoring and securing Redis in the CareerOpen application using Prometheus and Grafana.

## Prerequisites

- Docker and Docker Compose installed on your system
- Redis server running and accessible
- Python dependencies installed (see main `requirements.txt`)
- Administrative access to configure Redis server

## Getting Started

### 1. Secure Your Redis Instance

Before setting up monitoring, ensure your Redis instance is properly secured:

1. **Create a secure Redis configuration file** using the template at `monitoring/redis-secure.conf`
2. **Update the configuration** with your desired settings, especially:
   - `requirepass` - Set a strong password
   - `bind` - Restrict to localhost or private IPs
   - `maxmemory` - Set appropriate for your system
   - `protected-mode` - Set to 'yes'

3. **Restart Redis** with the new configuration:
   ```bash
   # For systemd systems
   sudo systemctl restart redis
   
   # For manual startup
   redis-server /path/to/your/redis.conf
   ```

### 2. Set Up Monitoring Environment

1. **Set environment variables**:
   Create a `.env` file in the project root with the following variables:
   ```
   # Redis configuration - must match your Redis server configuration
   REDIS_PASSWORD=your_secure_redis_password
   
   # Grafana configuration - change these from defaults
   GRAFANA_ADMIN_USER=admin
   GRAFANA_ADMIN_PASSWORD=your_secure_grafana_password
   ```

2. **Start the monitoring stack**:
   ```bash
   docker-compose -f docker-compose.monitoring.yml up -d
   ```

3. **Verify the services are running**:
   ```bash
   docker ps
   ```
   You should see containers for Prometheus, Grafana, and Redis Exporter.

4. **Access the monitoring tools**:
   - **Grafana**: http://localhost:3000
     - Username: `admin` (or your configured username)
     - Password: (your configured password)
   - **Prometheus**: http://localhost:9090

5. **Configure Grafana** (first time only):
   - Log in to Grafana
   - Navigate to Configuration > Data Sources
   - Add Prometheus as a data source with URL: `http://prometheus:9090`
   - Import the Redis dashboard from `monitoring/grafana/provisioning/dashboards/redis/redis-dashboard.json`

## Dashboards

### Redis Monitoring Dashboard

This dashboard provides an overview of your Redis instance, including:

- **Memory Usage**: Current and maximum memory usage
- **Memory Fragmentation**: Fragmentation ratio over time
- **Throughput**: Commands processed and network I/O
- **Cache Hit/Miss Ratio**: Cache performance metrics
- **Client Connections**: Active client connections
- **Performance Metrics**: Command duration and uptime

## Alerting

Alerts are configured in Prometheus and can be viewed in the Alerts section of the Prometheus UI. The following alerts are pre-configured:

1. **High Memory Usage**: Triggers when Redis memory usage exceeds 90% of maxmemory
2. **High Fragmentation**: Triggers when memory fragmentation ratio exceeds 1.5
3. **High Cache Miss Rate**: Triggers when cache miss rate exceeds 20%
4. **Redis Down**: Triggers when Redis is not accessible

## Security Hardening

### Redis Security

1. **Authentication**:
   - Always set a strong `requirepass` in Redis configuration
   - Use the `rename-command` directive to disable dangerous commands
   - Consider using ACLs for more granular access control

2. **Network Security**:
   - Bind Redis to localhost or a private network interface
   - Use firewalls to restrict access to Redis ports
   - Consider using SSH tunneling for remote access

3. **TLS/SSL**:
   - Enable TLS for encrypted connections
   - Use client certificate authentication for additional security

### Monitoring Security

1. **Authentication**:
   - Change default credentials for Grafana and Prometheus
   - Enable authentication for all monitoring endpoints
   - Use strong, unique passwords

2. **Network Security**:
   - Use a reverse proxy (like Nginx) with HTTPS
   - Restrict access to monitoring UIs using IP whitelisting
   - Consider using a VPN for remote access

3. **Data Protection**:
   - Regularly back up Grafana dashboards and Prometheus data
   - Monitor and rotate credentials periodically
   - Enable audit logging for all administrative actions

## Maintenance and Operations

### Updating the Stack

```bash
# Pull latest images
docker-compose -f docker-compose.monitoring.yml pull

# Recreate containers with new images
docker-compose -f docker-compose.monitoring.yml up -d
```

### Monitoring Logs

```bash
# View logs for all services
docker-compose -f docker-compose.monitoring.yml logs -f

# View logs for a specific service
docker-compose -f docker-compose.monitoring.yml logs -f prometheus
docker-compose -f docker-compose.monitoring.yml logs -f grafana
docker-compose -f docker-compose.monitoring.yml logs -f redis-exporter
```

### Backup and Restore

1. **Backup Grafana dashboards**:
   - Use the Grafana API or UI to export dashboards
   - Store backups in version control

2. **Backup Prometheus data**:
   - The Prometheus data directory is mounted at `prometheus_data` volume
   - Regularly back up this directory

3. **Backup Redis data**:
   - Use `SAVE` or `BGSAVE` to create RDB snapshots
   - Back up the AOF file if using AOF persistence
   - Store backups securely with encryption

## Monitoring Alerts

The following alerts are pre-configured in the monitoring setup:

### Critical Alerts
- **RedisDown**: Triggers when Redis is not accessible
- **RedisMemoryUsageCritical**: When memory usage exceeds 95%
- **RedisReplicationBroken**: If replication is not working

### Warning Alerts
- **RedisMemoryUsageWarning**: When memory usage exceeds 80%
- **RedisMemoryFragmentationHigh**: When fragmentation ratio > 1.5
- **RedisConnectedClientsHigh**: When connected clients exceed threshold
- **RedisExpensiveCommands**: When slow commands are detected

### Alert Configuration
To modify alerts:
1. Edit `monitoring/prometheus/alert.rules`
2. Reload Prometheus configuration:
   ```bash
   curl -X POST http://localhost:9090/-/reload
   ```

## Troubleshooting

### Common Issues

1. **No Data in Grafana**
   - Verify Prometheus is running: `http://localhost:9090/targets`
   - Check if Redis Exporter is up and scraping metrics
   - Verify network connectivity between containers

2. **Connection Refused**
   - Ensure Redis is running and accessible
   - Check Redis authentication credentials
   - Verify network/firewall settings

3. **High Memory Usage**
   - Review memory usage in the dashboard
   - Check for memory leaks in your application
   - Consider increasing `maxmemory` or optimizing data structures

4. **Authentication Failures**
   - Verify Redis password in `.env` matches Redis configuration
   - Check for special characters in passwords that might need escaping
   - Ensure proper URL encoding for special characters

### Getting Help

- Check container logs for errors
- Review Prometheus targets page for scrape errors
- Consult Redis documentation for specific error messages
- Check the issue tracker for known problems
