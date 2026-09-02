package org.example.projetlogitrack.config;

import io.micrometer.observation.ObservationRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.ServerHttpObservationFilter;

@Configuration
public class MetricsConfig {

    @Bean
    public ServerHttpObservationFilter serverHttpObservationFilter(ObservationRegistry registry) {
        return new ServerHttpObservationFilter(registry);
    }

}
