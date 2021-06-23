#!/usr/bin/env bash

nohup $(pwd)/binary --config=config.json >> chainx.log 2>&1 &
