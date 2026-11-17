package cl.tienda.api.dto;

import cl.tienda.api.model.Usuario;

public record UsuarioResponse(Long id, String nombre, String correo, String rol) {
    public static UsuarioResponse from(Usuario usuario) {
        return new UsuarioResponse(usuario.getId(), usuario.getNombre(), usuario.getCorreo(), usuario.getRol());
    }
}
