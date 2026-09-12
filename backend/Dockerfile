# Stage 1: Build stage with Maven and OpenJDK 17
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build production JAR without running tests
RUN mvn clean package -DskipTests

# Stage 2: Runtime stage with JRE 17
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy executable jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose default application port
EXPOSE 8080

# Environment variables with production fallbacks
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod

# Run the backend application
ENTRYPOINT ["java", "-jar", "app.jar"]
