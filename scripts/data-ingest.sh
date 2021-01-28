#!/bin/sh

docker build data-ingest -t data-ingest

docker run --rm -v $(dirname $1):/app/data data-ingest ./data/$(basename -- $1)
