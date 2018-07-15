#!/usr/bin/env bash

echo "============= Setup Node.js =============="
echo "==> Install tj/n"
pushd /tmp
git clone https://github.com/tj/n
pushd n
make install
popd
popd

echo "==> Install node js lts"
n lts
node --version
npm --version

npm config set unsafe-perm true

echo "==> Install node-gyp"
npm install -g node-gyp

echo "==> Cleanup node installation"
npm config set unsafe-perm false
