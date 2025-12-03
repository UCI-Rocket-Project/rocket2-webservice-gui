build:
	cd fake_rocket && docker build -t fake_rocket .
	cd gui && docker build -t gui .
	cd webservice && docker build -t webservice .
run_dev:
	docker-compose -f docker-compose-dev.yaml up
server:
	docker-compose -f docker-compose-server.yaml up
guionly:
	docker-compose -f docker-compose-gui.yaml up
run:
	docker-compose -f docker-compose-prod.yaml up
rocket:
	python fake_rocket/fake_rocket.py
test:
	cd gui && npx playwright test
