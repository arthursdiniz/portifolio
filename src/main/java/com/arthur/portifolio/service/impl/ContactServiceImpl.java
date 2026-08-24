package com.arthur.portifolio.service.impl;

import com.arthur.portifolio.domain.ContactMessage;
import com.arthur.portifolio.dto.ContactMessageRequestDTO;
import com.arthur.portifolio.dto.ContactMessageResponseDTO;
import com.arthur.portifolio.repository.ContactMessageRepository;
import com.arthur.portifolio.service.ContactService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactServiceImpl implements ContactService {

    private final ContactMessageRepository contactMessageRepository;

    public ContactServiceImpl(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    @Override
    @Transactional
    public ContactMessageResponseDTO saveMessage(ContactMessageRequestDTO requestDTO) {
        ContactMessage message = new ContactMessage(
                null,
                requestDTO.getName(),
                requestDTO.getEmail(),
                requestDTO.getMessage(),
                LocalDateTime.now()
        );

        ContactMessage saved = contactMessageRepository.save(message);
        return mapToDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactMessageResponseDTO> getAllMessages() {
        return contactMessageRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private ContactMessageResponseDTO mapToDTO(ContactMessage message) {
        return ContactMessageResponseDTO.builder()
                .id(message.getId())
                .name(message.getName())
                .email(message.getEmail())
                .message(message.getMessage())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
