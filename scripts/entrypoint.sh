#!/bin/sh

set -e

echo "--------------------------------------------------"
echo " BMSuite Startup Sequence"
echo "--------------------------------------------------"

# Wait for database using a simple Node.js network check
echo "Checking database connectivity at bms-db:5432..."
MAX_RETRIES=60
COUNT=0

while [ $COUNT -lt $MAX_RETRIES ]; do
  # Use Node.js to try and open a socket to the DB
  if node -e "const net = require('net'); const client = net.createConnection({ port: 5432, host: 'bms-db' }, () => { process.exit(0); }); client.on('error', () => { process.exit(1); });" 2>/dev/null; then
    echo "Database port is open!"
    break
  fi
  
  echo "Database not ready yet... (Attempt $COUNT/$MAX_RETRIES)"
  sleep 2
  COUNT=$((COUNT + 1))
done

if [ $COUNT -eq $MAX_RETRIES ]; then
  echo "Error: Database connection timed out!"
  exit 1
fi

echo "Database is UP and reachable!"

# Run migrations
echo "Deploying database migrations..."
# We use --skip-generate because we already generated in the build stage
npx prisma migrate deploy
npx prisma db seed

echo "Starting BMSuite on port 3000..."
echo "--------------------------------------------------"

# Execute the main command (node build)
exec "$@"