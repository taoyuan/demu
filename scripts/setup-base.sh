#!/usr/bin/env bash

echo "============= Setup Base =============="

echo "==> enable ssh"
systemctl enable ssh

echo "==> install core packages"
apt update
apt install -y git
