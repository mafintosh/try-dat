FROM mafintosh/docker-adventure-time
RUN apt-get install -qy docker.io libncurses5-dev
RUN npm install -g dat@6.8.1 docker-run@1.3.0 bionode-sam bionode-ncbi bionode-sra bionode-bwa
ADD welcome.txt /
ADD .bashrc /root/