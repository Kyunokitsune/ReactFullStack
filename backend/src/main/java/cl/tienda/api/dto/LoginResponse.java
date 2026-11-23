package cl.tienda.api.dto;

public record LoginResponse(String token, UsuarioResponse usuario) {
}
