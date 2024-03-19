# Stage 1: Build the Angular application
FROM node:18-alpine as angular


WORKDIR /app

COPY . .
RUN npm install

#logging to debug
RUN npm run build



# Stage 2: Serve the application with httpd

FROM httpd:alpine

WORKDIR /usr/local/apache2/htdocs/

COPY --from=angular /app/dist/chad-food6/browser/ .


