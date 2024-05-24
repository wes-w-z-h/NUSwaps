#!/bin/bash

IMAGE_ID=$(docker images --filter=reference="weswzh/orb_ci:server" --format "{{.ID}}")
docker run --rm -p 3000:3000 --env-file .env -d ${IMAGE_ID}
