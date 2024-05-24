FROM node:20.13.1-alpine
USER root
WORKDIR /usr/backend
RUN npm i -g newman
COPY orb_tester.postman_collection.json .
COPY test_env.postman_environment.json .
COPY local_env.postman_environment.json .
COPY host_env.postman_environment.json .
COPY run_api_tests.sh .
CMD ["sh", "run_api_tests.sh", "test"]
