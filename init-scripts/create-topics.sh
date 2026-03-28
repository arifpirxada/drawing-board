#!/bin/sh

MAX_RETRIES=30
RETRY=0

echo "Waiting for Kafka cluster (2 brokers)..."

until [ "$(/opt/kafka/bin/kafka-broker-api-versions.sh --bootstrap-server kafka:9092 2>/dev/null | grep -c 'id:')" -ge 2 ]; do
  RETRY=$((RETRY+1))
  if [ "$RETRY" -ge "$MAX_RETRIES" ]; then
    echo "Kafka brokers not ready after timeout"
    exit 1
  fi
  echo "Waiting for all 2 brokers to register..."
  sleep 2
done

echo "All 2 brokers ready. Creating topics..."

/opt/kafka/bin/kafka-topics.sh --create --if-not-exists \
  --topic drawing_events \
  --bootstrap-server kafka:9092 \
  --partitions 2 \
  --replication-factor 2

echo "Final topic list:"
/opt/kafka/bin/kafka-topics.sh --list --bootstrap-server kafka:9092