FROM ubuntu

MAINTAINER Yuan Tao <towyuan@outlook.com>
LABEL Description="Qemu based emulator"

# Update package repository
RUN apt-get update

# Install required packages
RUN apt-get install -y --allow-unauthenticated \
    qemu \
    qemu-user-static \
    binfmt-support \
    parted \
    vim

# Clean up after apt
RUN apt-get clean
RUN rm -rf /var/lib/apt

# Seup virtual mnt direcotry
RUN mkdir -p /vmnt
# Setup working directory
RUN mkdir -p /usr/rpi
WORKDIR /usr/rpi

COPY scripts/** /usr/rpi/
COPY pishrink /usr/sbin/
