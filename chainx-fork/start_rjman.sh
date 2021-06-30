#!/usr/bin/env bash

rm -rf rjman ./log/rjman.log

nohup $(pwd)/binary --config=./config_rjman.json >> ./log/rjman.log 2>&1 &
