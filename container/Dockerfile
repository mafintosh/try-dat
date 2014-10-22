FROM ubuntu:14.04
RUN apt-get update && apt-get -y install sudo curl git-core build-essential libgraphicsmagick1-dev vim python ruby1.9.3
RUN curl -fs https://raw.githubusercontent.com/mafintosh/node-install/master/install | sh && node-install 0.10.32
RUN npm install -g dat@6.8.1 expose-fs@1.1.1
ADD .spawn .bashrc /
WORKDIR /root
ENTRYPOINT /.spawn