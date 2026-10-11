# ==============================================================================
# Multi-stage Dockerfile for Spring Boot 3 / Java 21 / Kotlin 2.0 Backend
# ==============================================================================

# Stage 1: Build JAR with Maven & Eclipse Temurin 21
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /build

COPY pom.xml .
COPY src ./src
RUN mvn clean package -Dmaven.test.skip=true -B

# Stage 2: Production JRE 21 Alpine Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Non-root user for security
RUN addgroup -S fspgroup && adduser -S fspuser -G fspgroup
USER fspuser

COPY --from=builder /build/target/career-arena-backend-*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
