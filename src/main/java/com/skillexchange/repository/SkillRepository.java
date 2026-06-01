package com.skillexchange.repository;

import com.skillexchange.entity.Skill;
import com.skillexchange.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    List<Skill> findByOwner(User owner);

}