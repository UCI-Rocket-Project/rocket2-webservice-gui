build:
	cd gui && docker build -t gui .
	cd webservice && docker build -t webservice .
run:
	docker-compose up
rocket:
	python fake_rocket/fake_rocket.py