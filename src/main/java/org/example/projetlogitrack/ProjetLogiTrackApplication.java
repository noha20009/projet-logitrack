package org.example.projetlogitrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class ProjetLogiTrackApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjetLogiTrackApplication.class, args);
    }

}
