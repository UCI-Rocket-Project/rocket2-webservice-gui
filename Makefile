.PHONY: build run_dev server run quest rocket test

build:
	cd fake_rocket && docker build -t fake_rocket .
	cd gui && docker build -t gui .
	cd webservice && docker build -t webservice .
run_dev:
	docker-compose -f docker-compose-dev.yaml up
server:
	docker-compose -f docker-compose-server.yaml up
run:
	docker-compose -f docker-compose-prod.yaml up
quest:
	docker-compose -f docker-compose-quest.yaml up
rocket:
	python fake_rocket/fake_rocket.py
test:
	cd gui && npx playwright test
