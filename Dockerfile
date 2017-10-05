FROM maxogden/docker-adventure-time
RUN apt-get update && apt-get install -qy docker.io libncurses5-dev
RUN npm install -g docker-run@3.1.0
RUN npm install -g --unsafe-perm dat
RUN npm install -g mafintosh/picture-tube#patch-1 serve json
RUN mkdir /workshop
ADD welcome.txt /workshop
ADD cat.png /workshop
ADD .bashrc /workshop
