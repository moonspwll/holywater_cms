Development 

docker-compose -f docker-compose.dev.yml up --build

Production

docker-compose -f docker-compose.prod.yml up --build

Run DB migrations

sudo docker exec -it nestjs_backend_dev npm run db:migrate

Connect to DB with this command

sudo docker exec -it nestjs_db_dev psql -U admin -d holywater