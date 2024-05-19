build:
	cd fake_rocket && docker build -t fake_rocket .
	cd gui && docker build -t gui .
	cd webservice && docker build -t webservice .
run:
	docker-compose -f docker-compose-dev.yaml up
run_prod:
	docker-compose -f docker-compose-prod.yaml up
rocket:
	python fake_rocket/fake_rocket.py
test:
	cd gui && npx playwright test
