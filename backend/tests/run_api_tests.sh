#!/bin/sh

if [ $# -eq 0 ]; then
    echo "$0 Require 1 input environemt variable: local || test"
    exit 1
else
    echo "Running tests..."
fi

case "$1" in
"local")
    echo "Running local env..."
    newman run orb_tester.postman_collection.json -e local_env.postman_environment.json
    ;;
"test")
    echo "Running test env..."
    newman run orb_tester.postman_collection.json -e test_env.postman_environment.json
    ;;
"host")
    echo "Running host env..."
    newman run orb_tester.postman_collection.json -e host_env.postman_environment.json
    ;;
esac
