package com.arthur.portifolio.service;

import com.arthur.portifolio.dto.ContactMessageRequestDTO;
import com.arthur.portifolio.dto.ContactMessageResponseDTO;

import java.util.List;

public interface ContactService {
    ContactMessageResponseDTO saveMessage(ContactMessageRequestDTO requestDTO);
    List<ContactMessageResponseDTO> getAllMessages();
}
