FROM python:3

MAINTAINER Ar[]ne version: 0.1

ADD src /opt/

EXPOSE 8888

CMD cd /opt && python -m http.server --cgi 8888
