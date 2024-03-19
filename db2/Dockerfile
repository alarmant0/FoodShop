FROM postgres:14-alpine

ENV POSTGRES_DB="orders_database"
ENV POSTGRES_USER="db_orders"
ENV POSTGRES_PASSWORD="randompassword"

COPY init.sql /docker-entrypoint-initdb.d/

RUN chmod +x /docker-entrypoint-initdb.d/init.sql

EXPOSE 5432

CMD ["postgres"]
