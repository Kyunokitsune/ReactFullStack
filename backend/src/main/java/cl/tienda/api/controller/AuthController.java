package cl.tienda.api.controller;

import cl.tienda.api.dto.LoginRequest;
import cl.tienda.api.dto.LoginResponse;
import cl.tienda.api.dto.UsuarioResponse;
import cl.tienda.api.repository.UsuarioRepository;
import cl.tienda.api.service.JwtService;
import cl.tienda.api.service.UsuarioDetailsService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final UsuarioDetailsService userDetailsService;

    public AuthController(
            AuthenticationManager authenticationManager,
            UsuarioRepository usuarioRepository,
            JwtService jwtService,
            UsuarioDetailsService userDetailsService) {
        this.authenticationManager = authenticationManager;
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        String correo = request.correo().trim().toLowerCase();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(correo, request.password()));
        UsuarioResponse usuario = usuarioRepository.findByCorreoIgnoreCase(correo)
                .map(UsuarioResponse::from)
                .orElseThrow();
        UserDetails userDetails = userDetailsService.loadUserByUsername(correo);
        String token = jwtService.generateToken(userDetails);
        return new LoginResponse(token, usuario);
    }
}
