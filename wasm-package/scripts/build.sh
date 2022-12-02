#!/bin/bash

set -e

mkdir -p dist
mkdir -p wasm

#npm run eslint

# node scripts/optimize
node scripts/make-json
rollup -c
npx tsc ./src/index --outDir ./dist --downlevelIteration --emitDeclarationOnly --declaration --resolveJsonModule --allowSyntheticDefaultImports