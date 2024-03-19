# Food Store Orders & Inventory Management 

This project is an app used for managing orders and stocks of a food store.

## Prerequisites

You need to have Docker and Docker Compose installed on your machine. You can download them from the [Docker website](https://www.docker.com/get-started).

## Setup

1. Download the `docker-compose.yml` and `pull_images.sh` files from this repository.

2. Run the bash script to pull the Docker images from Docker Hub.

```bash
bash ./pull_images.sh
```
If you get a permission error, you might need to give execute permissions to the script:

```bash
chmod +x pull_images.sh
```

## Running the Application

1. Start the Docker containers with Docker Compose.

```bash 
docker-compose up
```

2. Open your web browser and navigate to `localhost:4200` or [click here](http://localhost:4200) to access the frontend.


## Stopping the Application

To stop the Docker containers, press `Ctrl+C` in the terminal where you ran docker-compose up.

To remove the Docker containers, run `docker-compose down`.
