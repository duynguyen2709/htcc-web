#!/bin/bash
docker container rm -f htcc-admin-tool
sleep 2
docker pull duyna5/htcc-admin-tool:latest
docker run -p -it 3002:80 -d \
        --name htcc-admin-tool \
        duyna5/htcc-admin-tool
