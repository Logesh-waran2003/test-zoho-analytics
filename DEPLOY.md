# Docker Deployment Guide

## Prerequisites on EC2

1. **Install Docker:**
```bash
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user
```

2. **Install Docker Compose:**
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

3. **Log out and back in** for group changes to take effect

## Deployment Steps

1. **Upload your project to EC2:**
```bash
# From your local machine
scp -i your-key.pem -r /path/to/test-app ec2-user@your-ec2-ip:~/
```

2. **SSH into EC2:**
```bash
ssh -i your-key.pem ec2-user@your-ec2-ip
```

3. **Navigate to project:**
```bash
cd test-app
```

4. **Configure environment:**
```bash
cp .env.example .env
nano .env  # Edit with your Zoho credentials and EC2 IP
```

5. **Start everything:**
```bash
docker-compose up -d
```

6. **Check status:**
```bash
docker-compose ps
docker-compose logs -f
```

## Access Your Application

- **Frontend:** http://your-ec2-ip
- **Backend API:** http://your-ec2-ip/api/health

## Useful Commands

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop everything
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# View running containers
docker ps
```

## Security Group Settings

Ensure your EC2 security group allows:
- **Port 80** (HTTP) - Inbound from 0.0.0.0/0
- **Port 22** (SSH) - Inbound from your IP

## Troubleshooting

1. **Database connection issues:**
```bash
docker-compose logs postgres
```

2. **Backend errors:**
```bash
docker-compose logs backend
```

3. **Frontend not loading:**
```bash
docker-compose logs frontend
```

4. **Reset everything:**
```bash
docker-compose down -v
docker-compose up -d
```
