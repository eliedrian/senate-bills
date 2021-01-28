#!/bin/sh

docker build data-ingest -t data-ingest

docker run --rm --network bills-app_default -v $(dirname $(readlink -f $1)):/app/data data-ingest ./data/$(basename -- $1)
