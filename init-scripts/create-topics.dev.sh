#!/bin/sh

MAX_RETRIES=30
RETRY=0

echo "Waiting for Kafka broker..."

until /opt/kafka/bin/kafka-broker-api-versions.sh --bootstrap-server kafka:9092 > /dev/null 2>&1; do
  RETRY=$((RETRY+1))
  if [ "$RETRY" -ge "$MAX_RETRIES" ]; then
    echo "Kafka broker not ready after timeout"
    exit 1
  fi
  echo "Waiting for broker to be ready... ($RETRY/$MAX_RETRIES)"
  sleep 2
done

echo "Broker ready. Creating topics..."

/opt/kafka/bin/kafka-topics.sh --create --if-not-exists \
  --topic drawing_events \
  --bootstrap-server kafka:9092 \
  --partitions 1 \
  --replication-factor 1

echo "Final topic list:"
/opt/kafka/bin/kafka-topics.sh --list --bootstrap-server kafka:9092