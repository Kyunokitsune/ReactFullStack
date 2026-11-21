package cl.tienda.api.config;

import cl.tienda.api.model.Producto;
import cl.tienda.api.model.Usuario;
import cl.tienda.api.repository.ProductoRepository;
import cl.tienda.api.repository.UsuarioRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements ApplicationRunner {
    private final ProductoRepository productos;
    private final UsuarioRepository usuarios;
    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;

    public DataInitializer(
            ProductoRepository productos,
            UsuarioRepository usuarios,
            PasswordEncoder passwordEncoder,
            @Value("${APP_ADMIN_EMAIL:}") String adminEmail,
            @Value("${APP_ADMIN_PASSWORD:}") String adminPassword) {
        this.productos = productos;
        this.usuarios = usuarios;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail.trim().toLowerCase();
        this.adminPassword = adminPassword;
    }

    @Override
    public void run(ApplicationArguments args) {
        sincronizarProductosIniciales();

        if (adminEmail.isBlank() != adminPassword.isBlank()) {
            throw new IllegalStateException("Configura APP_ADMIN_EMAIL y APP_ADMIN_PASSWORD juntas para crear el administrador inicial");
        }
        if (!adminEmail.isBlank() && !usuarios.existsByCorreoIgnoreCase(adminEmail)) {
            usuarios.save(new Usuario("Administrador", adminEmail,
                    passwordEncoder.encode(adminPassword), "ADMIN"));
        }
    }

    private void sincronizarProductosIniciales() {
        List<Producto> catalogoInicial = List.of(
                new Producto("Mouse Gamer RGB", "Mouse", new BigDecimal("29990"), "/productos/mouse.jpg", "Sensor de alta precisión y luces RGB configurables."),
                new Producto("Teclado Mecánico Gamer", "Teclados", new BigDecimal("59990"), "/productos/teclado-gamer.webp", "Teclas mecánicas rápidas para jugar y escribir."),
                new Producto("Headset Gamer 7.1", "Audio", new BigDecimal("49990"), "/productos/audifonoslogitech.jpg", "Audio envolvente y micrófono ajustable."),
                new Producto("Monitor Gamer 27 pulgadas 165 Hz", "Monitores", new BigDecimal("249990"), "/productos/monitor-gamer.webp", "Alta frecuencia de actualización para partidas fluidas."),
                new Producto("Silla Gamer Ergonómica", "Sillas", new BigDecimal("189990"), "/productos/silla-gamer.webp", "Respaldo reclinable y soporte para largas sesiones."),
                new Producto("Micrófono USB Gamer", "Audio", new BigDecimal("39990"), "/productos/microfono-gamer.webp", "Voz clara para streaming, llamadas y juegos."),
                new Producto("Control Inalámbrico Gamer", "Controles", new BigDecimal("44990"), "/productos/control-gamer.webp", "Control inalámbrico compatible con PC."),
                new Producto("Mousepad Gamer XL RGB", "Accesorios", new BigDecimal("24990"), "/productos/mousepad-gamer.webp", "Superficie amplia con iluminación RGB perimetral."));

        List<Producto> existentes = productos.findAll();

        for (Producto inicial : catalogoInicial) {
            Producto existente = existentes.stream()
                    .filter(producto -> producto.getNombre().equalsIgnoreCase(inicial.getNombre()))
                    .findFirst()
                    .orElse(null);

            if (existente == null) {
                productos.save(inicial);
                continue;
            }

            existente.setNombre(inicial.getNombre());
            existente.setCategoria(inicial.getCategoria());
            existente.setPrecio(inicial.getPrecio());
            existente.setImagen(inicial.getImagen());
            existente.setDescripcion(inicial.getDescripcion());
            productos.save(existente);
        }
    }
}
