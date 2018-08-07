FROM ubuntu:16.04
WORKDIR /app
COPY init.sh /app/init.sh
EXPOSE 8888
EXPOSE 9876
RUN apt-get update
RUN apt-get -y install curl wget sudo
RUN sh /app/init.sh
