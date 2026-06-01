package com.skillexchange.service;

import com.skillexchange.dto.SkillCreateDTO;
import com.skillexchange.dto.SkillResponseDTO;
import com.skillexchange.entity.Skill;
import com.skillexchange.entity.SkillSortOption;
import com.skillexchange.entity.User;
import com.skillexchange.repository.SkillRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    public SkillResponseDTO createSkill(SkillCreateDTO dto, User currentUser) {
        Skill skill = new Skill();
        skill.setTitle(dto.getTitle());
        skill.setDescription(dto.getDescription());
        skill.setCategory(dto.getCategory());
        skill.setLevel(dto.getLevel());
        skill.setCreditsPerHour(dto.getCreditsPerHour());
        skill.setOwner(currentUser);
        Skill saved = skillRepository.save(skill);
        return toResponseDTO(saved, saved.getOwner());
    }

    public List<SkillResponseDTO> getAllSkills(SkillSortOption sort) {
        List<SkillResponseDTO> result = skillRepository.findAll().stream()
                .map(skill -> {
                    User owner = skill.getOwner();
                    return toResponseDTO(skill, owner);
                })
                .collect(Collectors.toList());

        if (sort == SkillSortOption.rating) {
            result.sort(Comparator.comparingDouble(SkillResponseDTO::getOwnerAverageRating).reversed());
        } else if (sort == SkillSortOption.price) {
            result.sort(Comparator.comparingInt(SkillResponseDTO::getCreditsPerHour));
        } else if (sort == SkillSortOption.newest) {
            result.sort(Comparator.comparing(SkillResponseDTO::getCreatedAt).reversed());
        }

        return result;
    }

    public List<SkillResponseDTO> getMySkills(User currentUser) {
        return skillRepository.findAll()
                .stream()
                .filter(skill -> skill.getOwner().getId().equals(currentUser.getId()))
                .map(skill -> toResponseDTO(skill, skill.getOwner()))
                .collect(Collectors.toList());
    }

    private SkillResponseDTO toResponseDTO(Skill skill, User owner) {
        SkillResponseDTO dto = new SkillResponseDTO();
        dto.setId(skill.getId());
        dto.setTitle(skill.getTitle());
        dto.setDescription(skill.getDescription());
        dto.setCategory(skill.getCategory());
        dto.setLevel(skill.getLevel());
        dto.setCreditsPerHour(skill.getCreditsPerHour());
        dto.setCreatedAt(skill.getCreatedAt());

        // Skill-specific rating
        int sCount = skill.getSkillRatingCount() != null ? skill.getSkillRatingCount() : 0;
        int sTotal = skill.getSkillRatingTotal() != null ? skill.getSkillRatingTotal() : 0;
        dto.setSkillRatingCount(sCount);
        dto.setSkillAverageRating(sCount > 0 ? Math.round((double) sTotal / sCount * 10.0) / 10.0 : 0.0);

        dto.setOwnerId(owner.getId());
        dto.setOwnerName(owner.getName());

        dto.setOwnerRatingCount(owner.getRatingCount());

        double avg = owner.getRatingCount() > 0
                ? (double) owner.getRatingTotal() / owner.getRatingCount()
                : 0.0;

        dto.setOwnerAverageRating(Math.round(avg * 100.0) / 100.0);

        return dto;
    }
}