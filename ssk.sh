#!/bin/sh
# Access the link parameter as $1 or $LINK_PARAM
LINK="$1"
SLEEP_DURATION=1;

# Your script logic here
echo "Processing link: $LINK"

echo "Starting loop with ${SLEEP_DURATION} second intervals..."

# Loop counter
for i in {1..13}; do
    # Get current timestamp
    current_time=$(date "+%Y-%m-%d %H:%M:%S")

    # Output iteration number and timestamp
    echo "[$current_time] Loop iteration: $i"

    # Sleep for specified duration
    sleep "$SLEEP_DURATION"
done

echo "Loop completed"
exit 0
