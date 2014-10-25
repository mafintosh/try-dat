FROM mafintosh/docker-adventure-time
RUN apt-get install -qy docker.io libncurses5-dev
RUN npm install -g dat@6.8.1 docker-run@1.3.0 bionode-sam@1.0.1 bionode-ncbi@1.0.2 bionode-sra@1.0.1 bionode-bwa@0.0.9
ADD welcome.txt /
ADD .bashrc /root/
ADD .bashrc /