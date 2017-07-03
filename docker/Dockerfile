FROM ubuntu

MAINTAINER Yuan Tao <towyuan@outlook.com>
LABEL Description="Qemu based emulator"

RUN mv /etc/apt/sources.list /etc/apt/sources.list.bak

RUN echo "\
deb http://mirrors.aliyun.com/ubuntu/ xenial main restricted universe multiverse \n\
deb http://mirrors.aliyun.com/ubuntu/ xenial-security main restricted universe multiverse \n\
deb http://mirrors.aliyun.com/ubuntu/ xenial-updates main restricted universe multiverse \n\
deb http://mirrors.aliyun.com/ubuntu/ xenial-proposed main restricted universe multiverse \n\
deb http://mirrors.aliyun.com/ubuntu/ xenial-backports main restricted universe multiverse \n\
deb-src http://mirrors.aliyun.com/ubuntu/ xenial main restricted universe multiverse \n\
deb-src http://mirrors.aliyun.com/ubuntu/ xenial-security main restricted universe multiverse \n\
deb-src http://mirrors.aliyun.com/ubuntu/ xenial-updates main restricted universe multiverse \n\
deb-src http://mirrors.aliyun.com/ubuntu/ xenial-proposed main restricted universe multiverse \n\
deb-src http://mirrors.aliyun.com/ubuntu/ xenial-backports main restricted universe multiverse \
" > /etc/apt/sources.list

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
