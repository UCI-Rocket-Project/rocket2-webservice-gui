# Webservice & GUI

## For developers

### 1: Set up pre-commit to make all your code nice before committing

```shell
$ pip install pre-commit
$ pre-commit install
```

Now whenever you try to commit, prettier will fix everything up, so you will need to git add \* and then git commit again which is annoying but it makes your stuff pretty.

### 2: Install Node.js from https://nodejs.org/en/download/package-manager

Install playwright for integration tests by running

```shell
$ npx -y playwright@1.44.0 install --with-deps
```

## Initial Setup

1: Download and install docker desktop from docker website https://www.docker.com/products/docker-desktop/
Create a docker account and sign in on docker desktop. You will need to keep docker desktop open when you want to run a docker container.

## If you are on Windows

### 1: Install chocolatey

Open an administrative shell (powershell but run as admin)

```shell
$ Set-ExecutionPolicy AllSigned or Set-ExecutionPolicy Bypass -Scope Process
$ Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### 2: Install Make

```shell
$ choco install make
```

Once this is done, restart your computer

Open up Docker desktop and make sure you are still signed in

## Startup

Open up Docker Desktop and make sure you are still signed in

Open up this git repo in a command line and run

```shell
$ make build
```

Spin up the docker containers:

For dev environment which includes fake_rocket

```shell
$ make run
```

For prod environment which sends requests to 10.0.255.1 instead of fake_rocket

```shell
$ make run_prod
```

NOTE: If you are starting up the containers for the first time, POSTGRES might fail because it takes time to initialize. Just make run again

## Testing

To run tests, run

```shell
$ make test
```
