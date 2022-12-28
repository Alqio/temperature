#!/bin/bash

hciconfig hci0 down
hciconfig hci0 up

python3 main.py
