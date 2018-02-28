FROM microsoft/aspnetcore:2.0
ARG source
WORKDIR /app
EXPOSE 80
COPY ${source:-obj/Docker/publish} .

# Install Node (from the https://github.com/aspnet/aspnet-docker/blob/master/2.0/stretch/sdk/Dockerfile)
# It is neede only for microsoft/aspnetcore:2.0. Node.js already exists in the microsoft/aspnetcore-build:2.0
ENV NODE_VERSION 6.11.3
RUN set -x \
  && apt-get update && apt-get install -y gnupg dirmngr --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*
# Install keys required for node
RUN set -ex \
  && for key in \
  9554F04D7259F04124DE6B476D5A82AC7E37093B \
  94AE36675C464D64BAFA68DD7434390BDBE9B9C5 \
  0034A06D9D9B0064CE8ADF6BF1747F4AD2306D93 \
  FD3A5288F042B6850C66B31F09FE44734EB7990E \
  71DCFD284A79C3B38668286BC97EC7A07EDE3FC1 \
  DD8F2338BAE7501E3DD5AC78C273792F7D83545D \
  B9AE9905FFD7803F25714661B63B535A4C206CA9 \
  C4F0DFFF4E8C1A8236409D08E73BC641CC11F4C8 \
  ; do \
  gpg --keyserver pgp.mit.edu --recv-keys "$key" || \
  gpg --keyserver ha.pool.sks-keyservers.net --recv-keys "$key" || \
  gpg --keyserver keyserver.pgp.com --recv-keys "$key" ; \
  done

# set up node
RUN buildDeps='xz-utils' \
  && set -x \
  && apt-get update && apt-get install -y $buildDeps --no-install-recommends \
  && rm -rf /var/lib/apt/lists/* \
  && curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
  && curl -SLO "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
  && gpg --batch --decrypt --output SHASUMS256.txt SHASUMS256.txt.asc \
  && grep " node-v$NODE_VERSION-linux-x64.tar.xz\$" SHASUMS256.txt | sha256sum -c - \
  && tar -xJf "node-v$NODE_VERSION-linux-x64.tar.xz" -C /usr/local --strip-components=1 \
  && rm "node-v$NODE_VERSION-linux-x64.tar.xz" SHASUMS256.txt.asc SHASUMS256.txt \
  && apt-get purge -y --auto-remove $buildDeps

# This should be executed only for docker-compose.ci.build.yml
# RUN apt-get update
# RUN apt-get install bzip2	# for installing phantomjs
# ---
# RUN npm install
# RUN npm run build

ENTRYPOINT ["dotnet", "ASPNetCoreAngular2Payments.dll"]