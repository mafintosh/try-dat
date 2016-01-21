FROM mafintosh/docker-adventure-time
RUN apt-get install -qy docker.io libncurses5-dev nano
RUN npm install -g docker-run@1.3.0 bionode-sam@1.0.1 bionode-ncbi@1.0.2 bionode-sra@1.0.1 bionode-bwa@0.0.9
RUN npm install -g --unsafe-perm dat@next
RUN npm install -g tool-stream gasket mafintosh/picture-tube#patch-1 serve json
ADD welcome.txt /
ADD bob.png /
ADD .bashrc /root/
ADD .bashrc /
