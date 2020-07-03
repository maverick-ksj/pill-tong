<p align="center">
  <img src="./doc/thumbnail/thumbnail-black.png" alt="thumbnail">
</p>

![[GitHub release (latest SemVer)](https://github.com/maverick-ksj/pill-tong/releases)](https://img.shields.io/github/v/release/maverick-ksj/pill-tong)
![[GitHub tag (latest by date)](https://github.com/maverick-ksj/pill-tong/tags)](https://img.shields.io/github/v/tag/maverick-ksj/pill-tong)
![[LICENSE](https://github.com/maverick-ksj/pill-tong/blob/master/LICENSE)](https://img.shields.io/github/license/maverick-ksj/pill-tong)
[![Known Vulnerabilities](https://snyk.io/test/github/maverick-ksj/pill-tong/badge.svg)](https://snyk.io/test/github/maverick-ksj/pill-tong)

English | [Korean](./README.KR.md)

**Pill-Tong** is a [reverse proxy](https://en.wikipedia.org/wiki/Reverse_proxy) server written in NodeJS, and it provides HTTP request filtering layer using customizable middlewares.

Its concept is easy to understand; (1) first of all, you just install [pill-tong](https://www.npmjs.com/package/pill-tong) NPM module (2) set middleware filters (3) and then, enter the `pilltong` command.

Currently some filters exists as follows :

* [xss](https://github.com/maverick-ksj/pill-tong-xss-filter)
* [sqli](https://github.com/maverick-ksj/pill-tong-sqli-filter)

So, you can compose a web server that given filtered HTTP requests.

## Quick Start

### 1\. Install via npm

```sh
npm install pill-tong -g
```

### 2\. Create a Service

```sh
pilltong --create
```

### 3\. Set-up the [pill-tong configuration file](#pill-tong-configuration)

```sh
# pill-tong.yml: default configuration file name
vim pill-tong.yml
```

### 4\. **Configure the Firewall rules**

* your real server port: `private`
* pill-tong proxy server port: `public`

### 5\. Starts the pill-tong Proxy Server

```sh
pilltong
```

## Options

```sh
--create # create a service
--conf <path> # set configuration file path (default: ./pill-tong.yml)
--noHello # hello message print or not (default: false)
```

## Pill-Tong Configuration

```yml
# client configuration
client:
  host: 'localhost' # client server host
  port: 3000 # client server port (private port)

# pill-tong proxy server configuration
proxy:
  port: 80 # proxy server port (public port)

# filter lists
filters:
  - 'xss-filter' # filter installing via npm
  - './filter/my-filter' # user define filter

# ssl configuration (disable)
ssl: false

# ssl configuration (enable)
# ssl:
#     key: './cert/private.pem'
#     cert: './cert/public.pem'
```

## License

Pill-Tong is licensed under the [MIT License](./LICENSE)
