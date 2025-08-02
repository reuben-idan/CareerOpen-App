# Redis Monitoring Setup

This directory contains the configuration for monitoring Redis in the CareerOpen application using Prometheus and Grafana.

## Prerequisites

- Docker and Docker Compose installed on your system
- Redis server running and accessible
- Python dependencies installed (see main `requirements.txt`)

## Getting Started

1. **Set environment variables**:
   Create a `.env` file in the project root with the following variables:
   ```
   # Redis configuration
   REDIS_PASSWORD=your_redis_password
   
   # Grafana configuration
   GRAFANA_ADMIN_USER=admin
   GRAFANA_ADMIN_PASSWORD=admin
   ```

2. **Start the monitoring stack**:
   ```bash
   docker-compose -f docker-compose.monitoring.yml up -d
   ```

3. **Access the monitoring tools**:
   - **Grafana**: http://localhost:3000
     - Username: admin
     - Password: admin (change this in production)
   - **Prometheus**: http://localhost:9090

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

## Security Considerations

1. **Redis Security**:
   - Enable Redis authentication by setting a strong password
   - Bind Redis to localhost or a private network
   - Use SSL/TLS for encrypted connections in production

2. **Monitoring Security**:
   - Change default Grafana and Prometheus credentials
   - Enable authentication for Prometheus and Grafana
   - Restrict access to monitoring endpoints using a reverse proxy with authentication

## Maintenance

To update the monitoring stack:

```bash
docker-compose -f docker-compose.monitoring.yml pull
docker-compose -f docker-compose.monitoring.yml up -d
```

To view logs:

```bash
docker-compose -f docker-compose.monitoring.yml logs -f
```

## Troubleshooting

- **No data in Grafana**: Check if Prometheus is scraping metrics correctly
- **Connection refused**: Ensure Redis is running and accessible from the monitoring containers
- **High memory usage**: Review the memory usage dashboard and consider increasing maxmemory or optimizing your data structures
