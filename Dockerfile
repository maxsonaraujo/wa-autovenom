# define a imagem base
FROM debian:latest
# define o mantenedor da imagem
LABEL maintainer="Miwteam"

ENV DEBIAN_FRONTEND=noninteractive

# Atualiza a imagem com os pacotes
RUN apt-get update && apt-get upgrade -y
# Instala o NGINX para testar
RUN apt-get install wget -y

RUN apt-get install gdebi -y

RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb

RUN gdebi -n google-chrome-stable_current_amd64.deb

RUN google-chrome --version

RUN apt-get install git-core curl build-essential openssl libssl-dev python -y

RUN apt install -y gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -

RUN apt install nodejs

RUN npm install -g n

RUN npm install --global yarn

RUN node -v

RUN npm -v

RUN git clone https://maxsonjordan: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@MAXSONJORDAN/wa-autovenom.git

WORKDIR /wa-autovenom

# RUN echo "ola mundo" > session.data.json

#RUN sed -i '1s/^/127.0.0.1 example.com\n/' /etc/hosts

EXPOSE 3002

CMD git reset --hard HEAD && git pull && yarn && node index.js