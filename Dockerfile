FROM microsoft/dotnet:1.1.0-sdk-projectjson

RUN apt-get update
RUN wget -qO- https://deb.nodesource.com/setup_4.x | bash -
# postgresql-client - is for db health check script in docker-compose.yml
RUN apt-get install -y build-essential nodejs postgresql-client

COPY . /app

WORKDIR /app

RUN ["dotnet", "restore"]
RUN ["dotnet", "build"]

EXPOSE 8080/tcp

CMD ["dotnet", "run", "--server.urls", "http://*:8080"]