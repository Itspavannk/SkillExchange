package com.skillexchange.controller;

import com.skillexchange.dto.SkillCreateDTO;
import com.skillexchange.dto.SkillResponseDTO;
import com.skillexchange.entity.SkillSortOption;
import com.skillexchange.entity.User;
import com.skillexchange.service.SkillService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    // POST /skills/ — owner set from JWT, not from request body
    @PostMapping
    public SkillResponseDTO createSkill(@RequestBody SkillCreateDTO dto,
                                        @AuthenticationPrincipal User currentUser) {
        return skillService.createSkill(dto, currentUser);
    }

    // GET /skills/ with optional sort=rating|price|newest
@GetMapping
public List<SkillResponseDTO> listSkills(@RequestParam(required = false) SkillSortOption sort) {
    return skillService.getAllSkills(sort);
}

    // GET /skills/me — current user's skills from JWT
    @GetMapping("/me")
    public List<SkillResponseDTO> mySkills(@AuthenticationPrincipal User currentUser) {
        return skillService.getMySkills(currentUser);
    }
}