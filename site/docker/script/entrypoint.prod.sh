#!/bin/sh
nohup pnpm consumer:dev &
pnpm site:build
nohup node ./site/.output/server/index.mjs

sleep infinity
