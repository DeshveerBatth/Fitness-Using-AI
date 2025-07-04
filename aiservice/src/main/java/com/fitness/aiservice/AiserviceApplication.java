package com.fitness.aiservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories(basePackages = "com.fitness.aiservice.repository")
public class AiserviceApplication {
	public static void main(String[] args) {
		SpringApplication.run(AiserviceApplication.class, args);
	}
}