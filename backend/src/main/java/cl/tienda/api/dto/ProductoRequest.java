package cl.tienda.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ProductoRequest(
        @NotBlank @Size(max = 120) String nombre,
        @NotBlank @Size(max = 80) String categoria,
        @NotNull @DecimalMin("0.01") BigDecimal precio,
        @Size(max = 500) String imagen,
        @Size(max = 1000) String descripcion) {
}
