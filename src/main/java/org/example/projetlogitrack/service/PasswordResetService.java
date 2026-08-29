package org.example.projetlogitrack.service;

import org.example.projetlogitrack.model.User;
import org.example.projetlogitrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
public class PasswordResetService {

    private static final long TOKEN_VALIDITY_MINUTES = 30;

    private final SecureRandom secureRandom = new SecureRandom();

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${spring.mail.from:no-reply@logitrack.local}")
    private String fromAddress;

    public void sendResetLink(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return;
        }

        String token = generateToken();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(TOKEN_VALIDITY_MINUTES));
        userRepository.save(user);

        String resetUrl = frontendUrl + "/reset-password?token=" + token;

        String message = "Bonjour " + user.getPrenom() + ",\n\n"
                + "Vous avez demandé la réinitialisation de votre mot de passe.\n\n"
                + "Cliquez sur le lien suivant pour définir un nouveau mot de passe (valable "
                + TOKEN_VALIDITY_MINUTES + " minutes) :\n\n"
                + resetUrl + "\n\n"
                + "Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.\n\n"
                + "Cordialement,\nL'équipe LogiTrack";

        sendEmail(user.getEmail(), "Réinitialisation de votre mot de passe", message);
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Lien de réinitialisation invalide."));

        LocalDateTime now = LocalDateTime.now();
        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(now)) {
            throw new IllegalArgumentException("Le lien de réinitialisation a expiré. Veuillez en demander un nouveau.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

    private String generateToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
        } catch (Exception e) {
            throw new IllegalStateException("Impossible d'envoyer l'email de réinitialisation.", e);
        }
    }
}
