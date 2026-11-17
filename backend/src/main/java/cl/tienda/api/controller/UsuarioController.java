package cl.tienda.api.controller;

import cl.tienda.api.dto.UsuarioAdminRequest;
import cl.tienda.api.dto.UsuarioRegistroRequest;
import cl.tienda.api.dto.UsuarioResponse;
import cl.tienda.api.model.Usuario;
import cl.tienda.api.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioController(UsuarioRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse registrar(@Valid @RequestBody UsuarioRegistroRequest request) {
        String correo = request.correo().trim().toLowerCase();
        if (repository.existsByCorreoIgnoreCase(correo)) {
            throw new IllegalArgumentException("Ese correo ya está registrado");
        }
        Usuario usuario = new Usuario(request.nombre().trim(), correo,
                passwordEncoder.encode(request.password()), "CLIENTE");
        return UsuarioResponse.from(repository.save(usuario));
    }

    @GetMapping
    public List<UsuarioResponse> listar() {
        return repository.findAll().stream().map(UsuarioResponse::from).toList();
    }

    @GetMapping("/{id}")
    public UsuarioResponse obtener(@PathVariable Long id) {
        return UsuarioResponse.from(buscar(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse crear(@Valid @RequestBody UsuarioAdminRequest request) {
        if (request.password() == null || request.password().isBlank()) {
            throw new IllegalArgumentException("La contraseña es obligatoria al crear un usuario");
        }
        validarLongitudPassword(request.password());
        String correo = request.correo().trim().toLowerCase();
        if (repository.existsByCorreoIgnoreCase(correo)) {
            throw new IllegalArgumentException("Ese correo ya está registrado");
        }
        Usuario usuario = new Usuario(request.nombre().trim(), correo,
                passwordEncoder.encode(request.password()), rolValido(request.rol()));
        return UsuarioResponse.from(repository.save(usuario));
    }

    @PutMapping("/{id}")
    public UsuarioResponse actualizar(@PathVariable Long id, @Valid @RequestBody UsuarioAdminRequest request) {
        Usuario usuario = buscar(id);
        usuario.setNombre(request.nombre().trim());
        usuario.setCorreo(request.correo().trim().toLowerCase());
        if (request.rol() != null && !request.rol().isBlank()) {
            usuario.setRol(rolValido(request.rol()));
        }
        if (request.password() != null && !request.password().isBlank()) {
            validarLongitudPassword(request.password());
            usuario.setPassword(passwordEncoder.encode(request.password()));
        }
        return UsuarioResponse.from(repository.save(usuario));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        repository.delete(buscar(id));
    }

    private Usuario buscar(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("No existe el usuario " + id));
    }

    private String rolValido(String rol) {
        if (rol == null || (!rol.equals("ADMIN") && !rol.equals("CLIENTE"))) {
            throw new IllegalArgumentException("El rol debe ser ADMIN o CLIENTE");
        }
        return rol;
    }

    private void validarLongitudPassword(String password) {
        if (password.length() < 8) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 8 caracteres");
        }
    }
}
