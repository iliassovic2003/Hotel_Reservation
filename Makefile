backend:
	@echo "Starting backend services..."
	cd ./Backend && docker-compose up -d
	@echo "Waiting for database to be ready..."
	sleep 5
	cd ./Backend && mvn spring-boot:run &
	@echo "Backend started! Spring Boot running in background."

stop-backend:
	@echo "Stopping backend services..."
	cd ./Backend && docker-compose down -v
	@pkill -f "spring-boot:run" 2>/dev/null || true
	@echo "Backend stopped."

frontend:
	@echo "Starting frontend development server..."
	cd ./Frontend && npm run dev


clean: stop-all
	@echo "Cleaning up..."
	cd ./Backend && docker-compose down -v 2>/dev/null || true
	@echo "Cleanup complete."

up: start-all
down: stop-all

.PHONY: backend frontend start-all stop-backend stop-all clean