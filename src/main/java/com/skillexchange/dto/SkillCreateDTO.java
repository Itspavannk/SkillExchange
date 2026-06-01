package com.skillexchange.dto;

public class SkillCreateDTO {

    private String title;
    private String description;
    private String category;
    private String level;
    private Integer creditsPerHour;

    public SkillCreateDTO() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Integer getCreditsPerHour() {
        return creditsPerHour;
    }

    public void setCreditsPerHour(Integer creditsPerHour) {
        this.creditsPerHour = creditsPerHour;
    }
}