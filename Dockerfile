FROM mafintosh/docker-adventure-time
RUN apt-get update && apt-get install -qy docker.io libncurses5-dev
RUN npm install -g docker-run@1.3.0
RUN npm install -g --unsafe-perm dat
RUN npm install -g mafintosh/picture-tube#patch-1 serve json
ADD welcome.txt /
ADD bob.png /
ADD .bashrc /root/
ADD .bashrc /
