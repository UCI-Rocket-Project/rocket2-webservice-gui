build:
	cd frontend && docker build -t frontend .
	cd webservice && docker build -t webservice .
	cd fake_rocket && docker build -t fake_rocket .
run:
	docker-compose up
rocket:
	python fake_rocket/fake_rocket.py