build:
	docker-compose build

down:
	docker-compose down

up:
	docker-compose up -d

start: down build up
