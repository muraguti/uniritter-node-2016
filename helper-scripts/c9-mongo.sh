#!/usr/bin/env bash

sudo apt-get install -y mongodb-org
mkdir data
echo 'mongod --bind_ip=$IP --dbpath=data --nojournal --smallfiles --rest "$@"' > mongod
chmod a+x mongod
echo "setup complete. now you have a mongod script to start your mongo db"