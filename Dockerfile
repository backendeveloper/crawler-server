FROM node:8
LABEL maintainer="@backendeveloper <previousdeveloper@gmail.com>"

ENV GITURL "https://github.com/backendeveloper/crawler-server.git"
WORKDIR /usr/src/app
RUN git clone $GITURL 
RUN cd crawler-server

RUN apt-get update && apt-get -yq upgrade && apt-get install \
    && apt-get autoremove && apt-get autoclean

RUN apt-get update && apt-get install -y wget --no-install-recommends \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-unstable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst ttf-freefont \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get purge --auto-remove -y curl \
    && rm -rf /src/*.deb

ADD https://github.com/Yelp/dumb-init/releases/download/v1.2.1/dumb-init_1.2.1_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

ARG CACHEBUST=1

COPY package*.json ./

RUN npm install

COPY . .

RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app
USER pptruser

EXPOSE 8080
ENTRYPOINT ["dumb-init", "--"]
CMD [ "npm", "start" ]

# INSTALL
# docker build -t crawler-server/app .
# docker run -p 80:8080 -d crawler-server/app

# TEST
# curl -i localhost:80