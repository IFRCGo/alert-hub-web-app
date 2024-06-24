# -------------------------- Dev ---------------------------------------

FROM node:18-bullseye as dev

RUN apt-get update -y \
    && apt-get install -y --no-install-recommends \
        git bash g++ make \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /code

RUN git config --global --add safe.directory /code


# -------------------------- Builder ---------------------------------------
FROM dev AS builder

COPY ./package.json ./yarn.lock /code/

# TODO: patches are not working with this?
RUN yarn install --frozen-lockfile --check-files --cache-folder .ycache && \
    rm -rf .ycache

COPY . /code/
