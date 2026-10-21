package com.example.taxi.config;

import java.io.IOException;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

/**
 * Sert le front Angular compile a l'adresse /app/.
 *
 * <p>Le build Angular (voir pom.xml) depose les fichiers compiles dans
 * {@code target/classes/static/app}. Le routage Angular se fait cote client :
 * une adresse comme {@code /app/clients} ne correspond a aucun fichier, elle
 * doit donc retomber sur {@code index.html}. Les fichiers statiques absents
 * (avec une extension) renvoient un 404 classique.</p>
 */
@Configuration
public class SpaResourceConfig implements WebMvcConfigurer {

    private static final String INDEX_HTML = "/static/app/index.html";

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/app", "/app/", "/app/**")
                .addResourceLocations("classpath:/static/app/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        // "/app/" : le chemin residuel est un slash, on sert l'index.
                        String path = resourcePath.startsWith("/") ? resourcePath.substring(1) : resourcePath;

                        // Racine de l'application (/app ou /app/) : on sert l'index.
                        if (path.isEmpty()) {
                            return new ClassPathResource(INDEX_HTML);
                        }

                        Resource requested = location.createRelative(path);
                        if (requested.exists() && requested.isReadable()) {
                            return requested;
                        }

                        // Fichier statique absent : on laisse Spring renvoyer un 404.
                        if (path.contains(".")) {
                            return null;
                        }

                        // Route Angular : on renvoie l'index pour le routage cote client.
                        return new ClassPathResource(INDEX_HTML);
                    }
                });
    }
}
