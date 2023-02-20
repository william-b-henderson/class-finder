# Use latest version of node
FROM node:latest
# Copy files
COPY . /server
# Specify work directory
WORKDIR /server
RUN npm install
RUN npm install express pm2 -g
EXPOSE 8080
CMD ["pm2-runtime", "index.js"]
