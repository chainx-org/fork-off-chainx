#!/usr/bin/env bash
pkill binary

rm -rf hacpy ./log/hacpy.log

nohup $(pwd)/binary --config=config.json >> ./log/hacpy.log 2>&1 &
