#!/bin/bash
#
# Convenience script to manage qemu inside docker container
# Chains the provided helper scripts to mount the image, bootstrap qemu, run a command
# and tear down the environment correctly.

if [ "$#" -ne 1 ] && [ "$#" -ne 2 ]; then
    echo "Usage: $0 IMAGE MOUNT [COMMAND]"
    echo "IMAGE - raspberry pi .img file"
    echo "[COMMAND] - optional command to execute, defaults to /bin/bash"
    exit
fi

CWD=`pwd`
MOUNT_DIR=/media/rpi

if [ -z "$2" ]; then
	COMMAND=bin/bash
else
	COMMAND=$2
fi

set -e

# Create mount dir
mkdir -p $MOUNT_DIR

# Mount ISO
./mount.sh $1 $MOUNT_DIR

# Mount some others
# See: https://github.com/ryankurte/docker-rpi-emu/issues/9
mount --bind /proc $MOUNT_DIR/proc/
mount --bind /dev $MOUNT_DIR/dev/
mount --bind /sys $MOUNT_DIR/sys/
mount --bind /dev/pts $MOUNT_DIR/dev/pts

# Bootstrap QEMU
./qemu-setup.sh $MOUNT_DIR

# Launch QEMU
chroot $MOUNT_DIR $COMMAND

# Remove QEMU
./qemu-cleanup.sh $MOUNT_DIR

# Exit
./unmount.sh $MOUNT_DIR

