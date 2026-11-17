package cl.tienda.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UsuarioAdminRequest(
        @NotBlank @Size(max = 100) String nombre,
        @NotBlank @Email @Size(max = 180) String correo,
        @Pattern(regexp = "ADMIN|CLIENTE", message = "El rol debe ser ADMIN o CLIENTE") String rol,
        @Size(max = 72) String password) {
}
