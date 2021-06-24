#!/usr/bin/env bash

pkill binary

rm -rf rjman ./log/rjman.log

nohup $(pwd)/binary --config=./config_rjman.json >> ./log/rjman.log 2>&1 &
